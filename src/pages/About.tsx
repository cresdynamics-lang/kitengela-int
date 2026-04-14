import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ScrollReveal from '@/components/ScrollReveal'
import CoreValues from '@/components/CoreValues'
import Carousel from '@/components/Carousel'
import { publicApi } from '@/lib/api'
import styles from './About.module.css'

const FALLBACK = {
  churchName: 'VOSH Church International Kitengela',
  mission: 'To manifest Christ and be a house of solutions for our community.',
  vision: 'Building a community of believers who walk in holiness, unity, and purpose.',
  location: { city: 'Kitengela', address: 'Along Baraka Road / Treewa Road, Next to Balozi Junior Academy' }
}

const leadershipCarouselImages = [
  { id: 1, title: "Rev. Evans O. Kochoo - Senior Pastor", image: "/Rev.Evans1.jpeg", description: "Senior Pastor and founder of VOSH Church International Kitengela, known as 'The Eagle'" },
  { id: 2, title: "Rev. Evans O. Kochoo - Teaching Ministry", image: "/Rev.Evans2.jpeg", description: "Passionate teacher of God's Word with a heart for transforming lives" },
  { id: 3, title: "Rev. Evans O. Kochoo - Leadership", image: "/Rev.Evans3.jpeg", description: "Leading the church with wisdom, integrity, and a vision for community impact" },
  { id: 4, title: "Past. Nancy Sai - Ministry Leader", image: "/Past.Nancy.Sai.jpeg", description: "Dedicated ministry leader serving alongside Rev. Evans in various church ministries" },
  { id: 5, title: "Pastor Nancy Sai - Women's Ministry", image: "/PastorNancySai.jpeg", description: "Leading women's ministry and empowering women in their faith journey" }
]

export default function About() {
  const [siteInfo, setSiteInfo] = useState(FALLBACK)

  useEffect(() => {
    publicApi.getSite().then((res) => {
      if (res.success && res.data) {
        const d = res.data as any
        setSiteInfo({
          ...FALLBACK,
          churchName: d.churchName ?? FALLBACK.churchName,
          mission: d.missionText || FALLBACK.mission,
          vision: d.visionText || FALLBACK.vision,
          location: { city: 'Kitengela', address: d.locationText || FALLBACK.location.address }
        })
      }
    }).catch(() => {})
  }, [])

  return (
    <main className={styles.aboutMain}>
      <Header />
      <PageHeader 
        title="Who We Are" 
        subtitle={siteInfo.churchName}
        backgroundImage="/biblestudysundaymorning.jpeg"
        hideDivider={true}
      />

      <div className={styles.container}>
        {/* Mission & Vision Split Grid */}
        <div className={styles.mvGrid}>
          <ScrollReveal direction="left">
            <div className={styles.mvCard}>
              <div className={styles.cardImage} style={{ backgroundImage: 'url("/mission and vission.jpeg")' }} />
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <span className={styles.cardBadge}>Our Mission</span>
                <h2 className={styles.cardTitle}>Impact & Solutions</h2>
                <p className={styles.cardText}>{siteInfo.mission}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className={styles.mvCard}>
              <div className={styles.cardImage} style={{ backgroundImage: 'url("/churchcorevalues.jpeg")' }} />
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <span className={styles.cardBadge}>Our Vision</span>
                <h2 className={styles.cardTitle}>Spirit-Led Community</h2>
                <p className={styles.cardText}>{siteInfo.vision}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Leadership Featured Section */}
        <section className={styles.leadershipSpotlight}>
          <div className={styles.spotlightContent}>
            <ScrollReveal direction="left">
              <div className={styles.leaderPortrait}>
                <img src="/Rev.Evans1.jpeg" alt='Rev. Evans O. Kochoo' className={styles.portraitImg} />
                <div className={styles.portraitTag}>
                  <h3>Rev. Evans O. Kochoo</h3>
                  <p>"The Eagle"</p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right">
              <div className={styles.leaderBio}>
                <span className={styles.sectionBadge}>Our Leadership</span>
                <h2 className={styles.sectionTitle}>Guided by Faith & Vision</h2>
                <p className={styles.bioText}>
                  VOSH Church International Kitengela is led by <strong>Rev. Evans O. Kochoo</strong>, a passionate servant of God known for his apostolic vision and commitment to the pure Gospel.
                </p>
                <p className={styles.bioText}>
                  Under his leadership, our church has become a house of solutions, reaching thousands in Kitengela and beyond with the transforming power of Christ.
                </p>
                <Link to="/leadership/evans-kochoo" className={styles.premiumLink}>
                  Explore Full Leadership Profile
                  <span className={styles.linkArrow}>→</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Leadership Carousel */}
        <ScrollReveal direction="right">
          <section className={styles.carouselWrapper}>
            <h2 className={styles.carouselHeading}>The Leadership Team</h2>
            <Carousel images={leadershipCarouselImages} hideDivider={true} />
          </section>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <section className={styles.legacySection}>
            <div className={styles.addressBox}>
              <h2 className={styles.sectionTitle}>Visit Us</h2>
              <p className={styles.text}><strong>Location:</strong> {siteInfo.location.address}</p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <div className={styles.valuesBottom}>
            <CoreValues />
          </div>
        </ScrollReveal>
      </div>

      <Footer />
    </main>
  )
}
