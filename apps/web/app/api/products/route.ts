import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const collection = searchParams.get('collection')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      isActive: true,
    }

    if (category) {
      where.categoryId = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            where: { isActive: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          collections: collection ? {
            where: { id: collection },
          } : true,
        },
        orderBy: { sortOrder: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      shortDesc,
      categoryId,
      isActive = true,
      isFeatured = false,
      sortOrder = 0,
      variants = [],
      images = [],
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        categoryId,
        isActive,
        isFeatured,
        sortOrder,
        variants: {
          create: variants.map((v: any) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            comparePrice: v.comparePrice,
            costPrice: v.costPrice,
            stock: v.stock || 0,
            attributes: v.attributes || {},
          })),
        },
        images: {
          create: images.map((img: any) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder || 0,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
