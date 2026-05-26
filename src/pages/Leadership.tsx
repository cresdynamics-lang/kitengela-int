import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ScrollReveal from '@/components/ScrollReveal'
import Carousel from '@/components/Carousel'
import { publicApi } from '@/lib/api'
import { defaultLeaders, normalizeLeaders, resolvePublicLeaders, type PublicLeader } from '@/lib/leaders'
import styles from './Leadership.module.css'

const leadershipShowcaseCarouselImages = [
  { id: 1, title: 'Rev. Evans O. Kochoo - Senior Pastor', image: '/Rev.Evans1.jpeg', description: 'Senior Pastor and founder, leading with apostolic vision and passion' },
  { id: 2, title: 'Teaching Ministry', image: '/Rev.Evans2.jpeg', description: "Dynamic teaching of God's Word with clarity and anointing" },
  { id: 3, title: 'Pastoral Leadership', image: '/Rev.Evans3.jpeg', description: 'Shepherding the flock with wisdom and spiritual insight' },
  { id: 4, title: 'Pastor Nancy Sai - Ministry', image: '/Past.Nancy.Sai.jpeg', description: 'Dedicated service in various church ministries' },
  { id: 5, title: "Women's Leadership", image: '/PastorNancySai.jpeg', description: 'Empowering women in faith and ministry' },
]

function leadersToCarousel(leaders: PublicLeader[]) {
  const withPhotos = leaders.filter((l) => l.imageUrl)
  if (withPhotos.length === 0) return null
  return withPhotos.slice(0, 6).map((leader, i) => ({
    id: i + 1,
    title: `${leader.name} — ${leader.title}`,
    image: leader.imageUrl!,
    description: leader.bio ? leader.bio.slice(0, 120) + (leader.bio.length > 120 ? '…' : '') : 'Leadership at VOSH Church',
  }))
}

export default function Leadership() {
  const [leaders, setLeaders] = useState<PublicLeader[]>([])
  const [loading, setLoading] = useState(true)
  const [leadershipCarousel, setLeadershipCarousel] = useState(leadershipShowcaseCarouselImages)

  useEffect(() => {
    publicApi
      .getLeaders()
      .then((response) => {
        if (!response.success) {
          setLeaders(defaultLeaders)
          return
        }
        const fromApi = normalizeLeaders(response.data)
        const list = resolvePublicLeaders(fromApi)
        setLeaders(list)

        const leaderCarousel = leadersToCarousel(list)
        if (leaderCarousel && leaderCarousel.length > 0) {
          setLeadershipCarousel(leaderCarousel)
        }
      })
      .catch(() => {
        setLeaders(defaultLeaders)
      })
      .finally(() => setLoading(false))

    publicApi
      .getPhotos()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const photos = res.data as { category?: string; url?: string }[]
          const leadershipPhotos = photos.filter((p) => p.category === 'leadership' && p.url)
          if (leadershipPhotos.length > 0) {
            const carouselImages = leadershipPhotos.slice(0, 5).map((p, i) => ({
              id: i + 1,
              title: leadershipPhotos.length === 1 ? 'Our Leadership' : `Leadership ${i + 1}`,
              image: p.url!,
              description: 'Leadership in action at VOSH Church',
            }))
            setLeadershipCarousel(carouselImages)
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <main>
      <Header />
      <PageHeader
        title="Our Leadership"
        subtitle="Meet Our Dedicated Service Team"
        backgroundImage={leaders[0]?.imageUrl || '/Rev.Evans1.jpeg'}
        hideDivider={true}
      />
      <div className={styles.container}>
        <ScrollReveal direction="right">
          <section className={styles.carouselSection}>
            <Carousel images={leadershipCarousel} hideDivider={true} />
          </section>
        </ScrollReveal>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <ScrollReveal direction="right">
            <div className={styles.leadersGrid}>
              {leaders.length > 0 ? (
                leaders.map((leader) => (
                  <Link key={leader.id} to={`/leadership/${leader.id}`} className={styles.leaderCard}>
                    <div className={styles.imageContainer}>
                      {leader.imageUrl ? (
                        <img src={leader.imageUrl} alt={leader.name} className={styles.leaderImage} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <span className={styles.placeholderText}>{leader.name?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.leaderInfo}>
                      <h3 className={styles.leaderName}>{leader.name}</h3>
                      <p className={styles.leaderTitle}>{leader.title}</p>
                      {leader.bio && (
                        <p className={styles.leaderBio}>
                          {leader.bio.length > 150 ? `${leader.bio.substring(0, 150)}...` : leader.bio}
                        </p>
                      )}
                      <span className={styles.readMore}>Read More →</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={styles.empty}>
                  <p>Leadership information coming soon.</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>
      <Footer />
    </main>
  )
}
