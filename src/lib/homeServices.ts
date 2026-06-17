import { SERVICE_SLUGS } from './routes'

export type HomeServiceCard = {
  id: string
  slug: string
  title: string
  time: string
  venue: string
  platform?: string
  joinLabel: string
  linkKeys: string[]
}

export const HOME_SERVICE_CARDS: HomeServiceCard[] = [
  {
    id: 'sunday-worship',
    slug: SERVICE_SLUGS.sundayWorship,
    title: 'Sunday Worship',
    time: '9:30 AM',
    venue: 'Kitengela, Baraka Rd',
    joinLabel: 'Join Sunday',
    linkKeys: ['sunday', 'worship'],
  },
  {
    id: 'sunday-bible-study',
    slug: SERVICE_SLUGS.sundayBibleStudy,
    title: 'Sunday Bible Study',
    time: '8:00 AM',
    venue: 'Kitengela',
    joinLabel: 'Join Bible Study',
    linkKeys: ['bible', 'bible study'],
  },
  {
    id: 'wednesday-prayers',
    slug: SERVICE_SLUGS.wednesdayPrayers,
    title: 'Wednesday Prayers',
    time: '7:00 PM Online',
    venue: 'Online',
    platform: 'Zoom',
    joinLabel: 'Join Prayers',
    linkKeys: ['wednesday', 'prayer'],
  },
  {
    id: 'friday-night',
    slug: SERVICE_SLUGS.fridayNight,
    title: 'Friday Night Service',
    time: '7:00 PM',
    venue: 'Kitengela',
    joinLabel: 'Join Friday',
    linkKeys: ['friday'],
  },
  {
    id: 'thursday-connect',
    slug: SERVICE_SLUGS.thursdayConnect,
    title: 'Thursday Connect',
    time: '8:30 PM - 9:30 PM',
    venue: 'Online',
    platform: 'Google Meet',
    joinLabel: 'Join Connect',
    linkKeys: ['thursday', 'connect'],
  },
]

export function resolveServiceJoinUrl(
  card: HomeServiceCard,
  links: Array<{ title?: string; description?: string; url?: string }>,
  programs: Array<{ title?: string; url?: string; link_url?: string; linkUrl?: string }>,
): string | null {
  const matchLink = links.find((link) => {
    const hay = `${link.title ?? ''} ${link.description ?? ''}`.toLowerCase()
    return card.linkKeys.some((key) => hay.includes(key))
  })
  if (matchLink?.url) return matchLink.url

  const matchProgram = programs.find((p) => {
    const hay = (p.title ?? '').toLowerCase()
    return card.linkKeys.some((key) => hay.includes(key))
  })
  const programUrl = matchProgram?.url || matchProgram?.linkUrl || matchProgram?.link_url
  if (programUrl?.startsWith('http')) return programUrl

  return null
}
