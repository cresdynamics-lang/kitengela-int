import { ROUTES } from './routes'
import { SOCIAL_LINKS } from './brand'

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
    { label: 'Main', number: '+254 727 057 995' },
    { number: '+254 704 601 178' },
    { number: '+254 733 566 398' },
  ],
  whatsapp: '+254 727 057 995',
  whatsappGroup: SOCIAL_LINKS.whatsappGroup,
  officeHours: 'Counseling: 10:00 AM – 3:00 PM',
  email: 'evanskochoo2019@gmail.com',
  financeEmail: 'evanskochoo2019@gmail.com',
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
