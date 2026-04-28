# Ecommerce Symphony Architecture

## 1. Product Goal

Ecommerce Symphony is a premium gifting commerce platform for India-first retail and corporate gifting.

The rebuilt system should support:

- high-conversion storefront browsing
- occasion-based discovery
- cart and checkout
- UPI, card, and COD payments
- order tracking
- customer accounts
- blog and CMS-driven marketing pages
- admin operations for products, orders, content, inventory, promotions, and analytics
- corporate and bulk inquiry workflows

This rebuild replaces the current split setup of static HTML pages, a separate admin folder, and a standalone Express backend with a single modern, maintainable application architecture.

## 2. Architecture Decision

Build the product as a modular monolith in a pnpm monorepo.

This is the right choice because:

- the project is still evolving quickly
- storefront and admin share the same domain models
- the team needs velocity more than distributed-service complexity
- a monorepo allows one design system, one auth layer, one schema, and one deployment pipeline

## 3. Chosen Stack

### Core

- Package manager: pnpm
- Monorepo: pnpm workspace
- Frontend framework: Next.js App Router
- Language: TypeScript
- Runtime: Node.js 22 LTS

### UI

- Styling: Tailwind CSS v4
- Component primitives: shadcn/ui
- Animation: motion
- Design references: 21st.dev community components
- Design intelligence and system generation: UI UX Pro Max skill and references
- Icons: lucide-react

### Data and backend

- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Forms: React Hook Form
- Tables: TanStack Table
- State: Zustand for cart and lightweight client state
- Editor: Tiptap for blog and CMS content
- File storage: S3-compatible object storage

### Auth and payments

- Authentication: Auth.js
- Roles: admin, manager, editor, customer
- Payments: Razorpay for India-first checkout
- Optional later expansion: Stripe for international payments

### Quality and operations

- Unit and integration tests: Vitest
- E2E tests: Playwright
- Error monitoring: Sentry
- Analytics: PostHog or GA4
- Email: Resend or SMTP provider abstraction
- CI/CD: GitHub Actions
- Hosting: Vercel for web app, Neon or Supabase for Postgres, S3-compatible media storage

## 4. System Overview

The application is a single Next.js app with clear domain modules.

### Main surfaces

- public storefront
- authenticated customer account area
- authenticated admin application
- internal API routes and server actions
- shared design system and domain logic packages

### Major domains

- auth
- catalog
- cart
- checkout
- orders
- customers
- content
- marketing
- admin operations
- analytics
- settings

## 5. Monorepo Structure

```text
EcommerceSymphony/
  apps/
    web/
  packages/
    ui/
    config/
    email/
    payments/
    analytics/
  prisma/
  docs/
  public/
```

### Responsibilities

`apps/web`
The main Next.js application. Contains storefront, account area, admin area, route handlers, server actions, and page composition.

`packages/ui`
Reusable design system components, layout primitives, theme tokens, table wrappers, form wrappers, chart wrappers, and animation utilities.

`packages/config`
Shared TypeScript, ESLint, Prettier, and environment helpers.

`packages/email`
Transactional email templates and delivery adapters.

`packages/payments`
Payment provider abstractions, Razorpay integration, webhook verification, and payment mapping helpers.

`packages/analytics`
Client and server analytics wrappers.

`prisma`
Database schema, migrations, and seed scripts.

`docs`
Architecture, implementation, content model, data migration, and launch checklists.

## 6. Route Architecture

Use the Next.js App Router with route groups for separation.

```text
app/
  (marketing)/
  (shop)/
  (account)/
  admin/
  api/
```

### Public routes

- `/`
- `/shop`
- `/shop/[slug]`
- `/collections/[slug]`
- `/occasions/[slug]`
- `/blog`
- `/blog/[slug]`
- `/about`
- `/contact`
- `/faq`
- `/corporate-gifting`
- `/track-order`
- `/cart`
- `/checkout`

### Customer routes

- `/login`
- `/register`
- `/forgot-password`
- `/account`
- `/account/orders`
- `/account/orders/[id]`
- `/account/addresses`
- `/account/profile`
- `/account/wishlist`

### Admin routes

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/categories`
- `/admin/collections`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/customers`
- `/admin/content/pages`
- `/admin/content/blog`
- `/admin/content/banners`
- `/admin/content/testimonials`
- `/admin/promotions`
- `/admin/media`
- `/admin/analytics`
- `/admin/settings`
- `/admin/users`
- `/admin/audit-log`

## 7. UI and UX Direction

The visual direction should be premium gifting, not generic commodity retail.

### Brand direction

- editorial luxury with warm emotional commerce cues
- strong seasonal merchandising support
- elegant serif display typography with disciplined sans-serif UI typography
- ivory and charcoal base palette with metallic accent colors
- soft textured backgrounds, layered cards, and refined spacing

### UI rules

- use shadcn/ui primitives as the accessibility and interaction baseline
- use motion only for meaningful transitions, not decorative noise
- use 21st.dev patterns selectively for hero sections, animated testimonials, stats cards, navigation patterns, charts, and advanced visual blocks
- keep admin UI cleaner and denser than the storefront
- preserve mobile-first usability for every buying flow

## 8. Feature Architecture

### Catalog

- products
- categories
- collections
- occasions
- search
- filters
- sort
- featured products
- related products
- product variants
- stock status

### Product detail

- gallery
- variant picker
- gifting notes
- add-ons
- estimated delivery
- trust and shipping info
- reviews
- related recommendations

### Cart and checkout

- cart drawer
- cart page
- coupon codes
- gift wrap
- shipping calculation
- tax calculation
- payment selection
- address capture
- order confirmation

### Customer accounts

- authentication
- profile management
- address book
- order history
- order details
- tracking
- reorder
- wishlist

### Content and marketing

- home page CMS blocks
- banners
- testimonials
- blog
- SEO pages
- landing pages for campaigns and occasions
- corporate gifting inquiry forms

### Admin

- dashboard
- products CRUD
- category and collection management
- inventory management
- order management
- customer management
- content management
- banner and testimonial management
- promotions and coupon management
- analytics and reports
- roles and permissions
- settings
- audit log

## 9. Data Model

The core entities should be:

- User
- Session
- Account
- Address
- Product
- ProductVariant
- ProductImage
- Category
- Collection
- Occasion
- Cart
- CartItem
- WishlistItem
- Order
- OrderItem
- Payment
- Shipment
- Coupon
- ContentPage
- BlogPost
- Banner
- Testimonial
- MediaAsset
- StoreSetting
- AuditLog
- CorporateInquiry
- NewsletterSubscriber

### Important modeling rules

- products and variants must be separated
- orders must snapshot purchased item data
- content must be versionable or at minimum auditable
- admin actions should create audit log records
- images should be stored as media assets, not loose strings
- pricing logic must be centralized in one service layer

## 10. Security Model

- Auth.js session management
- password hashing through provider defaults where applicable
- role-based route guards for admin and customer areas
- server-side authorization checks for every admin action
- CSRF-safe mutation patterns
- signed webhook verification for payment callbacks
- rate limiting on auth and inquiry endpoints
- input validation with Zod at every boundary
- no client-side trust for price, stock, or discount calculations

## 11. Performance Model

- use server components by default
- use client components only for interactive islands
- statically render marketing pages where possible
- use ISR or tag-based revalidation for catalog and CMS content
- optimize images with Next Image
- defer non-critical scripts
- keep animation payloads small and localized
- paginate admin tables
- cache read-heavy catalog queries

## 12. Content Management Model

The CMS should not try to be a full no-code builder in v1.

Use structured content models:

- home page sections
- page hero blocks
- rich text sections
- banners
- testimonials
- blog posts
- SEO metadata

This keeps content flexible while avoiding layout chaos.

## 13. Payment and Order Flow

### Order flow

1. customer adds items to cart
2. checkout validates stock and pricing on server
3. system creates pending order
4. payment session or order is created with provider
5. payment result is verified through callback or webhook
6. order status updates to paid or failed
7. inventory is decremented after confirmed payment or confirmed COD placement based on business rule
8. confirmation email is sent
9. admin can process, ship, and complete the order

### Recommended v1 payment methods

- UPI via Razorpay
- cards via Razorpay
- COD

## 14. Deployment Architecture

### Environments

- local
- preview
- staging
- production

### Production services

- Vercel for Next.js
- managed PostgreSQL
- object storage for media
- email service
- monitoring service
- analytics service

### Environment variables

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `S3_ENDPOINT`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ANALYTICS_KEY`
- `SENTRY_DSN`

## 15. Migration Strategy From Current Project

The current repo already contains:

- product concepts
- order concepts
- content concepts
- admin features
- branding direction

Migration should preserve business data, not implementation patterns.

### Migrate

- products
- categories
- content pages
- banners
- testimonials
- admin users
- uploaded media

### Do not migrate directly

- legacy static HTML structure
- jQuery patterns
- current API contract shape where it blocks better modeling
- JSON-file persistence

## 16. Delivery Phases

### Phase 1

Foundation and design system.

### Phase 2

Storefront browsing and product detail.

### Phase 3

Cart, checkout, payments, and order creation.

### Phase 4

Customer accounts and order tracking.

### Phase 5

Admin operations and CMS.

### Phase 6

Analytics, SEO, quality hardening, and launch readiness.

## 17. Non-Negotiable Engineering Rules

- TypeScript everywhere
- shared types come from domain schemas, not duplicated interfaces
- no direct SQL or Prisma access from random UI files
- server actions and route handlers must call domain services
- pricing, inventory, and discount rules live in dedicated server modules
- admin tables must support filtering, pagination, and empty states
- every major flow needs Playwright coverage before launch
- every new page must support mobile before signoff

## 18. Final Recommendation

Build one premium Next.js commerce platform with shared domain logic, a disciplined CMS, a proper PostgreSQL schema, and a reusable design system powered by shadcn/ui primitives, motion-driven interactions, and carefully selected 21st.dev visual patterns.

That gives the project a clear path from prototype-grade code to a production-grade commerce product without introducing unnecessary microservice or headless-CMS complexity too early.
