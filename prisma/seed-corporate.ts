import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:dwnCfCfb%23CT4gJ&@db.ozuoxykvcfeeylszacoj.supabase.co:5432/postgres'
    }
  }
})

async function main() {
  console.log('🌱 Starting Corporate Gifts seed...')

  // 1. Ensure the parent "Corporate Gifts" category exists
  const parentCategory = await prisma.category.upsert({
    where: { slug: 'corporate-gifts' },
    update: {
      name: 'Corporate Gifts',
      description: 'Premium corporate gifting solutions, hampers, and kits.',
      image: '/images/fnp/corporate/welcome-kits.jpg',
    },
    create: {
      name: 'Corporate Gifts',
      slug: 'corporate-gifts',
      description: 'Premium corporate gifting solutions, hampers, and kits.',
      image: '/images/fnp/corporate/welcome-kits.jpg',
      sortOrder: 2,
    },
  })

  // 2. Create the specific sub-categories
  const categoriesData = [
    {
      title: "Festive Hampers",
      slug: "festive-hampers",
      description: "Curated gift hampers for Diwali, Christmas and other festive occasions.",
      image: "/images/fnp/corporate/hampers.jpg",
      sortOrder: 1
    },
    {
      title: "Onboarding & Welcome Kits",
      slug: "welcome-kits",
      description: "Welcome to the team! Premium onboarding kits to greet new employees.",
      image: "/images/fnp/corporate/welcome-kits.jpg",
      sortOrder: 2
    },
    {
      title: "Awards & Recognition",
      slug: "awards",
      description: "Long service awards and employee appreciation gifts.",
      image: "/images/fnp/corporate/awards.jpg",
      sortOrder: 3
    },
    {
      title: "Diwali Gifts",
      slug: "corporate-diwali",
      description: "Traditional sweets, dry fruits, and auspicious gifts for Diwali.",
      image: "/images/fnp/corporate/diwali.jpg",
      sortOrder: 4
    },
    {
      title: "Christmas Gifts",
      slug: "corporate-christmas",
      description: "Year-end gifting solutions and secret santa presents.",
      image: "/images/fnp/corporate/christmas.jpg",
      sortOrder: 5
    },
    {
      title: "Promotional Gifts",
      slug: "promotional-gifts",
      description: "Branded merchandise and customized event giveaways.",
      image: "/images/fnp/corporate/promotional.jpg",
      sortOrder: 6
    }
  ]

  const createdCategories = []

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.title,
        description: cat.description,
        image: cat.image,
        parentId: parentCategory.id,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.title,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        parentId: parentCategory.id,
        sortOrder: cat.sortOrder,
      },
    })
    createdCategories.push(createdCat)
    console.log(`✅ Category created: ${cat.title}`)
  }

  // 3. Add products to the categories
  const productsData = [
    {
      name: "The Utility Pack",
      slug: "the-utility-pack",
      description: "A functional kit designed for daily office use containing a premium diary, pen, and a thermal flask.",
      shortDesc: "Functional office utility kit.",
      categorySlug: "welcome-kits",
      price: 1499,
      images: ["/images/fnp/corporate/utility-pack.jpg"]
    },
    {
      name: "Eco Chic Hamper",
      slug: "eco-chic-hamper",
      description: "A sustainable gifting option focused on environmentally friendly products including bamboo desk organizers and seed pens.",
      shortDesc: "Sustainable, eco-friendly gift hamper.",
      categorySlug: "festive-hampers",
      price: 1899,
      images: ["/images/fnp/corporate/eco-chic.jpg"]
    },
    {
      name: "Let's Go Copper Kit",
      slug: "lets-go-copper-kit",
      description: "A themed wellness set featuring a pure copper water bottle, tumbler, and traditional wellness treats.",
      shortDesc: "Premium wellness copper kit.",
      categorySlug: "awards",
      price: 2499,
      images: ["/images/fnp/corporate/copper-kit.jpg"]
    },
    {
      name: "The Brown Collection",
      slug: "the-brown-collection",
      description: "A chic and classic leather collection intended for professional use. Includes a premium leather portfolio and wallet.",
      shortDesc: "Premium leather portfolio collection.",
      categorySlug: "awards",
      price: 3499,
      images: ["/images/fnp/corporate/brown-collection.jpg"]
    },
    {
      name: "Diwali Dry Fruit Tray",
      slug: "diwali-dry-fruit-tray",
      description: "A healthy and auspicious snack option featuring a premium mix of cashews, almonds, and apricots in an elegant wooden tray.",
      shortDesc: "Premium mixed dry fruits tray.",
      categorySlug: "corporate-diwali",
      price: 1299,
      images: ["/images/fnp/corporate/diwali.jpg"]
    },
    {
      name: "Corporate Christmas Treat Box",
      slug: "corporate-christmas-treat-box",
      description: "Celebrate the year-end with this curated box of rich plum cake, gourmet chocolates, and festive cookies.",
      shortDesc: "Festive plum cake & chocolate box.",
      categorySlug: "corporate-christmas",
      price: 999,
      images: ["/images/fnp/corporate/christmas.jpg"]
    },
    {
      name: "Personalized Corporate Diary & Pen",
      slug: "corporate-diary-pen-set",
      description: "A professional journal and pen set that can be customized with the company logo and employee name. Perfect for events.",
      shortDesc: "Customizable event merchandise set.",
      categorySlug: "promotional-gifts",
      price: 599,
      images: ["/images/fnp/corporate/promotional.jpg"]
    },
    {
      name: "Welcome to the Team Kit",
      slug: "welcome-to-the-team-kit",
      description: "An onboarding kit designed to greet new employees with company-branded mug, t-shirt, and welcome letter.",
      shortDesc: "Complete new employee greeting kit.",
      categorySlug: "welcome-kits",
      price: 1199,
      images: ["/images/fnp/corporate/welcome-kits.jpg"]
    }
  ]

  for (const prod of productsData) {
    const category = createdCategories.find(c => c.slug === prod.categorySlug)
    if (!category) continue

    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        shortDesc: prod.shortDesc,
        categoryId: category.id,
        isActive: true,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        shortDesc: prod.shortDesc,
        categoryId: category.id,
        isActive: true,
        sortOrder: 0,
      },
    })

    // Upsert variant
    await prisma.productVariant.upsert({
      where: { sku: `SKU-${prod.slug}` },
      update: {
        name: 'Default',
        price: prod.price,
        stock: 500,
        isActive: true,
      },
      create: {
        productId: product.id,
        name: 'Default',
        sku: `SKU-${prod.slug}`,
        price: prod.price,
        stock: 500,
        attributes: {},
        isActive: true,
      },
    })

    // Create images (delete existing first to avoid duplicates)
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })
    
    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: prod.images[i],
          sortOrder: i,
        }
      })
    }

    console.log(`✅ Product created: ${prod.name}`)
  }

  console.log('✅ Corporate seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })