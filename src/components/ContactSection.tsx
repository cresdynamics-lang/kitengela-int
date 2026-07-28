import { useEffect, useState } from 'react'
import { publicApi } from '@/lib/api'
import styles from './ContactSection.module.css'

interface ContactInfo {
  phoneNumbers: string[]
  email: string
  location: { city: string; address: string }
  socialMedia: { facebook: string; instagram: string; youtube: string }
  website: string
}

const FALLBACK: ContactInfo = {
  phoneNumbers: ['+254 727 057 995', '+254 704 601 178', '+254 733 566 398'],
  email: 'evanskochoo2019@gmail.com',
  location: {
    city: 'Kitengela',
    address: 'Along Baraka Road / Treewa Road, Next to Balozi Junior Academy'
  },
  socialMedia: {
    facebook: 'https://www.facebook.com/VoshChurchKitengela',
    instagram: 'https://www.instagram.com/voshchurchintkitengela',
    youtube: 'https://www.youtube.com/@PstEvansKochoo'
  },
  website: 'www.voshchurchintkitengela.co.ke'
}

export default function ContactSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await publicApi.getSite()
        if (res.success && res.data) {
          const s = res.data as { phoneNumbers?: string; email?: string | null; locationText?: string; facebookUrl?: string | null; instagramUrl?: string | null; youtubeUrl?: string | null }
          const phoneNumbers = (() => {
            try {
              return s.phoneNumbers ? JSON.parse(s.phoneNumbers) : FALLBACK.phoneNumbers
            } catch {
              return FALLBACK.phoneNumbers
            }
          })()
          setContactInfo({
            phoneNumbers: phoneNumbers.length ? phoneNumbers : FALLBACK.phoneNumbers,
            email: s.email || FALLBACK.email,
            location: { city: 'Kitengela', address: s.locationText || FALLBACK.location.address },
            socialMedia: {
              facebook: s.facebookUrl || FALLBACK.socialMedia.facebook,
              instagram: s.instagramUrl || FALLBACK.socialMedia.instagram,
              youtube: s.youtubeUrl || FALLBACK.socialMedia.youtube
            },
            website: FALLBACK.website
          })
        } else {
          setContactInfo(FALLBACK)
        }
      } catch (error) {
        console.error('Error fetching contact info:', error)
        setContactInfo(FALLBACK)
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  if (loading || !contactInfo) {
    return (
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <p>Loading contact information...</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Get In Touch</h2>
        <p className={styles.sectionSubtitle}>We'd love to hear from you</p>

        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <div className={styles.icon}>📞</div>
            <h3 className={styles.cardTitle}>Phone</h3>
            <div className={styles.phoneNumbers}>
              {contactInfo.phoneNumbers.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className={styles.phoneLink}
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.icon}>✉️</div>
            <h3 className={styles.cardTitle}>Email</h3>
            <a href={`mailto:${contactInfo.email}`} className={styles.emailLink}>
              {contactInfo.email}
            </a>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.icon}>📍</div>
            <h3 className={styles.cardTitle}>Location</h3>
            <p className={styles.address}>
              <strong>{contactInfo.location.city}</strong>
              <br />
              {contactInfo.location.address}
            </p>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.icon}>🌐</div>
            <h3 className={styles.cardTitle}>Follow Us</h3>
            <div className={styles.socialLinks}>
              <a
                href={contactInfo.socialMedia.facebook.startsWith('http') ? contactInfo.socialMedia.facebook : `https://facebook.com/${contactInfo.socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                Facebook
              </a>
              <a
                href={contactInfo.socialMedia.instagram.startsWith('http') ? contactInfo.socialMedia.instagram : `https://instagram.com/${contactInfo.socialMedia.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                Instagram
              </a>
              <a
                href={contactInfo.socialMedia.youtube.startsWith('http') ? contactInfo.socialMedia.youtube : `https://youtube.com/${contactInfo.socialMedia.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
