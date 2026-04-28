import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:dwnCfCfb%23CT4gJ&@db.ozuoxykvcfeeylszacoj.supabase.co:5432/postgres'
    }
  }
})

async function main() {
  console.log('🌱 Starting FNP personalized gifts seed...')

  // 1. Ensure the parent "Personalized Gifts" category exists
  const parentCategory = await prisma.category.upsert({
    where: { slug: 'personalized-gifts' },
    update: {
      name: 'Personalized Gifts',
      description: 'Custom gifts that still look premium.',
      image: '/images/fnp/products/tabletops.png',
    },
    create: {
      name: 'Personalized Gifts',
      slug: 'personalized-gifts',
      description: 'Custom gifts that still look premium.',
      image: '/images/fnp/products/tabletops.png',
      sortOrder: 1,
    },
  })

  // 2. Create the specific sub-categories from our hardcoded list
  const categoriesData = [
    {
      title: "Personalised Mugs",
      slug: "personalised-mugs",
      description: "Starting ₹249. Printed with photos, names, or messages.",
      image: "/images/fnp/products/mugs.png",
      sortOrder: 1
    },
    {
      title: "Personalised Cushions",
      slug: "personalised-cushions",
      description: "Bestseller. Gifting snuggles with custom photo prints.",
      image: "/images/fnp/products/cushions.png",
      sortOrder: 2
    },
    {
      title: "Personalised Photo Frames",
      slug: "personalised-frames",
      description: "Memories preserved in elegant desk and wall frames.",
      image: "/images/fnp/products/frames.png",
      sortOrder: 3
    },
    {
      title: "Personalised Caricatures",
      slug: "personalised-caricatures",
      description: "Artistic, fun representations based on hobbies.",
      image: "/images/fnp/products/caricatures.png",
      sortOrder: 4
    },
    {
      title: "Personalised Sippers",
      slug: "personalised-sippers",
      description: "Practical gifts engraved with names or initials.",
      image: "/images/fnp/products/sippers.png",
      sortOrder: 5
    },
    {
      title: "Personalised Neon Lights",
      slug: "personalised-neon-lights",
      description: "Custom neon text and signs for unique home decor.",
      image: "/images/fnp/products/neon.png",
      sortOrder: 6
    },
    {
      title: "Personalised Flowers",
      slug: "personalised-flowers",
      description: "Monogrammed mugs or photo bouquets for special days.",
      image: "/images/fnp/products/flowers.png",
      sortOrder: 7
    },
    {
      title: "Personalised Stationery",
      slug: "personalised-stationery",
      description: "Custom pens, diaries, and pencil boxes for office use.",
      image: "/images/fnp/products/stationery.png",
      sortOrder: 8
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

  // 3. Add products to each category
  const productsData = [
    {
      name: "Custom Photo Mug",
      slug: "custom-photo-mug",
      description: "A beautiful ceramic mug that you can personalize with your favorite photos and messages. Start your day right.",
      shortDesc: "Personalized ceramic photo mug.",
      categorySlug: "personalised-mugs",
      price: 249,
      images: ["/images/fnp/products/mugs.png"]
    },
    {
      name: "LED Photo Cushion",
      slug: "led-photo-cushion",
      description: "A comfortable and magical LED cushion that lights up your personalized photo. Perfect for gifting.",
      shortDesc: "Bestseller LED personalized cushion.",
      categorySlug: "personalised-cushions",
      price: 499,
      images: ["/images/fnp/products/cushions.png"]
    },
    {
      name: "Wooden Desk Frame",
      slug: "wooden-desk-frame",
      description: "An elegant wooden desk frame to keep your best memories close while you work.",
      shortDesc: "Elegant wooden personalized frame.",
      categorySlug: "personalised-frames",
      price: 399,
      images: ["/images/fnp/products/frames.png"]
    },
    {
      name: "Superhero Caricature Stand",
      slug: "superhero-caricature-stand",
      description: "A fun and quirky superhero caricature personalized with your face. A great desk accessory.",
      shortDesc: "Fun personalized superhero caricature.",
      categorySlug: "personalised-caricatures",
      price: 599,
      images: ["/images/fnp/products/caricatures.png"]
    },
    {
      name: "Engraved Steel Sipper",
      slug: "engraved-steel-sipper",
      description: "A high-quality steel sipper elegantly engraved with your name. Stay hydrated in style.",
      shortDesc: "Personalized name engraved sipper.",
      categorySlug: "personalised-sippers",
      price: 449,
      images: ["/images/fnp/products/sippers.png"]
    },
    {
      name: "Custom Name Neon Sign",
      slug: "custom-name-neon-sign",
      description: "A vibrant neon sign customized with a name or word of your choice. Liven up any room.",
      shortDesc: "Vibrant custom text neon sign.",
      categorySlug: "personalised-neon-lights",
      price: 1299,
      images: ["/images/fnp/products/neon.png"]
    },
    {
      name: "Photo Flower Box",
      slug: "photo-flower-box",
      description: "A stunning box of fresh flowers paired with your favorite memories printed on the box.",
      shortDesc: "Fresh flowers with personalized photo box.",
      categorySlug: "personalised-flowers",
      price: 899,
      images: ["/images/fnp/products/flowers.png"]
    },
    {
      name: "Engraved Leather Diary & Pen",
      slug: "engraved-leather-diary-pen",
      description: "A premium leather diary and pen set personalized with your initials. Perfect for professionals.",
      shortDesc: "Premium engraved stationery set.",
      categorySlug: "personalised-stationery",
      price: 699,
      images: ["/images/fnp/products/stationery.png"]
    },
    {
      name: "Personalized Tabletop Stand",
      slug: "personalized-tabletop-stand",
      description: "A beautiful acrylic tabletop stand displaying your custom message and photo.",
      shortDesc: "Acrylic personalized tabletop stand.",
      categorySlug: "personalised-frames",
      price: 349,
      images: ["/images/fnp/products/tabletops.png"]
    },
    {
      name: "Engraved Wooden Clock",
      slug: "engraved-wooden-clock",
      description: "A functional wooden clock engraved with a custom message. A timeless gift.",
      shortDesc: "Personalized wooden desk clock.",
      categorySlug: "personalised-stationery",
      price: 799,
      images: ["/images/fnp/products/clocks.png"]
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
        stock: 100,
        isActive: true,
      },
      create: {
        productId: product.id,
        name: 'Default',
        sku: `SKU-${prod.slug}`,
        price: prod.price,
        stock: 100,
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

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })