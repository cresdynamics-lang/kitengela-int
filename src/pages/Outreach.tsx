import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import MasonryGallery from '@/components/MasonryGallery'
import ScripturePulse from '@/components/ScripturePulse'
import { getVersesByTheme } from '@/lib/scripture'
import { ROUTES } from '@/lib/routes'
import styles from './MinistryPage.module.css'

const PROJECTS = [
  { title: 'Community Care', desc: 'Practical support for families in need across Kitengela.' },
  { title: 'Evangelism & Crusades', desc: 'Taking the Gospel beyond our walls to neighborhoods and regions.' },
  { title: 'School & Campus Ministry', desc: 'Partnering with institutions to reach the next generation.' },
  { title: 'Humanitarian Outreach', desc: 'Tangible acts of love that demonstrate Christ to our community.' },
]

const OUTREACH_IMAGES = [
  '/outreach-1.jpeg',
  '/outreach-2.jpeg',
  '/evans-activity-1.jpg',
  '/evans-activity-2.jpg',
  '/whatsapp-7.jpeg',
  '/church-praying.jpg',
]

export default function Outreach() {
  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.hero} style={{ backgroundImage: 'url(/outreach-1.jpeg)' }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Outreach</h1>
          <p className={styles.heroTagline}>
            Love beyond our walls — reaching Kitengela and beyond with the Gospel and acts of compassion.
          </p>
          <blockquote className={styles.heroScripture}>
            &ldquo;Whatever you did for the least of these, you did for Me.&rdquo;
            <cite>— Matthew 25:40</cite>
          </blockquote>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Mission in Action</h2>
          <p className={styles.bodyText}>
            VOSH Kitengela exists not only to gather believers but to send them. Our outreach ministry
            carries hope, healing, and the love of Christ into streets, schools, and communities —
            because transformation must move beyond the sanctuary.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Ongoing Projects</h2>
          <div className={styles.cardGrid}>
            {PROJECTS.map((p) => (
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

      <ScripturePulse verses={getVersesByTheme('community')} backgroundImage="/outreach-2.jpeg" />

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Outreach in Pictures</h2>
          <MasonryGallery images={OUTREACH_IMAGES} altPrefix="Outreach" />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Partner with us in outreach</h2>
          <Link to={`${ROUTES.joinUs}#contact-form`} className={styles.ctaBtn}>
            Get Involved →
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
