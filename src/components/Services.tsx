import { useEffect, useState } from 'react'
import { publicApi } from '@/lib/api'
import styles from './Services.module.css'

interface Service {
  id: number
  name: string
  time: string
  day: string
  description: string
  speaker?: string
  host?: string
  platform?: string
}

interface MassCard {
  id: string
  title: string
  thumbnailUrl: string | null
  linkUrl: string | null
}

interface ServicesProps {
  services: Service[]
}

export default function Services({ services }: ServicesProps) {
  const [massCards, setMassCards] = useState<MassCard[]>([])
  const featuredCards = [
    {
      id: 'sunday',
      title: 'Sunday Worship Service',
      image: '/sunday-services.jpeg',
      description: 'Main Sunday celebration service with worship, Word, and ministry.',
      cta: 'Join Sunday Service',
    },
    {
      id: 'wednesday',
      title: 'Wednesday Online Prayers',
      image: '/midweek-wed.jpeg',
      description: 'Midweek online prayer gathering to seek God together.',
      cta: 'Join Wednesday Prayers',
    },
    {
      id: 'friday',
      title: 'Friday Night Service',
      image: '/midweek-fri.jpeg',
      description: 'Friday night encounter in worship, intercession, and the Word.',
      cta: 'Join Friday Night',
    },
    {
      id: 'biblestudy',
      title: 'Sunday Bible Study',
      image: '/bible-study.jpeg',
      description: 'Grow deeper in Scripture before the main Sunday services.',
      cta: 'Join Bible Study',
    },
  ]

  useEffect(() => {
    const fetchMasses = async () => {
      try {
        const res = await publicApi.getSermons()
        if (res.success && Array.isArray(res.data)) {
          const mapped = (res.data as any[])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map((s) => ({
              id: s.id,
              title: s.title || 'Service',
              thumbnailUrl: s.thumbnailUrl || null,
              linkUrl: s.videoUrl || s.audioUrl || null,
            }))
          setMassCards(mapped)
        }
      } catch (e) {
        console.error('Error fetching mass sermons for Services section:', e)
      }
    }
    fetchMasses()
  }, [])

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Services &amp; Programs</h2>
        <p className={styles.sectionSubtitle}>Join us for worship, prayer, and fellowship throughout the week</p>

        <div className={styles.featuredGrid}>
          {featuredCards.map((card) => (
            <div key={card.id} className={styles.featuredCard}>
              <div className={styles.featuredImageWrap}>
                <img src={card.image} alt={card.title} className={styles.featuredImage} />
              </div>
              <div className={styles.featuredContent}>
                <h3 className={styles.featuredTitle}>{card.title}</h3>
                <p className={styles.featuredDescription}>{card.description}</p>
                <a href="/services" className={styles.featuredButton}>{card.cta}</a>
              </div>
            </div>
          ))}
        </div>
        
        {services && services.length > 0 ? (
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceHeader}>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  <span className={styles.serviceDay}>{service.day}</span>
                </div>
                <div className={styles.serviceTime}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{service.time}</span>
                </div>
                <p className={styles.serviceDescription}>{service.description}</p>
                {service.speaker && (
                  <div className={styles.serviceMeta}>
                    <strong>Speaker:</strong> {service.speaker}
                  </div>
                )}
                {service.host && (
                  <div className={styles.serviceMeta}>
                    <strong>Host:</strong> {service.host}
                  </div>
                )}
                {service.platform && (
                  <div className={styles.serviceMeta}>
                    <strong>Platform:</strong> {service.platform}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Service information will be displayed here. Check back soon.</p>
          </div>
        )}

        {massCards.length > 0 && (
          <div className={styles.massSection}>
            <h3 className={styles.massSectionTitle}>Mass & Service Streams</h3>
            <p className={styles.massSectionSubtitle}>
              Images and links for Sunday, Friday, Wednesday and other services — managed from the Sermons section in admin.
            </p>
            <div className={styles.massGrid}>
              {massCards.map((mass) => (
                <div key={mass.id} className={styles.massCard}>
                  {mass.thumbnailUrl && (
                    <div className={styles.massImageWrap}>
                      <img src={mass.thumbnailUrl} alt={mass.title} className={styles.massImage} />
                    </div>
                  )}
                  <div className={styles.massContent}>
                    <h4 className={styles.massTitle}>{mass.title}</h4>
                    {mass.linkUrl && (
                      <a
                        href={mass.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.massLink}
                      >
                        Open Stream / Details →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
