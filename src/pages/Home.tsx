import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import CoreValues from '@/components/CoreValues'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import LivePlayer from '@/components/LivePlayer'
import HeroCarousel from '@/components/HeroCarousel'
import ScripturePulse from '@/components/ScripturePulse'
import GenerationsCarousel from '@/components/GenerationsCarousel'
import TestimonyCarousel from '@/components/TestimonyCarousel'
import type { TestimonyItem } from '@/components/TestimonyCarousel'
import SermonCarousel from '@/components/SermonCarousel'
import type { SermonItem } from '@/components/SermonCarousel'
import { publicApi } from '@/lib/api'
import { ROUTES, serviceDetailPath } from '@/lib/routes'
import { getLiveJoinUrl, getNextSundayCalendarUrl } from '@/lib/live'
import { useLiveStatus } from '@/hooks/useLiveStatus'
import {
  HOME_SERVICE_CARDS,
  resolveServiceJoinUrl,
  type HomeServiceCard,
} from '@/lib/homeServices'
import {
  DEFAULT_HOME_HERO_SLIDES,
  DEFAULT_GENERATION_GROUPS,
  normalizeHeroSlide,
  normalizeGenerationGroup,
  type HeroSlide,
} from '@/lib/carousels'
import { getPulseVerses, normalizeScriptureRow } from '@/lib/scripture'
import styles from './Home.module.css'

const PILLARS = [
  {
    tag: 'ROOTED IN THE WORD',
    title: 'Rising in Spirit',
    body: 'Sound teaching matched with the move of the Holy Spirit.',
    scripture: '"Built on the foundation of the apostles and prophets." — Ephesians 2:20',
    cta: 'Discover Our Roots',
    link: ROUTES.whoWeAre,
    image: '/mission-vision.jpeg',
    photoCategory: 'foundation',
  },
  {
    tag: 'LOVE BEYOND OUR WALLS',
    title: 'Our Mission in Action',
    body: 'Outreach that brings hope, healing, and the tangible love of Christ to Kitengela and beyond.',
    scripture: '"Go and make disciples of all nations." — Matthew 28:19',
    cta: 'See Our Outreach',
    link: ROUTES.outreach,
    image: '/outreach-1.jpeg',
    photoCategory: 'reach',
  },
  {
    tag: 'EXPERIENCE THE SUPERNATURAL',
    title: 'House of Prayer',
    body: 'Worship, prayer, and divine encounters in the presence of God.',
    scripture: '"For my house will be called a house of prayer for all nations." — Isaiah 56:7',
    cta: 'View Service Times',
    link: ROUTES.services,
    image: '/praise-worship.jpg',
    photoCategory: 'prayer',
  },
  {
    tag: 'IMPACTING GENERATIONS',
    title: 'Next Generation',
    body: 'Equipping youth, teens, and young adults to carry the fire forward.',
    scripture: '"Train up a child in the way he should go." — Proverbs 22:6',
    cta: 'Explore Next Generation',
    link: ROUTES.nextGeneration,
    image: '/whatsapp-12.jpeg',
    photoCategory: 'youth',
  },
]

const FALLBACK_TESTIMONIES: TestimonyItem[] = [
  {
    id: '1',
    name: 'Church Member',
    quote: 'I came to VOSH broken and searching. Today I\'m walking in healing and purpose.',
    memberSince: 'Member since 2023',
  },
]

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@PstEvansKochoo'

function ServiceScheduleCard({
  card,
  joinUrl,
}: {
  card: HomeServiceCard
  joinUrl: string | null
}) {
  return (
    <div className={styles.scheduleCard}>
      <h3 className={styles.scheduleCardTitle}>{card.title}</h3>
      <p className={styles.scheduleCardTime}>{card.time}</p>
      <p className={styles.scheduleCardVenue}>
        {card.venue}
        {card.platform ? ` · Platform: ${card.platform}` : ''}
      </p>
      {joinUrl ? (
        <a href={joinUrl} target="_blank" rel="noopener noreferrer" className={styles.scheduleCardBtn}>
          {card.joinLabel} →
        </a>
      ) : (
        <Link to={serviceDetailPath(card.slug)} className={styles.scheduleCardBtn}>
          {card.joinLabel} →
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const { live } = useLiveStatus()
  const [showPlayer, setShowPlayer] = useState(false)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HOME_HERO_SLIDES)
  const [pillarImages, setPillarImages] = useState(PILLARS.map((p) => p.image))
  const [generationGroups, setGenerationGroups] = useState(DEFAULT_GENERATION_GROUPS)
  const [adminLinks, setAdminLinks] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [sermons, setSermons] = useState<SermonItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonyItem[]>(FALLBACK_TESTIMONIES)
  const [youtubeChannel, setYoutubeChannel] = useState(YOUTUBE_CHANNEL)
  const [scheduleLoading, setScheduleLoading] = useState(true)

  const liveJoinUrl = getLiveJoinUrl(live)
  const calendarUrl = getNextSundayCalendarUrl()

  useEffect(() => {
    Promise.allSettled([
      publicApi.getCarouselSlides('home').then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const parsed = (res.data as Record<string, unknown>[])
            .map(normalizeHeroSlide)
            .filter(Boolean) as HeroSlide[]
          if (parsed.length) setHeroSlides(parsed.slice(0, 4))
        }
      }),
      publicApi.getGenerationGroups().then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const parsed = (res.data as Record<string, unknown>[])
            .map(normalizeGenerationGroup)
            .filter(Boolean)
          if (parsed.length) setGenerationGroups(parsed as typeof DEFAULT_GENERATION_GROUPS)
        }
      }),
      publicApi.getPhotos().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const photos = res.data as { category?: string; url?: string }[]
          setPillarImages(
            PILLARS.map((pillar) => {
              const catPhoto = photos.find((p) => p.category === pillar.photoCategory)
              return catPhoto?.url ?? pillar.image
            }),
          )
        }
      }),
      publicApi.getLinks().then((res) => {
        if (res.success && Array.isArray(res.data)) setAdminLinks(res.data)
      }),
      publicApi.getWeeklyPrograms().then((res) => {
        if (res.success && Array.isArray(res.data)) setPrograms(res.data)
      }),
      publicApi.getSermons().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setSermons(
            (res.data as Record<string, unknown>[])
              .filter((s) => s.video_url || s.videoUrl)
              .slice(0, 8)
              .map((s) => ({
                id: String(s.id),
                title: String(s.title || 'Sermon'),
                thumbnailUrl: (s.thumbnail_url ?? s.thumbnailUrl) as string | null,
                videoUrl: (s.video_url ?? s.videoUrl) as string | null,
              })),
          )
        }
      }),
      publicApi.getTestimonials().then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTestimonials(
            (res.data as Record<string, unknown>[]).map((t) => ({
              id: String(t.id),
              name: String(t.name ?? 'Member'),
              quote: String(t.quote ?? t.content ?? ''),
              photoUrl: (t.photo_url ?? t.photoUrl) as string | null,
              memberSince: String(t.member_since ?? t.memberSince ?? ''),
            })).filter((t) => t.quote),
          )
        }
      }),
      publicApi.getSermonSource().then((res) => {
        if (res.success && res.data) {
          const url = (res.data as Record<string, unknown>).youtube_playlist_url ?? (res.data as Record<string, unknown>).youtubePlaylistUrl
          if (url) setYoutubeChannel(String(url))
        }
      }),
    ]).finally(() => setScheduleLoading(false))
  }, [])

  const handleLiveAction = () => {
    if (live?.isLive && liveJoinUrl) {
      if (live.youtubeLiveUrl) {
        setShowPlayer(true)
      } else {
        window.open(liveJoinUrl, '_blank', 'noopener,noreferrer')
      }
    } else {
      window.open(calendarUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const liveActions = (
    <div className={styles.heroActions}>
      <Link to={`${ROUTES.joinUs}#plan-visit`} className={styles.goldBtn}>
        Plan Your Visit
      </Link>
      <button
        type="button"
        onClick={handleLiveAction}
        className={`${styles.liveBtn} ${live?.isLive ? styles.liveBtnActive : ''}`}
      >
        {live?.isLive ? (
          <>
            <span className={styles.liveDot} aria-hidden />
            LIVE NOW — Tap to Join
          </>
        ) : (
          'Next Service: Sunday 9:30 AM — Set Reminder'
        )}
      </button>
    </div>
  )

  return (
    <main className={styles.main}>
      <Header />

      <HeroCarousel slides={heroSlides} liveSlot={liveActions} />

      <section className={styles.liveBar} aria-live="polite">
        {live?.isLive ? (
          <div className={styles.liveBarInner}>
            <span className={styles.liveBarStatus}>
              <span className={styles.liveDot} aria-hidden />
              LIVE NOW: {live.title}
            </span>
            <button type="button" onClick={handleLiveAction} className={styles.liveBarAction}>
              Join Now →
            </button>
          </div>
        ) : (
          <div className={styles.liveBarInner}>
            <div className={styles.liveBarNext}>
              <span>🕐 NEXT SERVICE: Sunday Worship — 9:30 AM</span>
              <span className={styles.liveBarMeta}>
                Kitengela, Baraka Road | Online: Join via website
              </span>
            </div>
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className={styles.liveBarAction}>
              Add to Calendar
            </a>
          </div>
        )}
      </section>

      <section className={styles.welcome}>
        <div className={styles.container}>
          <ScrollReveal>
            <h2 className={styles.welcomeTitle}>Welcome to VOSH Church International Kitengela</h2>
            <p className={styles.welcomeText}>
              A Spirit-filled Pentecostal church in Kitengela, Kenya — a Christ-centered family built on the Word,
              prayer, worship, and community transformation. Whether you&apos;re seeking healing,
              answers, or simply a place to belong along Baraka Road — you have found a home here.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <ScripturePulse verses={getPulseVerses(['boldness', 'prayer', 'identity'])} backgroundImage="/praise-worship.jpg" />

      <section className={styles.pillars}>
        <div className={styles.container}>
          <div className={styles.pillarsGrid}>
            {PILLARS.map((pillar, index) => (
              <ScrollReveal key={pillar.tag} direction={index % 2 === 0 ? 'left' : 'right'}>
                <article
                  className={styles.pillarCard}
                  style={{ backgroundImage: `url(${pillarImages[index]})` }}
                >
                  <div className={styles.pillarOverlay} />
                  <div className={styles.pillarContent}>
                    <span className={styles.pillarTag}>{pillar.tag}</span>
                    <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                    <p className={styles.pillarBody}>{pillar.body}</p>
                    <p className={styles.pillarScripture}>{pillar.scripture}</p>
                    <Link to={pillar.link} className={styles.pillarCta}>
                      {pillar.cta} →
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.generations}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Impacting Every Generation</h2>
          <GenerationsCarousel groups={generationGroups} />
        </div>
      </section>

      <section className={styles.schedule} id="services">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Join Us This Week</h2>
            <p className={styles.sectionSubtitle}>
              Worship, prayer, and fellowship — in person and online.
            </p>
          </div>
          {scheduleLoading ? (
            <p className={styles.loadingText}>Loading schedule…</p>
          ) : (
            <div className={styles.scheduleGrid}>
              {HOME_SERVICE_CARDS.map((card) => (
                <ServiceScheduleCard
                  key={card.id}
                  card={card}
                  joinUrl={resolveServiceJoinUrl(card, adminLinks, programs)}
                />
              ))}
            </div>
          )}
          <div className={styles.scheduleFooter}>
            <Link to={ROUTES.services} className={styles.outlineBtn}>
              View Full Service Schedule →
            </Link>
          </div>
        </div>
      </section>

      <CoreValues />

      <section className={styles.testimonies}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Stories of Transformation</h2>
          <TestimonyCarousel testimonials={testimonials} />
          <p className={styles.testimonyLink}>
            <Link to={ROUTES.testimonies}>Read more testimonies →</Link>
          </p>
        </div>
      </section>

      <section className={styles.media}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Catch Up on the Word</h2>
          <SermonCarousel sermons={sermons} />
          <p className={styles.mediaFooter}>
            <Link to={ROUTES.sermons} className={styles.outlineBtn}>
              Browse All Sermons →
            </Link>
            <a href={youtubeChannel} target="_blank" rel="noopener noreferrer" className={styles.youtubeLink}>
              YouTube Channel →
            </a>
          </p>
        </div>
      </section>

      <section className={styles.giving}>
        <div className={styles.container}>
          <h2 className={styles.givingTitle}>Partnering for Transformation</h2>
          <blockquote className={styles.givingScripture}>
            &ldquo;God loves a cheerful giver.&rdquo; — 2 Corinthians 9:7
          </blockquote>
          <p className={styles.givingText}>
            Your support enables us to reach more lives with the Gospel.
          </p>
          <Link to={ROUTES.give} className={styles.givingBtn}>
            Give Now →
          </Link>
        </div>
      </section>

      <Footer />

      {showPlayer && live?.youtubeLiveUrl && (
        <LivePlayer url={live.youtubeLiveUrl} onClose={() => setShowPlayer(false)} />
      )}
    </main>
  )
}
