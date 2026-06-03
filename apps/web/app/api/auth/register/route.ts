import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sendTransactionalEmail } from "@/lib/email/brevo";
import { getOTPEmailTemplate } from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimit(`register:${ip}`, 3, 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone, whatsapp } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP (valid for 10 minutes)
    await storeOTP(email, otp, 10);

    // Send OTP email
    try {
      await sendTransactionalEmail(
        email,
        name,
        "Verify Your Email - Symphony Enterprise",
        getOTPEmailTemplate(otp, name)
      );
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "OTP sent to your email. Please verify to complete registration.",
        requiresVerification: true,
        registrationData: { name, email, password, phone, whatsapp }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
