import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Carousel from '@/components/Carousel'
import Header from '@/components/Header'
import ScrollReveal from '@/components/ScrollReveal'
import Services from '@/components/Services'
import CoreValues from '@/components/CoreValues'
import Footer from '@/components/Footer'
import { publicApi } from '@/lib/api'
import styles from './Home.module.css'

const defaultCarouselImages = [
  { id: 0, title: "Welcome to VOSH Church International — Kitengela Branch", image: "/Carousel1.jpg", description: "We are committed to teaching the Word, building strong faith, and transforming lives through Christ." },
  { id: 1, title: "Voice Of Salvation And Healing Church Int'l – Kitengela", image: "/Carousel2.jpg", description: "A House of Solutions — Manifesting Christ in Our Community" },
  { id: 2, title: "Join Us for Worship and Fellowship!", image: "/Carousell3.jpeg", description: "Experience the power of God's Word and fellowship with believers", location: "Along Baraka Road / Treewa Road, Next to Balozi Junior Academy, Kitengela" },
  { id: 3, title: "We're Here for You!", image: "/Carousel4.jpg", description: "A community committed to prayer, stewardship, holiness, advocacy, and unity", phoneNumbers: ["+254 722 566 399", "+254 720 276 162", "+254 720 977 189"] },
  { id: 4, title: "Join Us This Sunday!", image: "/midweekservicefriday.jpeg", description: "Experience powerful worship and teaching", services: ["Bible Study: Sunday 8:00 AM - 9:00 AM", "SB1 Service: Sunday 9:00 AM - 10:30 AM", "Word Manifest: Sunday 10:30 AM - 1:00 PM", "Discipleship: Sunday 2:30 PM - 4:00 PM"] },
  { id: 5, title: "Connect With Us Today!", image: "/onlineconnectthurday.jpeg", description: "Join us for worship, prayer, and fellowship", services: ["Bible Study: Sunday 8:00 AM - 9:00 AM", "SB1 Service: Sunday 9:00 AM - 10:30 AM", "Word Manifest: Sunday 10:30 AM - 1:00 PM", "Discipleship: Sunday 2:30 PM - 4:00 PM"] }
]

const beforeServicesCarouselImages = [
  { id: 10, title: "Morning Prayers", image: "/Morningprayers.jpg", description: "Start your day in God's presence. Join our morning prayers and be refreshed." },
  { id: 11, title: "Church in Prayer", image: "/churchpraying.jpg", description: "Corporate prayer and intercession—together we seek His face." },
  { id: 12, title: "Praise & Worship", image: "/praiseandworshipdancing.jpg", description: "Celebrate the Lord with joy. Experience praise and worship that lifts the spirit." },
  { id: 13, title: "Preaching the Word", image: "/preachinghour.jpg", description: "Sound teaching that transforms lives. Tune in to the preaching hour." },
  { id: 14, title: "Sermon & Note-Taking", image: "/sermontimenoteteking.jpg", description: "Grow in the Word. Take notes and apply the message to your life." }
]

// Replace with your YouTube video ID or full embed URL for Wednesday Online Prayers (e.g. 'dQw4w9WgXcQ' or 'https://www.youtube.com/embed/dQw4w9WgXcQ')
const WEDNESDAY_PRAYER_VIDEO_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WEDNESDAY_PRAYER_VIDEO_URL) || ''
function getWednesdayVideoEmbedUrl(url: string) {
  if (!url) return ''
  const trimmed = url.trim()
  const idMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (idMatch) return `https://www.youtube.com/embed/${idMatch[1]}`
  if (trimmed.includes('youtube.com/embed/')) return trimmed
  return trimmed.length === 11 ? `https://www.youtube.com/embed/${trimmed}` : ''
}

export default function Home() {
  const [carouselImages] = useState(defaultCarouselImages)
  const [services, setServices] = useState<any[]>([])
  const [sundaySermon, setSundaySermon] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liveStreamUrl, setLiveStreamUrl] = useState<string | null>(null)
  const [sectionTick, setSectionTick] = useState(0)

  useEffect(() => {
    publicApi.getLive().then((r) => {
      if (r.success && r.data) {
        const d = r.data as any
        setLiveStreamUrl(d.youtubeLiveUrl || d.facebookLiveUrl || d.googleMeetUrl || null)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    Promise.allSettled([
      publicApi.getSermons().then((r) => r.success && Array.isArray(r.data) && r.data.length > 0 ? r.data[0] : null),
      publicApi.getWeeklyPrograms().then((r) => {
        if (!r.success || !Array.isArray(r.data)) return []
        return (r.data as any[]).filter((p: any) => p.isActive !== false).map((p: any) => ({
          id: p.id,
          name: p.title || p.name || '',
          time: p.startTime && p.endTime ? `${p.startTime} - ${p.endTime}` : p.startTime || p.time || '',
          day: p.day || '',
          description: p.description || ''
        }))
      })
    ]).then(([sermonResult, programsResult]) => {
      const sermon = sermonResult.status === 'fulfilled' ? sermonResult.value : null
      const prog = programsResult.status === 'fulfilled' ? programsResult.value : []
      setSundaySermon(sermon)
      setServices(prog)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSectionTick((prev) => prev + 1)
    }, 7000)
    return () => window.clearInterval(interval)
  }, [])

  const midweekHref = getWednesdayVideoEmbedUrl(WEDNESDAY_PRAYER_VIDEO_URL) || liveStreamUrl || '/services'

  return (
    <main>
      <Header />
      <Carousel images={carouselImages} />
      {sundaySermon && (
        <ScrollReveal direction="left">
          <section className={styles.sundaySermonSection}>
            <div className={styles.sundaySermonInner}>
              <div className={styles.sundaySermonContent}>
                <h1 className={styles.sundaySermonHeading}>{sundaySermon.title}</h1>
                {sundaySermon.description && <p className={styles.sundaySermonParagraph}>{sundaySermon.description}</p>}
                {sundaySermon.speaker && <p className={styles.sundaySermonSpeakers}>{sundaySermon.speaker.includes(',') ? 'Speakers: ' : 'Speaker: '}{sundaySermon.speaker}</p>}
                <div className={styles.sundaySermonActions}>
                  <a
                    href={liveStreamUrl || '/services'}
                    target={liveStreamUrl ? '_blank' : undefined}
                    rel={liveStreamUrl ? 'noopener noreferrer' : undefined}
                    className={styles.sundaySermonBtn}
                  >
                    Join Us Live
                  </a>
                </div>
              </div>
              {sundaySermon.thumbnailUrl && <div className={styles.sundaySermonPoster}><img src={sundaySermon.thumbnailUrl} alt={sundaySermon.title} /></div>}
            </div>
          </section>
        </ScrollReveal>
      )}
      <ScrollReveal direction="right">
        <section className={styles.joinSection}>
          <div className={styles.joinInner}>
            <h2 className={styles.joinTitle}>Join Us Online</h2>
            <p className={styles.joinSubtitle}>Experience worship and prayer from anywhere</p>
            <div className={styles.joinButtons}>
              <a
                href={liveStreamUrl || '/services'}
                target={liveStreamUrl ? '_blank' : undefined}
                rel={liveStreamUrl ? 'noopener noreferrer' : undefined}
                className={`${styles.joinButton} ${styles.joinButtonRed}`}
              >
                <span>▶️</span> Watch Live
              </a>
              <a
                href={liveStreamUrl || '/services'}
                target={liveStreamUrl ? '_blank' : undefined}
                rel={liveStreamUrl ? 'noopener noreferrer' : undefined}
                className={`${styles.joinButton} ${styles.joinButtonGold}`}
              >
                <span>🙏</span> Join Prayer
              </a>
            </div>
            <Link to="/services" className={styles.planVisitLink}>Plan Your Visit / Join Us This Sunday →</Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Second carousel – before Services */}
      <ScrollReveal direction="left">
        <section className={styles.secondCarouselWrap}>
          <h2 className={styles.secondCarouselTitle}>Life at VOSH — Prayers, Worship & Word</h2>
          <Carousel images={beforeServicesCarouselImages} />
        </section>
      </ScrollReveal>
      {[
        {
          id: 'midweek',
          badge: 'Midweek',
          title: 'Wednesday Online Prayers',
          text: 'Join us every Wednesday for a time of corporate prayer and intercession. Connect online from wherever you are and experience the power of agreement in prayer.',
          images: ['/churchpraying.jpg', '/midweekwednesday.jpeg', '/Morningprayers.jpg'],
          primaryLabel: 'Join Wednesday Prayers ->',
          primaryHref: midweekHref,
          primaryExternal: midweekHref.startsWith('http'),
          reverse: false,
        },
        {
          id: 'weekly',
          badge: 'Weekly',
          title: 'Friday Night Service',
          text: 'End your week in worship and the Word. Our Friday night gatherings are a time for refreshing, fellowship, and encountering God together.',
          images: ['/midweekservicefriday.jpeg', '/praiseandworshipdancing.jpg', '/preachinghour.jpg'],
          primaryLabel: 'View Times & Venue ->',
          primaryHref: '/services',
          reverse: true,
        },
        {
          id: 'sunday',
          badge: 'Sunday',
          title: 'Sunday Worship & Word',
          text: 'Bible Study, SB1 Service, Word Manifest, and Discipleship all in one place. Come as you are and experience a house of solutions, manifesting Christ.',
          images: ['/sundayservices.jpeg', '/preachinghour.jpg', '/biblestudysundaymorning.jpeg'],
          primaryLabel: 'Plan Your Visit ->',
          primaryHref: '/services',
          reverse: false,
        },
        {
          id: 'connect',
          badge: 'Connect',
          title: 'Connect With Us & Give',
          text: 'Stay connected through our online platforms. Your giving supports ministry, the building of our sanctuary, and outreach. Every gift makes a difference.',
          images: ['/handstogether unity.jpg', '/onlineconnectthurday.jpeg', '/latestoutreach.jpeg'],
          primaryLabel: 'Give & Support ->',
          primaryHref: '/give',
          secondaryLabel: 'Contact Us',
          secondaryHref: '/contact',
          reverse: true,
        },
        {
          id: 'prayer',
          badge: 'Prayer',
          title: 'Prayer From the Heart',
          text: 'When we pray from the heart, God hears. Join a community that values genuine, Spirit-led prayer and intercession for one another and our nation.',
          images: ['/fromheartprayesr.jpg', '/churchpraying.jpg', '/womanpraying.jpg'],
          primaryLabel: 'Join in Prayer ->',
          primaryHref: '/services',
          reverse: true,
        },
        {
          id: 'devotion',
          badge: 'Devotion',
          title: 'Personal & Corporate Devotion',
          text: 'Whether alone or together, our church is built on a foundation of prayer. Find space for personal devotion and corporate prayer throughout the week.',
          images: ['/womanpraying.jpg', '/manpraying.jpg', '/Morningprayers.jpg'],
          primaryLabel: 'Find a Service ->',
          primaryHref: '/services',
          reverse: false,
        },
        {
          id: 'mission',
          badge: 'Mission',
          title: 'Mission & Outreach',
          text: 'We take the Gospel beyond our walls. Through outreach, evangelism, and community impact, we are manifesting Christ in Kitengela and beyond.',
          images: ['/latestoutreach.jpeg', '/latestoutrach.jpeg', '/mission and vission.jpeg'],
          primaryLabel: 'Our Mission ->',
          primaryHref: '/about',
          reverse: true,
        },
      ].map((section, sectionIdx) => {
        const imageIndex = sectionTick % section.images.length
        return (
          <div key={section.id}>
            <ScrollReveal direction={section.reverse ? 'right' : 'left'}>
              <section className={`${styles.storySection} ${section.reverse ? styles.storySectionReverse : ''}`}>
                <div className={styles.storyBackgroundLayer}>
                  {section.images.map((image, idx) => (
                    <img
                      key={`${section.id}-${image}`}
                      src={image}
                      alt={section.title}
                      loading={sectionIdx === 0 && idx === imageIndex ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={sectionIdx === 0 && idx === imageIndex ? 'high' : 'low'}
                      className={`${styles.storyBackgroundImage} ${idx === imageIndex ? styles.storyBackgroundImageActive : ''}`}
                    />
                  ))}
                </div>
                <div className={styles.storyOverlay} />
                <div className={styles.storyContent}>
                  <span className={styles.bannerBadge}>{section.badge}</span>
                  <h2 className={styles.bannerTitle}>{section.title}</h2>
                  <p className={styles.bannerText}>{section.text}</p>
                  {section.primaryExternal ? (
                    <a href={section.primaryHref} target="_blank" rel="noopener noreferrer" className={styles.bannerCta}>
                      {section.primaryLabel}
                    </a>
                  ) : (
                    <Link to={section.primaryHref} className={styles.bannerCta}>
                      {section.primaryLabel}
                    </Link>
                  )}
                  {section.secondaryHref && section.secondaryLabel && (
                    <Link to={section.secondaryHref} className={`${styles.bannerCta} ${styles.outline}`} style={{ marginLeft: '0.75rem' }}>
                      {section.secondaryLabel}
                    </Link>
                  )}
                </div>
              </section>
            </ScrollReveal>
            {sectionIdx < 6 && <div className={styles.storyGap} />}
          </div>
        )
      })}

      {loading ? <div className={styles.loadingText}>Loading services...</div> : <ScrollReveal direction="left"><Services services={services} /></ScrollReveal>}
      <ScrollReveal direction="right"><CoreValues /></ScrollReveal>
      <Footer />
    </main>
  )
}

