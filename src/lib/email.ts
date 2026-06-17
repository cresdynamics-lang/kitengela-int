import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.warn('[email] RESEND_API_KEY is not set – email sending is disabled.')
}

const resend = resendApiKey ? new Resend(resendApiKey) : null

const DEFAULT_TO = 'voshchurchkitengela70@gmail.com'
const DEFAULT_FROM = 'VOSH Kitengela <onboarding@resend.dev>'

export async function sendContactEmail(options: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  if (!resend) {
    console.warn('[email] Resend client not initialised – skipping sendContactEmail')
    return
  }

  const { name, email, phone, subject, message } = options

  await resend.emails.send({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    subject: `Contact — ${subject} — ${name || 'Website Visitor'}`,
    replyTo: email || undefined,
    html: `
      <h2>New contact message from the VOSH Kitengela website</h2>
      <p><strong>Name:</strong> ${name || 'N/A'}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject || 'General'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `,
  })
}

export async function sendPlanVisitEmail(options: {
  fullName: string
  phone: string
  email?: string
  service: string
  howDidYouHear?: string
  prayerRequest?: string
}) {
  if (!resend) {
    console.warn('[email] Resend client not initialised – skipping sendPlanVisitEmail')
    return
  }

  const { fullName, phone, email, service, howDidYouHear, prayerRequest } = options

  await resend.emails.send({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    subject: `Plan Your Visit — ${fullName}`,
    replyTo: email || undefined,
    html: `
      <h2>New Plan Your Visit request</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>How they heard about us:</strong> ${howDidYouHear || 'N/A'}</p>
      <p><strong>Prayer request:</strong></p>
      <p>${(prayerRequest || 'None').replace(/\n/g, '<br />')}</p>
    `,
  })
}

