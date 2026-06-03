import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendTransactionalEmail } from '@/lib/email/brevo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true, unsubscribedAt: null },
        })
      }
      return NextResponse.json({ message: 'You are already subscribed!' })
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    })

    try {
      await sendTransactionalEmail(
        email,
        email,
        'Welcome to Symphony Enterprise Newsletter!',
        `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Newsletter Subscription</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; }
  .header { background: linear-gradient(135deg, #1f3763 0%, #2a4a7c 100%); padding: 30px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 24px; }
  .header p { color: #d0b57a; margin: 10px 0 0; }
  .content { padding: 30px; text-align: center; }
  .content h2 { color: #1f3763; }
  .content p { color: #444; line-height: 1.6; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>Symphony Enterprise</h1><p>Premium Gifting & Personalization</p></div>
  <div class="content">
    <h2>You're Subscribed!</h2>
    <p>Thank you for subscribing to our newsletter. You'll receive updates on new products, special offers, and gifting inspiration.</p>
    <p>Stay tuned for exciting updates from Symphony Enterprise!</p>
  </div>
</div>
</body>
</html>`
      )
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

    return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
