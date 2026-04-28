import { NextResponse } from "next/server";
import { sendTransactionalEmail, sendAdminNotification } from "@/lib/email/brevo";
import { getContactConfirmationTemplate, getContactAdminTemplate } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`;

    // Send confirmation email to user
    try {
      await sendTransactionalEmail(
        email,
        fullName,
        "We've Received Your Inquiry - Symphony Enterprise",
        getContactConfirmationTemplate(fullName, subject)
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Continue even if confirmation email fails
    }

    // Send notification email to admin
    try {
      await sendAdminNotification(
        `New Contact Form Submission: ${subject}`,
        getContactAdminTemplate(fullName, email, phone || "Not provided", subject, message)
      );
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Continue even if admin email fails
    }

    return NextResponse.json(
      { message: "Your inquiry has been sent successfully. We'll get back to you soon!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send your inquiry. Please try again later." },
      { status: 500 }
    );
  }
}
