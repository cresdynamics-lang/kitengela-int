export const ROUTES = {
  home: '/',
  whoWeAre: '/who-we-are',
  leadership: '/leadership',
  nextGeneration: '/next-generation',
  outreach: '/outreach',
  services: '/services',
  discipleship: '/discipleship',
  sermons: '/sermons',
  testimonies: '/testimonies',
  events: '/events',
  prayerWall: '/prayer-wall',
  joinUs: '/join-us',
  give: '/give',
  /** @deprecated use joinUs#contact-form */
  contact: '/join-us#contact-form',
  admin: {
    root: '/admin',
    login: '/admin/login',
    liveSessions: '/admin/live-sessions',
    services: '/admin/services',
    announcements: '/admin/announcements',
    leadership: '/admin/leadership',
    giveSettings: '/admin/give-settings',
  },
} as const

export const SERVICE_SLUGS = {
  sundayWorship: 'sunday-worship',
  sundayBibleStudy: 'sunday-bible-study',
  wednesdayPrayers: 'wednesday-prayers',
  fridayNight: 'friday-night',
  thursdayConnect: 'thursday-connect',
} as const

export type ServiceSlug = (typeof SERVICE_SLUGS)[keyof typeof SERVICE_SLUGS]

export const SERVICE_SLUG_LIST: ServiceSlug[] = Object.values(SERVICE_SLUGS)

/** @deprecated legacy slugs — redirect to new paths */
export const LEGACY_SERVICE_SLUGS: Record<string, ServiceSlug> = {
  sunday: SERVICE_SLUGS.sundayWorship,
  biblestudy: SERVICE_SLUGS.sundayBibleStudy,
  wednesday: SERVICE_SLUGS.wednesdayPrayers,
  friday: SERVICE_SLUGS.fridayNight,
  thursday: SERVICE_SLUGS.thursdayConnect,
}

export function serviceDetailPath(slug: string) {
  return `${ROUTES.services}/${slug}`
}
