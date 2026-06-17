import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestimonyCarousel from '@/components/TestimonyCarousel'
import type { TestimonyItem } from '@/components/TestimonyCarousel'
import { publicApi } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import styles from './MinistryPage.module.css'

const FALLBACK_TESTIMONIES: TestimonyItem[] = [
  {
    id: '1',
    name: 'Church Member',
    quote: 'I came to VOSH broken and searching. Today I\'m walking in healing and purpose I never thought possible.',
    memberSince: 'Member since 2023',
  },
  {
    id: '2',
    name: 'Youth Leader',
    quote: 'The Word taught here changed how I see myself and my calling. I am equipped to lead others to Christ.',
    memberSince: 'Serving since 2022',
  },
]

export default function Testimonies() {
  const [items, setItems] = useState<TestimonyItem[]>(FALLBACK_TESTIMONIES)

  useEffect(() => {
    publicApi.getTestimonials().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setItems(
          (res.data as Record<string, unknown>[]).map((t) => ({
            id: String(t.id),
            name: String(t.name ?? 'Member'),
            quote: String(t.quote ?? t.content ?? ''),
            photoUrl: (t.photo_url ?? t.photoUrl) as string | null,
            memberSince: String(t.member_since ?? t.memberSince ?? ''),
          })).filter((t) => t.quote),
        )
      }
    }).catch(() => {})
  }, [])

  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.hero} style={{ backgroundImage: 'url(/woman-praying.jpg)' }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Testimonies</h1>
          <p className={styles.heroTagline}>
            Real stories of transformation — because nothing speaks louder than a life changed by Christ.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Lives Transformed</h2>
          <TestimonyCarousel testimonials={items} />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Share your story</h2>
          <Link to={`${ROUTES.joinUs}#contact-form`} className={styles.ctaBtn}>
            Tell Us Your Story →
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
