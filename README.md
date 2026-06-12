# Symphony Enterprise - Ecommerce Platform

Premium gifting commerce platform built with Next.js 15 App Router, TypeScript, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 18, Tailwind CSS v4 |
| **Backend** | Next.js API Routes & Server Actions |
| **Database** | PostgreSQL via Prisma ORM |
| **Auth** | NextAuth.js (Credentials) |
| **Payments** | Razorpay |
| **Storage** | AWS S3 |
| **Email** | Brevo (Sendinblue) |
| **Hosting** | AWS EC2 + Nginx |

## Architecture

```
SYMPHONY/
  apps/
    web/         # Main Next.js application
  packages/
    ui/          # Shared UI components (shadcn/ui)
    config/      # Shared config (TS, ESLint, Prettier)
    email/       # Email templates
    payments/    # Payment provider integrations
    analytics/   # Analytics wrappers
    notifications/ # Notification service
  prisma/        # Database schema & migrations
```

## Local Development

```bash
# Prerequisites: Node.js 22+, pnpm 9+
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Deployment

Hosted on **AWS EC2** (t2.small, Amazon Linux 2023) behind **Nginx** with **Let's Encrypt SSL**.

### Infrastructure

| Resource | Details |
|---|---|
| **EC2** | t2.small, 2 vCPU, 2 GB RAM, 10 GB gp3 |
| **S3** | `symphonyenterprise-media` (ap-south-1) |
| **Database** | PostgreSQL 15 on EC2 |
| **SSL** | Let's Encrypt (auto-renew via systemd timer) |
| **Process Manager** | PM2 (auto-start on boot) |

### CI/CD

Push to `main` → GitHub Actions auto-deploys via SSH:

1. `git pull`
2. `pnpm install`
3. Prisma generate & migrate
4. `pnpm build`
5. `pm2 restart`

### Environment Variables

Key variables configured in `apps/web/.env`:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Session encryption key
- `NEXTAUTH_URL` — https://symphonyenterprise.co.in
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Admin credentials
- `S3_*` — S3 bucket credentials
- `BREVO_API_KEY` — Transactional email service
- `RAZORPAY_*` — Payment gateway keys

## Admin Access

| URL | Role |
|---|---|
| `https://symphonyenterprise.co.in/admin` | Admin dashboard |
| `https://symphonyenterprise.co.in/shop` | Storefront |
| `https://symphonyenterprise.co.in/login` | Customer login |
