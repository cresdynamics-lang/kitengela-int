import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import styles from './MinistryPage.module.css'

type EventItem = {
  id: string
  title: string
  date: string
  time?: string
  venue?: string
  description?: string
}

function formatEventDate(raw: string) {
  try {
    return new Date(raw).toLocaleDateString('en-KE', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return raw
  }
}

function mapEvents(rows: Record<string, unknown>[]): EventItem[] {
  return rows.map((e) => ({
    id: String(e.id),
    title: String(e.title ?? 'Event'),
    date: formatEventDate(String(e.date ?? '')),
    time: String(e.time ?? ''),
    venue: String(e.venue ?? ''),
    description: String(e.description ?? ''),
  }))
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    publicApi.getUpcomingEvents().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setEvents(mapEvents(res.data as Record<string, unknown>[]))
        return
      }
      return publicApi.getEvents().then((all) => {
        if (all.success && Array.isArray(all.data)) {
          setEvents(mapEvents(all.data as Record<string, unknown>[]))
        }
      })
    }).catch(() => {})
  }, [])

  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.hero} style={{ backgroundImage: 'url(/sunday-services.jpeg)' }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Events</h1>
          <p className={styles.heroTagline}>
            Conferences, crusades, special programs, and moments beyond our weekly rhythm.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Upcoming &amp; Special Programs</h2>
          {events.length > 0 ? (
            <div className={styles.cardGrid}>
              {events.map((event) => (
                <ScrollReveal key={event.id}>
                  <article className={styles.card}>
                    <h3>{event.title}</h3>
                    <p><strong>{event.date}</strong>{event.time ? ` · ${event.time}` : ''}</p>
                    {event.venue && <p>{event.venue}</p>}
                    {event.description && <p>{event.description}</p>}
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className={styles.bodyText}>
              Special events and conferences will be announced here. Join us every Sunday for worship
              and check back for upcoming programs.
            </p>
          )}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Don&apos;t miss what God is doing</h2>
          <Link to={`${ROUTES.joinUs}#plan-visit`} className={styles.ctaBtn}>
            Plan Your Visit →
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
