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
    id: 'sunday-bible-study',
    slug: SERVICE_SLUGS.sundayBibleStudy,
    title: 'Sunday Bible Study',
    time: '7:30 – 8:30 AM',
    venue: 'Kitengela, Baraka Rd',
    joinLabel: 'Join Bible Study',
    linkKeys: ['bible', 'bible study'],
  },
  {
    id: 'sunday-worship',
    slug: SERVICE_SLUGS.sundayWorship,
    title: 'Sunday Worship',
    time: '7:00 AM – 1:00 PM',
    venue: 'Kitengela, Baraka Rd',
    joinLabel: 'Join Sunday',
    linkKeys: ['sunday', 'worship'],
  },
  {
    id: 'wednesday-prayers',
    slug: SERVICE_SLUGS.wednesdayPrayers,
    title: 'Wednesday Midweek Prayers',
    time: '5:00 – 7:30 PM',
    venue: 'Kitengela (Physical)',
    joinLabel: 'Join Prayers',
    linkKeys: ['wednesday', 'prayer', 'midweek'],
  },
  {
    id: 'youth-online-connect',
    slug: SERVICE_SLUGS.youthOnlineConnect,
    title: 'Youth Online Connect',
    time: 'Tue 8:30 – 9:30 PM',
    venue: 'Online',
    platform: 'Online',
    joinLabel: 'Join Youth Connect',
    linkKeys: ['youth', 'tuesday', 'connect', 'online connect'],
  },
  {
    id: 'friday-night',
    slug: SERVICE_SLUGS.fridayNight,
    title: 'Tefila Night',
    time: 'Fri 8:00 PM – Dawn',
    venue: 'Kitengela',
    joinLabel: 'Join Tefila',
    linkKeys: ['friday', 'tefila', 'tefilah'],
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
