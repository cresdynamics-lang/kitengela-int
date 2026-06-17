export type NormalizedLive = {
  isLive: boolean
  title: string
  youtubeLiveUrl: string | null
  facebookLiveUrl: string | null
  googleMeetUrl: string | null
  scheduleTime: string | null
}

export function normalizeLiveData(raw: Record<string, unknown> | null | undefined): NormalizedLive | null {
  if (!raw) return null
  const hasStreamUrl = Boolean(
    raw.youtubeLiveUrl || raw.youtube_live_url ||
    raw.facebookLiveUrl || raw.facebook_live_url ||
    raw.googleMeetUrl || raw.google_meet_url
  )
  const isLive = Boolean(raw.isLive ?? raw.is_live) && hasStreamUrl

  return {
    isLive,
    title: (raw.title as string) || 'Sunday Worship Service',
    youtubeLiveUrl: (raw.youtubeLiveUrl as string) ?? (raw.youtube_live_url as string) ?? null,
    facebookLiveUrl: (raw.facebookLiveUrl as string) ?? (raw.facebook_live_url as string) ?? null,
    googleMeetUrl: (raw.googleMeetUrl as string) ?? (raw.google_meet_url as string) ?? null,
    scheduleTime: (raw.scheduleTime as string) ?? (raw.schedule_time as string) ?? null,
  }
}

export function getLiveJoinUrl(live: NormalizedLive | null): string | null {
  if (!live?.isLive) return null
  return live.youtubeLiveUrl || live.facebookLiveUrl || live.googleMeetUrl || null
}

/** Google Calendar link for next Sunday worship at 9:30 AM EAT (UTC+3) */
export function getNextSundayCalendarUrl() {
  const now = new Date()
  const day = now.getDay()
  const daysUntilSunday = day === 0 ? 7 : 7 - day
  const nextSunday = new Date(now)
  nextSunday.setDate(now.getDate() + daysUntilSunday)
  nextSunday.setHours(9, 30, 0, 0)

  const end = new Date(nextSunday)
  end.setHours(13, 0, 0, 0)

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Sunday Worship Service — VOSH Kitengela',
    dates: `${fmt(nextSunday)}/${fmt(end)}`,
    details: 'Join us at VOSH Church International Kitengela. House of Solutions — Manifesting Christ.',
    location: 'Kitengela, Kenya — Along Baraka Road / Treewa Road, Next to Balozi Junior Academy',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
