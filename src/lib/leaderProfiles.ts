import { ROUTES } from './routes'
import type { PublicLeader } from './leaders'

export type MinistryArea = {
  icon: string
  title: string
  description: string
}

export type RichLeaderProfile = {
  slug: string
  name: string
  nickname?: string
  roleLabel: string
  tagline: string
  signatureQuote: string
  quoteTagline?: string
  heroPhoto: string
  profilePhoto: string
  visionStatement?: string
  visionScripture?: { text: string; ref: string }
  profileParagraphs: string[]
  qualificationsNarrative?: string[]
  qualifications: string[]
  ministryAreas: MinistryArea[]
  coreSkills: string[]
  galleryImages: string[]
  cta?: { title: string; body: string; link: string; label: string }
}

export const RICH_PROFILE_SLUGS = ['evans-kochoo', 'pastor-nancy-sai', 'erastus-kwaka'] as const
export type RichProfileSlug = (typeof RICH_PROFILE_SLUGS)[number]

export const EVANS_KOCHOO_PROFILE: RichLeaderProfile = {
  slug: 'evans-kochoo',
  name: 'Rev. Evans O. Kochoo',
  nickname: 'The Eagle',
  roleLabel: 'Senior Pastor · The Eagle',
  tagline: 'Defying Gravity, Impacting Generations',
  signatureQuote:
    'The first organized opposition to the Gospel was financed to kill the truth; the Church must also finance a platform on which the truth is revealed.',
  quoteTagline: 'Defying Gravity, Impacting Generations',
  heroPhoto: '/preaching.jpg',
  profilePhoto: '/Rev.Evans2.jpeg',
  visionStatement:
    'To raise, equip, and release Kingdom-minded leaders who will impact generations by living out the uncompromised truth of the Gospel.',
  visionScripture: {
    text: 'One generation will commend Your works to another, and they will tell of Your mighty acts.',
    ref: 'Psalm 145:4',
  },
  profileParagraphs: [
    'Fondly known as "The Eagle," Evans O. Kochoo is a passionate servant of God driven by a dynamic apostolic mandate: to disseminate the pure and unadulterated Gospel of Jesus Christ — without compromise, without dilution.',
    'His teaching ministry is marked by depth and conviction. Through in-depth, thought-provoking exposition of Scripture, he ignites zeal, inspires purpose, and ultimately transforms lives — not just informs minds.',
    'Rev. Kochoo\'s ministry spans diverse platforms — from the pulpit at VOSH Kitengela to schools, colleges, conferences, and media spaces — shaping individuals, leaders, and entire communities with the uncompromising truth of God\'s Word.',
    'He often teaches that truth requires intentional support. Drawing from Matthew 28:12-13 and Luke 8:3, he emphasizes that while opposition once funded falsehood, the Church must faithfully resource platforms where the Gospel truth is boldly revealed.',
    'The name "The Eagle" reflects more than a nickname — it captures a calling: to rise above limitation, to see from a higher vantage point, and to lead others to do the same. This is the heart behind "Defying Gravity, Impacting Generations" — a life and ministry committed to breaking through what holds people back, and raising up a generation that carries the same fire forward.',
  ],
  qualificationsNarrative: [
    'Evans Kochoo is a dedicated church leader and transformational speaker with a solid foundation in biblical studies, theology, and ministry leadership. His academic and ministerial training equip him with both deep scriptural insight and practical pastoral competence.',
    'Beyond traditional theological training, he has sharpened his capacity to guide, inspire, and govern communities with integrity through advanced leadership study. And in a rare combination for ministry leaders of his generation, he has embraced modern tools — merging faith and technology for more effective ministry, leadership, and community impact.',
  ],
  qualifications: [
    'Diploma in Bible & Church Ministry',
    'Diploma in Bible & Theology',
    'Certificate in Biblical Transforming Leadership & Governance',
    'Certificate in Computer Literacy',
  ],
  ministryAreas: [
    { icon: '🏫', title: 'School, College & University Ministry', description: 'Raising a generation rooted in Christ — engaging young minds at the exact stage where worldview is being formed.' },
    { icon: '🔥', title: 'Training & Equipping Ministers/Leaders', description: 'Building capacity for effective Kingdom service — investing in the next wave of leaders, not just the current platform.' },
    { icon: '💍', title: 'Relationship Coaching', description: 'Guiding individuals and couples toward Christ-centered relationships — practical, biblical, and transformative.' },
    { icon: '🎤', title: 'Keynote Speaking & Media Commentary', description: 'Delivering life-changing insights at conferences, workshops, and media platforms — carrying the message beyond the pulpit.' },
    { icon: '🌱', title: 'Mentorship', description: 'Shaping lives through discipleship and guidance — the long, faithful work of walking alongside others.' },
  ],
  coreSkills: [
    'Apostolic Teaching & Preaching',
    'Leadership Training & Development',
    'Inspirational Keynote Speaking',
    'Counseling & Relationship Coaching',
    'Mentorship & Discipleship',
    'Media Communication & Commentary',
  ],
  galleryImages: [
    '/Rev.Evans1.jpeg',
    '/Rev.Evans2.jpeg',
    '/Rev.Evans3.jpeg',
    '/evans-activity-1.jpg',
    '/evans-activity-2.jpg',
    '/evans-activity-3.jpg',
  ],
  cta: {
    title: 'Invite Rev. Evans Kochoo to Speak',
    body: 'For keynote engagements, conferences, leadership training, or media commentary.',
    link: `${ROUTES.joinUs}?subject=Partnership#contact-form`,
    label: 'Request a Speaking Engagement →',
  },
}

export const PASTOR_NANCY_PROFILE: RichLeaderProfile = {
  slug: 'pastor-nancy-sai',
  name: 'Pastor Nancy Sai',
  roleLabel: 'Assistant Pastor',
  tagline: 'Sound Teaching · Servant Leadership · Community Impact',
  signatureQuote: 'Advancing God\'s Kingdom with a heart for people and excellence in ministry.',
  quoteTagline: 'Sound Teaching · Servant Leadership · Community Impact',
  heroPhoto: '/PastorNancySai.jpeg',
  profilePhoto: '/PastorNancySai.jpeg',
  visionStatement:
    'To nurture believers in the Word, equip them for purposeful living, and see families and communities transformed by the love of Christ.',
  visionScripture: {
    text: 'Shepherd the flock of God that is among you, exercising oversight, not under compulsion, but willingly.',
    ref: '1 Peter 5:2',
  },
  profileParagraphs: [
    'Pastor Nancy Sai serves as the Assistant Pastor at VOSH Church International Kitengela. She is passionate about advancing God\'s Kingdom through sound teaching, servant leadership, and community impact.',
    'With a heart for people and excellence in ministry, Pastor Sai is committed to nurturing spiritual growth and empowering believers to fulfill their God-given purpose — in the church, at home, and in the marketplace.',
    'Her ministry emphasizes practical discipleship, pastoral care, and building strong families rooted in Christ. She works alongside the senior leadership team to shepherd the congregation and raise a people who manifest Christ in every sphere of life.',
  ],
  qualificationsNarrative: [
    'Pastor Nancy brings a strong commitment to biblical teaching and pastoral care, with experience in discipleship, women\'s ministry, and community outreach.',
  ],
  qualifications: [
    'Ministry leadership & pastoral care',
    'Biblical teaching & discipleship',
    'Community outreach & evangelism',
    'Women\'s & family ministry',
  ],
  ministryAreas: [
    { icon: '📖', title: 'Sound Teaching', description: 'Grounding believers in the Word of God with clarity, depth, and practical application for everyday life.' },
    { icon: '🤝', title: 'Servant Leadership', description: 'Leading by example with humility, integrity, and a heart that serves people first.' },
    { icon: '🌍', title: 'Community Impact', description: 'Transforming lives and neighborhoods for Christ through outreach, care, and faithful presence.' },
    { icon: '💪', title: 'Nurturing & Empowerment', description: 'Helping believers discover and walk in their God-given purpose with confidence in Christ.' },
    { icon: '🙏', title: 'Pastoral Care & Prayer', description: 'Walking with people through seasons of need, healing, and spiritual growth.' },
  ],
  coreSkills: [
    'Biblical Teaching & Preaching',
    'Pastoral Care & Counseling',
    'Discipleship & Mentorship',
    'Women\'s & Family Ministry',
    'Community Outreach',
    'Worship & Prayer Ministry',
  ],
  galleryImages: [
    '/PastorNancySai.jpeg',
    '/praise-worship.jpg',
    '/preaching.jpg',
    '/sermon-notes.jpg',
    '/woman-praying.jpg',
    '/church-praying.jpg',
  ],
  cta: {
    title: 'Connect with Pastor Nancy',
    body: 'For pastoral care, ministry questions, or partnership opportunities.',
    link: `${ROUTES.joinUs}#contact-form`,
    label: 'Get in Touch →',
  },
}

export const BISHOP_ERASTUS_PROFILE: RichLeaderProfile = {
  slug: 'erastus-kwaka',
  name: 'Bishop Erastus Kwaka',
  roleLabel: 'Bishop · FCPA',
  tagline: 'A Gift to Our Generation · A Life Model · A Blessing',
  signatureQuote: 'A leader whose life speaks — a gift, a model, and a blessing to all who follow Christ.',
  quoteTagline: 'A Gift · A Model · A Blessing',
  heroPhoto: '/bishop-erastus-kwaka.png',
  profilePhoto: '/bishop-erastus-kwaka.png',
  visionStatement:
    'To shepherd with integrity, model Christ-like living before the nations, and be a blessing that raises generations who walk in faith, excellence, and purpose.',
  visionScripture: {
    text: 'Remember your leaders, who spoke the word of God to you. Consider the outcome of their way of life and imitate their faith.',
    ref: 'Hebrews 13:7',
  },
  profileParagraphs: [
    'Bishop Erastus Kwaka is cherished across VOSH Church International Kitengela as a gift to this generation — a leader whose presence strengthens the body of Christ and whose life points others to Jesus.',
    'He is regarded as a life model: a man of faith, dignity, and consistency whose walk with God inspires believers to pursue excellence in ministry, family, and community.',
    'Across the VOSH family, including Nairobi West fellowships, Bishop Kwaka is honored as a blessing — one whose counsel, oversight, and fatherly leadership have enriched countless lives and advanced the Kingdom of God.',
    'As Bishop and Fellow of the Certified Public Accountants board (FCPA), he brings together spiritual authority and professional discipline — demonstrating that faith and excellence belong in the same life.',
    'The church community remains deeply grateful for his sacrificial devotion, integrity, wisdom, and grace in shepherding the body of Christ and strengthening the expansion of God\'s Kingdom.',
  ],
  qualificationsNarrative: [
    'Bishop Erastus Kwaka carries both ministerial calling and professional distinction. His FCPA credential reflects a commitment to integrity, stewardship, and accountable leadership — qualities that enrich his service to the church and community.',
  ],
  qualifications: [
    'Bishop — VOSH Church International',
    'FCPA — Fellow, Certified Public Accountants',
    'Spiritual oversight & pastoral leadership',
    'Mentorship & generational impact',
  ],
  ministryAreas: [
    { icon: '🎁', title: 'A Gift to Our Generation', description: 'A leader raised for such a time as this — strengthening the church and equipping believers to manifest Christ.' },
    { icon: '⭐', title: 'A Life Model', description: 'Living before the congregation and community as an example of faith, integrity, and godly character.' },
    { icon: '🙌', title: 'A Blessing to the Community', description: 'Pouring into lives through counsel, presence, and leadership that uplifts families and the wider body of Christ.' },
    { icon: '🏛️', title: 'Spiritual Oversight', description: 'Providing bishopric leadership, guidance, and covering for ministries under VOSH Church International.' },
    { icon: '🌱', title: 'Mentorship & Legacy', description: 'Investing in leaders and believers so the next generation inherits faith, wisdom, and purpose.' },
  ],
  coreSkills: [
    'Bishopric & Spiritual Oversight',
    'Leadership Modeling',
    'Mentorship & Pastoral Care',
    'Financial Stewardship & Governance',
    'Community Impact',
    'Generational Leadership',
  ],
  galleryImages: ['/bishop-erastus-kwaka.png'],
  cta: {
    title: 'Honor & Connect',
    body: 'For pastoral covering, leadership counsel, or ministry partnership with Bishop Erastus Kwaka.',
    link: `${ROUTES.joinUs}?subject=Pastoral Care#contact-form`,
    label: 'Get in Touch →',
  },
}

export const RICH_LEADER_PROFILES: Record<RichProfileSlug, RichLeaderProfile> = {
  'evans-kochoo': EVANS_KOCHOO_PROFILE,
  'pastor-nancy-sai': PASTOR_NANCY_PROFILE,
  'erastus-kwaka': BISHOP_ERASTUS_PROFILE,
}

export function resolveRichProfileSlug(routeId: string): RichProfileSlug | null {
  const id = routeId.trim().toLowerCase()
  if (id === 'evans-kochoo' || id === '1') return 'evans-kochoo'
  if (id === 'pastor-nancy-sai') return 'pastor-nancy-sai'
  if (id === 'erastus-kwaka') return 'erastus-kwaka'
  if (/evans/i.test(id) && id.includes('kochoo')) return 'evans-kochoo'
  if (/nancy/i.test(id)) return 'pastor-nancy-sai'
  if (/erastus/i.test(id) || /kwaka/i.test(id)) return 'erastus-kwaka'
  return null
}

export function resolveRichProfileFromLeader(leader: PublicLeader): RichProfileSlug | null {
  if (leader.id === 'evans-kochoo' || leader.slug === 'evans-kochoo' || /evans/i.test(leader.name)) {
    return 'evans-kochoo'
  }
  if (leader.id === 'pastor-nancy-sai' || leader.slug === 'pastor-nancy-sai' || /nancy/i.test(leader.name)) {
    return 'pastor-nancy-sai'
  }
  if (
    leader.id === 'erastus-kwaka' ||
    leader.slug === 'erastus-kwaka' ||
    /erastus/i.test(leader.name) ||
    /kwaka/i.test(leader.name)
  ) {
    return 'erastus-kwaka'
  }
  return null
}

export function leaderProfilePath(leader: PublicLeader): string {
  const rich = resolveRichProfileFromLeader(leader)
  if (rich) return `${ROUTES.leadership}/${rich}`
  return `${ROUTES.leadership}/${leader.slug || leader.id}`
}
