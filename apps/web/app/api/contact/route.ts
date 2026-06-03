import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendTransactionalEmail, sendAdminNotification } from "@/lib/email/brevo";
import { getContactConfirmationTemplate, getContactAdminTemplate } from "@/lib/email/templates";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, subject, message } = result.data;
    const fullName = `${firstName} ${lastName}`;

    // Save to database
    try {
      await prisma.corporateInquiry.create({
        data: {
          name: fullName,
          email,
          phone: phone || "",
          requirements: message,
          status: "pending",
        },
      });
    } catch (dbError) {
      console.error("Failed to save inquiry to DB:", dbError);
    }

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
    }

    // Send notification email to admin
    try {
      await sendAdminNotification(
        `New Contact Form Submission: ${subject}`,
        getContactAdminTemplate(fullName, email, phone || "Not provided", subject, message)
      );
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
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
