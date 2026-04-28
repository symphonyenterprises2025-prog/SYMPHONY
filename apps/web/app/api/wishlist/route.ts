import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user?.id },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch products separately
    const productIds = wishlistItems.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: true,
        variants: {
          where: { isActive: true },
        },
      },
    })

    const wishlistWithProducts = wishlistItems.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId),
    }))

    return NextResponse.json(wishlistWithProducts)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
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
    const { productId } = body

    await prisma.wishlistItem.create({
      data: {
        userId: session.user?.id,
        productId,
      },
    })

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user?.id },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch products separately
    const productIds = wishlistItems.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: true,
        variants: {
          where: { isActive: true },
        },
      },
    })

    const wishlistWithProducts = wishlistItems.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId),
    }))

    return NextResponse.json(wishlistWithProducts)
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
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

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user?.id,
        productId,
      },
    })

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user?.id },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch products separately
    const productIds = wishlistItems.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: true,
        variants: {
          where: { isActive: true },
        },
      },
    })

    const wishlistWithProducts = wishlistItems.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId),
    }))

    return NextResponse.json(wishlistWithProducts)
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
