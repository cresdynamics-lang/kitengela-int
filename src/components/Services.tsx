import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { publicApi } from '@/lib/api'
import { ROUTES, SERVICE_SLUGS, serviceDetailPath } from '@/lib/routes'
import styles from './Services.module.css'

interface Service {
  id: string | number
  name: string
  time: string
  day: string
  description: string
  speaker?: string
  host?: string
  platform?: string
  venue?: string
  url?: string
  linkUrl?: string
  link_url?: string
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
  const [adminLinks, setAdminLinks] = useState<any[]>([])

  // When Home cannot load weekly programs quickly (or returns none),
  // show at least the requested Thursday Online Connect info.
  const fallbackServices: Service[] = [
    {
      id: 'thursday-online-connect',
      name: 'Thursday Online Connect',
      day: 'Thursday',
      time: '8:30 PM - 9:30 PM',
      description:
        'Online Connect Fellowship every Thursday 8:30 PM - 9:30 PM on Google Meet.',
      platform: 'Google Meet',
      venue: 'Online (Google Meet)',
    },
  ]

  const effectiveServices = services && services.length > 0 ? services : fallbackServices
  const featuredCards = [
    {
      id: SERVICE_SLUGS.sundayWorship,
      title: 'Sunday Worship Service',
      image: '/sunday-services.jpeg',
      description: 'Main Sunday celebration service with worship, Word, and ministry.',
      cta: 'Join Sunday Service',
      time: 'Every Sunday | 9:30 AM - 1:00 PM',
      location: 'VOSH Kitengela Main Sanctuary',
      expect: 'Dynamic Praise & Worship, Prophetic Ministry, and Life-Transforming Word.',
      who: "Open to Everyone (Children's Church available)",
    },
    {
      id: SERVICE_SLUGS.wednesdayPrayers,
      title: 'Wednesday Online Prayers',
      image: '/midweek-wed.jpeg',
      description: 'Midweek online prayer gathering to seek God together.',
      cta: 'Join Wednesday Prayers',
      time: 'Every Wednesday | 8:00 PM - 9:30 PM',
      location: 'Online (Zoom / YouTube Live)',
      expect: 'Deep Intercession, Testimonies, and Corporate Prayer.',
      who: 'Open to Everyone',
    },
    {
      id: SERVICE_SLUGS.fridayNight,
      title: 'Friday Night Service',
      image: '/midweek-fri.jpeg',
      description: 'Friday night encounter in worship, intercession, and the Word.',
      cta: 'Join Friday Night',
      time: 'Every Friday | 5:30 PM - 7:30 PM',
      location: 'VOSH Kitengela Main Sanctuary',
      expect: "Extended Worship, Deliverance, and Encountering God's Presence.",
      who: 'Youth, Young Adults & Everyone Hungry for God',
    },
    {
      id: SERVICE_SLUGS.sundayBibleStudy,
      title: 'Sunday Bible Study',
      image: '/bible-study.jpeg',
      description: 'Grow deeper in Scripture before the main Sunday services.',
      cta: 'Join Bible Study',
      time: 'Every Sunday | 8:30 AM - 9:30 AM',
      location: 'VOSH Kitengela Main Sanctuary',
      expect: 'In-depth Scripture Exploration, Q&A, and Foundation Building.',
      who: 'New Believers and Growing Disciples',
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

    const fetchLinks = async () => {
      try {
        const res = await publicApi.getLinks()
        if (res.success && Array.isArray(res.data)) {
          setAdminLinks(res.data)
        }
      } catch (e) {
        console.error('Error fetching admin links:', e)
      }
    }
    fetchLinks()
  }, [])

  const effectiveFeaturedCards = featuredCards.map(card => {
    const matchingLink = adminLinks.find(link => 
      (link.description && link.description.toLowerCase().includes(card.cta.toLowerCase())) ||
      (link.title && link.title.toLowerCase().includes(card.title.toLowerCase())) ||
      (card.id === SERVICE_SLUGS.sundayWorship && link.description?.toLowerCase().includes('sunday')) ||
      (card.id === SERVICE_SLUGS.wednesdayPrayers && link.description?.toLowerCase().includes('wednesday')) ||
      (card.id === SERVICE_SLUGS.fridayNight && link.description?.toLowerCase().includes('friday')) ||
      (card.id === SERVICE_SLUGS.sundayBibleStudy && link.description?.toLowerCase().includes('bible'))
    )

    const matchingService = effectiveServices?.find(s => 
      (s.description && s.description.toLowerCase().includes(card.cta.toLowerCase())) ||
      (s.name && s.name.toLowerCase().includes(card.title.toLowerCase())) ||
      (card.id === SERVICE_SLUGS.sundayWorship && s.name?.toLowerCase().includes('sunday') && !s.name?.toLowerCase().includes('bible')) ||
      (card.id === SERVICE_SLUGS.wednesdayPrayers && s.name?.toLowerCase().includes('wednesday')) ||
      (card.id === SERVICE_SLUGS.fridayNight && s.name?.toLowerCase().includes('friday')) ||
      (card.id === SERVICE_SLUGS.sundayBibleStudy && s.name?.toLowerCase().includes('bible'))
    )

    let finalHref = ROUTES.services;
    let target = undefined;
    let rel = undefined;
    let finalDescription = card.description;

    if (matchingLink && matchingLink.url) {
      finalHref = matchingLink.url;
      target = '_blank';
      rel = 'noopener noreferrer';
      if (matchingLink.description && !matchingLink.description.toLowerCase().includes('join')) {
         finalDescription = matchingLink.description;
      }
    } else if (matchingService) {
      const serviceLink = matchingService.linkUrl || matchingService.link_url || matchingService.url
      if (serviceLink?.startsWith('http')) {
        finalHref = serviceLink;
        target = '_blank';
        rel = 'noopener noreferrer';
      }
      if (matchingService.description) {
        finalDescription = matchingService.description;
      }
    }

    return {
      ...card,
      description: finalDescription,
      href: finalHref,
      target,
      rel
    }
  })

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Services &amp; Programs</h2>
        <p className={styles.sectionSubtitle}>Join us for worship, prayer, and fellowship throughout the week</p>

        <div className={styles.featuredGrid}>
          {effectiveFeaturedCards.map((card, index) => (
            <motion.div 
              key={card.id} 
              className={styles.featuredCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={styles.featuredImageWrap}>
                <img src={card.image} alt={card.title} className={styles.featuredImage} />
              </div>
              <div className={styles.featuredContent}>
                <h3 className={styles.featuredTitle}>{card.title}</h3>
                <p className={styles.featuredDescription}>{card.description}</p>
                {card.href === ROUTES.services ? (
                  <Link 
                    to={serviceDetailPath(card.id)}
                    className={styles.featuredButton}
                  >
                    {card.cta} <span>→</span>
                  </Link>
                ) : (
                  <a 
                    href={card.href} 
                    target={card.target} 
                    rel={card.rel} 
                    className={styles.featuredButton}
                  >
                    {card.cta} <span>→</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {effectiveServices && effectiveServices.length > 0 ? (
          <div className={styles.servicesGrid}>
            {effectiveServices.map((service) => (
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
