# Ecommerce Symphony Implementation Plan

This document is the execution plan for rebuilding Ecommerce Symphony from scratch.

It is intentionally file-by-file so the project can be built in a controlled sequence without architecture drift.

## 1. Build Strategy

Create the new app in phases:

1. foundation
2. design system
3. data model
4. storefront
5. checkout
6. customer account
7. admin
8. analytics and SEO
9. tests and launch

## 2. New Repository Structure

```text
EcommerceSymphony/
  apps/
    web/
      app/
      components/
      features/
      lib/
      hooks/
      styles/
      public/
      tests/
      middleware.ts
      next.config.ts
      package.json
      tsconfig.json
  packages/
    ui/
    email/
    payments/
    analytics/
    config/
  prisma/
  docs/
  package.json
  pnpm-workspace.yaml
  turbo.json
  .env.example
  .gitignore
```

## 3. Root Files

### `/package.json`

Create workspace scripts:

- `dev`
- `build`
- `lint`
- `test`
- `test:e2e`
- `format`
- `db:generate`
- `db:migrate`
- `db:seed`

### `/pnpm-workspace.yaml`

Declare workspace packages:

- `apps/*`
- `packages/*`

### `/turbo.json`

Define pipeline for:

- build
- lint
- test
- dev

### `/.env.example`

List every required environment variable for local setup.

### `/.gitignore`

Ignore:

- `node_modules`
- `.next`
- `dist`
- `.turbo`
- `.env*`
- generated Prisma artifacts if needed

## 4. Prisma Layer

### `/prisma/schema.prisma`

Create the complete database schema.

Models to add:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Address`
- `Category`
- `Collection`
- `Occasion`
- `Product`
- `ProductVariant`
- `ProductImage`
- `Cart`
- `CartItem`
- `WishlistItem`
- `Order`
- `OrderItem`
- `Payment`
- `Shipment`
- `Coupon`
- `ContentPage`
- `BlogPost`
- `Banner`
- `Testimonial`
- `MediaAsset`
- `StoreSetting`
- `AuditLog`
- `CorporateInquiry`
- `NewsletterSubscriber`

### `/prisma/seed.ts`

Seed:

- admin user
- sample categories
- sample occasions
- sample collections
- sample products
- sample banners
- sample testimonials
- settings defaults

### `/prisma/migrations/*`

Generated after schema stabilizes.

## 5. App Foundation Files

### `/apps/web/package.json`

Add dependencies for:

- Next.js
- React
- Tailwind CSS
- shadcn/ui dependencies
- motion
- Prisma client
- Auth.js
- Zod
- React Hook Form
- Zustand
- TanStack Table
- Tiptap
- Sentry
- Playwright

### `/apps/web/next.config.ts`

Configure:

- image domains
- experimental flags only if truly needed
- security headers if managed here

### `/apps/web/tsconfig.json`

Set path aliases:

- `@/components/*`
- `@/features/*`
- `@/lib/*`
- `@/hooks/*`
- `@/styles/*`

### `/apps/web/middleware.ts`

Protect:

- `/admin`
- selected `/account` routes

### `/apps/web/app/layout.tsx`

Create the global app shell:

- html/body wrapper
- theme tokens
- top-level providers
- toast container
- analytics bootstrap

### `/apps/web/app/globals.css`

Define:

- CSS variables
- semantic theme tokens
- typography scale
- background textures
- utility classes for premium surfaces and motion-safe effects

### `/apps/web/app/favicon.ico`

Add brand icon.

## 6. Shared Libraries

### `/apps/web/lib/env.ts`

Validate environment variables with Zod.

### `/apps/web/lib/db.ts`

Export Prisma client singleton.

### `/apps/web/lib/auth.ts`

Create Auth.js config and helpers.

### `/apps/web/lib/constants.ts`

Centralize enums and app-wide constants.

### `/apps/web/lib/utils.ts`

Utility helpers for class merging, currency formatting, slugging, and dates.

### `/apps/web/lib/permissions.ts`

Role checks for admin, manager, editor, and customer.

### `/apps/web/lib/revalidate.ts`

Tag helpers for cache invalidation.

## 7. Feature Folders

Create one folder per major domain under `/apps/web/features`.

### `/apps/web/features/auth/*`

Files:

- `actions.ts`
- `queries.ts`
- `schema.ts`
- `service.ts`
- `types.ts`

### `/apps/web/features/catalog/*`

Files:

- `actions.ts`
- `queries.ts`
- `schema.ts`
- `service.ts`
- `types.ts`

### `/apps/web/features/cart/*`

Files:

- `store.ts`
- `actions.ts`
- `schema.ts`
- `types.ts`

### `/apps/web/features/checkout/*`

Files:

- `actions.ts`
- `schema.ts`
- `service.ts`
- `pricing.ts`
- `types.ts`

### `/apps/web/features/orders/*`

Files:

- `actions.ts`
- `queries.ts`
- `service.ts`
- `types.ts`

### `/apps/web/features/content/*`

Files:

- `actions.ts`
- `queries.ts`
- `schema.ts`
- `service.ts`
- `types.ts`

### `/apps/web/features/admin/*`

Files:

- `actions.ts`
- `queries.ts`
- `service.ts`
- `types.ts`

### `/apps/web/features/analytics/*`

Files:

- `server.ts`
- `client.ts`
- `events.ts`

## 8. UI Package

Use `packages/ui` for reusable components that are not page-specific.

### `/packages/ui/package.json`

Expose the UI package.

### `/packages/ui/src/index.ts`

Export all reusable components.

### `/packages/ui/src/lib/utils.ts`

Shared UI helpers.

### `/packages/ui/src/styles/tokens.css`

Store design tokens if you split them from app globals.

### `/packages/ui/src/components/base/*`

Create foundational wrappers for:

- `PageHeader.tsx`
- `SectionHeading.tsx`
- `EmptyState.tsx`
- `StatCard.tsx`
- `MetricCard.tsx`
- `DataTable.tsx`
- `FormField.tsx`
- `Price.tsx`

### `/packages/ui/src/components/motion/*`

Create:

- `FadeIn.tsx`
- `Stagger.tsx`
- `Reveal.tsx`
- `HoverLift.tsx`

### `/packages/ui/src/components/commerce/*`

Create:

- `ProductCard.tsx`
- `ProductBadge.tsx`
- `QuantitySelector.tsx`
- `PriceBlock.tsx`
- `CartLineItem.tsx`
- `OrderStatusBadge.tsx`

### `/packages/ui/src/components/admin/*`

Create:

- `AdminSidebar.tsx`
- `AdminHeader.tsx`
- `AdminShell.tsx`
- `FilterBar.tsx`
- `BulkActionBar.tsx`

## 9. shadcn/ui Components

Inside `apps/web/components/ui`, add the shadcn components needed for v1:

- `button.tsx`
- `input.tsx`
- `textarea.tsx`
- `label.tsx`
- `form.tsx`
- `select.tsx`
- `checkbox.tsx`
- `radio-group.tsx`
- `switch.tsx`
- `tabs.tsx`
- `card.tsx`
- `badge.tsx`
- `table.tsx`
- `dialog.tsx`
- `sheet.tsx`
- `drawer.tsx`
- `dropdown-menu.tsx`
- `popover.tsx`
- `tooltip.tsx`
- `separator.tsx`
- `breadcrumb.tsx`
- `pagination.tsx`
- `skeleton.tsx`
- `sonner.tsx`
- `alert-dialog.tsx`
- `command.tsx`

## 10. Storefront Pages

### `/apps/web/app/(marketing)/page.tsx`

Home page with:

- premium hero
- seasonal featured collections
- featured products
- testimonials
- gifting categories
- corporate gifting callout
- blog highlights

### `/apps/web/app/(marketing)/about/page.tsx`

Brand story and trust-building content.

### `/apps/web/app/(marketing)/contact/page.tsx`

Contact page with inquiry form and store contact details.

### `/apps/web/app/(marketing)/faq/page.tsx`

Customer support FAQ.

### `/apps/web/app/(marketing)/corporate-gifting/page.tsx`

Dedicated B2B landing page and inquiry form.

### `/apps/web/app/(shop)/shop/page.tsx`

Catalog listing with filters, sort, pagination, and search.

### `/apps/web/app/(shop)/shop/[slug]/page.tsx`

Product detail page with gallery, variant selection, add to cart, and related products.

### `/apps/web/app/(shop)/collections/[slug]/page.tsx`

Collection landing page.

### `/apps/web/app/(shop)/occasions/[slug]/page.tsx`

Occasion-specific merchandising page.

### `/apps/web/app/(shop)/blog/page.tsx`

Blog listing page.

### `/apps/web/app/(shop)/blog/[slug]/page.tsx`

Blog article page.

### `/apps/web/app/(shop)/cart/page.tsx`

Full cart page.

### `/apps/web/app/(shop)/checkout/page.tsx`

Checkout page with shipping, payment, and order summary.

### `/apps/web/app/(shop)/order-success/page.tsx`

Payment success and order confirmation page.

### `/apps/web/app/(shop)/track-order/page.tsx`

Guest tracking page.

## 11. Customer Account Pages

### `/apps/web/app/(account)/login/page.tsx`

Login page.

### `/apps/web/app/(account)/register/page.tsx`

Registration page.

### `/apps/web/app/(account)/forgot-password/page.tsx`

Password reset request page.

### `/apps/web/app/(account)/account/page.tsx`

Account overview dashboard.

### `/apps/web/app/(account)/account/orders/page.tsx`

Order list.

### `/apps/web/app/(account)/account/orders/[id]/page.tsx`

Order detail and tracking timeline.

### `/apps/web/app/(account)/account/addresses/page.tsx`

Address book management.

### `/apps/web/app/(account)/account/profile/page.tsx`

Customer profile settings.

### `/apps/web/app/(account)/account/wishlist/page.tsx`

Wishlist page.

## 12. Admin Pages

### `/apps/web/app/admin/layout.tsx`

Admin shell wrapper.

### `/apps/web/app/admin/page.tsx`

Dashboard overview.

### `/apps/web/app/admin/products/page.tsx`

Product list with filtering and bulk actions.

### `/apps/web/app/admin/products/new/page.tsx`

Create product page.

### `/apps/web/app/admin/products/[id]/page.tsx`

Edit product page.

### `/apps/web/app/admin/categories/page.tsx`

Category management.

### `/apps/web/app/admin/collections/page.tsx`

Collection management.

### `/apps/web/app/admin/orders/page.tsx`

Order list and status filtering.

### `/apps/web/app/admin/orders/[id]/page.tsx`

Order detail page.

### `/apps/web/app/admin/customers/page.tsx`

Customer list.

### `/apps/web/app/admin/content/pages/page.tsx`

Static pages and home sections management.

### `/apps/web/app/admin/content/blog/page.tsx`

Blog management.

### `/apps/web/app/admin/content/banners/page.tsx`

Banner management.

### `/apps/web/app/admin/content/testimonials/page.tsx`

Testimonial management.

### `/apps/web/app/admin/promotions/page.tsx`

Coupons and promotions.

### `/apps/web/app/admin/media/page.tsx`

Media library and uploads.

### `/apps/web/app/admin/analytics/page.tsx`

Revenue, orders, top products, conversion, and campaign reporting.

### `/apps/web/app/admin/settings/page.tsx`

Store settings.

### `/apps/web/app/admin/users/page.tsx`

Admin users and roles.

### `/apps/web/app/admin/audit-log/page.tsx`

Audit trail viewer.

## 13. Reusable Page Components

Create these under `/apps/web/components`.

### `layout/`

- `site-header.tsx`
- `site-footer.tsx`
- `announcement-bar.tsx`
- `mobile-nav.tsx`
- `breadcrumbs.tsx`

### `marketing/`

- `hero.tsx`
- `featured-collections.tsx`
- `gifting-categories.tsx`
- `brand-story.tsx`
- `testimonials-section.tsx`
- `blog-highlights.tsx`
- `corporate-cta.tsx`

### `catalog/`

- `filters-sidebar.tsx`
- `sort-select.tsx`
- `product-grid.tsx`
- `product-gallery.tsx`
- `related-products.tsx`
- `search-empty-state.tsx`

### `cart/`

- `cart-drawer.tsx`
- `cart-summary.tsx`
- `cart-item-list.tsx`

### `checkout/`

- `checkout-form.tsx`
- `shipping-form.tsx`
- `payment-methods.tsx`
- `order-summary.tsx`

### `account/`

- `account-nav.tsx`
- `order-timeline.tsx`
- `address-form.tsx`

### `admin/`

- `dashboard-stats.tsx`
- `sales-chart.tsx`
- `orders-table.tsx`
- `products-table.tsx`
- `customer-table.tsx`
- `content-editor.tsx`
- `media-uploader.tsx`

## 14. API and Server Endpoints

Prefer server actions for internal mutations, but use route handlers where external callbacks or API-style access is needed.

### `/apps/web/app/api/auth/[...nextauth]/route.ts`

Auth.js handler.

### `/apps/web/app/api/webhooks/razorpay/route.ts`

Verify and process Razorpay webhooks.

### `/apps/web/app/api/upload/route.ts`

Signed upload or controlled server upload endpoint.

### `/apps/web/app/api/track-order/route.ts`

Guest tracking lookup endpoint.

### `/apps/web/app/api/search/route.ts`

Search API if needed for autosuggest.

## 15. Email Package

### `/packages/email/src/index.ts`

Export email senders.

### `/packages/email/src/templates/order-confirmation.tsx`

Order confirmation email.

### `/packages/email/src/templates/order-shipped.tsx`

Shipment email.

### `/packages/email/src/templates/password-reset.tsx`

Password reset email.

### `/packages/email/src/templates/corporate-inquiry.tsx`

Internal notification email.

## 16. Payments Package

### `/packages/payments/src/index.ts`

Export provider-facing functions.

### `/packages/payments/src/razorpay.ts`

Order creation, signature verification, and payment mapping.

### `/packages/payments/src/types.ts`

Shared payment types.

## 17. Analytics Package

### `/packages/analytics/src/index.ts`

Export analytics wrappers.

### `/packages/analytics/src/events.ts`

Define canonical event names.

### `/packages/analytics/src/client.ts`

Client-side tracking helpers.

### `/packages/analytics/src/server.ts`

Server-side tracking helpers.

## 18. Tests

### `/apps/web/tests/e2e/storefront.spec.ts`

Browse catalog to product detail.

### `/apps/web/tests/e2e/cart-checkout.spec.ts`

Add to cart and complete checkout.

### `/apps/web/tests/e2e/account.spec.ts`

Customer login and order history.

### `/apps/web/tests/e2e/admin-products.spec.ts`

Admin product CRUD.

### `/apps/web/tests/e2e/admin-orders.spec.ts`

Admin order workflow.

### `/apps/web/tests/unit/pricing.test.ts`

Price, tax, shipping, and coupon rules.

### `/apps/web/tests/unit/auth.test.ts`

Auth and permission helpers.

## 19. Docs To Add Later

Create these after the first working foundation:

- `/docs/data-migration.md`
- `/docs/design-system.md`
- `/docs/content-model.md`
- `/docs/launch-checklist.md`
- `/docs/qa-checklist.md`

## 20. Execution Order

Build in this exact order:

1. root workspace files
2. Prisma schema and seed
3. web app config and app shell
4. shadcn/ui primitives
5. shared UI package
6. auth and permissions
7. catalog queries and home page
8. shop listing and product detail
9. cart store and cart drawer
10. checkout pricing and payment integration
11. account pages
12. admin shell and dashboard
13. product admin
14. order admin
15. content admin
16. analytics, SEO, and email flows
17. tests
18. migration of legacy data
19. staging hardening
20. production launch

## 21. Definition Of Done

A phase is complete only when:

- the UI works on mobile and desktop
- loading, empty, and error states exist
- Zod validation exists at input boundaries
- role checks exist for protected actions
- analytics events are instrumented where needed
- tests exist for the critical path
- the page is integrated into real navigation

## 22. Recommended First Sprint

If starting immediately, implement only these files first:

- root workspace files
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `apps/web/app/layout.tsx`
- `apps/web/app/globals.css`
- `apps/web/lib/env.ts`
- `apps/web/lib/db.ts`
- `apps/web/lib/auth.ts`
- `apps/web/components/ui/*` base shadcn components
- `packages/ui/src/components/base/*`
- `apps/web/components/layout/site-header.tsx`
- `apps/web/components/layout/site-footer.tsx`
- `apps/web/app/(marketing)/page.tsx`
- `apps/web/app/(shop)/shop/page.tsx`
- `apps/web/app/(shop)/shop/[slug]/page.tsx`

That first sprint gives a real visual foundation, the first database model, and the start of the storefront without wasting time on low-value scaffolding.
