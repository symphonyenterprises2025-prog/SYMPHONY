import { prisma } from './db'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

const CLEANUP_PROBABILITY = 0.01 // 1% chance per call to GC expired rows

/**
 * Postgres-backed sliding-window rate limiter.
 *
 * Replaces the previous in-memory Map so the limit survives cold starts,
 * scales across instances, and doesn't leak a setInterval per serverless
 * function. Expired rows are reaped opportunistically on a small fraction
 * of calls.
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
      .catch((err) => console.error('rate-limit cleanup failed:', err))
  }

  const result = await prisma.$transaction(async (tx) => {
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

  return result
}
