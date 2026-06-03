# WhatsApp Integration Guide (via OpenWA)

## Overview

This document explains how to set up and run WhatsApp notifications for Symphony Ecommerce using [OpenWA](https://github.com/rmyndharis/OpenWA), a free self-hosted WhatsApp API Gateway.

## Architecture

```
SymphonyEcommerce (Next.js, Port 3000)
    └─ packages/notifications (new)
         ├─ WhatsApp client → HTTP → OpenWA (Port 2785)
         └─ Email wrapper    → HTTPS → Brevo API
```

## Prerequisites

- Node.js 22 LTS
- A WhatsApp account (your business number: +91 7978974823)
- The OpenWA repo cloned

## Step 1: Install OpenWA (Non-Docker Approach)

Since your project does not use Docker, run OpenWA as a separate Node.js process.

### Option A: Clone as sibling folder (recommended)

```bash
cd C:\Users\tatta\OneDrive\Desktop
git clone https://github.com/rmyndharis/OpenWA.git
cd OpenWA
npm install
```

### Option B: Clone inside a dedicated services folder

```bash
cd C:\Users\tatta\OneDrive\Desktop\SymphonyEcommerce
mkdir -p services
cd services
git clone https://github.com/rmyndharis/OpenWA.git
cd OpenWA
npm install
```

## Step 2: Configure OpenWA

Create `C:\Users\tatta\OneDrive\Desktop\OpenWA\.env`:

```env
# Server
PORT=2785
HOST=0.0.0.0

# API Key (generate a random key)
API_KEY=symphony-wa-key-change-in-production

# Database (SQLite for simplicity)
DB_TYPE=sqlite
DB_PATH=./data/openwa.db

# Storage (local)
STORAGE_TYPE=local
STORAGE_PATH=./storage

# Rate limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Webhook for incoming messages
WEBHOOK_URL=http://localhost:3000/api/webhooks/whatsapp
WEBHOOK_SECRET=symphony-wa-webhook-secret
```

## Step 3: Start OpenWA

```bash
cd C:\Users\tatta\OneDrive\Desktop\OpenWA
npm run dev
```

This starts:
- API on `http://localhost:2785`
- Dashboard on `http://localhost:2886`
- Swagger docs on `http://localhost:2785/api/docs`

## Step 4: Link WhatsApp Number

1. Open the Dashboard at **http://localhost:2886**
2. Generate an API key (copy it)
3. Create a new session named "symphony"
4. Click "Start Session" to generate a QR code
5. Scan the QR code with WhatsApp on your phone:
   - Open WhatsApp → Menu → Linked Devices → Link a Device
6. Once scanned, the session status should show as "Connected"

## Step 5: Configure Symphony Ecommerce

Add these environment variables to your `apps/web/.env.local`:

```env
# OpenWA Configuration
OPENWA_API_URL=http://localhost:2785/api
OPENWA_API_KEY=symphony-wa-key-change-in-production
OPENWA_SESSION_ID=symphony
OPENWA_ADMIN_PHONE=917978974823
OPENWA_ENABLED=true

# Notification channel preferences (optional, defaults to 'both')
NOTIFY_ORDER_CONFIRMED=both
NOTIFY_ORDER_SHIPPED=both
NOTIFY_ORDER_DELIVERED=both
NOTIFY_ORDER_CANCELLED=both
NOTIFY_ORDER_PAYMENT_FAILED=both
NOTIFY_AUTH_OTP=email          # OTPs via email only (more secure)
NOTIFY_AUTH_WELCOME=both
NOTIFY_CONTACT_INQUIRY=both
NOTIFY_ADMIN_NEW_ORDER=whatsapp  # Admin alerts only via WhatsApp
NOTIFY_ADMIN_LARGE_ORDER=whatsapp
```

## Step 6: Verify the Integration

### Test API connectivity

```bash
curl http://localhost:2785/api/sessions \
  -H "X-API-Key: symphony-wa-key-change-in-production"
```

### Test sending a message

```bash
curl -X POST http://localhost:2785/api/sessions/symphony/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: symphony-wa-key-change-in-production" \
  -d '{
    "chatId": "917978974823@c.us",
    "text": "🔔 *Test Message*\n\nWhatsApp integration is working!"
  }'
```

### Test webhook

OpenWA will POST to `http://localhost:3000/api/webhooks/whatsapp` when:
- A message is received
- Session status changes

## Step 7: PM2 for Production (Windows)

Install PM2 and create a startup script:

```bash
npm install -g pm2
```

Create `ecosystem.config.js` in the SymphonyEcommerce root:

```javascript
module.exports = {
  apps: [
    {
      name: 'symphony-web',
      cwd: './apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'openwa',
      cwd: '../OpenWA',
      script: 'npm',
      args: 'run start:prod',
      env: { NODE_ENV: 'production' },
    },
  ],
}
```

Start both:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup      # Auto-start on boot
```

## File Structure Summary

### New package: `packages/notifications/`

```
packages/notifications/
├── package.json
├── src/
│   ├── index.ts                  # Public API exports
│   ├── types.ts                  # TypeScript types for all notifications
│   ├── config.ts                 # Configuration from environment
│   ├── notification.ts           # Unified notification dispatcher
│   └── whatsapp/
│       ├── index.ts
│       ├── client.ts             # OpenWA REST API client
│       └── templates.ts          # WhatsApp message templates
```

### New app files:

```
apps/web/
├── lib/
│   └── notifications.ts              # Bootstrap: wires email + templates
├── app/api/webhooks/whatsapp/
│   └── route.ts                      # Inbound WhatsApp webhook handler
└── components/providers/
    └── notifications-provider.tsx     # Initializes on app mount
```

### Modified files:

- `apps/web/app/api/orders/route.ts` — Added import of `@symphony/notifications`
- `pnpm-workspace.yaml` — Added `packages/notifications`

## Troubleshooting

| Symptom | Solution |
|---------|----------|
| `ECONNREFUSED` when sending WhatsApp | OpenWA is not running. Start it with `npm run dev` in the OpenWA directory |
| QR code expired | Go to OpenWA dashboard → Restart session → Scan new QR |
| "Session not found" | Create a session named "symphony" in the dashboard |
| Webhook not receiving | Check OpenWA webhook config points to `http://localhost:3000/api/webhooks/whatsapp` |
| Messages not sending | Verify the phone number format: `917978974823@c.us` (country code + number, no +) |

## WhatsApp Message Templates

| Event | Customer Message | Admin Message |
|-------|-----------------|---------------|
| Order Confirmed | ✅ Order confirmed with summary | 📦 New order alert with link |
| Order Shipped | 🚚 Shipping notification with tracking | — |
| Order Delivered | 🎉 Delivery confirmation | — |
| Order Cancelled | ❌ Cancellation notice | — |
| Payment Failed | ⚠️ Payment failed, retry link | — |
| OTP | 🔐 Verification code | — |
| Welcome | 👋 Welcome message | — |
| Inquiry Received | 📋 We'll get back to you | 🏢 New inquiry alert |