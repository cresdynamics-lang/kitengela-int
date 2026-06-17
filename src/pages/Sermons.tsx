import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SermonCarousel from '@/components/SermonCarousel'
import type { SermonItem } from '@/components/SermonCarousel'
import ScripturePulse from '@/components/ScripturePulse'
import { publicApi } from '@/lib/api'
import { getVersesByTheme } from '@/lib/scripture'
import styles from './MinistryPage.module.css'

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@PstEvansKochoo'

function formatSermonDate(raw?: string) {
  if (!raw) return undefined
  try {
    return new Date(raw).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })
  } catch {
    return undefined
  }
}

export default function Sermons() {
  const [sermons, setSermons] = useState<SermonItem[]>([])
  const [youtubeUrl, setYoutubeUrl] = useState(YOUTUBE_CHANNEL)

  useEffect(() => {
    publicApi.getSermons().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setSermons(
          (res.data as Record<string, unknown>[]).map((s) => ({
            id: String(s.id),
            title: String(s.title ?? 'Sermon'),
            description: String(s.description ?? s.speaker ?? ''),
            date: formatSermonDate(String(s.date ?? s.published_at ?? '')),
            thumbnailUrl: (s.thumbnail_url ?? s.thumbnailUrl) as string | null,
            videoUrl: (s.video_url ?? s.videoUrl) as string | null,
          })),
        )
      }
    }).catch(() => {})

    publicApi.getSermonSource().then((res) => {
      if (res.success && res.data) {
        const url = (res.data as Record<string, unknown>).youtube_playlist_url ?? (res.data as Record<string, unknown>).youtubePlaylistUrl
        if (url) setYoutubeUrl(String(url))
      }
    }).catch(() => {})
  }, [])

  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.hero} style={{ backgroundImage: 'url(/preaching.jpg)' }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>The Word</h1>
          <p className={styles.heroTagline}>
            Sermons, teachings, and messages to feed your faith between Sundays.
          </p>
          <blockquote className={styles.heroScripture}>
            &ldquo;Faith comes from hearing the message, and the message is heard through the word about Christ.&rdquo;
            <cite>— Romans 10:17</cite>
          </blockquote>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Latest Messages</h2>
          <SermonCarousel sermons={sermons} />
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
              Visit YouTube Channel →
            </a>
          </p>
        </div>
      </section>

      <ScripturePulse verses={getVersesByTheme('discipleship')} backgroundImage="/sermon-notes.jpg" />
      <Footer />
    </main>
  )
}
