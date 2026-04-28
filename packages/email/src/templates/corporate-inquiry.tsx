import { Html } from '@react-email/components'

interface CorporateInquiryProps {
  name: string
  email: string
  company: string
  requirements: string
}

export function CorporateInquiry({ name, email, company, requirements }: CorporateInquiryProps) {
  return (
    <Html>
      <body>
        <h1>New Corporate Inquiry</h1>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Company: {company}</p>
        <p>Requirements: {requirements}</p>
      </body>
    </Html>
  )
}
