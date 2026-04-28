import { Html } from '@react-email/components'

interface PasswordResetProps {
  customerName: string
  resetLink: string
}

export function PasswordReset({ customerName, resetLink }: PasswordResetProps) {
  return (
    <Html>
      <body>
        <h1>Password Reset</h1>
        <p>Dear {customerName},</p>
        <p>Click the link below to reset your password:</p>
        <a href={resetLink}>Reset Password</a>
      </body>
    </Html>
  )
}
