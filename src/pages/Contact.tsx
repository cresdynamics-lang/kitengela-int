import { useEffect, useState, FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import {
  CONTACT_INFO,
  CONTACT_SUBJECTS,
  MAP_EMBED_URL,
  phoneHref,
  whatsappHref,
  type ContactSubject,
} from '@/lib/contact'
import styles from './Contact.module.css'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const [heroImage, setHeroImage] = useState('/whatsapp-11.jpeg')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
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
          (p) => p.category === 'contact' && p.url,
        )
        if (photo?.url) setHeroImage(photo.url)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const subject = searchParams.get('subject')
    if (subject && CONTACT_SUBJECTS.includes(subject as ContactSubject)) {
      setForm((prev) => ({ ...prev, subject: subject as ContactSubject }))
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await publicApi.submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject,
        message: form.message.trim(),
      })
      if (res.success) {
        setSubmitted(true)
        setForm({ name: '', email: '', phone: '', subject: 'General', message: '' })
      } else {
        setError((res as { error?: string }).error || 'Something went wrong. Please try again.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <Header />

      {/* SECTION 1 — Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Get In Touch</h1>
          <p className={styles.heroTagline}>
            We&apos;d love to hear from you — questions, prayer requests, or just to say hello.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Info + Form */}
      <section className={styles.main}>
        <div className={styles.container}>
          <div className={styles.split}>
            <ScrollReveal direction="left">
              <aside className={styles.info}>
                <h2 className={styles.infoTitle}>Contact Info</h2>
                <ul className={styles.infoList}>
                  <li>
                    <span className={styles.infoIcon} aria-hidden>📍</span>
                    <span>{CONTACT_INFO.locationLine}</span>
                  </li>
                  {CONTACT_INFO.phoneNumbers.map((entry) => (
                    <li key={entry.number}>
                      <span className={styles.infoIcon} aria-hidden>📞</span>
                      <a href={phoneHref(entry.number)} className={styles.infoLink}>
                        {entry.number}
                        {entry.label ? ` (${entry.label})` : ''}
                      </a>
                    </li>
                  ))}
                  <li>
                    <span className={styles.infoIcon} aria-hidden>💬</span>
                    <a
                      href={whatsappHref(CONTACT_INFO.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.infoLink}
                    >
                      WhatsApp: {CONTACT_INFO.whatsapp}
                    </a>
                  </li>
                  <li>
                    <span className={styles.infoIcon} aria-hidden>🕐</span>
                    <span>Office Hours: {CONTACT_INFO.officeHours}</span>
                  </li>
                </ul>
              </aside>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className={styles.formWrap} id="contact-form">
                {submitted ? (
                  <div className={styles.successBox}>
                    <p>Thank you for reaching out. A member of our team will respond soon.</p>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <p className={styles.error}>{error}</p>}

                    <label className={styles.label}>
                      Name *
                      <input
                        type="text"
                        required
                        className={styles.input}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </label>

                    <label className={styles.label}>
                      Email *
                      <input
                        type="email"
                        required
                        className={styles.input}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </label>

                    <label className={styles.label}>
                      Phone
                      <input
                        type="tel"
                        className={styles.input}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </label>

                    <label className={styles.label}>
                      Subject *
                      <select
                        required
                        className={styles.select}
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value as ContactSubject })
                        }
                      >
                        {CONTACT_SUBJECTS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </label>

                    <label className={styles.label}>
                      Message *
                      <textarea
                        required
                        className={styles.textarea}
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </label>

                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send Message →'}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Map */}
      <section className={styles.mapSection}>
        <div className={styles.containerWide}>
          <h2 className={styles.mapTitle}>Find Us</h2>
          <div className={styles.mapFrame}>
            <iframe
              title="VOSH Church International Kitengela location"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
