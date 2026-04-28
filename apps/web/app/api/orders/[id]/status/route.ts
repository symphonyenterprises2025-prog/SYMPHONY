import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email/brevo";
import { getOrderStatusUpdateTemplate } from "@/lib/email/templates";

const statusMessages: Record<string, string> = {
  'PENDING': 'Your order has been received and is awaiting processing.',
  'PROCESSING': 'Your order is being prepared and will be shipped soon.',
  'SHIPPED': 'Your order has been shipped and is on its way to you!',
  'DELIVERED': 'Your order has been delivered. Thank you for shopping with us!',
  'CANCELLED': 'Your order has been cancelled as requested.',
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, message } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
        address: true,
      },
    });

    // Send status update email to customer
    if (order.customerEmail) {
      try {
        await sendTransactionalEmail(
          order.customerEmail,
          order.customerName || "Customer",
          `Order Update: ${status} - ${order.orderNumber}`,
          getOrderStatusUpdateTemplate(
            order.orderNumber,
            order.customerName || "Customer",
            status,
            message || statusMessages[status]
          )
        );
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
