import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  AUTH_TRUST_HOST: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  S3_ENDPOINT: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_ANALYTICS_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>
