import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  // /checkout is gated because POST /api/orders requires a session. Without
  // this a logged-out shopper could fill in the whole shipping form and only
  // then be told to sign in, losing everything they typed. withAuth sends
  // them to /login?callbackUrl=/checkout instead, and the login page already
  // honours callbackUrl.
  //
  // /cart is deliberately NOT gated: it renders a "sign in to see your cart"
  // state, which is friendlier than bouncing someone who just wants to look.
  matcher: ['/admin/:path*', '/account/:path*', '/checkout'],
}
