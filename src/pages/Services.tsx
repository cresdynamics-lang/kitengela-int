import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ScrollReveal from '@/components/ScrollReveal'
import Carousel from '@/components/Carousel'
import { publicApi } from '@/lib/api'
import styles from './Services.module.css'

interface Program {
  id: string
  title: string
  day: string
  startTime: string
  endTime: string
  venue: string
  description: string | null
  contacts: string | string[]
  posterImageUrl: string | null
}

interface ServiceCard {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  linkUrl: string | null
}

const churchActivitiesCarouselImages = [
  { id: 1, title: "Sunday Worship Experience", image: "/sunday-services.jpeg", description: "Join us every Sunday for powerful worship and life-changing messages" },
  { id: 2, title: "Bible Study Sessions", image: "/bible-study.jpeg", description: "Deep dive into God's Word and grow in your understanding of Scripture" },
  { id: 3, title: "Corporate Prayer", image: "/church-praying.jpg", description: "Experience the power of corporate prayer and intercession" },
  { id: 4, title: "Online Connect Fellowship", image: "/online-connect.jpeg", description: "Join our Online Connect Fellowship every Thursday from 8:30 PM - 9:30 PM" },
  { id: 5, title: "Men's Fellowship", image: "/man-praying.jpg", description: "Men gathering together to reclaim the divine mandate of manhood" },
  { id: 6, title: "Our Core Values", image: "/core-values.jpeg", description: "Prayer, Stewardship, Holiness, Advocacy, and Unity form our foundation" },
  { id: 7, title: "Praise & Worship", image: "/praise-worship.jpg", description: "Celebrate God's goodness through vibrant praise and worship" },
  { id: 8, title: "Midweek Refreshment", image: "/midweek-fri.jpeg", description: "Midweek spiritual refreshment and fellowship" }
]

export default function Services() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [groupedPrograms, setGroupedPrograms] = useState<Record<string, Program[]>>({})
  const [loading, setLoading] = useState(true)
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([])
  const [servicesCarousel, setServicesCarousel] = useState(churchActivitiesCarouselImages)

  useEffect(() => {
    Promise.all([publicApi.getWeeklyPrograms(), publicApi.getSermons()])
      .then(([programsRes, sermonsRes]) => {
        if (programsRes.success && Array.isArray(programsRes.data)) {
          const rawData = programsRes.data as any[]
          const progData = rawData.map(p => ({
            id: p.id,
            title: p.title,
            day: p.day,
            startTime: p.startTime || p.start_time || '',
            endTime: p.endTime || p.end_time || '',
            venue: p.venue,
            description: p.description,
            contacts: p.contacts,
            posterImageUrl: p.posterImageUrl || p.poster_image_url || null
          })) as Program[]
          
          setPrograms(progData)
          const grouped: Record<string, Program[]> = {}
          progData.forEach((p) => {
            if (!grouped[p.day]) grouped[p.day] = []
            grouped[p.day].push(p)
          })
          setGroupedPrograms(grouped)
        }

        if (sermonsRes.success && Array.isArray(sermonsRes.data)) {
          const rawSermons = sermonsRes.data as any[]
          const mapped = rawSermons
            .filter(s => s && (s.date || s.createdAt))
            .sort((a, b) => {
              const dateA = new Date(a.date || a.createdAt).getTime()
              const dateB = new Date(b.date || b.createdAt).getTime()
              return dateB - dateA
            })
            .slice(0, 4)
            .map((s) => ({
              id: s.id,
              title: s.title || 'Service',
              description: s.description || null,
              thumbnailUrl: s.thumbnailUrl || s.thumbnail_url || null,
              linkUrl: s.videoUrl || s.video_url || s.audioUrl || s.audio_url || null,
            }))
          setServiceCards(mapped)
        }
      })
      .catch(err => {
        console.error('Error fetching services data:', err)
      })
      .finally(() => setLoading(false))

    // Fetch services page images
    publicApi.getPhotos().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const photos = res.data as any[]
        const servicesPhotos = photos.filter(p => p.category === 'services')
        if (servicesPhotos.length > 0) {
          const carouselImages = servicesPhotos.slice(0, 8).map((p, i) => ({
            id: i + 1,
            title: i === 0 ? "Sunday Worship Experience" : i === 1 ? "Bible Study Sessions" : i === 2 ? "Corporate Prayer" : i === 3 ? "Online Connect Fellowship" : i === 4 ? "Men's Fellowship" : i === 5 ? "Our Core Values" : i === 6 ? "Praise & Worship" : "Midweek Refreshment",
            image: p.url,
            description: "Join us for church activities"
          }))
          setServicesCarousel(carouselImages)
        }
      }
    }).catch(() => {})
  }, [])

  const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const effectiveServiceCards: ServiceCard[] = serviceCards.length > 0
      ? serviceCards
      : [
          {
            id: 'sunday',
            title: 'Sunday Worship Service',
            description: 'Main Sunday celebration service with worship, Word, and ministry.',
            thumbnailUrl: '/sunday-services.jpeg',
            linkUrl: null,
          },
          {
            id: 'thursday',
            title: 'Thursday Online Connect',
            description: 'Online Connect Fellowship every Thursday 8:30 PM - 9:30 PM on Google Meet.',
            thumbnailUrl: '/online-connect.jpeg',
            linkUrl: null,
          },
          {
            id: 'friday',
            title: 'Friday Night Service',
            description: 'Friday night encounter in worship, intercession, and the Word.',
            thumbnailUrl: '/midweek-fri.jpeg',
            linkUrl: null,
          },
          {
            id: 'biblestudy',
            title: 'Sunday Bible Study',
            description: 'Grow deeper in Scripture before the main Sunday services.',
            thumbnailUrl: '/bible-study.jpeg',
            linkUrl: null,
          },
        ]

  return (
    <main>
      <Header />
      <PageHeader 
        title="Services & Programs" 
        subtitle="Spiritual Refreshment for Your Week"
        backgroundImage="/sunday-services.jpeg"
        hideDivider={true}
      />
      <div className={styles.container}>
        <section className={styles.carouselSection}>
          <h2 className={styles.carouselTitle}>Church Life & Activities</h2>
            <Carousel images={servicesCarousel} hideDivider={true} />
        <div className={styles.featuredGrid}>
          {effectiveServiceCards.map((card) => (
              <div key={card.id} className={styles.featuredCard}>
                {card.thumbnailUrl && (
                  <div className={styles.featuredImageWrap}>
                    <img src={card.thumbnailUrl} alt={card.title} className={styles.featuredImage} />
                  </div>
                )}
                <div className={styles.featuredContent}>
                  <h2 className={styles.featuredTitle}>{card.title}</h2>
                  {card.description && (
                    <p className={styles.featuredDescription}>{card.description}</p>
                  )}
                  <a
                    href={card.linkUrl || '/services'}
                    target={card.linkUrl ? '_blank' : undefined}
                    rel={card.linkUrl ? 'noopener noreferrer' : undefined}
                    className={styles.featuredButton}
                  >
                    {card.linkUrl ? 'Open Stream / Details' : 'View Service Details'}
                  </a>
                </div>
              </div>
            ))}
        </div>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
            <div className={styles.programsContainer}>
              {daysOrder.map((day) => {
                const dayPrograms = groupedPrograms[day] || []
                if (dayPrograms.length === 0) return null
                return (
                  <div key={day} className={styles.daySection}>
                    <h2 className={styles.dayTitle}>{day}</h2>
                    <div className={styles.programsGrid}>
                      {dayPrograms.map((program) => (
                        <div key={program.id} className={styles.programCard}>
                          {program.posterImageUrl && (
                            <div className={styles.programPosterWrap}>
                              <img src={program.posterImageUrl} alt={program.title} className={styles.programPoster} />
                            </div>
                          )}
                          <h3 className={styles.programTitle}>{program.title}</h3>
                          <div className={styles.programTime}>
                            <span>{program.startTime} - {program.endTime}</span>
                          </div>
                          <div className={styles.programVenue}><strong>Venue:</strong> {program.venue}</div>
                          {program.description && <p className={styles.programDescription}>{program.description}</p>}
                          {program.contacts && (() => {
                            try {
                              let contacts: string[] = [];
                              if (typeof program.contacts === 'string') {
                                contacts = JSON.parse(program.contacts);
                              } else if (Array.isArray(program.contacts)) {
                                contacts = program.contacts;
                              }
                              return contacts.length > 0 ? (
                                <div className={styles.programContacts}>
                                  <strong>Contact:</strong>{' '}
                                  {contacts.map((contact, idx) => (
                                    <a key={idx} href={`tel:${contact.replace(/\s/g, '')}`} className={styles.contactLink}>{contact}</a>
                                  ))}
                                </div>
                              ) : null
                            } catch {
                              return null
                            }
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
