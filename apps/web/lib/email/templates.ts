const styles = `
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1f3763 0%, #2a4a7c 100%); padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
    .header p { color: #d0b57a; margin: 10px 0 0; font-size: 14px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1f3763; margin: 0 0 20px; font-size: 20px; }
    .content p { color: #444444; line-height: 1.6; margin: 0 0 15px; }
    .otp-box { background: linear-gradient(135deg, #f8f2e5 0%, #eadfca 100%); border: 2px solid #d0b57a; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0; }
    .otp-code { font-size: 36px; font-weight: 700; color: #1f3763; letter-spacing: 8px; margin: 0; }
    .otp-label { font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px; }
    .button { display: inline-block; background: linear-gradient(135deg, #1f3763 0%, #2a4a7c 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 30px; font-weight: 600; margin: 20px 0; }
    .footer { background-color: #f8f2e5; padding: 20px 30px; text-align: center; border-top: 1px solid #e6dbc4; }
    .footer p { color: #666666; font-size: 12px; margin: 0; }
    .details { background-color: #f8f2e5; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .details table { width: 100%; }
    .details td { padding: 8px 0; color: #444444; }
    .details td:first-child { color: #666666; width: 40%; }
    .highlight { color: #1f3763; font-weight: 600; }
    .gold { color: #d0b57a; }
  </style>
`

export function getOTPEmailTemplate(otp: string, name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Symphony Enterprise</title>
  ${styles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Symphony Enterprise</h1>
      <p>Premium Gifting & Personalization</p>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Thank you for signing up! To complete your registration, please use the verification code below:</p>
      
      <div class="otp-box">
        <p class="otp-label">Your Verification Code</p>
        <p class="otp-code">${otp}</p>
      </div>
      
      <p>This code will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Symphony Enterprise. All rights reserved.</p>
      <p>Siripur Market, Unit-8, Bhubaneswar, Odisha 751003</p>
    </div>
  </div>
</body>
</html>
  `
}

export function getWelcomeEmailTemplate(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Symphony Enterprise</title>
  ${styles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Symphony Enterprise</h1>
      <p>Premium Gifting & Personalization</p>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Your account has been successfully created! We're excited to have you on board.</p>
      <p>At Symphony Enterprise, we specialize in premium gifting solutions including:</p>
      <ul style="color: #444444; line-height: 1.8;">
        <li>Corporate gift hampers & welcome kits</li>
        <li>Personalized laser engraving services</li>
        <li>Custom trophies & recognition awards</li>
        <li>Festive & occasion-based gifting</li>
        <li>Bulk customization for events</li>
      </ul>
      <p style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/shop" class="button">Start Shopping</a>
      </p>
      <p>If you need any assistance, feel free to reach out to us at <a href="mailto:symphonyenterprise2025@gmail.com" style="color: #1f3763;">symphonyenterprise2025@gmail.com</a> or WhatsApp us at <strong>+91 7978974823</strong>.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Symphony Enterprise. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}

export function getContactConfirmationTemplate(name: string, subject: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We've Received Your Inquiry</title>
  ${styles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Symphony Enterprise</h1>
      <p>Thank You for Reaching Out</p>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Thank you for contacting us. We've received your inquiry regarding <strong class="highlight">${subject}</strong>.</p>
      <p>Our team will review your message and get back to you within <strong>24 hours</strong>.</p>
      <p>In the meantime, you can:</p>
      <ul style="color: #444444; line-height: 1.8;">
        <li>Browse our <a href="${process.env.NEXTAUTH_URL}/shop" style="color: #1f3763;">product catalog</a></li>
        <li>WhatsApp us for quick queries: <strong>+91 7978974823</strong></li>
        <li>Visit our studio at Siripur Market, Bhubaneswar</li>
      </ul>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Symphony Enterprise. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}

export function getContactAdminTemplate(
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  ${styles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Inquiry</h1>
      <p>Symphony Enterprise Website</p>
    </div>
    <div class="content">
      <h2>Inquiry Details</h2>
      <div class="details">
        <table>
          <tr><td>Name:</td><td><strong>${name}</strong></td></tr>
          <tr><td>Email:</td><td>${email}</td></tr>
          <tr><td>Phone:</td><td>${phone || 'Not provided'}</td></tr>
          <tr><td>Subject:</td><td><strong class="highlight">${subject}</strong></td></tr>
        </table>
      </div>
      <h3>Message:</h3>
      <div style="background-color: #f8f2e5; border-left: 4px solid #d0b57a; padding: 15px; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #444444; white-space: pre-line;">${message}</p>
      </div>
    </div>
    <div class="footer">
      <p>Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>
  </div>
</body>
</html>
  `
}

export function getOrderConfirmationTemplate(
  orderNumber: string,
  name: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  shippingAddress: string
): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e6dbc4;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e6dbc4; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e6dbc4; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${orderNumber}</title>
  ${styles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
      <p>Order #${orderNumber}</p>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Thank you for your order! We're preparing your items for shipment.</p>
      
      <div class="details">
        <h3 style="margin-top: 0; color: #1f3763;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #e6dbc4;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f8f2e5; font-weight: 600;">
              <td colspan="2" style="padding: 12px; text-align: right;">Total:</td>
              <td style="padding: 12px; text-align: right; color: #1f3763;">₹${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div class="details">
        <h3 style="margin-top: 0; color: #1f3763;">Shipping Address</h3>
        <p style="margin: 0; color: #444444; white-space: pre-line;">${shippingAddress}</p>
      </div>
      
      <p>We'll send you another email once your order ships. If you have any questions, reply to this email or WhatsApp us at <strong>+91 7978974823</strong>.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Symphony Enterprise. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}

export function getOrderStatusUpdateTemplate(
  orderNumber: string,
  name: string,
  status: string,
  message?: string
): string {
  const statusColors: Record<string, string> = {
    'PENDING': '#f59e0b',
    'PROCESSING': '#3b82f6',
    'SHIPPED': '#8b5cf6',
    'DELIVERED': '#10b981',
    'CANCELLED': '#ef4444',
  }

  const statusColor = statusColors[status] || '#1f3763'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - ${orderNumber}</title>
  ${styles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Update</h1>
      <p>Order #${orderNumber}</p>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      
      <div class="otp-box" style="background: linear-gradient(135deg, ${statusColor}15 0%, ${statusColor}25 100%); border-color: ${statusColor};">
        <p class="otp-label">Order Status</p>
        <p style="font-size: 28px; font-weight: 700; color: ${statusColor}; margin: 10px 0 0;">${status}</p>
      </div>
      
      ${message ? `<p>${message}</p>` : ''}
      
      <p>You can track your order status by visiting your <a href="${process.env.NEXTAUTH_URL}/account/orders" style="color: #1f3763;">account page</a>.</p>
      <p>Need help? Contact us at <a href="mailto:symphonyenterprise2025@gmail.com" style="color: #1f3763;">symphonyenterprise2025@gmail.com</a> or WhatsApp <strong>+91 7978974823</strong>.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Symphony Enterprise. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}
