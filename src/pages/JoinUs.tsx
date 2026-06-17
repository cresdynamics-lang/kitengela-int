import { useEffect, useState, FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LiveStatusBar from '@/components/LiveStatusBar'
import LivePlayer from '@/components/LivePlayer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { getLiveJoinUrl } from '@/lib/live'
import { useLiveStatus } from '@/hooks/useLiveStatus'
import { MAPS_URL } from '@/lib/servicesPage'
import {
  CONTACT_INFO,
  CONTACT_SUBJECTS,
  MAP_EMBED_URL,
  phoneHref,
  whatsappHref,
  type ContactSubject,
} from '@/lib/contact'
import styles from './JoinUs.module.css'

const SERVICE_OPTIONS = [
  'Sunday Worship',
  'Bible Study',
  'Wednesday Prayers',
  'Thursday Connect',
  'Friday Night',
  'Other',
]

export default function JoinUs() {
  const [searchParams] = useSearchParams()
  const { live } = useLiveStatus()
  const [showPlayer, setShowPlayer] = useState(false)
  const [heroImage, setHeroImage] = useState('/whatsapp-11.jpeg')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactError, setContactError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: 'Sunday Worship',
    howDidYouHear: '',
    prayerRequest: '',
  })
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: (searchParams.get('subject') as ContactSubject) || 'General',
    message: '',
  })

  useEffect(() => {
    publicApi.getPhotos().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const photo = (res.data as { category?: string; url?: string }[]).find(
          (p) => (p.category === 'reach' || p.category === 'foundation' || p.category === 'hero') && p.url,
        )
        if (photo?.url) setHeroImage(photo.url)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const subject = searchParams.get('subject')
    if (subject && CONTACT_SUBJECTS.includes(subject as ContactSubject)) {
      setContactForm((prev) => ({ ...prev, subject: subject as ContactSubject }))
    }
  }, [searchParams])

  const handleLiveJoin = () => {
    const url = getLiveJoinUrl(live)
    if (live?.youtubeLiveUrl) {
      setShowPlayer(true)
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await publicApi.submitPlanVisit({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        service: form.service,
        howDidYouHear: form.howDidYouHear.trim() || undefined,
        prayerRequest: form.prayerRequest.trim() || undefined,
      })
      if (res.success) {
        setSubmitted(true)
        setForm({
          fullName: '',
          phone: '',
          email: '',
          service: 'Sunday Worship',
          howDidYouHear: '',
          prayerRequest: '',
        })
      } else {
        setError((res as { error?: string }).error || 'Something went wrong. Please try again.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setContactError('')
    setContactSubmitting(true)
    try {
      const res = await publicApi.submitContact({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim() || undefined,
        subject: contactForm.subject,
        message: contactForm.message.trim(),
      })
      if (res.success) {
        setContactSubmitted(true)
        setContactForm({ name: '', email: '', phone: '', subject: 'General', message: '' })
      } else {
        setContactError((res as { error?: string }).error || 'Something went wrong.')
      }
    } catch (err: unknown) {
      setContactError(err instanceof Error ? err.message : 'Network error.')
    } finally {
      setContactSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <Header />

      {/* SECTION 1 — Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Join Us</h1>
          <p className={styles.heroTagline}>
            Whether this is your first time hearing about VOSH Kitengela or your first time
            visiting — we&apos;re glad you&apos;re here.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Three Ways to Join */}
      <section className={styles.ways}>
        <div className={styles.container}>
          <div className={styles.waysGrid}>
            <ScrollReveal>
              <article className={styles.wayCard}>
                <h2>Visit In Person</h2>
                <p>Kitengela, Baraka Road</p>
                <p className={styles.wayHighlight}>Sunday 9:30 AM</p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={styles.wayBtn}>
                  Get Directions →
                </a>
              </article>
            </ScrollReveal>
            <ScrollReveal>
              <article className={styles.wayCard}>
                <h2>Join Online</h2>
                <p>
                  <span className={styles.liveDot} aria-hidden />
                  Live services every week — join from anywhere
                </p>
                <Link to={ROUTES.services} className={styles.wayBtn}>
                  View Live Schedule →
                </Link>
              </article>
            </ScrollReveal>
            <ScrollReveal>
              <article className={styles.wayCard}>
                <h2>Connect With Us</h2>
                <p>Talk to someone before you visit. We&apos;d love to hear from you.</p>
                <a href="#contact-form" className={styles.wayBtn}>
                  Contact Us →
                </a>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Live Join Widget */}
      <LiveStatusBar live={live} onJoinLive={handleLiveJoin} />

      {/* SECTION 4 — Plan Your Visit Form */}
      <section className={styles.formSection} id="plan-visit">
        <div className={styles.container}>
          <h2 className={styles.formHeading}>Plan Your Visit</h2>
          <div className={styles.formRule} aria-hidden />

          {submitted ? (
            <div className={styles.successBox}>
              <p>Thank you! A member of our team will reach out soon to welcome you.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <p className={styles.error}>{error}</p>}

              <label className={styles.label}>
                Full Name *
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </label>

              <label className={styles.label}>
                Phone / WhatsApp *
                <input
                  type="tel"
                  required
                  className={styles.input}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>

              <label className={styles.label}>
                Email
                <input
                  type="email"
                  className={styles.input}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label className={styles.label}>
                Which service are you planning to join? *
                <select
                  required
                  className={styles.select}
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>

              <label className={styles.label}>
                How did you hear about us?
                <input
                  type="text"
                  className={styles.input}
                  value={form.howDidYouHear}
                  onChange={(e) => setForm({ ...form, howDidYouHear: e.target.value })}
                />
              </label>

              <label className={styles.label}>
                Prayer Request (Optional)
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={form.prayerRequest}
                  onChange={(e) => setForm({ ...form, prayerRequest: e.target.value })}
                />
              </label>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit →'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 5 — Get in Touch (merged Contact) */}
      <section className={styles.contactSection} id="contact-form">
        <div className={styles.containerWide}>
          <h2 className={styles.formHeading}>Get in Touch</h2>
          <div className={styles.formRule} aria-hidden />
          <div className={styles.contactSplit}>
            <ScrollReveal direction="left">
              <aside className={styles.contactInfo}>
                <ul className={styles.infoList}>
                  <li><span aria-hidden>📍</span><span>{CONTACT_INFO.locationLine}</span></li>
                  {CONTACT_INFO.phoneNumbers.map((entry) => (
                    <li key={entry.number}>
                      <span aria-hidden>📞</span>
                      <a href={phoneHref(entry.number)} className={styles.infoLink}>
                        {entry.number}{entry.label ? ` (${entry.label})` : ''}
                      </a>
                    </li>
                  ))}
                  <li>
                    <span aria-hidden>💬</span>
                    <a href={whatsappHref(CONTACT_INFO.whatsapp)} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                      WhatsApp: {CONTACT_INFO.whatsapp}
                    </a>
                  </li>
                  <li><span aria-hidden>🕐</span><span>Office Hours: {CONTACT_INFO.officeHours}</span></li>
                </ul>
              </aside>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className={styles.contactFormWrap}>
                {contactSubmitted ? (
                  <div className={styles.successBox}>
                    <p>Thank you for reaching out. A member of our team will respond soon.</p>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleContactSubmit}>
                    {contactError && <p className={styles.error}>{contactError}</p>}
                    <label className={styles.label}>
                      Name *
                      <input type="text" required className={styles.input} value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                    </label>
                    <label className={styles.label}>
                      Email *
                      <input type="email" required className={styles.input} value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                    </label>
                    <label className={styles.label}>
                      Phone
                      <input type="tel" className={styles.input} value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
                    </label>
                    <label className={styles.label}>
                      Subject *
                      <select required className={styles.select} value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value as ContactSubject })}>
                        {CONTACT_SUBJECTS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </label>
                    <label className={styles.label}>
                      Message *
                      <textarea required className={styles.textarea} rows={5} value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
                    </label>
                    <button type="submit" className={styles.submitBtn} disabled={contactSubmitting}>
                      {contactSubmitting ? 'Sending…' : 'Send Message →'}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className={styles.mapSection}>
        <div className={styles.containerWide}>
          <h2 className={styles.mapTitle}>Find Us</h2>
          <div className={styles.mapFrame}>
            <iframe title="VOSH Church Kitengela location" src={MAP_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>We can&apos;t wait to welcome you home.</h2>
          <div className={styles.ctaActions}>
            <button type="button" onClick={handleLiveJoin} className={styles.ctaPrimary}>
              Join Live Now
            </button>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary}>
              Get Directions
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {showPlayer && live?.youtubeLiveUrl && (
        <LivePlayer url={live.youtubeLiveUrl} onClose={() => setShowPlayer(false)} />
      )}
    </main>
  )
}
