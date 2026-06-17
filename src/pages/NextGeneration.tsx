import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import GenerationsCarousel from '@/components/GenerationsCarousel'
import ScripturePulse from '@/components/ScripturePulse'
import { DEFAULT_GENERATION_GROUPS } from '@/lib/carousels'
import { getVersesByTheme } from '@/lib/scripture'
import { ROUTES } from '@/lib/routes'
import styles from './MinistryPage.module.css'

const PROGRAMS = [
  { title: 'Sunday Youth Service', desc: 'Dynamic worship and Word-centered teaching for teens every Sunday.' },
  { title: 'Midweek Connect', desc: 'Small groups and Bible discussions that build authentic community.' },
  { title: 'School & Campus Outreach', desc: 'Taking the Gospel to schools, colleges, and universities in Kitengela.' },
  { title: 'Leadership Development', desc: 'Equipping young adults to lead with integrity and Kingdom purpose.' },
]

export default function NextGeneration() {
  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.hero} style={{ backgroundImage: 'url(/whatsapp-12.jpeg)' }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Next Generation</h1>
          <p className={styles.heroTagline}>
            Raising Kingdom-minded youth, teens, and young adults who will impact generations.
          </p>
          <blockquote className={styles.heroScripture}>
            &ldquo;Train up a child in the way he should go.&rdquo;
            <cite>— Proverbs 22:6</cite>
          </blockquote>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Impacting Generations Starts Here</h2>
          <p className={styles.bodyText}>
            Our Next Generation ministry exists to disciple young people at every stage — from children
            discovering Jesus to young adults stepping into calling. This is not a footnote; it is the
            heartbeat of our mission.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Every Generation, One Family</h2>
          <GenerationsCarousel groups={DEFAULT_GENERATION_GROUPS} />
        </div>
      </section>

      <ScripturePulse verses={getVersesByTheme('generational')} backgroundImage="/whatsapp-4.jpeg" />

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Programs</h2>
          <div className={styles.cardGrid}>
            {PROGRAMS.map((p) => (
              <ScrollReveal key={p.title}>
                <article className={styles.card}>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to get involved?</h2>
          <Link to={`${ROUTES.joinUs}#plan-visit`} className={styles.ctaBtn}>
            Plan Your Visit →
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
