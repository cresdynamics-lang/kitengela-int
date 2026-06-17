import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import styles from './WhoWeAre.module.css'

const MISSION = {
  title: 'Our Mission',
  body: 'Manifesting Christ in every sphere — disseminating the pure Gospel and demonstrating His power.',
}

const VISION = {
  title: 'Our Vision',
  body: "To be a house of solutions for the nations, raising disciples who carry God's presence everywhere they go.",
}

const MANDATE = {
  title: 'Our Mandate',
  body: 'To disseminate the pure Gospel of Jesus Christ — apostolic, unfiltered, and transformative.',
}

const BELIEFS = [
  {
    title: 'The infallible Word of God',
    summary: 'We believe the Bible is the inspired, authoritative Word of God — our final rule for faith and life.',
  },
  {
    title: 'Salvation through Jesus Christ alone',
    summary: 'We believe salvation is found only through faith in Jesus Christ, His death, and resurrection.',
  },
  {
    title: 'The baptism and gifts of the Holy Spirit',
    summary: 'We believe the Holy Spirit empowers believers for worship, service, and the edification of the Church.',
  },
  {
    title: 'Healing and deliverance as present-day realities',
    summary: 'We believe God still heals, delivers, and transforms lives through the power of the Gospel today.',
  },
  {
    title: 'The Church as the Body of Christ in active mission',
    summary: 'We believe the Church exists to worship God, disciple believers, and reach the world with the Gospel.',
  },
  {
    title: 'The return of Jesus Christ',
    summary: 'We believe in the personal, visible return of Jesus Christ and the hope of eternal life for all who believe.',
  },
]

const FULL_STATEMENT = `VOSH Church International Kitengela affirms the historic Christian faith as revealed in Scripture. We hold to the authority of God's Word, the lordship of Jesus Christ, the work of the Holy Spirit, and the Great Commission entrusted to the Church. We believe in holy living, fervent prayer, compassionate outreach, and the supernatural power of God to save, heal, and restore.`

export default function WhoWeAre() {
  const [heroImage, setHeroImage] = useState('/church-praying.jpg')
  const [outreachImage, setOutreachImage] = useState('/outreach-1.jpeg')
  const [openBelief, setOpenBelief] = useState<number | null>(null)
  const [showFullFaith, setShowFullFaith] = useState(false)
  const [missionText, setMissionText] = useState(MISSION.body)
  const [visionText, setVisionText] = useState(VISION.body)

  useEffect(() => {
    publicApi.getSite().then((res) => {
      if (res.success && res.data) {
        const d = res.data as Record<string, string>
        if (d.missionText) setMissionText(d.missionText)
        if (d.visionText) setVisionText(d.visionText)
      }
    }).catch(() => {})

    publicApi.getPhotos().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const photos = res.data as Array<{ category: string; url: string }>
        const about = photos.filter((p) => p.category === 'about')
        const reach = photos.filter((p) => p.category === 'reach')
        const worship = photos.find((p) => p.category === 'hero' || p.category === 'prayer')
        if (about[0]?.url) setHeroImage(about[0].url)
        else if (worship?.url) setHeroImage(worship.url)
        if (reach[0]?.url) setOutreachImage(reach[0].url)
      }
    }).catch(() => {})
  }, [])

  const toggleBelief = (index: number) => {
    setOpenBelief((prev) => (prev === index ? null : index))
  }

  return (
    <main className={styles.page}>
      <Header />

      {/* SECTION 1 — Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Who We Are</h1>
          <p className={styles.heroTagline}>
            A house of spiritual solutions, where miracles are matched with sound teaching.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Our Story */}
      <section className={styles.story}>
        <div className={styles.container}>
          <ScrollReveal>
            <h2 className={styles.storyHeading}>Rooted in the Word, Rising in Spirit</h2>
            <div className={styles.storyBody}>
              <p>
                VOSH Church International Kitengela is built on the apostolic mandate to disseminate the
                pure Gospel of Jesus Christ. We are a house of spiritual solutions — a place where the
                supernatural meets sound doctrine, and where every person who walks through our doors
                encounters the presence of God.
              </p>
              <p>
                What began as a calling to serve Kitengela has grown into a family of believers committed
                to prayer, the Word, worship, and transformation — in our homes, our streets, and our
                nation.
              </p>
            </div>
            <blockquote className={styles.scripture}>
              &ldquo;Built on the foundation of the apostles and prophets, with Christ Jesus Himself as
              the chief cornerstone.&rdquo;
              <cite>— Ephesians 2:20</cite>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3 — Mission, Vision, Mandate */}
      <section className={styles.mvm}>
        <div className={styles.container}>
          <div className={styles.mvmGrid}>
            <ScrollReveal>
              <article className={styles.mvmCard}>
                <h3 className={styles.mvmLabel}>{MISSION.title}</h3>
                <div className={styles.mvmRule} aria-hidden />
                <p className={styles.mvmText}>{missionText}</p>
              </article>
            </ScrollReveal>
            <ScrollReveal>
              <article className={styles.mvmCard}>
                <h3 className={styles.mvmLabel}>{VISION.title}</h3>
                <div className={styles.mvmRule} aria-hidden />
                <p className={styles.mvmText}>{visionText}</p>
              </article>
            </ScrollReveal>
            <ScrollReveal>
              <article className={styles.mvmCard}>
                <h3 className={styles.mvmLabel}>{MANDATE.title}</h3>
                <div className={styles.mvmRule} aria-hidden />
                <p className={styles.mvmText}>{MANDATE.body}</p>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Statement of Faith */}
      <section className={styles.faith} id="statement-of-faith">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What We Believe</h2>
          <p className={styles.sectionSubtitle}>Statement of Faith — Summary</p>

          <div className={styles.accordion}>
            {BELIEFS.map((belief, index) => {
              const isOpen = openBelief === index
              return (
                <div key={belief.title} className={styles.accordionItem}>
                  <button
                    type="button"
                    className={`${styles.accordionTrigger} ${isOpen ? styles.accordionTriggerOpen : ''}`}
                    onClick={() => toggleBelief(index)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.checkmark} aria-hidden>✓</span>
                    <span>{belief.title}</span>
                    <span className={styles.accordionIcon} aria-hidden>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className={styles.accordionPanel}>
                      <p>{belief.summary}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            className={styles.faithLink}
            onClick={() => setShowFullFaith((v) => !v)}
            aria-expanded={showFullFaith}
          >
            {showFullFaith ? 'Hide Full Statement of Faith ↑' : 'Read Our Full Statement of Faith →'}
          </button>

          {showFullFaith && (
            <div className={styles.fullFaith}>
              <p>{FULL_STATEMENT}</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5 — Love Beyond Our Walls */}
      <section className={styles.outreach}>
        <div className={styles.outreachGrid}>
          <div
            className={styles.outreachImage}
            style={{ backgroundImage: `url(${outreachImage})` }}
            role="img"
            aria-label="Community outreach"
          />
          <div className={styles.outreachCopy}>
            <ScrollReveal direction="right">
              <span className={styles.outreachEyebrow}>Love Beyond Our Walls</span>
              <h2 className={styles.outreachTitle}>Our Mission in Action</h2>
              <p className={styles.outreachText}>
                Our mission extends to the streets of Kitengela and beyond. Through outreach programs,
                we bring hope, healing, and the tangible love of Christ to those who need it most.
              </p>
              <blockquote className={styles.outreachScripture}>
                &ldquo;Therefore go and make disciples of all nations.&rdquo;
                <cite>— Matthew 28:19</cite>
              </blockquote>
              <Link to={ROUTES.joinUs} className={styles.outreachCta}>
                See Our Outreach Work →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Want to experience the House of Solutions for yourself?
          </h2>
          <div className={styles.ctaActions}>
            <Link to={`${ROUTES.joinUs}#plan-visit`} className={styles.ctaPrimary}>
              Plan Your Visit →
            </Link>
            <Link to={ROUTES.joinUs} className={styles.ctaSecondary}>
              View Service Times →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
