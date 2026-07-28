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
    if (id === 'evans-kochoo' && /evans/i.test(leader.name) && /kochoo/i.test(leader.name)) return true
    if (id === 'pastor-nancy-sai' && /nancy/i.test(leader.name)) return true
    if (id === 'erastus-kwaka' && /kwaka/i.test(leader.name)) return true
    if (id === 'erastus-oyoo' && /oyoo/i.test(leader.name)) return true
    if (id === 'ponciano-odongo' && /ponciano|odongo/i.test(leader.name)) return true
    if (id === 'evangelist-lenny' && /lenny/i.test(leader.name)) return true
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
    imageUrl: '/bishop-erastus-kwaka.jpeg',
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
    bio: 'I am Evans O. Kochoo, fondly known as The Eagle, a passionate servant of God driven by a dynamic apostolic mandate to disseminate the pure and unadulterated Gospel of Jesus Christ.\n\nFor years, the Lord has entrusted me with shepherding VOSH Church International Kitengela — raising a people who encounter God\'s presence, grow in the Word, and carry solutions to their generation.\n\nI teach that just as the first organized opposition to the Gospel was financed to suppress the truth, the Church must also finance platforms where the truth is revealed.\n\nScripture: "Shepherd the flock of God that is among you, exercising oversight." — 1 Peter 5:2',
    imageUrl: '/rev-evans-kochoo-smiling.jpeg',
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
    bio: "Pastor Nancy Sai serves as the Assistant Pastor at VOSH Church International Kitengela. She is passionate about advancing God's Kingdom through sound teaching, servant leadership, and community impact.",
    imageUrl: '/PastorNancySai.jpeg',
    slug: 'pastor-nancy-sai',
    facebookUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    orderIndex: 2,
  },
  {
    id: 'erastus-oyoo',
    name: 'Pst. Erastus K. Oyoo',
    title: 'Youth Pastor',
    bio: 'Pastor Erastus K. Oyoo leads the Youth Ministry at VOSH Church International Kitengela — raising the next generation in faith, fellowship, and purpose.\n\nHe shepherds Youth Online Connect and next-generation programs that equip young people to walk with Christ and impact Kitengela and beyond.\n\nScripture: "Don\'t let anyone look down on you because you are young, but set an example for the believers." — 1 Timothy 4:12',
    imageUrl: '/pst-erastus-oyoo-youth.jpeg',
    slug: 'erastus-oyoo',
    facebookUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    orderIndex: 3,
  },
  {
    id: 'ponciano-odongo',
    name: 'Pst. Ponciano Odongo',
    title: 'Children’s Pastor',
    bio: 'Pastor Ponciano Odongo leads the Children’s Ministry at VOSH Church International Kitengela — nurturing young hearts in the Word every Sunday from 9:00 AM to 11:00 AM.\n\nHe is committed to raising children who know Jesus early, grow in character, and belong in the family of faith.\n\nScripture: "Train up a child in the way he should go; even when he is old he will not depart from it." — Proverbs 22:6',
    imageUrl: '/pst-ponciano-odongo-children.jpeg',
    slug: 'ponciano-odongo',
    facebookUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    orderIndex: 4,
  },
  {
    id: 'evangelist-lenny',
    name: 'Evangelist Lenny',
    title: 'Evangelist',
    bio: 'Evangelist Lenny serves VOSH Church International Kitengela with a passion to proclaim the Gospel and draw people to Christ.\n\nThrough evangelism and outreach, she helps carry the message of salvation beyond the walls of the church into the community.\n\nScripture: "Go into all the world and preach the gospel to all creation." — Mark 16:15',
    imageUrl: '/evangelist-lenny.jpeg',
    slug: 'evangelist-lenny',
    facebookUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    orderIndex: 5,
  },
]

/** Use database leaders when present; merge in site defaults for leaders not yet in CMS. */
export function resolvePublicLeaders(fromApi: PublicLeader[]): PublicLeader[] {
  if (fromApi.length === 0) return defaultLeaders

  const merged = [...fromApi]
  for (const fallback of defaultLeaders) {
    const exists = merged.some(
      (l) =>
        l.id === fallback.id ||
        l.slug === fallback.slug ||
        (fallback.id === 'evans-kochoo' && /evans/i.test(l.name) && /kochoo/i.test(l.name)) ||
        (fallback.id === 'pastor-nancy-sai' && /nancy/i.test(l.name)) ||
        (fallback.id === 'erastus-kwaka' && /kwaka/i.test(l.name)) ||
        (fallback.id === 'erastus-oyoo' && /oyoo/i.test(l.name)) ||
        (fallback.id === 'ponciano-odongo' && /ponciano|odongo/i.test(l.name)) ||
        (fallback.id === 'evangelist-lenny' && /lenny/i.test(l.name)),
    )
    if (!exists) {
      merged.push(fallback)
    } else {
      // Prefer clearer local portraits when API photo is missing
      const idx = merged.findIndex(
        (l) =>
          l.id === fallback.id ||
          l.slug === fallback.slug ||
          (fallback.slug === 'erastus-kwaka' && /kwaka/i.test(l.name)) ||
          (fallback.slug === 'evans-kochoo' && /evans/i.test(l.name) && /kochoo/i.test(l.name)),
      )
      if (idx >= 0 && !merged[idx].imageUrl && fallback.imageUrl) {
        merged[idx] = { ...merged[idx], imageUrl: fallback.imageUrl }
      }
    }
  }
  return merged.sort((a, b) => a.orderIndex - b.orderIndex)
}

export function isBishopLeader(leader: PublicLeader): boolean {
  const t = leader.title.toLowerCase()
  if (t.includes('bishop')) return true
  return /kwaka/i.test(leader.name)
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
      !isBishopLeader(l) &&
      !/assistant pastor/i.test(l.title) &&
      !/nancy/i.test(l.name),
  )
}

export const DEPARTMENT_SLOTS = [
  { id: 'youth', label: 'Youth Ministry', match: /youth/i },
  { id: 'children', label: 'Children’s Ministry', match: /children|child/i },
  { id: 'evangelism', label: 'Evangelism', match: /evangelist|evangelism/i },
  { id: 'prayer', label: 'Prayer Ministry', match: /prayer/i },
] as const

export function getDepartmentalLeaders(leaders: PublicLeader[], senior: PublicLeader | null) {
  const pool = leaders.filter((l) => l.id !== senior?.id && !isBishopLeader(l))
  return DEPARTMENT_SLOTS.map((slot) => {
    const lead =
      pool.find((l) => slot.match.test(l.title) || slot.match.test(l.name)) ?? null
    return { ...slot, lead }
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
