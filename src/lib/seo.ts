import { CONTACT_INFO } from './contact'
import { ROUTES, SERVICE_SLUGS } from './routes'

export const SITE_URL = 'https://voshchurchintkitengela.co.ke'
export const SITE_NAME = 'VOSH Church International Kitengela'
export const SITE_TAGLINE = 'One Way, One Job'
export const SITE_IMAGE = `${SITE_URL}/vosh-logo-70th.jpeg`

export const SITE_KEYWORDS = [
  'VOSH church',
  'VOSH church Kitengela',
  'church in Kitengela',
  'church Kitengela Kenya',
  'Voice of Salvation and Healing Church',
  'Pentecostal church Kitengela',
  'Sunday worship Kitengela',
  'church near me Kitengela',
  'Christian church Kajiado',
  'Baraka Road church Kitengela',
].join(', ')

export type SeoConfig = {
  title: string
  description: string
  path: string
  keywords?: string
  breadcrumbs?: { name: string; path: string }[]
}

const BRAND_SUFFIX = ` | ${SITE_NAME}`

function pageTitle(primary: string) {
  return `${primary}${BRAND_SUFFIX}`
}

const STATIC_PAGES: Record<string, SeoConfig> = {
  [ROUTES.home]: {
    title: `${SITE_NAME} | Pentecostal Church in Kitengela, Kenya`,
    description:
      'VOSH Church International Kitengela — a Spirit-filled Pentecostal church in Kitengela, Kenya. Join Sunday worship, Bible study, prayer, youth ministry, and community outreach along Baraka Road.',
    path: ROUTES.home,
    keywords: SITE_KEYWORDS,
  },
  [ROUTES.whoWeAre]: {
    title: pageTitle('Who We Are — Our Story & Mission'),
    description:
      'Learn about VOSH Church International Kitengela — our vision, values, and Christ-centered mission to transform lives in Kitengela and beyond.',
    path: ROUTES.whoWeAre,
    keywords: `VOSH church history, church mission Kitengela, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Who We Are', path: ROUTES.whoWeAre },
    ],
  },
  [ROUTES.leadership]: {
    title: pageTitle('Leadership & Pastors'),
    description:
      'Meet the pastors and leaders of VOSH Church International Kitengela — Bishop Erastus Kwaka, Rev. Evans Kochoo, Pastor Nancy Sai, and ministry heads serving Kitengela.',
    path: ROUTES.leadership,
    keywords: `VOSH church pastors, church leadership Kitengela, Rev Evans Kochoo Kitengela, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Leadership', path: ROUTES.leadership },
    ],
  },
  [ROUTES.services]: {
    title: pageTitle('Church Services & Programs in Kitengela'),
    description:
      'Service times at VOSH Church Kitengela — Sunday worship 7AM–1PM, Bible study, Wednesday midweek prayers, Youth Online Connect, and Friday Tefila Night.',
    path: ROUTES.services,
    keywords: `Sunday service Kitengela, church service times Kitengela, worship service Kitengela, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Services', path: ROUTES.services },
    ],
  },
  [ROUTES.discipleship]: {
    title: pageTitle('Discipleship & Small Groups'),
    description:
      'Grow in faith at VOSH Church Kitengela through new believers classes, foundation teaching, small groups, and ministry training in Kitengela.',
    path: ROUTES.discipleship,
    keywords: `Bible study Kitengela, discipleship church Kitengela, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Discipleship', path: ROUTES.discipleship },
    ],
  },
  [ROUTES.nextGeneration]: {
    title: pageTitle('Youth & Next Generation Ministry'),
    description:
      'Youth and next-generation ministry at VOSH Church International Kitengela — dynamic worship, campus outreach, and leadership development for young people in Kitengela.',
    path: ROUTES.nextGeneration,
    keywords: `youth church Kitengela, teens ministry Kitengela, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Next Generation', path: ROUTES.nextGeneration },
    ],
  },
  [ROUTES.outreach]: {
    title: pageTitle('Community Outreach in Kitengela'),
    description:
      'VOSH Church Kitengela outreach — evangelism, community care, school ministry, and humanitarian projects bringing hope to Kitengela and surrounding areas.',
    path: ROUTES.outreach,
    keywords: `church outreach Kitengela, community church Kitengela, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Outreach', path: ROUTES.outreach },
    ],
  },
  [ROUTES.sermons]: {
    title: pageTitle('Sermons & Messages'),
    description:
      'Watch and listen to sermons from VOSH Church International Kitengela — life-changing messages from Sunday worship and special services in Kitengela.',
    path: ROUTES.sermons,
    keywords: `sermons Kitengela church, church messages Kenya, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Sermons', path: ROUTES.sermons },
    ],
  },
  [ROUTES.testimonies]: {
    title: pageTitle('Testimonies of Faith'),
    description:
      'Read testimonies from members of VOSH Church International Kitengela — stories of healing, transformation, and faith from our church family in Kitengela.',
    path: ROUTES.testimonies,
    keywords: `church testimonies Kitengela, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Testimonies', path: ROUTES.testimonies },
    ],
  },
  [ROUTES.events]: {
    title: pageTitle('Church Events & Programs'),
    description:
      'Upcoming events at VOSH Church International Kitengela — conferences, crusades, special services, and community gatherings in Kitengela.',
    path: ROUTES.events,
    keywords: `church events Kitengela, VOSH church programs, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Events', path: ROUTES.events },
    ],
  },
  [ROUTES.prayerWall]: {
    title: pageTitle('Prayer Wall'),
    description:
      'Submit and pray with the VOSH Church Kitengela community. Share prayer requests and join believers across Kitengela in intercession.',
    path: ROUTES.prayerWall,
    keywords: `prayer church Kitengela, prayer requests Kitengela, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Prayer Wall', path: ROUTES.prayerWall },
    ],
  },
  [ROUTES.joinUs]: {
    title: pageTitle('Visit Us — Plan Your Visit to Kitengela'),
    description:
      'Plan your visit to VOSH Church International Kitengela. Find directions along Baraka Road, service times, contact details, and what to expect on your first Sunday.',
    path: ROUTES.joinUs,
    keywords: `visit church Kitengela, church directions Kitengela, plan visit VOSH church, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Join Us', path: ROUTES.joinUs },
    ],
  },
  [ROUTES.give]: {
    title: pageTitle('Give & Partner With Us'),
    description:
      'Give online to VOSH Church International Kitengela. Partner in tithes, offerings, and missions to advance the Gospel in Kitengela and beyond.',
    path: ROUTES.give,
    keywords: `give church Kitengela, tithe offering VOSH church, ${SITE_KEYWORDS}`,
    breadcrumbs: [
      { name: 'Home', path: ROUTES.home },
      { name: 'Give', path: ROUTES.give },
    ],
  },
}

const SERVICE_NAMES: Record<string, string> = {
  [SERVICE_SLUGS.sundayWorship]: 'Sunday Worship',
  [SERVICE_SLUGS.sundayBibleStudy]: 'Sunday Bible Study',
  [SERVICE_SLUGS.wednesdayPrayers]: 'Wednesday Midweek Prayers',
  [SERVICE_SLUGS.fridayNight]: 'Tefila Night',
  [SERVICE_SLUGS.youthOnlineConnect]: 'Youth Online Connect',
}

const SERVICE_SEO: Record<string, Omit<SeoConfig, 'path'> & { pathSuffix: string }> = {
  [SERVICE_SLUGS.sundayWorship]: {
    title: pageTitle('Sunday Worship Service in Kitengela'),
    description:
      'Join Sunday worship at VOSH Church International Kitengela — 7:00 AM to 1:00 PM at our sanctuary on Baraka Road.',
    pathSuffix: SERVICE_SLUGS.sundayWorship,
    keywords: `Sunday worship Kitengela, Sunday church service Kitengela, ${SITE_KEYWORDS}`,
  },
  [SERVICE_SLUGS.sundayBibleStudy]: {
    title: pageTitle('Sunday Bible Study in Kitengela'),
    description:
      'Sunday Bible study at VOSH Church Kitengela — 7:30 AM to 8:30 AM. Grow deeper in Scripture with our church family.',
    pathSuffix: SERVICE_SLUGS.sundayBibleStudy,
    keywords: `Bible study Kitengela Sunday, ${SITE_KEYWORDS}`,
  },
  [SERVICE_SLUGS.wednesdayPrayers]: {
    title: pageTitle('Wednesday Midweek Prayers in Kitengela'),
    description:
      'Wednesday midweek prayers at VOSH Kitengela — physical gathering 5:00 PM to 7:30 PM at the church.',
    pathSuffix: SERVICE_SLUGS.wednesdayPrayers,
    keywords: `Wednesday prayer Kitengela church, midweek prayers VOSH, ${SITE_KEYWORDS}`,
  },
  [SERVICE_SLUGS.fridayNight]: {
    title: pageTitle('Tefila Night — Friday All-Night Prayer'),
    description:
      'Tefila Night every Friday at VOSH Church Kitengela — from 8:00 PM until dawn. All-night prayer and worship.',
    pathSuffix: SERVICE_SLUGS.fridayNight,
    keywords: `Tefila Night Kitengela, Friday prayer church Kitengela, ${SITE_KEYWORDS}`,
  },
  [SERVICE_SLUGS.youthOnlineConnect]: {
    title: pageTitle('Youth Online Connect'),
    description:
      'Youth Online Connect every Tuesday 8:30–9:30 PM — online fellowship for young people at VOSH Church Kitengela.',
    pathSuffix: SERVICE_SLUGS.youthOnlineConnect,
    keywords: `youth church Kitengela, Youth Online Connect VOSH, ${SITE_KEYWORDS}`,
  },
}

const LEADER_SEO: Record<string, { name: string; title: string }> = {
  'erastus-kwaka': { name: 'Bishop Erastus Kwaka', title: 'Bishop' },
  'evans-kochoo': { name: 'Rev. Evans Kochoo', title: 'Senior Pastor' },
  'pastor-nancy-sai': { name: 'Pastor Nancy Sai', title: 'Assistant Pastor' },
  'erastus-oyoo': { name: 'Pst. Erastus K. Oyoo', title: 'Youth Pastor' },
  'ponciano-odongo': { name: 'Pst. Ponciano Odongo', title: "Children's Pastor" },
  'evangelist-lenny': { name: 'Evangelist Lenny', title: 'Evangelist' },
}

export function canonicalUrl(path: string) {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function resolveSeo(pathname: string): SeoConfig {
  const path = pathname.split('?')[0].split('#')[0] || '/'

  if (STATIC_PAGES[path]) return STATIC_PAGES[path]

  const serviceMatch = path.match(/^\/services\/([^/]+)$/)
  if (serviceMatch) {
    const slug = serviceMatch[1]
    const cfg = SERVICE_SEO[slug]
    const servicePath = `${ROUTES.services}/${slug}`
    if (cfg) {
      return {
        title: cfg.title,
        description: cfg.description,
        path: servicePath,
        keywords: cfg.keywords,
        breadcrumbs: [
          { name: 'Home', path: ROUTES.home },
          { name: 'Services', path: ROUTES.services },
          { name: SERVICE_NAMES[slug] ?? 'Service', path: servicePath },
        ],
      }
    }
    return {
      ...STATIC_PAGES[ROUTES.services],
      path: servicePath,
    }
  }

  const leaderMatch = path.match(/^\/leadership\/([^/]+)$/)
  if (leaderMatch) {
    const id = leaderMatch[1]
    const leader = LEADER_SEO[id]
    const leaderPath = `${ROUTES.leadership}/${id}`
    const name = leader?.name ?? 'Church Leader'
    return {
      title: pageTitle(`${name} — ${leader?.title ?? 'Leadership'}`),
      description: `Learn about ${name} at VOSH Church International Kitengela — ${leader?.title ?? 'church leader'} serving the body of Christ in Kitengela, Kenya.`,
      path: leaderPath,
      keywords: `${name} VOSH church, church pastor Kitengela, ${SITE_KEYWORDS}`,
      breadcrumbs: [
        { name: 'Home', path: ROUTES.home },
        { name: 'Leadership', path: ROUTES.leadership },
        { name, path: leaderPath },
      ],
    }
  }

  return STATIC_PAGES[ROUTES.home]
}

export function organizationJsonLd() {
  const mainPhone = CONTACT_INFO.phoneNumbers[0]?.number.replace(/\s/g, '') ?? '+254722566399'
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: [
      'Voice Of Salvation And Healing Church International Kitengela',
      'VOSH Church Kitengela',
      'VOSH Kitengela',
    ],
    description:
      'VOSH Church International Kitengela is a Spirit-filled Pentecostal church in Kitengela, Kenya — One Way, One Job. Worship, Word, prayer, and community outreach.',
    url: SITE_URL,
    logo: SITE_IMAGE,
    image: SITE_IMAGE,
    telephone: mainPhone,
    email: CONTACT_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Along Baraka Road / Treewa Road, Next to Balozi Junior Academy',
      addressLocality: 'Kitengela',
      addressRegion: 'Kajiado County',
      postalCode: '00241',
      addressCountry: 'KE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.3478,
      longitude: 36.9571,
    },
    areaServed: {
      '@type': 'City',
      name: 'Kitengela',
    },
    sameAs: [
      'https://www.facebook.com/VoshChurchKitengela',
      'https://www.instagram.com/voshchurchintkitengela',
      'https://www.tiktok.com/@vosh.church.kiten',
      'https://chat.whatsapp.com/33qLByUjVxw5NiqteMIOzu',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '07:00',
        closes: '13:00',
        description: 'Sunday Bible Study and Worship',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Tuesday',
        opens: '20:30',
        closes: '21:30',
        description: 'Youth Online Connect',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Wednesday',
        opens: '17:00',
        closes: '19:30',
        description: 'Wednesday Midweek Prayers (Physical)',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '20:00',
        closes: '06:00',
        description: 'Tefila Night — 8 PM until dawn',
      },
    ],
    hasMap: 'https://maps.google.com/maps?q=VOSH+Church+International+Kitengela+Baraka+Road+Balozi+Junior+Academy',
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-KE',
  }
}

export function breadcrumbJsonLd(breadcrumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  }
}
