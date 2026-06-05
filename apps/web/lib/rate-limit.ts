import { prisma } from './db'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  bypassed?: boolean
}

const CLEANUP_PROBABILITY = 0.01 // 1% chance per call to GC expired rows

let tableMissingWarned = false

/**
 * Postgres-backed sliding-window rate limiter.
 *
 * Replaces the previous in-memory Map so the limit survives cold starts,
 * scales across instances, and doesn't leak a setInterval per serverless
 * function. Expired rows are reaped opportunistically on a small fraction
 * of calls.
 *
 * FAIL-OPEN POLICY: if the rate_limit_entries table is missing (e.g. the
 * migration was never applied), this function logs a single warning and
 * returns `{ allowed: true, bypassed: true }` rather than crashing the
 * whole request. This prevents a deployment with a missing migration
 * from taking down the entire signup flow. The warn-once flag prevents
 * log spam.
 *
 * Other Prisma errors (connection lost, transient timeouts) are surfaced
 * by rethrowing -- the caller decides how to respond.
 */
export async function rateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 1000
): Promise<RateLimitResult> {
  const now = Date.now()
  const newResetAt = new Date(now + windowMs)

  if (Math.random() < CLEANUP_PROBABILITY) {
    // Fire and forget; never block the caller on cleanup.
    prisma.rateLimitEntry
      .deleteMany({ where: { resetAt: { lt: new Date() } } })
      .catch((err) => {
        if (err instanceof Error && /does not exist/i.test(err.message)) {
          if (!tableMissingWarned) {
            console.error(
              '[rate-limit] rate_limit_entries table missing. Run `prisma migrate deploy` and rate limiting will resume. Currently FAIL-OPEN.'
            )
            tableMissingWarned = true
          }
          return
        }
        console.error('[rate-limit] cleanup failed:', err)
      })
  }

  let result
  try {
    result = await prisma.$transaction(async (tx) => {
      const existing = await tx.rateLimitEntry.findUnique({ where: { key } })

      if (!existing || existing.resetAt.getTime() <= now) {
        const upserted = await tx.rateLimitEntry.upsert({
          where: { key },
          update: { count: 1, resetAt: newResetAt },
          create: { key, count: 1, resetAt: newResetAt },
        })
        return {
          allowed: true,
          remaining: Math.max(0, maxAttempts - upserted.count),
          resetAt: upserted.resetAt.getTime(),
        }
      }

      if (existing.count >= maxAttempts) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: existing.resetAt.getTime(),
        }
      }

      const updated = await tx.rateLimitEntry.update({
        where: { key },
        data: { count: { increment: 1 } },
      })
      return {
        allowed: true,
        remaining: Math.max(0, maxAttempts - updated.count),
        resetAt: updated.resetAt.getTime(),
      }
    })
  } catch (err) {
    if (err instanceof Error && /does not exist/i.test(err.message)) {
      if (!tableMissingWarned) {
        console.error(
          '[rate-limit] rate_limit_entries table missing. Run `prisma migrate deploy` and rate limiting will resume. Currently FAIL-OPEN.'
        )
        tableMissingWarned = true
      }
      return {
        allowed: true,
        remaining: maxAttempts,
        resetAt: newResetAt.getTime(),
        bypassed: true,
      }
    }
    throw err
  }

  return result
}

/**
 * Detect missing-table error patterns across Prisma versions.
 * Prisma 5.x surfaces this as P2021 with meta.modelName, but the
 * human-readable message in `err.message` is the most reliable check
 * because it works across locales.
 */
export function isMissingTableError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  return /does not exist/i.test(err.message) || /relation .* does not exist/i.test(err.message)
}
