import { ROUTES } from './routes'

export const DISCIPLESHIP_PATHWAY = [
  {
    step: 1,
    title: 'New Believers Class',
    topics: 'Salvation, baptism intro, first steps',
    cta: 'Enroll →',
    href: `${ROUTES.joinUs}#plan-visit`,
  },
  {
    step: 2,
    title: 'Foundation Classes',
    topics: 'Core doctrine, baptism, the Holy Spirit',
    cta: 'Enroll →',
    href: `${ROUTES.joinUs}#plan-visit`,
  },
  {
    step: 3,
    title: 'Small Groups',
    topics: 'Community, accountability, growth',
    cta: 'Find a Group →',
    href: '#small-groups',
  },
  {
    step: 4,
    title: 'Ministry & Service',
    topics: 'Using your gifts to build the Kingdom',
    cta: 'Serve With Us →',
    href: ROUTES.leadership,
  },
] as const

export type SmallGroup = {
  id: string
  name: string
  schedule: string
  location: string
  joinUrl?: string | null
}

/** Next New Believers Class — update in admin links or here */
export const NEXT_DISCIPLESHIP_CLASS = {
  title: 'New Believers Class',
  startsOn: 'First Sunday of each month',
  time: '11:30 AM',
  location: 'Kitengela Main Sanctuary',
  enrollLink: `${ROUTES.joinUs}#plan-visit`,
}

export const FALLBACK_SMALL_GROUPS: SmallGroup[] = [
  {
    id: 'kitengela-central',
    name: 'Kitengela Central Cell',
    schedule: 'Wednesday · 7:00 PM',
    location: 'Kitengela Main Sanctuary',
  },
  {
    id: 'baraka-road',
    name: 'Baraka Road Fellowship',
    schedule: 'Friday · 6:30 PM',
    location: 'Baraka Road Area',
  },
  {
    id: 'online-connect',
    name: 'Online Connect Group',
    schedule: 'Thursday · 8:30 PM',
    location: 'Online (Google Meet)',
  },
]

export function parseSmallGroupsFromLinks(
  links: Array<{ id?: string; title?: string; description?: string; url?: string; category?: string }>,
): SmallGroup[] {
  const filtered = links.filter((link) => {
    const cat = (link.category ?? '').toLowerCase()
    const title = (link.title ?? '').toLowerCase()
    return cat.includes('small group') || cat.includes('cell') || title.includes('cell group')
  })

  if (filtered.length === 0) return []

  return filtered.map((link, i) => ({
    id: link.id ?? `group-${i}`,
    name: link.title ?? 'Small Group',
    schedule: link.description?.split('|')[0]?.trim() || link.description || 'See details',
    location: link.description?.split('|')[1]?.trim() || 'Kitengela',
    joinUrl: link.url,
  }))
}
