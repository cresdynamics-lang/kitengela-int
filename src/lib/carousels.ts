import { ROUTES } from './routes'

export type HeroSlide = {
  id: string
  image: string
  label: string
  headline: string
  scriptureText: string
  scriptureRef: string
  ctaText: string
  ctaLink: string
}

export type GenerationCard = {
  id: string
  groupName: string
  imageUrl: string
  scriptureText: string
  scriptureRef: string
}

export const DEFAULT_HOME_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'house-of-solutions',
    image: '/rev-evans-kochoo-preaching.jpeg',
    label: 'VOSH CHURCH KITENGELA',
    headline: 'Rooted in the Word, Rising in Spirit',
    scriptureText: 'Built on the foundation of the apostles and prophets, with Christ Jesus Himself as the chief cornerstone.',
    scriptureRef: 'Ephesians 2:20',
    ctaText: 'Discover Our Roots',
    ctaLink: ROUTES.whoWeAre,
  },
  {
    id: 'defying-gravity',
    image: '/rev-evans-kochoo-smiling.jpeg',
    label: 'ONE WAY, ONE JOB',
    headline: 'Impacting Generations',
    scriptureText: 'One generation will commend Your works to another, and they will tell of Your mighty acts.',
    scriptureRef: 'Psalm 145:4',
    ctaText: 'Meet Our Leadership',
    ctaLink: `${ROUTES.leadership}/evans-kochoo`,
  },
  {
    id: 'outreach',
    image: '/outreach-1.jpeg',
    label: 'LOVE BEYOND OUR WALLS',
    headline: 'Our Mission in Action',
    scriptureText: 'Therefore go and make disciples of all nations.',
    scriptureRef: 'Matthew 28:19',
    ctaText: 'See Our Outreach',
    ctaLink: ROUTES.outreach,
  },
  {
    id: 'tefila',
    image: '/tefila-night.jpeg',
    label: 'TEFILA NIGHT',
    headline: 'Pursue · Overtake · Recover',
    scriptureText: 'Every Friday · 8:00 PM until Dawn at VOSH Kitengela.',
    scriptureRef: '1 Samuel 30:2-8',
    ctaText: 'View Services',
    ctaLink: ROUTES.services,
  },
]

export const DEFAULT_GENERATION_GROUPS: GenerationCard[] = [
  {
    id: 'children',
    groupName: "Children's Ministry",
    imageUrl: '/pst-ponciano-odongo-children.jpeg',
    scriptureText: 'Train up a child in the way he should go.',
    scriptureRef: 'Proverbs 22:6',
  },
  {
    id: 'youth',
    groupName: 'Youth & Teens',
    imageUrl: '/pst-erastus-oyoo-youth.jpeg',
    scriptureText: 'Let no one despise your youth.',
    scriptureRef: '1 Timothy 4:12',
  },
  {
    id: 'young-adults',
    groupName: 'Young Adults',
    imageUrl: '/whatsapp-12.jpeg',
    scriptureText: "Don't let anyone look down on you because you are young.",
    scriptureRef: '1 Timothy 4:12',
  },
  {
    id: 'elders',
    groupName: 'Elders & Legacy',
    imageUrl: '/bishop-erastus-kwaka.jpeg',
    scriptureText: 'One generation will commend Your works to another.',
    scriptureRef: 'Psalm 145:4',
  },
]

export function normalizeHeroSlide(row: Record<string, unknown>): HeroSlide | null {
  const image = String(row.image_url ?? row.imageUrl ?? row.image ?? '').trim()
  const headline = String(row.headline ?? '').trim()
  if (!image || !headline) return null
  return {
    id: String(row.id ?? headline),
    image,
    label: String(row.label ?? ''),
    headline,
    scriptureText: String(row.scripture_text ?? row.scriptureText ?? ''),
    scriptureRef: String(row.scripture_ref ?? row.scriptureRef ?? ''),
    ctaText: String(row.cta_text ?? row.ctaText ?? ''),
    ctaLink: String(row.cta_link ?? row.ctaLink ?? ROUTES.whoWeAre),
  }
}

export function normalizeGenerationGroup(row: Record<string, unknown>): GenerationCard | null {
  const groupName = String(row.group_name ?? row.groupName ?? '').trim()
  const imageUrl = String(row.image_url ?? row.imageUrl ?? '').trim()
  if (!groupName || !imageUrl) return null
  return {
    id: String(row.id ?? groupName),
    groupName,
    imageUrl,
    scriptureText: String(row.scripture_text ?? row.scriptureText ?? ''),
    scriptureRef: String(row.scripture_ref ?? row.scriptureRef ?? ''),
  }
}
