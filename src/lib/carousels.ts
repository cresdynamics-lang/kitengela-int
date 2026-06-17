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
    image: '/rev-side-picture.jpeg',
    label: 'VOSH CHURCH KITENGELA',
    headline: 'Rooted in the Word, Rising in Spirit',
    scriptureText: 'Built on the foundation of the apostles and prophets, with Christ Jesus Himself as the chief cornerstone.',
    scriptureRef: 'Ephesians 2:20',
    ctaText: 'Discover Our Roots',
    ctaLink: ROUTES.whoWeAre,
  },
  {
    id: 'defying-gravity',
    image: '/evans-preaching.jpeg',
    label: 'DEFYING GRAVITY',
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
    id: 'next-gen',
    image: '/worship-time.jpeg',
    label: 'NEXT GENERATION',
    headline: 'Raising Kingdom Leaders for Tomorrow',
    scriptureText: 'Train up a child in the way he should go; even when he is old he will not depart from it.',
    scriptureRef: 'Proverbs 22:6',
    ctaText: 'Explore Next Generation',
    ctaLink: ROUTES.nextGeneration,
  },
]

export const DEFAULT_GENERATION_GROUPS: GenerationCard[] = [
  {
    id: 'children',
    groupName: "Children's Ministry",
    imageUrl: '/whatsapp-4.jpeg',
    scriptureText: 'Train up a child in the way he should go.',
    scriptureRef: 'Proverbs 22:6',
  },
  {
    id: 'youth',
    groupName: 'Youth & Teens',
    imageUrl: '/whatsapp-12.jpeg',
    scriptureText: 'Let no one despise your youth.',
    scriptureRef: '1 Timothy 4:12',
  },
  {
    id: 'young-adults',
    groupName: 'Young Adults',
    imageUrl: '/online-connect.jpeg',
    scriptureText: "Don't let anyone look down on you because you are young.",
    scriptureRef: '1 Timothy 4:12',
  },
  {
    id: 'elders',
    groupName: 'Elders & Legacy',
    imageUrl: '/church-praying.jpg',
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
    ctaText: String(row.cta_text ?? row.ctaText ?? 'Learn More'),
    ctaLink: String(row.cta_link ?? row.ctaLink ?? ROUTES.whoWeAre),
  }
}

export function normalizeGenerationGroup(row: Record<string, unknown>): GenerationCard | null {
  const imageUrl = String(row.image_url ?? row.imageUrl ?? '').trim()
  const groupName = String(row.group_name ?? row.groupName ?? '').trim()
  if (!imageUrl || !groupName) return null
  return {
    id: String(row.id ?? groupName),
    groupName,
    imageUrl,
    scriptureText: String(row.scripture_text ?? row.scriptureText ?? ''),
    scriptureRef: String(row.scripture_ref ?? row.scriptureRef ?? ''),
  }
}
