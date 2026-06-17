import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import {
  DEFAULT_GIVE_SETTINGS,
  GIVING_CATEGORIES,
  formatMpesaAccount,
  normalizeGiveSettings,
  type GiveSettings,
} from '@/lib/give'
import { FINANCE_CONTACT_HREF } from '@/lib/contact'
import { ROUTES } from '@/lib/routes'
import styles from './Give.module.css'

export default function Give() {
  const [heroImage, setHeroImage] = useState('/unity.jpg')
  const [settings, setSettings] = useState<GiveSettings>(DEFAULT_GIVE_SETTINGS)

  useEffect(() => {
    publicApi.getPhotos().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const photo = (res.data as { category?: string; url?: string }[]).find(
          (p) => p.category === 'give' && p.url,
        )
        if (photo?.url) setHeroImage(photo.url)
      }
    }).catch(() => {})

    publicApi.getGiveSettings().then((res) => {
      if (res.success && res.data) {
        setSettings(normalizeGiveSettings(res.data as Record<string, unknown>))
      }
    }).catch(() => {})
  }, [])

  const defaultAccount = formatMpesaAccount(settings)

  return (
    <main className={styles.page}>
      <Header />

      {/* SECTION 1 — Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Partnering for Transformation</h1>
          <blockquote className={styles.heroScripture}>
            &ldquo;God loves a cheerful giver.&rdquo;
            <cite>— 2 Corinthians 9:7</cite>
          </blockquote>
          <p className={styles.heroTagline}>
            Your support enables us to reach more lives with the Gospel and impact our community
            through tangible acts of love.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Giving Categories */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Giving Categories</h2>
          <div className={styles.categoriesGrid}>
            {GIVING_CATEGORIES.map((category) => (
              <ScrollReveal key={category.id}>
                <article className={styles.categoryCard}>
                  <h3 className={styles.categoryTitle}>{category.title}</h3>
                  <p className={styles.categorySubtitle}>{category.subtitle}</p>
                  <p className={styles.categoryDesc}>{category.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — How to Give */}
      <section className={styles.howToGive}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How to Give</h2>

          <ScrollReveal>
            <article className={styles.methodCard}>
              <h3 className={styles.methodTitle}>M-Pesa (Easiest &amp; Fastest)</h3>
              <div className={styles.methodRule} aria-hidden />
              <div className={styles.detailGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Paybill Number</span>
                  <span className={styles.detailValue}>{settings.paybillNumber}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Account Number</span>
                  <span className={styles.detailValue}>{defaultAccount}</span>
                </div>
              </div>
              <div className={styles.steps}>
                <p className={styles.stepsHeading}>Step-by-step:</p>
                <ol>
                  <li>Go to M-Pesa → Lipa na M-Pesa → Pay Bill</li>
                  <li>
                    Business Number: <strong>{settings.paybillNumber}</strong>
                  </li>
                  <li>
                    Account Number: <strong>{defaultAccount}</strong> (or{' '}
                    {settings.accountSuffixes.map((suffix, i) => (
                      <span key={suffix}>
                        {i > 0 && (i === settings.accountSuffixes.length - 1 ? ', or ' : ', ')}
                        <strong>{formatMpesaAccount(settings, suffix)}</strong>
                      </span>
                    ))}{' '}
                    depending on your gift)
                  </li>
                  <li>Enter amount → Confirm</li>
                </ol>
              </div>
            </article>
          </ScrollReveal>

          <ScrollReveal>
            <article className={styles.methodCard}>
              <h3 className={styles.methodTitle}>Bank Transfer</h3>
              <div className={styles.methodRule} aria-hidden />
              <div className={styles.bankDetails}>
                <p><strong>Bank Name:</strong> {settings.bankName}</p>
                <p><strong>Account Name:</strong> {settings.bankAccountName}</p>
                <p><strong>Account Number:</strong> {settings.bankAccountNumber}</p>
                {settings.bankBranch && (
                  <p><strong>Branch:</strong> {settings.bankBranch}</p>
                )}
              </div>
            </article>
          </ScrollReveal>

          <ScrollReveal>
            <article className={styles.methodCard}>
              <h3 className={styles.methodTitle}>Give In Person</h3>
              <div className={styles.methodRule} aria-hidden />
              <p className={styles.inPersonText}>
                Join any of our services and give during the offering.
              </p>
              <Link to={ROUTES.joinUs} className={styles.inPersonLink}>
                Plan Your Visit →
              </Link>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4 — Why We Give */}
      <section className={styles.encouragement}>
        <div className={styles.container}>
          <blockquote className={styles.encouragementScripture}>
            &ldquo;Each of you should give what you have decided in your heart to give, not
            reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
            <cite>— 2 Corinthians 9:7</cite>
          </blockquote>
          <p className={styles.encouragementText}>
            Your giving is more than a transaction — it&apos;s an act of worship that fuels the
            mission of VOSH Kitengela: reaching the lost, discipling believers, and transforming
            our community.
          </p>
        </div>
      </section>

      {/* SECTION 5 — Transparency */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <p className={styles.transparencyText}>
            We are committed to stewarding every gift with integrity. For questions about giving
            or to request a giving statement, contact our finance team.
          </p>
          <a href={FINANCE_CONTACT_HREF} className={styles.transparencyCta}>
            Contact Finance Team →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
