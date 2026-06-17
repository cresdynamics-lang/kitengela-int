import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LiveStatusBar from '@/components/LiveStatusBar'
import LivePlayer from '@/components/LivePlayer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { getLiveJoinUrl } from '@/lib/live'
import { useLiveStatus } from '@/hooks/useLiveStatus'
import {
  WEEKLY_SERVICES,
  mergeProgramIntoService,
  resolveWeeklyServiceJoin,
  type WeeklyService,
} from '@/lib/servicesPage'
import styles from './Services.module.css'

function normalizePrograms(rows: unknown) {
  if (!Array.isArray(rows)) return []
  return rows.map((p: Record<string, unknown>) => ({
    title: String(p.title ?? ''),
    startTime: (p.startTime ?? p.start_time) as string | undefined,
    start_time: p.start_time as string | undefined,
    endTime: (p.endTime ?? p.end_time) as string | undefined,
    end_time: p.end_time as string | undefined,
    venue: String(p.venue ?? ''),
    description: (p.description as string | null) ?? null,
    url: (p.url ?? p.linkUrl ?? p.link_url) as string | undefined,
    linkUrl: p.linkUrl as string | undefined,
    link_url: p.link_url as string | undefined,
  }))
}

export default function Services() {
  const { live: liveRaw } = useLiveStatus()
  const live = liveRaw
  const [showPlayer, setShowPlayer] = useState(false)
  const [heroImage, setHeroImage] = useState('/sunday-services.jpeg')
  const [adminLinks, setAdminLinks] = useState<any[]>([])
  const [programs, setPrograms] = useState<ReturnType<typeof normalizePrograms>>([])
  const [services, setServices] = useState<WeeklyService[]>(WEEKLY_SERVICES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      publicApi.getLinks().then((res) => {
        if (res.success && Array.isArray(res.data)) setAdminLinks(res.data)
      }),
      publicApi.getWeeklyPrograms().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const normalized = normalizePrograms(res.data)
          setPrograms(normalized)
          setServices(
            WEEKLY_SERVICES.map((s) => mergeProgramIntoService(s, normalized)).sort(
              (a, b) => a.sortOrder - b.sortOrder,
            ),
          )
        }
      }),
      publicApi.getPhotos().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const photo = (res.data as { category?: string; url?: string }[]).find(
            (p) => p.category === 'services' && p.url,
          )
          if (photo?.url) setHeroImage(photo.url)
        }
      }),
    ]).finally(() => setLoading(false))
  }, [])

  const handleLiveJoin = () => {
    const url = getLiveJoinUrl(live)
    if (live?.youtubeLiveUrl) {
      setShowPlayer(true)
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const onlineLinks = adminLinks.filter((l) => l.url?.startsWith('http'))

  return (
    <main className={styles.page}>
      <Header />

      {/* SECTION 1 — Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Church Services in Kitengela</h1>
          <p className={styles.heroTagline}>
            Join us for worship, prayer, and fellowship throughout the week.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Live Status Banner */}
      <LiveStatusBar live={live} onJoinLive={handleLiveJoin} />

      {/* SECTION 3 — Weekly Schedule */}
      <section className={styles.schedule}>
        <div className={styles.container}>
          {loading ? (
            <p className={styles.loading}>Loading schedule…</p>
          ) : (
            <div className={styles.scheduleList}>
              {services.map((service) => {
                const join = resolveWeeklyServiceJoin(service, adminLinks, programs, live)
                return (
                  <ScrollReveal key={service.id}>
                    <article className={styles.scheduleCard}>
                      <h2 className={styles.scheduleTitle}>{service.title}</h2>
                      <p className={styles.scheduleMeta}>
                        {service.time} | {service.venue}
                      </p>
                      <p className={styles.scheduleDesc}>{service.description}</p>
                      {join.showLiveStreamNote && (
                        <p className={styles.liveNote}>Live Stream Available</p>
                      )}
                      {join.external ? (
                        <a
                          href={join.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.joinBtn}
                        >
                          {service.joinLabel} →
                        </a>
                      ) : (
                        <Link to={join.href} className={styles.joinBtn}>
                          {service.joinLabel} →
                        </Link>
                      )}
                    </article>
                  </ScrollReveal>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 — What to Expect */}
      <section className={styles.expect}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>First Time Joining Us?</h2>
          <div className={styles.expectGrid}>
            <div className={styles.expectCard}>
              <h3>What to Wear</h3>
              <p>Come as you are — casual or formal, you belong here.</p>
            </div>
            <div className={styles.expectCard}>
              <h3>What to Expect</h3>
              <p>Worship, the Word, and a warm welcome. Services run about 90 minutes.</p>
            </div>
            <div className={styles.expectCard}>
              <h3>For Your Kids</h3>
              <p>
                Children&apos;s ministry is available during Sunday Worship. Friendly ushers
                will guide your family when you arrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Online links */}
      <section className={styles.onlineLinks} id="online-links">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Online Service Links</h2>
          {onlineLinks.length > 0 ? (
            <ul className={styles.linksList}>
              {onlineLinks.map((link) => (
                <li key={link.id ?? link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title || link.description || link.url}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.loading}>
              Online links are updated from the admin panel. Check back soon or visit{' '}
              <Link to={ROUTES.joinUs}>Join Us</Link> for service times.
            </p>
          )}
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Can&apos;t make it in person? Join us online — every service, every week.
          </h2>
          <a href="#online-links" className={styles.ctaBtn}>
            View All Online Links →
          </a>
        </div>
      </section>

      <Footer />

      {showPlayer && live?.youtubeLiveUrl && (
        <LivePlayer url={live.youtubeLiveUrl} onClose={() => setShowPlayer(false)} />
      )}
    </main>
  )
}
