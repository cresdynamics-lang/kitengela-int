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
}

interface ServiceCard {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  linkUrl: string | null
}

const churchActivitiesCarouselImages = [
  { id: 1, title: "Sunday Worship Experience", image: "/sundayservices.jpeg", description: "Join us every Sunday for powerful worship and life-changing messages" },
  { id: 2, title: "Bible Study Sessions", image: "/biblestudysundaymorning.jpeg", description: "Deep dive into God's Word and grow in your understanding of Scripture" },
  { id: 3, title: "Corporate Prayer", image: "/churchpraying.jpg", description: "Experience the power of corporate prayer and intercession" },
  { id: 4, title: "Praise & Worship", image: "/praiseandworshipdancing.jpg", description: "Celebrate God's goodness through vibrant praise and worship" },
  { id: 5, title: "Community Service", image: "/WhatsApp Image 2026-04-08 at 13.57.59 (2).jpeg", description: "Serving our community with love and compassion" },
  { id: 6, title: "Spiritual Growth", image: "/WhatsApp Image 2026-04-08 at 13.58.00.jpeg", description: "Growing together in faith and spiritual maturity" },
  { id: 7, title: "Midweek Services", image: "/midweekservicefriday.jpeg", description: "Midweek spiritual refreshment and fellowship" },
  { id: 8, title: "Online Connection", image: "/onlineconnectthurday.jpeg", description: "Connect with us online for prayer and fellowship" }
]

export default function Services() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [groupedPrograms, setGroupedPrograms] = useState<Record<string, Program[]>>({})
  const [loading, setLoading] = useState(true)
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([])

  useEffect(() => {
    Promise.all([publicApi.getWeeklyPrograms(), publicApi.getSermons()])
      .then(([programsRes, sermonsRes]) => {
        if (programsRes.success && Array.isArray(programsRes.data)) {
          const progData = programsRes.data as Program[]
          setPrograms(progData)
          const grouped: Record<string, Program[]> = {}
          progData.forEach((p) => {
            if (!grouped[p.day]) grouped[p.day] = []
            grouped[p.day].push(p)
          })
          setGroupedPrograms(grouped)
        }

        if (sermonsRes.success && Array.isArray(sermonsRes.data)) {
          const mapped = (sermonsRes.data as any[])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map((s) => ({
              id: s.id,
              title: s.title || 'Service',
              description: s.description || null,
              thumbnailUrl: s.thumbnailUrl || null,
              linkUrl: s.videoUrl || s.audioUrl || null,
            }))
          setServiceCards(mapped)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const effectiveServiceCards: ServiceCard[] =
    serviceCards.length > 0
      ? serviceCards
      : [
          {
            id: 'sunday',
            title: 'Sunday Worship Service',
            description: 'Main Sunday celebration service with worship, Word, and ministry.',
            thumbnailUrl: '/sundayservices.jpeg',
            linkUrl: null,
          },
          {
            id: 'wednesday',
            title: 'Wednesday Online Prayers',
            description: 'Midweek online prayer gathering to seek God together.',
            thumbnailUrl: '/midweekwednesday.jpeg',
            linkUrl: null,
          },
          {
            id: 'friday',
            title: 'Friday Night Service',
            description: 'Friday night encounter in worship, intercession, and the Word.',
            thumbnailUrl: '/midweekservicefriday.jpeg',
            linkUrl: null,
          },
          {
            id: 'biblestudy',
            title: 'Sunday Bible Study',
            description: 'Grow deeper in Scripture before the main Sunday services.',
            thumbnailUrl: '/biblestudysundaymorning.jpeg',
            linkUrl: null,
          },
        ]

  return (
    <main>
      <Header />
      <PageHeader 
        title="Services & Programs" 
        subtitle="Spiritual Refreshment for Your Week"
        backgroundImage="/sundayservices.jpeg"
        hideDivider={true}
      />
      <div className={styles.container}>
        <ScrollReveal direction="right">
          <section className={styles.carouselSection}>
            <h2 className={styles.carouselTitle}>Church Life & Activities</h2>
            <Carousel images={churchActivitiesCarouselImages} hideDivider={true} />
          </section>
        </ScrollReveal>
        <ScrollReveal direction="right">
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
        </ScrollReveal>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <ScrollReveal direction="right">
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
          </ScrollReveal>
        )}
      </div>
      <Footer />
    </main>
  )
}
