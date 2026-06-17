import { ROUTES } from './routes'

export const CONTACT_SUBJECTS = [
  'General',
  'Prayer Request',
  'Pastoral Care',
  'Partnership',
  'Other',
] as const

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number]

export const CONTACT_INFO = {
  locationLine: 'Kitengela, Kenya — Along Baraka Road / Treewa Road, Next to Balozi Junior Academy',
  phoneNumbers: [
    { label: 'Main', number: '+254 722 566 399' },
    { number: '+254 720 276 162' },
    { number: '+254 720 977 189' },
    { number: '+254 775 036 515' },
    { number: '+254 703 182 203' },
  ],
  whatsapp: '+254 722 566 399',
  officeHours: 'Mon–Fri, 9AM–5PM',
  email: 'voshchurchkitengela70@gmail.com',
  financeEmail: 'voshchurchkitengela70@gmail.com',
}

export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=VOSH+Church+International+Kitengela+Baraka+Road+Balozi+Junior+Academy&output=embed'

export const FINANCE_CONTACT_HREF = `${ROUTES.joinUs}?subject=Partnership#contact-form`

export function phoneHref(number: string) {
  return `tel:${number.replace(/\s/g, '')}`
}

export function whatsappHref(number: string) {
  return `https://wa.me/${number.replace(/\D/g, '')}`
}
