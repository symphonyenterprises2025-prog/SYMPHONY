import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:dwnCfCfb%23CT4gJ%26@db.ozuoxykvcfeeylszacoj.supabase.co:5432/postgres'
    }
  }
})

async function main() {
  console.log('🌱 Starting seed...')

  // Hash the sample password
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@symphony.com' },
    update: {},
    create: {
      email: 'admin@symphony.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created')

  // Create sample customers with upsert to ensure passwords are set
  const sampleCustomers = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'CUSTOMER' as const,
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'CUSTOMER' as const,
    },
    {
      email: 'rahul.kumar@example.com',
      name: 'Rahul Kumar',
      password: hashedPassword,
      role: 'CUSTOMER' as const,
    },
    {
      email: 'priya.sharma@example.com',
      name: 'Priya Sharma',
      password: hashedPassword,
      role: 'CUSTOMER' as const,
    },
    {
      email: 'amit.patel@example.com',
      name: 'Amit Patel',
      password: hashedPassword,
      role: 'CUSTOMER' as const,
    },
  ]

  for (const customer of sampleCustomers) {
    await prisma.user.upsert({
      where: { email: customer.email },
      update: { password: customer.password },
      create: customer,
    })
  }
  console.log('✅ Sample customers created')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'gift-hampers' },
      update: {},
      create: {
        name: 'Gift Hampers',
        slug: 'gift-hampers',
        description: 'Curated gift hampers for every occasion',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'personalized-gifts' },
      update: {},
      create: {
        name: 'Personalized Gifts',
        slug: 'personalized-gifts',
        description: 'Customized gifts with personal touch',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'corporate-gifts' },
      update: {},
      create: {
        name: 'Corporate Gifts',
        slug: 'corporate-gifts',
        description: 'Premium corporate gifting solutions',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'festive-gifts' },
      update: {},
      create: {
        name: 'Festive Gifts',
        slug: 'festive-gifts',
        description: 'Special gifts for festivals and celebrations',
        sortOrder: 4,
      },
    }),
  ])
  console.log('✅ Categories created')

  // Create occasions
  const occasions = await Promise.all([
    prisma.occasion.upsert({
      where: { slug: 'birthday' },
      update: {},
      create: {
        name: 'Birthday',
        slug: 'birthday',
        description: 'Make birthdays special',
        sortOrder: 1,
      },
    }),
    prisma.occasion.upsert({
      where: { slug: 'anniversary' },
      update: {},
      create: {
        name: 'Anniversary',
        slug: 'anniversary',
        description: 'Celebrate love and togetherness',
        sortOrder: 2,
      },
    }),
    prisma.occasion.upsert({
      where: { slug: 'wedding' },
      update: {},
      create: {
        name: 'Wedding',
        slug: 'wedding',
        description: 'Perfect gifts for the special day',
        sortOrder: 3,
      },
    }),
    prisma.occasion.upsert({
      where: { slug: 'diwali' },
      update: {},
      create: {
        name: 'Diwali',
        slug: 'diwali',
        description: 'Festival of lights gifts',
        sortOrder: 4,
      },
    }),
    prisma.occasion.upsert({
      where: { slug: 'congratulations' },
      update: {},
      create: {
        name: 'Congratulations',
        slug: 'congratulations',
        description: 'Recognition gifts for achievements',
        sortOrder: 5,
      },
    }),
    prisma.occasion.upsert({
      where: { slug: 'thank-you' },
      update: {},
      create: {
        name: 'Thank You',
        slug: 'thank-you',
        description: 'Express gratitude with thoughtful gifts',
        sortOrder: 6,
      },
    }),
  ])
  console.log('✅ Occasions created')

  // Create collections
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'gift-hampers' },
      update: {},
      create: {
        name: 'Gift Hampers',
        slug: 'gift-hampers',
        description: 'Curated boxes for celebrations, festivals, and premium gifting moments.',
        sortOrder: 1,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'personalized-gifts' },
      update: {},
      create: {
        name: 'Personalized Gifts',
        slug: 'personalized-gifts',
        description: 'Photo products, engraved pieces, and made-for-them keepsakes.',
        sortOrder: 2,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'corporate-sets' },
      update: {},
      create: {
        name: 'Corporate Sets',
        slug: 'corporate-sets',
        description: 'Presentation-focused gifting for clients, teams, and campaigns.',
        sortOrder: 3,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'awards-recognition' },
      update: {},
      create: {
        name: 'Awards & Recognition',
        slug: 'awards-recognition',
        description: 'Trophies, plaques, and memorable recognition formats.',
        sortOrder: 4,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'anniversary-stories' },
      update: {},
      create: {
        name: 'Anniversary Stories',
        slug: 'anniversary-stories',
        description: 'Keepsake gifts designed around memory, photo, and sentiment.',
        sortOrder: 5,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'festival-specials' },
      update: {},
      create: {
        name: 'Festival Specials',
        slug: 'festival-specials',
        description: 'Diwali and seasonal gifting built around warm presentation.',
        sortOrder: 6,
      },
    }),
  ])
  console.log('✅ Collections created')

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'luxury-chocolate-hamper' },
      update: {},
      create: {
        name: 'Luxury Chocolate Hamper',
        slug: 'luxury-chocolate-hamper',
        description: 'An exquisite collection of premium Belgian chocolates in an elegant box. Perfect for gifting on special occasions.',
        shortDesc: 'Premium Belgian chocolates in elegant packaging',
        categoryId: categories[0].id,
        isFeatured: true,
        sortOrder: 1,
        variants: {
          create: {
            name: 'Standard',
            sku: 'LCH-001',
            price: 1499,
            comparePrice: 1799,
            stock: 50,
            attributes: { size: 'Standard', pieces: '24' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift23.webp',
              alt: 'Luxury Chocolate Hamper',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'personalized-photo-frame' },
      update: {},
      create: {
        name: 'Personalized Photo Frame',
        slug: 'personalized-photo-frame',
        description: 'A beautiful wooden photo frame that can be personalized with your favorite photo and a custom message.',
        shortDesc: 'Customizable wooden photo frame',
        categoryId: categories[1].id,
        isFeatured: true,
        sortOrder: 2,
        variants: {
          create: {
            name: '8x10 inch',
            sku: 'PPF-001',
            price: 899,
            comparePrice: 1099,
            stock: 100,
            attributes: { size: '8x10 inch', material: 'Wood' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift24.webp',
              alt: 'Personalized Photo Frame',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'corporate-gift-bundle' },
      update: {},
      create: {
        name: 'Corporate Gift Bundle',
        slug: 'corporate-gift-bundle',
        description: 'A sophisticated corporate gift bundle including a premium notebook, pen set, and customized diary.',
        shortDesc: 'Premium corporate gift set',
        categoryId: categories[2].id,
        isFeatured: false,
        sortOrder: 3,
        variants: {
          create: {
            name: 'Standard',
            sku: 'CGB-001',
            price: 2499,
            comparePrice: 2999,
            stock: 30,
            attributes: { size: 'Standard', items: 'Notebook, Pen, Diary' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift11.webp',
              alt: 'Corporate Gift Bundle',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'personalized-cushion' },
      update: {},
      create: {
        name: 'Personalized Cushion',
        slug: 'personalized-cushion',
        description: 'A soft and comfortable cushion that can be personalized with photos, names, or messages.',
        shortDesc: 'Custom photo cushion with personalization',
        categoryId: categories[1].id,
        isFeatured: true,
        sortOrder: 4,
        variants: {
          create: {
            name: 'Standard',
            sku: 'PC-001',
            price: 499,
            comparePrice: 699,
            stock: 75,
            attributes: { size: '16x16 inch', material: 'Velvet' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift01.webp',
              alt: 'Personalized Cushion',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'engraved-pen-set' },
      update: {},
      create: {
        name: 'Engraved Pen Set',
        slug: 'engraved-pen-set',
        description: 'Premium metal pen set with custom engraving options for names and logos.',
        shortDesc: 'Custom engraved pen set',
        categoryId: categories[1].id,
        isFeatured: true,
        sortOrder: 5,
        variants: {
          create: {
            name: 'Standard',
            sku: 'EPS-001',
            price: 699,
            comparePrice: 899,
            stock: 60,
            attributes: { pieces: '3', material: 'Metal' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift02.webp',
              alt: 'Engraved Pen Set',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'custom-mug' },
      update: {},
      create: {
        name: 'Custom Mug',
        slug: 'custom-mug',
        description: 'High-quality ceramic mug that can be customized with photos, names, or messages.',
        shortDesc: 'Personalized ceramic mug',
        categoryId: categories[1].id,
        isFeatured: true,
        sortOrder: 6,
        variants: {
          create: {
            name: 'Standard',
            sku: 'CM-001',
            price: 349,
            comparePrice: 449,
            stock: 120,
            attributes: { size: '11oz', material: 'Ceramic' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift15.webp',
              alt: 'Custom Mug',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'personalized-keychain' },
      update: {},
      create: {
        name: 'Personalized Keychain',
        slug: 'personalized-keychain',
        description: 'Durable metal keychain with photo engraving and custom text options.',
        shortDesc: 'Custom engraved keychain',
        categoryId: categories[1].id,
        isFeatured: false,
        sortOrder: 7,
        variants: {
          create: {
            name: 'Standard',
            sku: 'PK-001',
            price: 299,
            comparePrice: 399,
            stock: 150,
            attributes: { material: 'Metal', type: 'Photo' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift05.webp',
              alt: 'Personalized Keychain',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'crystal-trophy' },
      update: {},
      create: {
        name: 'Crystal Trophy',
        slug: 'crystal-trophy',
        description: 'Elegant crystal trophy with laser engraving for awards and recognition.',
        shortDesc: 'Premium crystal award trophy',
        categoryId: categories[3].id,
        isFeatured: true,
        sortOrder: 8,
        variants: {
          create: {
            name: 'Standard',
            sku: 'CT-001',
            price: 1299,
            comparePrice: 1599,
            stock: 40,
            attributes: { height: '8 inch', material: 'Crystal' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift22.webp',
              alt: 'Crystal Trophy',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'festive-diwali-hamper' },
      update: {},
      create: {
        name: 'Festive Diwali Hamper',
        slug: 'festive-diwali-hamper',
        description: 'A grand Diwali hamper with sweets, dry fruits, and decorative items for the festival of lights.',
        shortDesc: 'Premium Diwali gift hamper',
        categoryId: categories[3].id,
        isFeatured: true,
        sortOrder: 9,
        variants: {
          create: {
            name: 'Standard',
            sku: 'FDH-001',
            price: 1499,
            comparePrice: 1999,
            stock: 45,
            attributes: { items: '15', type: 'Festive' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift16.webp',
              alt: 'Festive Diwali Hamper',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'anniversary-gift-set' },
      update: {},
      create: {
        name: 'Anniversary Gift Set',
        slug: 'anniversary-gift-set',
        description: 'A romantic gift set with photo frame, flowers, and personalized message card.',
        shortDesc: 'Romantic anniversary gift collection',
        categoryId: categories[1].id,
        isFeatured: false,
        sortOrder: 10,
        variants: {
          create: {
            name: 'Standard',
            sku: 'AGS-001',
            price: 999,
            comparePrice: 1299,
            stock: 55,
            attributes: { items: '5', type: 'Romantic' },
          },
        },
        images: {
          create: [
            {
              url: '/images/fnp/products/gift15.webp',
              alt: 'Anniversary Gift Set',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
  ])
  console.log('✅ Products created')

  // Link products to collections
  await Promise.all([
    prisma.collection.update({
      where: { id: collections[0].id },
      data: {
        products: {
          connect: [{ id: products[0].id }, { id: products[1].id }, { id: products[8].id }],
        },
      },
    }),
    prisma.collection.update({
      where: { id: collections[1].id },
      data: {
        products: {
          connect: [{ id: products[0].id }, { id: products[3].id }, { id: products[4].id }, { id: products[5].id }, { id: products[6].id }],
        },
      },
    }),
    prisma.collection.update({
      where: { id: collections[2].id },
      data: {
        products: {
          connect: [{ id: products[2].id }],
        },
      },
    }),
  ])
  console.log('✅ Products linked to collections')

  // Link products to occasions
  await Promise.all([
    prisma.occasion.update({
      where: { id: occasions[0].id },
      data: {
        products: {
          connect: [{ id: products[0].id }, { id: products[3].id }, { id: products[5].id }],
        },
      },
    }),
    prisma.occasion.update({
      where: { id: occasions[1].id },
      data: {
        products: {
          connect: [{ id: products[1].id }, { id: products[9].id }],
        },
      },
    }),
    prisma.occasion.update({
      where: { id: occasions[2].id },
      data: {
        products: {
          connect: [{ id: products[3].id }, { id: products[9].id }],
        },
      },
    }),
    prisma.occasion.update({
      where: { id: occasions[3].id },
      data: {
        products: {
          connect: [{ id: products[0].id }, { id: products[8].id }],
        },
      },
    }),
  ])
  console.log('✅ Products linked to occasions')

  // Create sample orders
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    take: 3,
  })

  if (customers.length > 0 && products.length > 0) {
    const orders = await prisma.order.createMany({
      data: [
        {
          orderNumber: 'ORD-001',
          customerEmail: customers[0].email,
          customerName: customers[0].name || 'Customer',
          status: 'DELIVERED',
          subtotal: 1499,
          shippingCost: 99,
          tax: 270,
          discount: 0,
          total: 1868,
          userId: customers[0].id,
        },
        {
          orderNumber: 'ORD-002',
          customerEmail: customers[1].email,
          customerName: customers[1].name || 'Customer',
          status: 'PROCESSING',
          subtotal: 899,
          shippingCost: 99,
          tax: 162,
          discount: 100,
          total: 1060,
          userId: customers[1].id,
        },
        {
          orderNumber: 'ORD-003',
          customerEmail: customers[2].email,
          customerName: customers[2].name || 'Customer',
          status: 'SHIPPED',
          subtotal: 2499,
          shippingCost: 0,
          tax: 450,
          discount: 250,
          total: 2699,
          userId: customers[2].id,
        },
      ],
      skipDuplicates: true,
    })
    console.log('✅ Sample orders created')

    // Fetch created orders to add order items
    const createdOrders = await prisma.order.findMany({
      where: { orderNumber: { in: ['ORD-001', 'ORD-002', 'ORD-003'] } },
    })

    // Fetch products with variants
    const productsWithVariants = await prisma.product.findMany({
      where: { id: { in: products.slice(0, 3).map(p => p.id) } },
      include: { variants: true },
    })

    // Add order items
    for (const order of createdOrders) {
      const productIndex = Math.floor(Math.random() * productsWithVariants.length)
      const product = productsWithVariants[productIndex]
      const variant = product.variants[0]

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantName: variant.name,
          price: variant.price,
          quantity: 1,
          total: variant.price,
          productData: { name: product.name, slug: product.slug },
        },
      })
    }
    console.log('✅ Sample order items created')
  }

  // Create banners
  await Promise.all([
    prisma.banner.upsert({
      where: { id: 'banner-1' },
      update: {},
      create: {
        id: 'banner-1',
        title: 'Summer Sale - Up to 30% Off',
        image: '/images/banners/summer-sale.jpg',
        link: '/shop',
        position: 'home-hero',
        sortOrder: 1,
      },
    }),
    prisma.banner.upsert({
      where: { id: 'banner-2' },
      update: {},
      create: {
        id: 'banner-2',
        title: 'Corporate Gifting Solutions',
        image: '/images/banners/corporate-gifting.jpg',
        link: '/corporate-gifting',
        position: 'home-secondary',
        sortOrder: 2,
      },
    }),
  ])
  console.log('✅ Banners created')

  // Create testimonials
  await Promise.all([
    prisma.testimonial.upsert({
      where: { id: 'testimonial-1' },
      update: {},
      create: {
        id: 'testimonial-1',
        name: 'Priya Sharma',
        role: 'Marketing Manager',
        content: 'The corporate gift bundles were perfect for our client appreciation event. Excellent quality and timely delivery!',
        rating: 5,
        sortOrder: 1,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-2' },
      update: {},
      create: {
        id: 'testimonial-2',
        name: 'Rahul Mehta',
        role: 'Customer',
        content: 'Ordered a personalized photo frame for my parents anniversary. They absolutely loved it! Great quality and fast shipping.',
        rating: 5,
        sortOrder: 2,
      },
    }),
  ])
  console.log('✅ Testimonials created')

  // Create store settings
  const settings = [
    { key: 'store_name', value: 'Ecommerce Symphony', description: 'Store name' },
    { key: 'store_email', value: 'contact@symphony.com', description: 'Store contact email' },
    { key: 'store_phone', value: '+91 98765 43210', description: 'Store contact phone' },
    { key: 'currency', value: 'INR', description: 'Default currency' },
    { key: 'tax_rate', value: '18', description: 'Default tax rate in percent' },
    { key: 'shipping_cost', value: '99', description: 'Default shipping cost' },
    { key: 'free_shipping_threshold', value: '999', description: 'Free shipping order threshold' },
  ]

  for (const setting of settings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('✅ Store settings created')

  // Create blog posts
  await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: 'top-10-personalized-gifting-ideas' },
      update: {},
      create: {
        title: 'Top personalized gifting ideas that still feel premium',
        slug: 'top-10-personalized-gifting-ideas',
        excerpt: 'How to avoid generic custom products and choose gifts that still feel polished, elegant, and memorable.',
        content: 'Full article content about personalized gifting...',
        author: 'Symphony Editorial',
        isPublished: true,
        publishedAt: new Date('2026-04-15'),
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'art-of-corporate-gifting' },
      update: {},
      create: {
        title: 'What corporate gifting gets right when the presentation is consistent',
        slug: 'art-of-corporate-gifting',
        excerpt: 'Why the best business gifting programs think beyond the item and focus on curation, branding, and finishing.',
        content: 'Full article content about corporate gifting...',
        author: 'Business Team',
        isPublished: true,
        publishedAt: new Date('2026-04-10'),
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'customized-hampers-perfect-birthday-gift' },
      update: {},
      create: {
        title: 'How curated festive hampers create stronger first impressions',
        slug: 'customized-hampers-perfect-birthday-gift',
        excerpt: 'A closer look at hamper composition, packaging layers, and how to build gift boxes that feel intentional.',
        content: 'Full article content about festive hampers...',
        author: 'Symphony Editorial',
        isPublished: true,
        publishedAt: new Date('2026-04-05'),
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'recognition-products-better-than-trophies' },
      update: {},
      create: {
        title: 'Recognition products that look better than standard trophies',
        slug: 'recognition-products-better-than-trophies',
        excerpt: 'Plaques, engraved desk pieces, acrylic silhouettes, and crystal awards that elevate milestone moments.',
        content: 'Full article content about recognition products...',
        author: 'Symphony Editorial',
        isPublished: true,
        publishedAt: new Date('2026-04-01'),
      },
    }),
  ])
  console.log('✅ Blog posts created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
