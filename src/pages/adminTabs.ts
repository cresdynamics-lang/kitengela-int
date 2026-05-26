export type TabKey =
  | 'programs'
  | 'events'
  | 'live'
  | 'sermons'
  | 'links'
  | 'admins'
  | 'photos'
  | 'carousel-manager'
  | 'testimonials'
  | 'leaders'

export const adminTabs: { key: TabKey; label: string }[] = [
  { key: 'programs', label: 'Programs' },
  { key: 'events', label: 'Events' },
  { key: 'live', label: 'Live Stream' },
  { key: 'sermons', label: 'Sermons' },
  { key: 'leaders', label: 'Leaders' },
  { key: 'links', label: 'Links' },
  { key: 'admins', label: 'Admin Rights' },
  { key: 'photos', label: 'Photos' },
  { key: 'carousel-manager', label: 'Carousels' },
  { key: 'testimonials', label: 'Testimonials' },
]
