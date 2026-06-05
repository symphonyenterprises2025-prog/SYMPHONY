import { prisma } from './db'
import { checkBrevoHealth } from './email/brevo'

/**
 * Startup health check for the auth subsystem. Called lazily from the
 * first auth request to a server instance. The results are cached for
 * `CACHE_TTL_MS` so the check is paid for at most once per instance
 * per cache window.
 *
 * The check does NOT throw. It returns a structured result the caller
 * can use to decide between returning a 503 ("service temporarily
 * unavailable") or proceeding with degraded behavior.
 */

const CACHE_TTL_MS = 60_000

export interface AuthHealth {
  ok: boolean
  checks: {
    database: { ok: boolean; latencyMs: number; error?: string }
    rateLimitTable: { ok: boolean; error?: string }
    otpTable: { ok: boolean; error?: string }
    userTable: { ok: boolean; error?: string }
    brevo: {
      ok: boolean
      apiKeyConfigured: boolean
      apiKeyValid?: boolean
      senderConfigured?: string
      senderVerified?: boolean
      error?: string
    }
    nextAuthSecret: { ok: boolean; configured: boolean }
  }
}

let cached: { at: number; result: AuthHealth } | null = null

export async function checkAuthHealth(): Promise<AuthHealth> {
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.result
  }

  const result: AuthHealth = {
    ok: true,
    checks: {
      database: { ok: true, latencyMs: 0 },
      rateLimitTable: { ok: true },
      otpTable: { ok: true },
      userTable: { ok: true },
      brevo: { ok: true, apiKeyConfigured: !!process.env.BREVO_API_KEY },
      nextAuthSecret: { ok: true, configured: !!process.env.NEXTAUTH_SECRET },
    },
  }

  // 1. Database round-trip
  const t0 = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    result.checks.database.latencyMs = Date.now() - t0
  } catch (err) {
    result.checks.database.ok = false
    result.checks.database.error = err instanceof Error ? err.message : 'unknown'
    result.ok = false
  }

  // 2. Required tables for auth flows
  if (result.checks.database.ok) {
    for (const [name, model] of [
      ['rate_limit_entries', () => prisma.rateLimitEntry.count()],
      ['otp_codes', () => prisma.otpCode.count()],
      ['users', () => prisma.user.count()],
    ] as const) {
      try {
        await model()
        if (name === 'rate_limit_entries') result.checks.rateLimitTable.ok = true
        if (name === 'otp_codes') result.checks.otpTable.ok = true
        if (name === 'users') result.checks.userTable.ok = true
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown'
        if (name === 'rate_limit_entries') {
          result.checks.rateLimitTable.ok = false
          result.checks.rateLimitTable.error = msg
        } else if (name === 'otp_codes') {
          result.checks.otpTable.ok = false
          result.checks.otpTable.error = msg
        } else if (name === 'users') {
          result.checks.userTable.ok = false
          result.checks.userTable.error = msg
        }
        result.ok = false
      }
    }
  } else {
    result.checks.rateLimitTable.ok = false
    result.checks.otpTable.ok = false
    result.checks.userTable.ok = false
  }

  // 3. Brevo (active call; cached 5 min inside checkBrevoHealth)
  const brevo = await checkBrevoHealth()
  result.checks.brevo = brevo
  if (!brevo.ok || !brevo.senderVerified) {
    // Not fatal: signup can technically still run if the API key is
    // valid, but the send will 401/403 and the user will see a 503.
    // Mark overall not-ok so the cold-start log makes it obvious.
    result.ok = false
  }

  // 4. NEXTAUTH_SECRET (fatal: without this, NextAuth refuses to issue JWTs)
  if (!process.env.NEXTAUTH_SECRET) {
    result.checks.nextAuthSecret.ok = false
    result.ok = false
  }

  cached = { at: Date.now(), result }
  return result
}

/**
 * One-shot boot-time self-test. Best-effort: logs results, never throws.
 * Call from a place that runs once per process (e.g. in a 'use server'
 * file's top-level, or from the first inbound request via checkAuthHealth).
 */
export async function bootAuthHealthCheck(): Promise<void> {
  if (process.env.NODE_ENV === 'production' && process.env.AUTH_HEALTHCHECK_LOGGED === '1') {
    return
  }
  const h = await checkAuthHealth()
  if (!h.ok) {
    console.error('[auth-health] FAIL:', JSON.stringify(h.checks, null, 2))
  } else {
    const b = h.checks.brevo
    console.log(
      `[auth-health] OK (db ${h.checks.database.latencyMs}ms, brevo key=${b.apiKeyValid ? 'valid' : b.apiKeyConfigured ? 'INVALID' : 'unset'}, sender=${b.senderConfigured || 'unset'}${b.senderVerified === false ? ' (NOT VERIFIED)' : ''}, nextauth-secret=${h.checks.nextAuthSecret.configured ? 'set' : 'unset'})`
    )
  }
  if (process.env.NODE_ENV === 'production') {
    process.env.AUTH_HEALTHCHECK_LOGGED = '1'
  }
}
