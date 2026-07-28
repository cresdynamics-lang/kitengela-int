import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { MISSION, MOTTO, VISION } from '@/lib/brand'
import styles from './WhoWeAre.module.css'

const MISSION_BLOCK = {
  title: 'Our Mission',
  body: MISSION,
}

const VISION_BLOCK = {
  title: 'Our Vision',
  body: VISION,
}

const MOTTO_BLOCK = {
  title: 'Our Motto',
  body: MOTTO,
}

const BELIEFS = [
  {
    title: 'The Bible',
    summary:
      'The Word of God — sixty-six books of the Old and New Testament, inspired by the Spirit, without error in the original manuscripts, and our final authority in faith and practice.',
  },
  {
    title: 'One Eternal God',
    summary:
      'The Creator of all things — Holy and Sovereign — existing in three eternal persons: the Father, the Son, and the Holy Spirit, in one divine perfection. His name is Jehovah.',
  },
  {
    title: 'Jesus Christ',
    summary:
      'We believe in the absolute deity of Jesus Christ — His virgin birth, sinless life, substitutionary death, bodily resurrection, ascension, mediatorial ministry, and personal return.',
  },
  {
    title: 'The Holy Spirit',
    summary:
      'We believe in the deity and personality of the Holy Spirit who convicts, regenerates, sanctifies, illuminates, and comforts those who believe in Jesus Christ.',
  },
  {
    title: 'Salvation of Sinners',
    summary:
      'Salvation is by grace through repentance and faith in the finished work of the cross — remission of sins and new life in Christ.',
  },
  {
    title: 'Water Baptism & Holy Communion',
    summary:
      'We practice water baptism by immersion in the Name of the Father, Son, and Holy Spirit, and the Lord’s Supper for all believers as often as we meet.',
  },
  {
    title: 'The Spirit-Filled Life',
    summary:
      'We believe in the Spirit-filled life with the evidence of speaking in tongues — empowered to be witnesses of the Lord Jesus Christ.',
  },
  {
    title: 'Divine Healing',
    summary:
      'We believe in the healing of body, soul, and mind through faith in Jesus Christ, as practiced in the early Church.',
  },
  {
    title: 'Evangelism & The Church',
    summary:
      'We obey the Great Commission to preach the Gospel to every creature. The local church is a body of baptized believers under the Lordship of Christ.',
  },
  {
    title: 'Resurrection & Eternal Life',
    summary:
      'We believe in the resurrection of the dead and eternal life — and that this world will give way to a new heaven and a new earth.',
  },
]

const FULL_STATEMENT = `VOSH Church International receives all her instructions from the Scriptures, both Old and New Testaments, as inspired by God (2 Timothy 3:16; Joshua 1:8).

We believe the Bible is the Word of God; in one Eternal God existing as Father, Son, and Holy Spirit; in the absolute deity of Jesus Christ — His virgin birth, sinless life, substitutionary death, bodily resurrection, and personal return; and in the Holy Spirit who convicts, regenerates, sanctifies, and empowers believers.

We believe man was created in God’s image, fell into sin, and needs salvation by grace through repentance and faith in Christ. We uphold the sanctity of life from conception, water baptism by immersion, the Holy Communion, the Spirit-filled life with the evidence of speaking in tongues, divine healing, fervent prayer, holy matrimony between a man and a woman, biblical equality, giving and receiving as worship, respect for governing authorities, and the hope of resurrection and the world to come.

We affirm the Apostles’ Creed as a concise summary of the historic Christian faith, and we commit ourselves to love others, enjoy the fellowship of believers, and actively identify with this local congregation for the glory of God.

Motto: One Way, One Job.`

export default function WhoWeAre() {
  const [heroImage, setHeroImage] = useState('/values.jpeg')
  const [outreachImage, setOutreachImage] = useState('/outreach-1.jpeg')
  const [openBelief, setOpenBelief] = useState<number | null>(null)
  const [showFullFaith, setShowFullFaith] = useState(false)
  const [missionText, setMissionText] = useState(MISSION_BLOCK.body)
  const [visionText, setVisionText] = useState(VISION_BLOCK.body)

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

      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Who We Are</h1>
          <p className={styles.heroTagline}>
            Voice Of Salvation And Healing Church International — Kitengela. Motto: {MOTTO}.
          </p>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.container}>
          <ScrollReveal>
            <h2 className={styles.storyHeading}>Rooted in the Word, Rising in Spirit</h2>
            <div className={styles.storyBody}>
              <p>
                VOSH Church International is an indigenous Bible-centered Pentecostal church,
                founded in the fiery revival of the 1950s under Archbishop Dr. J.A. Silas Owiti.
                We teach and preach the Word of God unadulterated — grounded in Hebrews 13:8:
                Jesus Christ is the same yesterday, today, and forever.
              </p>
              <p>
                At Kitengela we are a family committed to prayer, the Word, worship, and
                transformation — in our homes, our streets, and our nation. One Way, One Job.
              </p>
            </div>
            <blockquote className={styles.scripture}>
              &ldquo;Jesus Christ is the same yesterday and today and forever.&rdquo;
              <cite>— Hebrews 13:8</cite>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      <section className={styles.mvm}>
        <div className={styles.container}>
          <div className={styles.mvmGrid}>
            <ScrollReveal>
              <article className={styles.mvmCard}>
                <h3 className={styles.mvmLabel}>{VISION_BLOCK.title}</h3>
                <div className={styles.mvmRule} aria-hidden />
                <p className={styles.mvmText}>{visionText}</p>
              </article>
            </ScrollReveal>
            <ScrollReveal>
              <article className={styles.mvmCard}>
                <h3 className={styles.mvmLabel}>{MISSION_BLOCK.title}</h3>
                <div className={styles.mvmRule} aria-hidden />
                <p className={styles.mvmText}>{missionText}</p>
              </article>
            </ScrollReveal>
            <ScrollReveal>
              <article className={styles.mvmCard}>
                <h3 className={styles.mvmLabel}>{MOTTO_BLOCK.title}</h3>
                <div className={styles.mvmRule} aria-hidden />
                <p className={styles.mvmText}>{MOTTO_BLOCK.body}</p>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className={styles.faith} id="statement-of-faith">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What We Believe</h2>
          <p className={styles.sectionSubtitle}>Statement of Faith — from the VOSH Constitution</p>

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
              {FULL_STATEMENT.split('\n\n').map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          )}
        </div>
      </section>

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
                Our mission extends to the streets of Kitengela and beyond. Through outreach,
                we bring hope, healing, and the tangible love of Christ to those who need it most.
              </p>
              <blockquote className={styles.outreachScripture}>
                &ldquo;Therefore go and make disciples of all nations.&rdquo;
                <cite>— Matthew 28:19</cite>
              </blockquote>
              <Link to={ROUTES.outreach} className={styles.outreachCta}>
                See Our Outreach Work →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Ready to walk the One Way with us?
          </h2>
          <div className={styles.ctaActions}>
            <Link to={`${ROUTES.joinUs}#plan-visit`} className={styles.ctaPrimary}>
              Plan Your Visit →
            </Link>
            <Link to={ROUTES.services} className={styles.ctaSecondary}>
              View Service Times →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
