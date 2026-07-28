import { SERVICE_SLUGS } from './routes'
import type { NormalizedLive } from './live'
import { resolveServiceJoinUrl, type HomeServiceCard } from './homeServices'

export type WeeklyService = HomeServiceCard & {
  description: string
  isOnline: boolean
  sortOrder: number
}

export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=VOSH+Church+International+Kitengela+Baraka+Road'

export const WEEKLY_SERVICES: WeeklyService[] = [
  {
    id: 'sunday-bible-study',
    slug: SERVICE_SLUGS.sundayBibleStudy,
    title: 'Sunday Bible Study',
    time: '7:30 – 8:30 AM',
    venue: 'Kitengela, Baraka Road',
    description: 'Grow deeper in Scripture before the main Sunday gathering.',
    joinLabel: 'Join Bible Study',
    linkKeys: ['bible', 'bible study'],
    isOnline: false,
    sortOrder: 1,
  },
  {
    id: 'sunday-worship',
    slug: SERVICE_SLUGS.sundayWorship,
    title: 'Sunday Worship Service',
    time: '7:00 AM – 1:00 PM',
    venue: 'Kitengela, Baraka Road',
    description: 'Main Sunday celebration — worship, the Word, and ministry.',
    joinLabel: 'Join Sunday Service',
    linkKeys: ['sunday', 'worship'],
    isOnline: false,
    sortOrder: 2,
  },
  {
    id: 'wednesday-prayers',
    slug: SERVICE_SLUGS.wednesdayPrayers,
    title: 'Wednesday Midweek Prayers',
    time: '5:00 – 7:30 PM',
    venue: 'Kitengela, Baraka Road (Physical)',
    description: 'Midweek physical prayer gathering — come seek God together on site.',
    joinLabel: 'Get Directions',
    linkKeys: ['wednesday', 'prayer', 'midweek'],
    isOnline: false,
    sortOrder: 3,
  },
  {
    id: 'youth-online-connect',
    slug: SERVICE_SLUGS.youthOnlineConnect,
    title: 'Youth Online Connect',
    time: 'Tuesday 8:30 – 9:30 PM',
    venue: 'Online',
    description: 'Youth online fellowship — connect, grow, and encourage one another.',
    joinLabel: 'Join Youth Connect',
    linkKeys: ['youth', 'tuesday', 'connect', 'online connect'],
    isOnline: true,
    sortOrder: 4,
  },
  {
    id: 'friday-night',
    slug: SERVICE_SLUGS.fridayNight,
    title: 'Tefila Night',
    time: 'Friday 8:00 PM – Dawn',
    venue: 'Kitengela, Baraka Road',
    description: 'All-night prayer and worship — Tefila every Friday from 8 PM until dawn.',
    joinLabel: 'Join Tefila Night',
    linkKeys: ['friday', 'tefila', 'tefilah'],
    isOnline: false,
    sortOrder: 5,
  },
]

/** Monthly & special gatherings shown on the Services page */
export const MONTHLY_GATHERINGS = [
  {
    id: 'leaders-fellowship',
    title: 'Leaders’ Fellowship',
    time: 'First Saturday of every month',
    description: 'Monthly gathering for church leaders to pray, plan, and grow together.',
  },
  {
    id: 'womens-fellowship',
    title: 'Women’s Fellowship',
    time: 'Third Saturday of every month',
    description: 'Women of VOSH Kitengela gathering for fellowship, Word, and prayer.',
  },
  {
    id: 'childrens-ministry',
    title: 'Children’s Ministry',
    time: 'Every Sunday · 9:00 – 11:00 AM',
    description: 'Sunday school and children’s ministry during the morning service.',
  },
  {
    id: 'counseling',
    title: 'Counseling Sessions',
    time: '10:00 AM – 3:00 PM',
    description: 'Pastoral counseling available — book through the church office or contact form.',
  },
] as const

export type ServiceJoinAction = {
  href: string
  external: boolean
  showLiveStreamNote: boolean
}

export function resolveWeeklyServiceJoin(
  service: WeeklyService,
  links: Array<{ title?: string; description?: string; url?: string }>,
  programs: Array<{ title?: string; url?: string; link_url?: string; linkUrl?: string }>,
  live: NormalizedLive | null,
): ServiceJoinAction {
  const onlineUrl = resolveServiceJoinUrl(service, links, programs)
  const hasSundayStream =
    service.slug === SERVICE_SLUGS.sundayWorship &&
    Boolean(live?.youtubeLiveUrl || live?.facebookLiveUrl)

  if (service.isOnline && onlineUrl) {
    return { href: onlineUrl, external: true, showLiveStreamNote: false }
  }

  if (!service.isOnline) {
    if (onlineUrl?.startsWith('http')) {
      return { href: onlineUrl, external: true, showLiveStreamNote: hasSundayStream }
    }
    return {
      href: MAPS_URL,
      external: true,
      showLiveStreamNote: hasSundayStream,
    }
  }

  return {
    href: onlineUrl || MAPS_URL,
    external: true,
    showLiveStreamNote: false,
  }
}

export function mergeProgramIntoService(
  service: WeeklyService,
  programs: Array<{
    title?: string
    startTime?: string
    start_time?: string
    endTime?: string
    end_time?: string
    venue?: string
    description?: string | null
  }>,
): WeeklyService {
  const match = programs.find((p) => {
    const hay = (p.title ?? '').toLowerCase()
    return service.linkKeys.some((key) => hay.includes(key))
  })
  if (!match) return service

  const start = match.startTime || match.start_time || ''
  const end = match.endTime || match.end_time || ''
  const time = start && end ? `${start} – ${end}` : start || service.time

  return {
    ...service,
    time,
    venue: match.venue || service.venue,
    description: match.description || service.description,
  }
}
