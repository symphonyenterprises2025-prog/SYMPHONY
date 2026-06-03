import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyOTP, deleteOTPs } from "@/lib/otp";
import { sendTransactionalEmail } from "@/lib/email/brevo";
import { getWelcomeEmailTemplate } from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";

const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  name: z.string().min(2, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimit(`verify-otp:${ip}`, 5, 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const { email, otp, name, password, phone, whatsapp } = result.data;

    // Verify OTP
    const isValid = await verifyOTP(email, otp);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Clean up OTP
      await deleteOTPs(email);
      
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        whatsapp: whatsapp || null,
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    });

    // Clean up OTP
    await deleteOTPs(email);

    // Send welcome email
    try {
      await sendTransactionalEmail(
        email,
        name || "Customer",
        "Welcome to Symphony Enterprise!",
        getWelcomeEmailTemplate(name || "Customer")
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
