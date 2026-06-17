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

/** Strip legacy "& Founder" suffix from titles shown on the site. */
export function formatLeaderTitle(title: string): string {
  return title.replace(/\s*&\s*founder/gi, '').replace(/\s{2,}/g, ' ').trim()
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
    title: formatLeaderTitle(String(row.title ?? '')),
    bio: String(row.bio ?? ''),
    imageUrl: photo || null,
    slug: String(row.slug ?? '').trim() || leaderSlug(name),
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
    if (id === 'erastus-kwaka' && (/erastus/i.test(leader.name) || /kwaka/i.test(leader.name))) return true
    return false
  })
}

/** Original site leaders — shown when the database has no rows yet. */
export const defaultLeaders: PublicLeader[] = [
  {
    id: 'erastus-kwaka',
    name: 'Bishop Erastus Kwaka',
    title: 'Bishop · FCPA',
    bio: 'Bishop Erastus Kwaka is regarded across VOSH Church International Kitengela as a gift to this generation — a life model of faith, integrity, and excellence, and a blessing to the community.\n\nAs the broader VOSH family honors his leadership, we remain deeply grateful for his wisdom, grace, and selfless dedication to the spiritual growth of the saints and the expansion of God\'s Kingdom.\n\nHis leadership combines spiritual oversight with professional stewardship, inspiring believers to walk in purpose and serve with distinction.\n\nScripture: "Remember your leaders, who spoke the word of God to you. Consider the outcome of their way of life and imitate their faith." — Hebrews 13:7',
    imageUrl: '/bishop-erastus-kwaka.png',
    slug: 'erastus-kwaka',
    facebookUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    orderIndex: 0,
  },
  {
    id: 'evans-kochoo',
    name: 'Rev. Evans O. Kochoo',
    title: 'Senior Pastor',
    bio: 'I am Evans O. Kochoo, fondly known as The Eagle, a passionate servant of God driven by a dynamic apostolic mandate to disseminate the pure and unadulterated Gospel of Jesus Christ.\n\nFor years, the Lord has entrusted me with shepherding VOSH Church International Kitengela — raising a people who encounter God\'s presence, grow in the Word, and carry solutions to their generation.\n\nI teach that just as the first organized opposition to the Gospel was financed to suppress the truth, the Church must also finance platforms where the truth is revealed.\n\nScripture: "When the chief priests had met with the elders and devised a plan, they gave the soldiers a large sum of money, telling them, \'You are to say, His disciples came during the night and stole him away while we were asleep.\'" — Matthew 28:12-13\n\nScripture: "These women were helping to support them out of their own means." — Luke 8:3',
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

/** Use database leaders when present; merge in site defaults for rich-profile leaders not yet in CMS. */
export function resolvePublicLeaders(fromApi: PublicLeader[]): PublicLeader[] {
  if (fromApi.length === 0) return defaultLeaders

  const merged = [...fromApi]
  for (const fallback of defaultLeaders) {
    const exists = merged.some(
      (l) =>
        l.id === fallback.id ||
        l.slug === fallback.slug ||
        (fallback.id === 'evans-kochoo' && /evans/i.test(l.name)) ||
        (fallback.id === 'pastor-nancy-sai' && /nancy/i.test(l.name)) ||
        (fallback.id === 'erastus-kwaka' && (/erastus/i.test(l.name) || /kwaka/i.test(l.name))),
    )
    if (!exists) merged.push(fallback)
  }
  return merged.sort((a, b) => a.orderIndex - b.orderIndex)
}

export function isBishopLeader(leader: PublicLeader): boolean {
  const t = leader.title.toLowerCase()
  return t.includes('bishop') || /erastus/i.test(leader.name) || /kwaka/i.test(leader.name)
}

export function isSeniorLeader(leader: PublicLeader): boolean {
  const t = leader.title.toLowerCase()
  return t.includes('senior pastor') || t.includes('founder') || t.includes('lead pastor')
}

export function isDepartmentalLeader(leader: PublicLeader): boolean {
  const t = leader.title.toLowerCase()
  return (
    t.includes('ministry') ||
    t.includes('ushering') ||
    t.includes('department') ||
    /head of|ministry lead|dept\./i.test(leader.title)
  )
}

export function getSeniorLeader(leaders: PublicLeader[]): PublicLeader | null {
  return leaders.find(isSeniorLeader) ?? leaders[0] ?? null
}

export function getMinistryTeam(leaders: PublicLeader[], senior: PublicLeader | null): PublicLeader[] {
  return leaders.filter(
    (l) =>
      l.id !== senior?.id &&
      !isDepartmentalLeader(l) &&
      !isBishopLeader(l) &&
      !/assistant pastor/i.test(l.title) &&
      !/nancy/i.test(l.name),
  )
}

export const DEPARTMENT_SLOTS = [
  { id: 'prayer', label: 'Prayer Ministry', match: /prayer/i },
  { id: 'worship', label: 'Worship Ministry', match: /worship/i },
  { id: 'outreach', label: 'Outreach Ministry', match: /outreach/i },
  { id: 'ushering', label: 'Ushering', match: /ushering/i },
] as const

export function getDepartmentalLeaders(leaders: PublicLeader[], senior: PublicLeader | null) {
  const pool = leaders.filter((l) => l.id !== senior?.id)
  return DEPARTMENT_SLOTS.map((slot) => {
    const lead =
      pool.find((l) => slot.match.test(l.title) && isDepartmentalLeader(l)) ??
      pool.find((l) => slot.match.test(l.title))
    return { ...slot, lead: lead ?? null }
  })
}

export function splitBioParagraphs(bio: string): string[] {
  return bio
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Optional trailing line in bio: Scripture: "text" — Reference */
export function parseGuidingScripture(bio: string): { text: string; ref: string } | null {
  const match = bio.match(/scripture:\s*[""]?(.+?)[""]?\s*[—–-]\s*(.+)$/im)
  if (!match) return null
  return { text: match[1].trim(), ref: match[2].trim() }
}

export const DEFAULT_SENIOR_SCRIPTURE = {
  text: 'Shepherd the flock of God that is among you, exercising oversight.',
  ref: '1 Peter 5:2',
}
