import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1).default(1),
  addOnIds: z.array(z.string()).default([]),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user?.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variant: true,
            addOns: {
              include: { addOn: true },
            },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({ items: [] })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const result = addToCartSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { productId, variantId, quantity, addOnIds } = result.data

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user?.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user?.id },
      })
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
      // Update add-ons: delete existing, add new
      await prisma.cartItemAddOn.deleteMany({ where: { cartItemId: existingItem.id } })
      if (addOnIds.length > 0) {
        const addOns = await prisma.addOn.findMany({
          where: { id: { in: addOnIds } },
        })
        await prisma.cartItemAddOn.createMany({
          data: addOns.map((a) => ({
            cartItemId: existingItem.id,
            addOnId: a.id,
            price: a.price,
          })),
        })
      }
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
          addOns: addOnIds.length > 0
            ? {
                create: await (async () => {
                  const addOns = await prisma.addOn.findMany({
                    where: { id: { in: addOnIds } },
                  })
                  return addOns.map((a) => ({
                    addOnId: a.id,
                    price: a.price,
                  }))
                })(),
              }
            : undefined,
        },
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variant: true,
            addOns: {
              include: { addOn: true },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user?.id },
    })

    if (cart) {
      // Delete all cart items
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }

    return NextResponse.json({ message: 'Cart cleared successfully' })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
