import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ScrollReveal from '@/components/ScrollReveal'
import Carousel from '@/components/Carousel'
import { publicApi } from '@/lib/api'
import styles from './Leadership.module.css'

const defaultLeaders = [
  { id: 'evans-kochoo', name: 'Rev. Evans O. Kochoo', title: 'Senior Pastor', bio: 'I am Evans O. Kochoo, fondly known as The Eagle, a passionate servant of God driven by a dynamic apostolic mandate to disseminate the pure and unadulterated Gospel of Jesus Christ.', imageUrl: '/Rev.Evans1.jpeg', orderIndex: 1 },
  { id: 'pastor-nancy-sai', name: 'Pastor Nancy Sai', title: 'Assistant Pastor', bio: 'Pastor Nancy Sai serves as the Assistant Pastor at Kitengela VOSH International Church. She is passionate about advancing God\'s Kingdom through sound teaching, servant leadership, and community impact. With a heart for people and excellence in ministry, Pastor Sai is committed to nurturing spiritual growth and empowering believers to fulfill their God-given purpose.', imageUrl: '/PastorNancySai.jpeg', orderIndex: 2 }
]

const leadershipShowcaseCarouselImages = [
  { id: 1, title: "Rev. Evans O. Kochoo - Senior Pastor", image: "/Rev.Evans1.jpeg", description: "Senior Pastor and founder, leading with apostolic vision and passion" },
  { id: 2, title: "Teaching Ministry", image: "/Rev.Evans2.jpeg", description: "Dynamic teaching of God's Word with clarity and anointing" },
  { id: 3, title: "Pastoral Leadership", image: "/Rev.Evans3.jpeg", description: "Shepherding the flock with wisdom and spiritual insight" },
  { id: 4, title: "Pastor Nancy Sai - Ministry", image: "/Past.Nancy.Sai.jpeg", description: "Dedicated service in various church ministries" },
  { id: 5, title: "Women's Leadership", image: "/PastorNancySai.jpeg", description: "Empowering women in faith and ministry" }
]

export default function Leadership() {
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [leadershipCarousel, setLeadershipCarousel] = useState(leadershipShowcaseCarouselImages)

  useEffect(() => {
    publicApi.getLeaders()
      .then((response) => {
        if (response.success && response.data && Array.isArray(response.data) && response.data.length >= 2) {
          setLeaders(response.data)
        } else {
          setLeaders(defaultLeaders)
        }
      })
      .catch(() => setLeaders(defaultLeaders))
      .finally(() => setLoading(false))

    // Fetch leadership page images
    publicApi.getPhotos().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const photos = res.data as any[]
        const leadershipPhotos = photos.filter(p => p.category === 'leadership')
        if (leadershipPhotos.length > 0) {
          const carouselImages = leadershipPhotos.slice(0, 5).map((p, i) => ({
            id: i + 1,
            title: i === 0 ? "Rev. Evans O. Kochoo - Senior Pastor" : i === 1 ? "Teaching Ministry" : i === 2 ? "Pastoral Leadership" : i === 3 ? "Pastor Nancy Sai - Ministry" : "Women's Leadership",
            image: p.url,
            description: "Leadership in action at VOSH Church"
          }))
          setLeadershipCarousel(carouselImages)
        }
      }
    }).catch(() => {})
  }, [])

  const getSlug = (leader: any) => {
    if (leader.name?.toLowerCase().includes('evans')) return 'evans-kochoo'
    if (leader.id === 'pastor-nancy-sai' || leader.name?.toLowerCase().includes('nancy')) return 'pastor-nancy-sai'
    return leader.id
  }
  const getImageUrl = (leader: any) => {
    if (leader.imageUrl) return leader.imageUrl
    if (leader.name?.toLowerCase().includes('evans')) return '/Rev.Evans1.jpeg'
    if (leader.name?.toLowerCase().includes('nancy')) return '/PastorNancySai.jpeg'
    return null
  }

  return (
    <main>
      <Header />
      <PageHeader 
        title="Our Leadership" 
        subtitle="Meet Our Dedicated Service Team"
        backgroundImage="/Rev.Evans1.jpeg"
        hideDivider={true}
      />
      <div className={styles.container}>
        <ScrollReveal direction="right">
          <section className={styles.carouselSection}>
            <Carousel images={leadershipCarousel} hideDivider={true} />
          </section>
        </ScrollReveal>
        {loading ? <div className={styles.loading}>Loading...</div> : (
          <ScrollReveal direction="right">
            <div className={styles.leadersGrid}>
              {leaders.length > 0 ? leaders.map((leader) => (
                <Link key={leader.id} to={`/leadership/${getSlug(leader)}`} className={styles.leaderCard}>
                  <div className={styles.imageContainer}>
                    {getImageUrl(leader) ? (
                      <img src={getImageUrl(leader)!} alt={leader.name} className={styles.leaderImage} />
                    ) : (
                      <div className={styles.placeholderImage}><span className={styles.placeholderText}>{leader.name?.charAt(0)}</span></div>
                    )}
                  </div>
                  <div className={styles.leaderInfo}>
                    <h3 className={styles.leaderName}>{leader.name}</h3>
                    <p className={styles.leaderTitle}>{leader.title}</p>
                    {leader.bio && <p className={styles.leaderBio}>{leader.bio.length > 150 ? `${leader.bio.substring(0, 150)}...` : leader.bio}</p>}
                    <span className={styles.readMore}>Read More →</span>
                  </div>
                </Link>
              )) : <div className={styles.empty}><p>Leadership information coming soon.</p></div>}
            </div>
          </ScrollReveal>
        )}
      </div>
      <Footer />
    </main>
  )
}
