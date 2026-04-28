import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sendTransactionalEmail } from "@/lib/email/brevo";
import { getOTPEmailTemplate } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, whatsapp } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

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
