import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
          location: { city: 'Kitengela', address: d.locationText || FALLBACK.location.address }
        })
      }
    }).catch(() => {})
  }, [])

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>About Us</h1>
          <p className={styles.subtitle}>{siteInfo.churchName}</p>
        </div>
        <ScrollReveal direction="left">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.text}>{siteInfo.mission}</p>
          </section>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Vision</h2>
            <p className={styles.text}>{siteInfo.vision}</p>
          </section>
        </ScrollReveal>
        <ScrollReveal direction="left">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Leadership</h2>
            <p className={styles.text}>
              VOSH Church International Kitengela is led by <strong>Rev. Evans O. Kochoo</strong> ("The Eagle").
            </p>
            <p className={styles.text}>
              <Link to="/leadership/evans-kochoo" className={styles.leaderLink}>Learn more about Rev. Evans O. Kochoo →</Link>
            </p>
          </section>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Meet Our Leadership Team</h2>
            <Carousel images={leadershipCarouselImages} />
          </section>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <p className={styles.text}><strong>Address:</strong> {siteInfo.location.address}</p>
          </section>
        </ScrollReveal>
        <ScrollReveal direction="left"><CoreValues /></ScrollReveal>
      </div>
      <Footer />
    </main>
  )
}
