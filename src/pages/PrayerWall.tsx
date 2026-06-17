import { useState, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScripturePulse from '@/components/ScripturePulse'
import { publicApi } from '@/lib/api'
import { getVersesByTheme } from '@/lib/scripture'
import styles from './PrayerWall.module.css'

const ANSWERED_PRAYERS = [
  { id: '1', text: 'A member received healing after weeks of prayer — God is faithful.' },
  { id: '2', text: 'A family reunited through pastoral care and intercession.' },
  { id: '3', text: 'A young person found direction and peace in Christ.' },
]

export default function PrayerWall() {
  const [form, setForm] = useState({ name: '', request: '', isAnonymous: false })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await publicApi.submitPrayerRequest({
        name: form.isAnonymous ? 'Anonymous' : form.name.trim(),
        request: form.request.trim(),
      })
      if (res.success) {
        setSubmitted(true)
        setForm({ name: '', request: '', isAnonymous: false })
      } else {
        setError((res as { error?: string }).error || 'Could not submit. Please try again.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.hero} style={{ backgroundImage: 'url(/morning-prayers.jpg)' }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Prayer Wall</h1>
          <p className={styles.heroTagline}>
            Submit a prayer request and stand in faith with our church family.
          </p>
          <blockquote className={styles.heroScripture}>
            &ldquo;The prayer of a righteous person is powerful and effective.&rdquo;
            <cite>— James 5:16</cite>
          </blockquote>
        </div>
      </section>

      <section className={styles.main}>
        <div className={styles.container}>
          <div className={styles.split}>
            <div>
              <h2 className={styles.sectionTitle}>Submit a Prayer Request</h2>
              {submitted ? (
                <div className={styles.success}>Your request has been received. Our prayer team is standing with you.</div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  {error && <p className={styles.error}>{error}</p>}
                  <label className={styles.label}>
                    <input
                      type="checkbox"
                      checked={form.isAnonymous}
                      onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                    />
                    {' '}Submit anonymously
                  </label>
                  {!form.isAnonymous && (
                    <label className={styles.label}>
                      Your Name
                      <input
                        type="text"
                        required
                        className={styles.input}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </label>
                  )}
                  <label className={styles.label}>
                    Prayer Request *
                    <textarea
                      required
                      className={styles.textarea}
                      rows={5}
                      value={form.request}
                      onChange={(e) => setForm({ ...form, request: e.target.value })}
                    />
                  </label>
                  <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit Prayer →'}
                  </button>
                </form>
              )}
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Answered Prayers</h2>
              <p className={styles.answeredIntro}>Stories of God&apos;s faithfulness (shared anonymously).</p>
              <ul className={styles.answeredList}>
                {ANSWERED_PRAYERS.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ScripturePulse verses={getVersesByTheme('prayer')} />
      <Footer />
    </main>
  )
}
