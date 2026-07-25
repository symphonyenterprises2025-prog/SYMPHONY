import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

const CANCELLABLE: OrderStatus[] = ["PENDING", "CONFIRMED"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        userId: true,
        status: true,
        orderNumber: true,
        items: { select: { variantId: true, quantity: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!CANCELLABLE.includes(order.status)) {
      return NextResponse.json(
        { error: "Order can only be cancelled if it is Pending or Confirmed" },
        { status: 400 }
      );
    }

    // Cancel and return the reserved stock in one transaction. The status
    // guard above is re-applied here so two concurrent cancels can't both
    // succeed and credit the stock twice.
    await prisma.$transaction(async (tx) => {
      const updated = await tx.order.updateMany({
        where: { id, status: { in: CANCELLABLE } },
        data: { status: "CANCELLED" },
      });

      if (updated.count !== 1) {
        throw new Error("ALREADY_CANCELLED");
      }

      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    });

    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "ALREADY_CANCELLED") {
      return NextResponse.json(
        { error: "This order has already been cancelled." },
        { status: 409 }
      );
    }
    console.error("Error cancelling order:", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
