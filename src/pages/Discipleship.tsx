import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import {
  DISCIPLESHIP_PATHWAY,
  FALLBACK_SMALL_GROUPS,
  NEXT_DISCIPLESHIP_CLASS,
  parseSmallGroupsFromLinks,
  type SmallGroup,
} from '@/lib/discipleship'
import ScripturePulse from '@/components/ScripturePulse'
import { getVersesByTheme } from '@/lib/scripture'
import styles from './Discipleship.module.css'

export default function Discipleship() {
  const [heroImage, setHeroImage] = useState('/bible-study.jpeg')
  const [smallGroups, setSmallGroups] = useState<SmallGroup[]>(FALLBACK_SMALL_GROUPS)

  useEffect(() => {
    publicApi.getPhotos().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const photo = (res.data as { category?: string; url?: string }[]).find(
          (p) => p.category === 'discipleship' && p.url,
        )
        if (photo?.url) setHeroImage(photo.url)
      }
    }).catch(() => {})

    publicApi.getLinks().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const parsed = parseSmallGroupsFromLinks(res.data as any[])
        if (parsed.length > 0) setSmallGroups(parsed)
      }
    }).catch(() => {})
  }, [])

  return (
    <main className={styles.page}>
      <Header />

      {/* SECTION 1 — Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Discipleship</h1>
          <p className={styles.heroTagline}>
            Growing from new believer to mature disciple — a clear path for every stage of your
            walk with Christ.
          </p>
          <blockquote className={styles.heroScripture}>
            &ldquo;Therefore go and make disciples of all nations.&rdquo;
            <cite>— Matthew 28:19</cite>
          </blockquote>
        </div>
      </section>

      <ScripturePulse verses={getVersesByTheme('discipleship')} backgroundImage="/bible-study.jpeg" />

      {/* Next Class Starts */}
      <section className={styles.nextClass}>
        <div className={styles.container}>
          <div className={styles.nextClassBanner}>
            <div>
              <p className={styles.nextClassLabel}>Next Class Starts</p>
              <h2 className={styles.nextClassTitle}>{NEXT_DISCIPLESHIP_CLASS.title}</h2>
              <p className={styles.nextClassMeta}>
                {NEXT_DISCIPLESHIP_CLASS.startsOn} · {NEXT_DISCIPLESHIP_CLASS.time} · {NEXT_DISCIPLESHIP_CLASS.location}
              </p>
            </div>
            <Link to={NEXT_DISCIPLESHIP_CLASS.enrollLink} className={styles.nextClassCta}>
              Enroll Now →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Pathway */}
      <section className={styles.pathway}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>The Discipleship Pathway</h2>
          <div className={styles.pathwayTrack}>
            {DISCIPLESHIP_PATHWAY.map((step) => (
              <ScrollReveal key={step.step}>
                <article className={styles.pathStep}>
                  <span className={styles.stepLabel}>Step {step.step}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepTopics}>{step.topics}</p>
                  <Link
                    to={step.href.startsWith('#') ? `${ROUTES.discipleship}${step.href}` : step.href}
                    className={styles.stepCta}
                  >
                    {step.cta}
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Small Groups */}
      <section className={styles.groups} id="small-groups">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Find a Group Near You</h2>
          <p className={styles.sectionSubtitle}>Small Groups / Cell Groups</p>
          <div className={styles.groupsTable}>
            <div className={styles.groupsHeader} aria-hidden>
              <span>Group Name</span>
              <span>Day / Time</span>
              <span>Location / Online</span>
            </div>
            {smallGroups.map((group) => (
              <div key={group.id} className={styles.groupRow}>
                <span className={styles.groupName}>{group.name}</span>
                <span className={styles.groupSchedule}>{group.schedule}</span>
                <span className={styles.groupLocation}>
                  {group.joinUrl ? (
                    <a href={group.joinUrl} target="_blank" rel="noopener noreferrer">
                      {group.location}
                    </a>
                  ) : (
                    group.location
                  )}
                </span>
              </div>
            ))}
          </div>
          <Link to={`${ROUTES.joinUs}#plan-visit`} className={styles.groupsCta}>
            Join a Small Group →
          </Link>
        </div>
      </section>

      {/* SECTION 4 — CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <blockquote className={styles.ctaScripture}>
            &ldquo;Make every effort to add to your faith goodness; and to goodness, knowledge.&rdquo;
            <cite>— 2 Peter 1:5</cite>
          </blockquote>
          <h2 className={styles.ctaTitle}>Ready to take your next step?</h2>
          <Link to={`${ROUTES.joinUs}#plan-visit`} className={styles.ctaBtn}>
            Start Discipleship Class →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
