# Symphony Ecommerce - Technical Design Document

## Document Information

- **Project Name**: Symphony Ecommerce
- **Version**: 1.0.0
- **Last Updated**: June 3, 2026
- **Document Type**: Technical Design Document

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [API Architecture](#api-architecture)
7. [Authentication & Authorization](#authentication--authorization)
8. [Frontend Architecture](#frontend-architecture)
9. [Security Considerations](#security-considerations)
10. [Performance Optimization](#performance-optimization)
11. [Deployment Architecture](#deployment-architecture)
12. [Monitoring & Logging](#monitoring--logging)
13. [Future Enhancements](#future-enhancements)

---

## Executive Summary

Symphony Ecommerce is a premium gifting commerce platform designed for the Indian market. The platform serves both B2C customers looking for personalized gifts and B2B clients requiring corporate gifting solutions. The system is built as a modular monolith using Next.js 15 with the App Router, providing a unified codebase for storefront, customer accounts, and administrative operations.

### Key Features

- **Storefront**: Product browsing, search, filtering, and personalized recommendations
- **Cart & Checkout**: Seamless shopping experience with multiple payment methods
- **Customer Accounts**: Order tracking, wishlist, address management
- **Admin Panel**: Product management, order processing, content management, analytics
- **Corporate Gifting**: Dedicated B2B workflows and inquiry management
- **Content Management**: Blog, banners, testimonials, and marketing pages

### Business Goals

- Provide a premium gifting experience with emotional commerce cues
- Support both individual and bulk/corporate orders
- Enable efficient order fulfillment and inventory management
- Scale to handle seasonal demand spikes during festivals
- Maintain high conversion rates through optimized UX

---

## System Overview

### Application Structure

The application follows a monorepo structure using pnpm workspaces:

```
symphony-ecommerce/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # Next.js App Router pages
│       ├── components/         # React components
│       ├── features/           # Feature modules
│       ├── lib/                # Utility libraries
│       └── public/             # Static assets
├── packages/                   # Shared packages (future expansion)
├── prisma/                     # Database schema and migrations
└── docs/                       # Documentation
```

### Main Application Surfaces

1. **Public Storefront** (`/`, `/shop`, `/collections`, `/occasions`)
2. **Customer Account Area** (`/account/*`)
3. **Admin Panel** (`/admin/*`)
4. **API Routes** (`/api/*`)
5. **Marketing Pages** (`/about`, `/contact`, `/faq`, `/corporate-gifting`)

### Domain Modules

- **Auth**: User authentication and session management
- **Catalog**: Products, categories, collections, occasions
- **Cart**: Shopping cart and wishlist management
- **Checkout**: Order processing and payment integration
- **Orders**: Order management and fulfillment
- **Content**: CMS for blog, banners, testimonials
- **Admin**: Administrative operations and analytics
- **Settings**: Store configuration and preferences

---

## Architecture

### Architectural Pattern

The system implements a **modular monolith** architecture, chosen for:

- **Development Velocity**: Single codebase enables faster iteration
- **Shared Domain Logic**: Common models and services across surfaces
- **Simplified Deployment**: Single deployment pipeline
- **Cost Efficiency**: Reduced infrastructure overhead
- **Future Flexibility**: Can extract modules to microservices if needed

### Layer Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  (Next.js Pages, React Components)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Feature Layer                   │
│  (Domain Services, Business Logic)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│  (Prisma ORM, Query Builders)          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Database Layer                  │
│  (PostgreSQL)                           │
└─────────────────────────────────────────┘
```

### Route Architecture

Next.js App Router with route groups for logical separation:

```
app/
├── (marketing)/          # Public marketing pages
│   ├── page.tsx          # Home page
│   ├── about/
│   ├── contact/
│   ├── faq/
│   └── corporate-gifting/
├── (shop)/               # E-commerce pages
│   ├── shop/
│   ├── collections/
│   ├── occasions/
│   ├── cart/
│   ├── checkout/
│   └── track-order/
├── (account)/            # Customer account pages
│   ├── login/
│   ├── register/
│   └── account/
├── admin/                # Admin panel
│   ├── products/
│   ├── orders/
│   ├── customers/
│   ├── content/
│   └── settings/
└── api/                  # API routes
    ├── auth/
    ├── cart/
    ├── orders/
    └── webhooks/
```

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 22 LTS | Runtime environment |
| **TypeScript** | 5.0+ | Type-safe development |
| **pnpm** | 9.0+ | Package manager and workspace management |
| **Turbo** | 2.0+ | Build system and task runner |

### Frontend Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5+ | React framework with App Router |
| **React** | 18+ | UI library |
| **Tailwind CSS** | 4+ | Utility-first CSS framework |
| **shadcn/ui** | Latest | Component library primitives |

### Backend & Data

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | Latest | Primary database |
| **Prisma** | Latest | ORM and database client |
| **Supabase** | Latest | Database hosting and storage |

### Authentication & Security

| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth.js** | Latest | Authentication framework |
| **bcrypt** | Latest | Password hashing |
| **Zod** | Latest | Schema validation |

### Payment Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| **Razorpay** | Latest | Payment processing (India) |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | Latest | Code linting |
| **Prettier** | Latest | Code formatting |
| **TypeScript** | 5.0+ | Type checking |

---

## Database Schema

### Core Entities

#### Authentication Models

**User**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  phone         String?
  whatsapp      String?
  role          UserRole  @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  addresses     Address[]
  orders        Order[]
  cart          Cart?
  wishlistItems WishlistItem[]
  auditLogs     AuditLog[]
  reviews       ProductReview[]
}
```

**Account, Session, VerificationToken, OtpCode**
- Standard NextAuth.js authentication models
- Support for OAuth providers
- OTP-based email verification

#### Catalog Models

**Category**
```prisma
model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  image       String?
  parentId    String?
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  parent      Category?       @relation("CategoryHierarchy")
  children    Category[]     @relation("CategoryHierarchy")
  products    Product[]
  shopByCategories ShopByCategory[]
}
```

**Collection**
- Curated product collections for marketing
- Supports seasonal and themed groupings

**Occasion**
- Event-based product categorization (Birthday, Anniversary, etc.)
- Enables occasion-specific merchandising

**Product**
```prisma
model Product {
  id          String          @id @default(cuid())
  name        String
  slug        String          @unique
  description String          @db.Text
  shortDesc   String?
  categoryId  String
  isActive    Boolean         @default(true)
  isFeatured  Boolean         @default(false)
  sortOrder   Int             @default(0)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  // Relations
  category    Category
  collections Collection[]
  occasions   Occasion[]
  variants    ProductVariant[]
  images      ProductImage[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
  mediaAssets MediaAsset[]
  reviews     ProductReview[]
}
```

**ProductVariant**
- Size, color, and other product variations
- Individual pricing and inventory tracking
- JSON attributes for flexible variant definitions

**ProductImage**
- Multiple images per product
- Sort order for gallery display

#### Cart & Order Models

**Cart**
```prisma
model Cart {
  id        String     @id @default(cuid())
  userId    String?    @unique
  sessionId String?    @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  // Relations
  user      User?
  items     CartItem[]
}
```

**CartItem**
- Links cart to product variants
- Quantity tracking
- Unique constraint per cart-variant combination

**WishlistItem**
- Customer wish list functionality
- User-product unique constraint

**Order**
```prisma
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  userId          String?
  customerEmail   String
  customerName    String
  customerPhone   String?
  status          OrderStatus @default(PENDING)
  subtotal        Decimal     @db.Decimal(10, 2)
  shippingCost    Decimal     @db.Decimal(10, 2)
  tax             Decimal     @db.Decimal(10, 2)
  discount        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  currency        String      @default("INR")
  notes           String?     @db.Text
  giftMessage     String?     @db.Text
  isGiftWrapped   Boolean     @default(false)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  // Relations
  user            User?
  address         Address?
  items           OrderItem[]
  payments        Payment[]
  shipments       Shipment[]
  coupon          Coupon?
}
```

**OrderItem**
- Snapshot of product data at order time
- Preserves historical pricing and product information

**Payment**
- Multi-payment support per order
- Razorpay integration
- Payment status tracking

**Shipment**
- Shipping and tracking information
- Multiple shipments per order
- Delivery timeline management

#### Content Models

**BlogPost**
- Rich content management
- SEO-friendly URLs
- Publication workflow

**Banner**
- Hero and promotional banners
- Sort order and active status
- Link to products or collections

**Testimonial**
- Customer reviews and testimonials
- Approval workflow

**ContentPage**
- Static pages (About, FAQ, etc.)
- Rich text content

#### Admin & System Models

**Coupon**
- Discount codes and promotions
- Usage limits and expiration
- Percentage and fixed amount discounts

**MediaAsset**
- Centralized media management
- S3/Supabase storage integration

**StoreSetting**
- Application configuration
- Feature flags and preferences

**AuditLog**
- Admin action tracking
- Security and compliance

**CorporateInquiry**
- B2B inquiry management
- Bulk order requests

**NewsletterSubscriber**
- Email marketing integration

### Enums

```prisma
enum UserRole {
  CUSTOMER
  ADMIN
  MANAGER
  EDITOR
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentProvider {
  RAZORPAY
  COD
  STRIPE  // Future
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

enum ShipmentStatus {
  PENDING
  SHIPPED
  IN_TRANSIT
  DELIVERED
  RETURNED
}
```

---

## API Architecture

### API Route Structure

The application uses Next.js API routes for server-side operations:

```
app/api/
├── auth/
│   └── [...nextauth]/route.ts    # NextAuth.js handler
├── cart/
│   ├── route.ts                   # GET/POST cart operations
│   └── [id]/route.ts             # DELETE cart item
├── orders/
│   ├── route.ts                   # GET orders, POST create order
│   └── [id]/route.ts             # GET/PUT specific order
├── addresses/
│   └── route.ts                   # CRUD address operations
├── wishlist/
│   └── route.ts                   # CRUD wishlist operations
├── contact/
│   └── route.ts                   # Contact form submission
├── newsletter/
│   └── route.ts                   # Newsletter subscription
├── coupons/
│   └── route.ts                   # Coupon validation
├── reviews/
│   └── route.ts                   # Product reviews
├── upload/
│   └── route.ts                   # File upload handling
├── user/
│   └── route.ts                   # User profile operations
├── webhooks/
│   └── razorpay/route.ts          # Razorpay webhook handler
└── ping/
    └── route.ts                   # Health check endpoint
```

### API Design Principles

1. **RESTful Conventions**: Standard HTTP methods and status codes
2. **Authentication**: Session-based via NextAuth.js
3. **Validation**: Zod schemas for request/response validation
4. **Error Handling**: Consistent error response format
5. **Rate Limiting**: Protection against abuse (future implementation)

### Key API Endpoints

#### Authentication

**POST /api/auth/signin**
- Email/password authentication
- Returns session token

**POST /api/auth/signout**
- Session termination
- Clears authentication cookies

**POST /api/auth/register**
- New user registration
- Email verification flow

#### Cart Operations

**GET /api/cart**
- Retrieve current cart
- Supports both authenticated and guest carts

**POST /api/cart**
- Add item to cart
- Validates product availability

**DELETE /api/cart/[id]**
- Remove item from cart
- Update cart totals

**PUT /api/cart/[id]**
- Update item quantity
- Stock validation

#### Order Operations

**POST /api/orders**
- Create new order
- Payment initiation
- Inventory reservation

**GET /api/orders**
- List user orders
- Pagination support

**GET /api/orders/[id]**
- Retrieve order details
- Tracking information

#### Product Operations

**GET /api/products**
- Product listing
- Filtering and pagination
- Search functionality

**GET /api/products/[slug]**
- Product details
- Variant information
- Related products

#### Content Operations

**GET /api/blog**
- Blog post listing
- Category filtering

**GET /api/blog/[slug]**
- Blog post details
- Related posts

**GET /api/banners**
- Active banners
- Position-based filtering

### Server Actions

In addition to API routes, the application uses Next.js Server Actions for form submissions and mutations:

- **Form submissions**: Contact forms, newsletter signup
- **Admin operations**: Product CRUD, content updates
- **Customer operations**: Profile updates, address management

Server Actions provide:
- Type-safe form handling
- Direct database access
- Reduced client-server round trips
- Progressive enhancement

---

## Authentication & Authorization

### Authentication Flow

#### NextAuth.js Configuration

The application uses NextAuth.js (Auth.js) for authentication:

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Database validation
        // Password verification with bcrypt
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user role and ID to session
    },
    async jwt({ token, user }) {
      // Persist user data in JWT
    },
  },
}
```

#### Authentication Methods

1. **Email/Password**
   - bcrypt password hashing
   - Secure session management
   - Remember me functionality

2. **OTP Verification** (Future)
   - Email-based one-time passwords
   - Phone-based OTP (India SMS integration)

3. **Social OAuth** (Future)
   - Google
   - Facebook
   - Apple

### Authorization Model

#### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  CUSTOMER  // Regular customers
  EDITOR    // Content editors
  MANAGER   // Store managers
  ADMIN     // Full system access
}
```

#### Permission Matrix

| Resource | Customer | Editor | Manager | Admin |
|----------|----------|--------|---------|-------|
| Storefront | ✅ | ✅ | ✅ | ✅ |
| Account | ✅ | ✅ | ✅ | ✅ |
| Admin Panel | ❌ | ✅ | ✅ | ✅ |
| Products | ❌ | ❌ | ✅ | ✅ |
| Orders | ❌ | ❌ | ✅ | ✅ |
| Content | ❌ | ✅ | ✅ | ✅ |
| Settings | ❌ | ❌ | ❌ | ✅ |
| Users | ❌ | ❌ | ❌ | ✅ |

#### Route Protection

Middleware-based route protection:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const session = await getServerSession()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Protect account routes
  if (pathname.startsWith('/account')) {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}
```

#### Server-Side Authorization

Every protected operation includes role checks:

```typescript
// Example: Product deletion
async function deleteProduct(productId: string, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    throw new Error('Unauthorized')
  }
  
  // Proceed with deletion
}
```

### Security Measures

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Minimum password requirements
   - Password strength validation

2. **Session Security**
   - HTTP-only cookies
   - Secure cookie flags in production
   - Session expiration

3. **CSRF Protection**
   - Built-in Next.js CSRF protection
   - Token-based form validation

4. **Rate Limiting** (Future)
   - Auth endpoint throttling
   - API rate limiting per user

5. **Audit Logging**
   - All admin actions logged
   - Failed login attempts tracked
   - Security event monitoring

---

## Frontend Architecture

### Component Architecture

#### Component Hierarchy

```
app/
├── layout.tsx                    # Root layout
│   ├── SiteHeader               # Navigation
│   ├── SiteFooter               # Footer
│   └── children                 # Page content
│
├── components/
│   ├── layout/                  # Layout components
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   └── breadcrumbs.tsx
│   │
│   ├── storefront/              # Storefront components
│   │   ├── brand-system.tsx     # Design system components
│   │   ├── hero-rotator.tsx     # Image carousel
│   │   └── product-card.tsx     # Product display
│   │
│   ├── shop/                    # Shop-specific components
│   │   ├── filters-sidebar.tsx
│   │   └── sort-select.tsx
│   │
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   └── admin/                   # Admin components
│       ├── admin-shell.tsx
│       └── data-table.tsx
```

#### Design System

The application uses a custom design system built on shadcn/ui:

**Brand Colors**
- Primary: `#1f3763` (Deep Navy)
- Secondary: `#2b8b68` (Forest Green)
- Accent: `#f5cf83` (Gold)
- Background: `#f7f2e8` (Ivory)
- Text: `#1a1a1a` (Charcoal)

**Typography**
- Display: Serif fonts for headings
- Body: Sans-serif for UI text
- Monospace: For code and technical content

**Spacing Scale**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### State Management

#### Client State

**Zustand** for lightweight client state:

```typescript
// stores/cart-store.ts
interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  // ...
}))
```

#### Server State

**React Server Components** by default:
- Data fetched on the server
- No client-side JavaScript for initial render
- Improved SEO and performance

**Server Actions** for mutations:
- Type-safe form handling
- Direct database access
- Progressive enhancement

### Performance Optimization

#### Code Splitting

- Automatic route-based splitting
- Dynamic imports for heavy components
- Lazy loading for admin panels

#### Image Optimization

```typescript
// Next.js Image component
<Image
  src={product.image}
  alt={product.name}
  width={800}
  height={600}
  priority={false}
  loading="lazy"
/>
```

#### Caching Strategy

- Static page generation where possible
- ISR (Incremental Static Regeneration) for catalog
- Tag-based revalidation for CMS content
- CDN caching for static assets

#### Bundle Optimization

- Tree shaking for unused code
- Minification in production
- Compression (gzip/brotli)

---

## Security Considerations

### Data Security

1. **Encryption**
   - TLS/SSL for all data in transit
   - Encrypted database connections
   - Sensitive data encryption at rest (future)

2. **Input Validation**
   - Zod schema validation on all inputs
   - SQL injection prevention via Prisma
   - XSS protection via React escaping

3. **File Upload Security**
   - File type validation
   - Size limits
   - Virus scanning (future)
   - S3/Supabase signed URLs

### API Security

1. **Authentication**
   - Session-based authentication
   - Token expiration
   - Secure cookie handling

2. **Authorization**
   - Role-based access control
   - Server-side permission checks
   - Admin action audit logging

3. **Rate Limiting** (Future)
   - Per-IP rate limits
   - Per-user rate limits
   - DDoS protection

### Privacy & Compliance

1. **Data Privacy**
   - GDPR compliance (future)
   - Data retention policies
   - Right to deletion

2. **Cookie Policy**
   - Cookie consent banner (future)
   - Essential vs. marketing cookies
   - Cookie expiration management

3. **Payment Security**
   - PCI DSS compliance via Razorpay
   - No card data storage
   - Secure payment flow

---

## Performance Optimization

### Database Optimization

1. **Indexing**
   - Primary keys on all tables
   - Unique constraints on slugs and emails
   - Composite indexes for common queries

2. **Query Optimization**
   - Prisma query optimization
   - Selective field loading
   - Connection pooling

3. **Caching**
   - Query result caching
   - Redis integration (future)
   - CDN for static assets

### Frontend Performance

1. **Code Splitting**
   - Route-based splitting
   - Component lazy loading
   - Dynamic imports

2. **Asset Optimization**
   - Image optimization with Next.js Image
   - Font subsetting
   - CSS minification

3. **Loading Strategies**
   - Progressive loading
   - Skeleton screens
   - Lazy loading for below-fold content

### Monitoring & Optimization

1. **Performance Metrics**
   - Core Web Vitals tracking
   - Lighthouse CI (future)
   - Real user monitoring (future)

2. **Database Monitoring**
   - Query performance tracking
   - Slow query logging
   - Connection pool monitoring

---

## Deployment Architecture

### Current Deployment

**Platform**: Render (Free Tier)

**Services**:
- **Web Application**: Next.js standalone build
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (product images)
- **CDN**: Render's built-in CDN

### Deployment Configuration

```yaml
# render.yaml
services:
  - type: web
    name: symphony-ecommerce
    runtime: node
    plan: free
    buildCommand: pnpm install --no-frozen-lockfile && pnpm run build
    startCommand: node .next/standalone/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_OPTIONS
        value: --max-old-space-size=384
      - key: DATABASE_URL
        sync: false
      - key: NEXTAUTH_SECRET
        generateValue: true
      - key: NEXTAUTH_URL
        value: https://symphony-ecommerce.onrender.com
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
```

### Environment Variables

**Required Variables**:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Session encryption key
- `NEXTAUTH_URL`: Application URL
- `RAZORPAY_KEY_ID`: Razorpay public key
- `RAZORPAY_KEY_SECRET`: Razorpay secret key

**Optional Variables**:
- `RAZORPAY_WEBHOOK_SECRET`: Webhook verification
- `S3_ENDPOINT`: Object storage endpoint
- `S3_BUCKET`: Storage bucket name
- `S3_ACCESS_KEY`: Storage access key
- `S3_SECRET_KEY`: Storage secret key
- `RESEND_API_KEY`: Email service API key
- `SENTRY_DSN`: Error tracking DSN

### Build Optimization

**Next.js Configuration**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}
```

**Memory Optimization**:
- `NODE_OPTIONS: --max-old-space-size=384` (Render free tier limit: 512MB)
- Standalone output for reduced bundle size
- Disabled source maps in production

### CI/CD Pipeline

**GitHub Actions** (Future):
1. **On Push**: Run tests, lint, build
2. **On PR**: Run full test suite, type checking
3. **On Merge to Main**: Deploy to production
4. **Scheduled**: Database backups, health checks

---

## Monitoring & Logging

### Error Tracking

**Sentry Integration** (Future):
- Client-side error tracking
- Server-side error tracking
- Performance monitoring
- Release tracking

### Logging Strategy

1. **Application Logs**
   - Structured logging with timestamps
   - Log levels: DEBUG, INFO, WARN, ERROR
   - Request/response logging

2. **Audit Logs**
   - Admin actions
   - Security events
   - Order changes

3. **Performance Logs**
   - Query execution time
   - API response times
   - Page load metrics

### Health Monitoring

**Health Check Endpoint**: `/api/ping`
- Database connectivity check
- External service status
- Response time monitoring

### Analytics

**PostHog/Google Analytics** (Future):
- User behavior tracking
- Conversion funnel analysis
- A/B testing support

---

## Future Enhancements

### Short-term (3-6 months)

1. **Search Enhancement**
   - Full-text search with Meilisearch
   - Autocomplete suggestions
   - Search analytics

2. **Payment Expansion**
   - UPI integration
   - EMI options
   - Wallet integration (PhonePe, Paytm)

3. **Email Automation**
   - Order confirmation emails
   - Shipping notifications
   - Abandoned cart recovery
   - Newsletter campaigns

4. **Admin Enhancements**
   - Advanced reporting
   - Inventory alerts
   - Bulk operations
   - Export functionality

### Medium-term (6-12 months)

1. **Mobile App**
   - React Native mobile app
   - Push notifications
   - Offline mode

2. **AI Features**
   - Product recommendations
   - Personalized search
   - Chatbot support

3. **Marketplace**
   - Multi-vendor support
   - Vendor onboarding
   - Commission management

4. **International Expansion**
   - Multi-currency support
   - Multi-language support
   - Regional shipping

### Long-term (12+ months)

1. **Microservices Migration**
   - Extract services as needed
   - Event-driven architecture
   - Service mesh

2. **Advanced Analytics**
   - Predictive analytics
   - Inventory forecasting
   - Customer lifetime value

3. **Social Commerce**
   - Social media integration
   - Influencer partnerships
   - User-generated content

---

## Appendix

### Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint and Prettier
   - Write self-documenting code

2. **Testing**
   - Unit tests for business logic
   - Integration tests for API routes
   - E2E tests for critical flows

3. **Documentation**
   - Comment complex logic
   - Update README for new features
   - Maintain API documentation

### Troubleshooting

**Common Issues**:

1. **Build Failures**
   - Check Node.js version (requires 22+)
   - Clear .next cache
   - Verify environment variables

2. **Database Connection**
   - Verify DATABASE_URL
   - Check Supabase status
   - Review connection limits

3. **Image Loading**
   - Verify image paths
   - Check Supabase storage permissions
   - Review Next.js image config

### Support Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Razorpay Documentation**: https://razorpay.com/docs

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | June 3, 2026 | System | Initial technical design document |

---

**End of Document**
