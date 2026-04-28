import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sendTransactionalEmail } from "@/lib/email/brevo";
import { getOTPEmailTemplate } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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
