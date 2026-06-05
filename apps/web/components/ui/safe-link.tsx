import NextLink, { type LinkProps } from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

type SafeLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>

/**
 * Drop-in replacement for next/link with RSC prefetch hard-disabled.
 *
 * Why: on the Render free tier (512 MB), a single Next.js Link in
 * the viewport queues a server render of the destination route.
 * With ~50 links on the homepage (header nav, mobile menu, footer,
 * product cards, breadcrumbs), a hover-heavy user can trigger 15+
 * simultaneous server renders, all fighting for the same memory
 * budget. That's what caused the OOMs on prod.
 *
 * The performance cost of disabling prefetch is negligible for a
 * small storefront: navigations to /shop, /about etc. render in
 * <500 ms and feel instant. We trade a millisecond of perceived
 * speed for a deterministic memory ceiling.
 *
 * Usage: change `import Link from "@/components/ui/safe-link"` to
 *        `import Link from "@/components/ui/safe-link"`.
 * Everything else stays the same.
 */
export default function Link(props: SafeLinkProps) {
  return <NextLink {...props} prefetch={false} />
}
