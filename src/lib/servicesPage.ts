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
    time: '8:00 AM',
    venue: 'Kitengela, Baraka Road',
    description: 'Grow deeper in Scripture before the main service.',
    joinLabel: 'Join Bible Study',
    linkKeys: ['bible', 'bible study'],
    isOnline: false,
    sortOrder: 1,
  },
  {
    id: 'sunday-worship',
    slug: SERVICE_SLUGS.sundayWorship,
    title: 'Sunday Worship Service',
    time: '9:30 AM',
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
    title: 'Wednesday Online Prayers',
    time: '7:00 PM',
    venue: 'Online — Zoom',
    description: 'Midweek prayer gathering to seek God together.',
    joinLabel: 'Join Wednesday Prayers',
    linkKeys: ['wednesday', 'prayer'],
    isOnline: true,
    sortOrder: 3,
  },
  {
    id: 'thursday-connect',
    slug: SERVICE_SLUGS.thursdayConnect,
    title: 'Thursday Online Connect',
    time: '8:30 PM – 9:30 PM',
    venue: 'Online — Google Meet',
    description: 'Midweek fellowship and connection.',
    joinLabel: 'Join Thursday Connect',
    linkKeys: ['thursday', 'connect'],
    isOnline: true,
    sortOrder: 4,
  },
  {
    id: 'friday-night',
    slug: SERVICE_SLUGS.fridayNight,
    title: 'Friday Night Service',
    time: '7:00 PM',
    venue: 'Kitengela, Baraka Road',
    description: 'Night of worship, intercession, and the Word.',
    joinLabel: 'Join Friday Night',
    linkKeys: ['friday'],
    isOnline: false,
    sortOrder: 5,
  },
]

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
