/** Shared leader shape for public pages (from API `leaders` table). */
export type PublicLeader = {
  id: string
  name: string
  title: string
  bio: string
  imageUrl: string | null
  slug: string
  facebookUrl: string | null
  instagramUrl: string | null
  twitterUrl: string | null
  orderIndex: number
}

export function leaderSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeLeader(row: Record<string, unknown>): PublicLeader {
  const name = String(row.name ?? '')
  const photo =
    (row.photo_url as string | null | undefined) ||
    (row.imageUrl as string | null | undefined) ||
    (row.photoUrl as string | null | undefined) ||
    null

  return {
    id: String(row.id ?? ''),
    name,
    title: String(row.title ?? ''),
    bio: String(row.bio ?? ''),
    imageUrl: photo || null,
    slug: leaderSlug(name),
    facebookUrl: (row.facebook_url as string | null) ?? (row.facebookUrl as string | null) ?? null,
    instagramUrl: (row.instagram_url as string | null) ?? (row.instagramUrl as string | null) ?? null,
    twitterUrl: (row.twitter_url as string | null) ?? (row.twitterUrl as string | null) ?? null,
    orderIndex: Number(row.order_index ?? row.orderIndex ?? 0),
  }
}

export function normalizeLeaders(rows: unknown): PublicLeader[] {
  if (!Array.isArray(rows)) return []
  return rows
    .map((row) => normalizeLeader(row as Record<string, unknown>))
    .filter((l) => l.id && l.name)
    .sort((a, b) => a.orderIndex - b.orderIndex)
}

/** Match route param to a leader (UUID, slug, or legacy paths). */
export function findLeaderByRouteId(leaders: PublicLeader[], routeId: string): PublicLeader | undefined {
  const id = routeId.trim().toLowerCase()
  return leaders.find((leader) => {
    if (leader.id === routeId) return true
    if (leader.slug === id) return true
    if (id === 'evans-kochoo' && /evans/i.test(leader.name)) return true
    if (id === 'pastor-nancy-sai' && /nancy/i.test(leader.name)) return true
    return false
  })
}

/** Original site leaders — shown when the database has no rows yet. */
export const defaultLeaders: PublicLeader[] = [
  {
    id: 'evans-kochoo',
    name: 'Rev. Evans O. Kochoo',
    title: 'Senior Pastor',
    bio: 'I am Evans O. Kochoo, fondly known as The Eagle, a passionate servant of God driven by a dynamic apostolic mandate to disseminate the pure and unadulterated Gospel of Jesus Christ.',
    imageUrl: '/Rev.Evans1.jpeg',
    slug: 'evans-kochoo',
    facebookUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    orderIndex: 1,
  },
  {
    id: 'pastor-nancy-sai',
    name: 'Pastor Nancy Sai',
    title: 'Assistant Pastor',
    bio: "Pastor Nancy Sai serves as the Assistant Pastor at Kitengela VOSH International Church. She is passionate about advancing God's Kingdom through sound teaching, servant leadership, and community impact.",
    imageUrl: '/PastorNancySai.jpeg',
    slug: 'pastor-nancy-sai',
    facebookUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    orderIndex: 2,
  },
]

/** Use database leaders when present; otherwise keep the original website leaders visible. */
export function resolvePublicLeaders(fromApi: PublicLeader[]): PublicLeader[] {
  return fromApi.length > 0 ? fromApi : defaultLeaders
}
