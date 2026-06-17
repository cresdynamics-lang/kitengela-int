export type ScriptureTheme =
  | 'identity'
  | 'generational'
  | 'supernatural'
  | 'prayer'
  | 'boldness'
  | 'community'
  | 'giving'
  | 'discipleship'
  | 'leadership'

export type ScriptureVerse = {
  id: string
  theme: ScriptureTheme
  text: string
  reference: string
}

export const SCRIPTURE_THEMES: Record<ScriptureTheme, string> = {
  identity: 'Identity & Purpose',
  generational: 'Generational Impact & Legacy',
  supernatural: 'The Supernatural & Healing',
  prayer: 'Prayer & Presence',
  boldness: 'Boldness & Breakthrough',
  community: 'Community & Outreach',
  giving: 'Giving & Stewardship',
  discipleship: 'Discipleship & Growth',
  leadership: 'Leadership & Calling',
}

export const SCRIPTURE_LIBRARY: ScriptureVerse[] = [
  { id: 'eph-2-10', theme: 'identity', text: 'For we are God\'s handiwork, created in Christ Jesus to do good works.', reference: 'Ephesians 2:10' },
  { id: 'jer-1-5', theme: 'identity', text: 'Before I formed you in the womb I knew you.', reference: 'Jeremiah 1:5' },
  { id: '1pet-2-9', theme: 'identity', text: 'You are a chosen people, a royal priesthood, a holy nation.', reference: '1 Peter 2:9' },
  { id: 'ps-145-4', theme: 'generational', text: 'One generation will commend Your works to another.', reference: 'Psalm 145:4' },
  { id: 'prov-22-6', theme: 'generational', text: 'Train up a child in the way he should go.', reference: 'Proverbs 22:6' },
  { id: '3jn-1-4', theme: 'generational', text: 'I have no greater joy than to hear that my children walk in the truth.', reference: '3 John 1:4' },
  { id: 'isa-46-4', theme: 'generational', text: 'Even to your old age I am He, and to gray hairs I will carry you.', reference: 'Isaiah 46:4' },
  { id: 'ex-15-26', theme: 'supernatural', text: 'I am the Lord who heals you.', reference: 'Exodus 15:26' },
  { id: 'ps-107-20', theme: 'supernatural', text: 'He sent His word and healed them.', reference: 'Psalm 107:20' },
  { id: 'jas-5-14', theme: 'supernatural', text: 'Is anyone among you sick? Let them call the elders... and pray.', reference: 'James 5:14' },
  { id: 'isa-56-7', theme: 'prayer', text: 'For my house will be called a house of prayer for all nations.', reference: 'Isaiah 56:7' },
  { id: 'jer-33-3', theme: 'prayer', text: 'Call to Me and I will answer you.', reference: 'Jeremiah 33:3' },
  { id: 'jas-5-16', theme: 'prayer', text: 'The prayer of a righteous person is powerful and effective.', reference: 'James 5:16' },
  { id: 'gal-5-16', theme: 'boldness', text: 'If you walk in the Spirit, you shall not fulfill the lust of the flesh.', reference: 'Galatians 5:16' },
  { id: 'phil-4-13', theme: 'boldness', text: 'I can do all things through Christ who strengthens me.', reference: 'Philippians 4:13' },
  { id: 'isa-54-17', theme: 'boldness', text: 'No weapon forged against you will prevail.', reference: 'Isaiah 54:17' },
  { id: 'jer-23-29', theme: 'boldness', text: 'Is not My word like fire? Like a hammer that breaks a rock in pieces?', reference: 'Jeremiah 23:29' },
  { id: 'matt-28-19', theme: 'community', text: 'Therefore go and make disciples of all nations.', reference: 'Matthew 28:19' },
  { id: 'matt-25-40', theme: 'community', text: 'Whatever you did for the least of these, you did for Me.', reference: 'Matthew 25:40' },
  { id: 'gal-6-2', theme: 'community', text: 'Carry each other\'s burdens.', reference: 'Galatians 6:2' },
  { id: '2cor-9-7', theme: 'giving', text: 'God loves a cheerful giver.', reference: '2 Corinthians 9:7' },
  { id: 'luke-6-38', theme: 'giving', text: 'Give, and it will be given to you.', reference: 'Luke 6:38' },
  { id: 'prov-3-9', theme: 'giving', text: 'Honor the Lord with your wealth, with the firstfruits of all your produce.', reference: 'Proverbs 3:9' },
  { id: '2pet-1-5', theme: 'discipleship', text: 'Make every effort to add to your faith goodness, and to goodness, knowledge.', reference: '2 Peter 1:5' },
  { id: 'prov-27-17', theme: 'discipleship', text: 'Iron sharpens iron, and one man sharpens another.', reference: 'Proverbs 27:17' },
  { id: '1pet-2-2', theme: 'discipleship', text: 'As newborn babies, desire the pure milk of the word, that you may grow.', reference: '1 Peter 2:2' },
  { id: 'jas-3-1', theme: 'leadership', text: 'Not many of you should become teachers... because teachers will be judged more strictly.', reference: 'James 3:1' },
  { id: '1pet-5-2', theme: 'leadership', text: 'Shepherd the flock of God which is among you.', reference: '1 Peter 5:2' },
  { id: 'matt-20-26', theme: 'leadership', text: 'Whoever wants to become great among you must be your servant.', reference: 'Matthew 20:26' },
  { id: 'eph-2-20', theme: 'identity', text: 'Built on the foundation of the apostles and prophets, with Christ Jesus Himself as the chief cornerstone.', reference: 'Ephesians 2:20' },
]

export function getVersesByTheme(theme: ScriptureTheme): ScriptureVerse[] {
  return SCRIPTURE_LIBRARY.filter((v) => v.theme === theme)
}

export function getPulseVerses(themes?: ScriptureTheme[]): ScriptureVerse[] {
  const pool = themes
    ? SCRIPTURE_LIBRARY.filter((v) => themes.includes(v.theme))
    : SCRIPTURE_LIBRARY
  return pool.slice(0, 8)
}

export function normalizeScriptureRow(row: Record<string, unknown>): ScriptureVerse | null {
  const text = String(row.verse_text ?? row.verseText ?? row.text ?? '').trim()
  const reference = String(row.reference ?? row.ref ?? '').trim()
  if (!text || !reference) return null
  return {
    id: String(row.id ?? `${reference}-${text.slice(0, 12)}`),
    theme: (row.theme as ScriptureTheme) || 'identity',
    text,
    reference,
  }
}
