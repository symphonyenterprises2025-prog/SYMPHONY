import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendAdminNotification } from "@/lib/email/brevo";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, whatsapp, currentPassword, newPassword } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone || null;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp || null;

    // Handle password change
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user?.password) {
        return NextResponse.json(
          { error: "User has no password set" },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);

      // Send notification if admin changes their password
      if (user.role === 'ADMIN') {
        try {
          await sendAdminNotification(
            '🔐 Admin Password Changed',
            `<div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto;">
              <h2 style="color:#1f3763;">Admin Password Changed</h2>
              <p>The admin password for <strong>${user.email}</strong> was just updated.</p>
              <p style="color:#666;font-size:14px;">If you did not make this change, please secure your account immediately.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
              <p style="color:#999;font-size:12px;">Symphony Enterprise - Security Notification</p>
            </div>`
          );
        } catch (emailError) {
          console.error('Failed to send admin password change notification:', emailError);
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
