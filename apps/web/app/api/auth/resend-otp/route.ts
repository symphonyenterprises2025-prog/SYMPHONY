import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sendTransactionalEmail } from "@/lib/email/brevo";
import { getOTPEmailTemplate } from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";

const resendSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = await rateLimit(`resend-otp:${ip}`, 3, 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = resendSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const { email, name } = result.data;

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

    // Generate new OTP
    const otp = generateOTP();
    
    // Store OTP
    await storeOTP(email, otp, 10);

    // Send OTP email
    try {
      await sendTransactionalEmail(
        email,
        name || "Customer",
        "Verify Your Email - Symphony Enterprise",
        getOTPEmailTemplate(otp, name || "Customer")
      );
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return NextResponse.json(
        { error: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
