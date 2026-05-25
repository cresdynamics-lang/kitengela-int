import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Carousel from '@/components/Carousel'
import Header from '@/components/Header'
import Services from '@/components/Services'
import CoreValues from '@/components/CoreValues'
import Footer from '@/components/Footer'
import BackgroundCarouselSection from '@/components/BackgroundCarouselSection'
import { publicApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import styles from './Home.module.css'

const heroImages = [
  { id: 0, title: "Welcome to Kitengela", image: "/Carousel1.jpg", description: "#House_Of_Solutions", verse: "I was glad when they said to me, 'Let us go to the house of the LORD!' - Psalm 122:1" },
  { id: 1, title: "Manifesting Christ in Our Community", image: "/Carousel2.jpg", description: "We are a House of Solutions, reaching out with love and power in Kitengela." },
  { id: 2, title: "Experience Supernatural Worship", image: "/carousel3.jpeg", description: "Join us this Sunday along Baraka Road for a time of refreshment and miracles." },
]

const foundationImages = [
  "/whatsapp-12.jpeg",
  "/whatsapp-13.jpeg",
  "/whatsapp-14.jpeg"
]

const reachImages = [
  "/whatsapp-15.jpeg",
  "/whatsapp-16.jpeg",
  "/whatsapp-17.jpeg",
  "/whatsapp-18.jpeg"
]

const prayerImages = [
  "/whatsapp-1.jpeg",
  "/whatsapp-2.jpeg",
  "/whatsapp-4.jpeg"
]

const givingImages = [
  "/whatsapp-7.jpeg",
  "/whatsapp-11.jpeg",
  "/whatsapp-12.jpeg"
]

// Universal Exclusion List: Images used across the entire site that should NOT be in the gallery
const SYSTEM_IMAGES: string[] = [
  ...heroImages.map(img => img.image),
  ...foundationImages,
  ...reachImages,
  ...prayerImages,
  ...givingImages,
  "/logo/church-logo.jpeg",
  "/logo/vosh-logo.png",
  "/logo/logo.png",
  "/Past.Nancy.Sai.jpeg",
  "/PastorNancySai.jpeg",
  "/Rev.Evans1.jpeg",
  "/Rev.Evans2.jpeg",
  "/Rev.Evans3.jpeg",
  "/mission-vision.jpeg",
  "/core-values.jpeg",
  "/bible-study.jpeg"
]

// Use SYSTEM_IMAGES to filter gallery
void SYSTEM_IMAGES

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

export default function Home() {
  const [services, setServices] = useState<any[]>([])
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "/whatsapp-1.jpeg",
    "/whatsapp-2.jpeg",
    "/whatsapp-4.jpeg",
    "/whatsapp-7.jpeg",
    "/whatsapp-11.jpeg",
    "/whatsapp-12.jpeg",
    "/whatsapp-13.jpeg",
    "/whatsapp-14.jpeg",
    "/whatsapp-15.jpeg",
    "/whatsapp-16.jpeg",
    "/whatsapp-17.jpeg",
    "/whatsapp-18.jpeg",
    "/whatsapp-19.jpeg"
  ])
  const [heroImagesState, setHeroImagesState] = useState<any[]>(heroImages)
  const [foundationImagesState, setFoundationImagesState] = useState<string[]>(foundationImages)
  const [reachImagesState, setReachImagesState] = useState<string[]>(reachImages)
  const [prayerImagesState, setPrayerImagesState] = useState<string[]>(prayerImages)
  const [givingImagesState, setGivingImagesState] = useState<string[]>(givingImages)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await publicApi.getPhotos()
        if (response.success && Array.isArray(response.data)) {
          const allPhotos = response.data as any[]
          
          // 1. Update Gallery (All photos) - exclude non-gallery categories if needed
          const galleryPhotos = allPhotos.filter(p => !['hero', 'foundation', 'reach', 'prayer', 'giving', 'discipleship', 'ministries', 'contact'].includes(p.category)).map(p => p.url)
          
          if (galleryPhotos.length > 0) {
            setGalleryImages(galleryPhotos)
          }

          // 2. Helper to get top 3 by category (used for fallback)
          const getByCategory = (cat: string): string[] => allPhotos.filter(p => p.category === cat).slice(0, 3).map(p => p.url)
          
          // Use getByCategory for fallback images
          void getByCategory

          // 3. Update Hero
          const heroPhotos = allPhotos.filter(p => p.category === 'hero').slice(0, 3)
          if (heroPhotos.length > 0) {
            const dynamicHero = heroPhotos.map((p, i) => ({
              id: p.id,
              title: i === 0 ? "Welcome to Kitengela" : i === 1 ? "Manifesting Christ in Our Community" : "Experience Supernatural Worship",
              image: p.url,
              description: i === 0 ? "#House_Of_Solutions - Transforming lives through the pure Word and building strong faith for our community." : i === 1 ? "We are a House of Solutions, reaching out with love and power in Kitengela." : "Join us this Sunday along Baraka Road for a time of refreshment and miracles.",
              verse: i === 0 ? "I was glad when they said to me, 'Let us go to the house of the LORD!' - Psalm 122:1" : undefined
            }))
            // Do not merge with fallbacks. Only use admin-selected images.
            setHeroImagesState(dynamicHero)
          } else {
            setHeroImagesState(heroImages)
          }

          // 4. Update Sections with guaranteed 3 images
          const usedImagesSet = new Set<string>()
          
          const updateSection = (cat: string, fallbackArr: string[], setState: Function) => {
            const catPhotos = allPhotos.filter(p => p.category === cat).map(p => p.url)
            const finalImages = catPhotos.length >= 3 
              ? catPhotos.slice(0, 3) 
              : [...catPhotos, ...fallbackArr.slice(0, 3 - catPhotos.length)]
            
            setState(finalImages)
            // Track these as used
            finalImages.forEach(img => usedImagesSet.add(img))
          }

          updateSection('foundation', foundationImages, setFoundationImagesState)
          updateSection('reach', reachImages, setReachImagesState)
          updateSection('prayer', prayerImages, setPrayerImagesState)
          updateSection('giving', givingImages, setGivingImagesState)

          // Track hero images as used too
          heroImagesState.forEach(item => usedImagesSet.add(item.image))

        }
      } catch (error) {
        console.error('Error fetching gallery:', error)
      }
    }

    // Timeout mechanism: fail fast if Supabase takes too long (e.g. 1500ms)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API Timeout')), 1500)
    )

    Promise.all([
      Promise.race([
        publicApi.getWeeklyPrograms(),
        timeoutPromise
      ]).then((r: any) => {
        if (r && r.success && Array.isArray(r.data)) {
          setServices((r.data as any[]).map((p) => ({
            id: p.id,
            name: p.title || p.name || '',
            time: p.startTime && p.endTime ? `${p.startTime} - ${p.endTime}` : p.startTime || p.time || '',
            day: p.day || '',
            description: p.description || '',
            venue: p.venue || '',
            url: p.url || p.linkUrl || p.venue || ''
          })))
        }
      }).catch(err => console.warn('Programs fetch failed or timed out:', err)),
      Promise.race([
        fetchGallery(),
        timeoutPromise
      ]).catch(err => console.warn('Gallery fetch failed or timed out:', err))
    ]).finally(() => setLoading(false))

    // Real-time updates subscription
    const channel = supabase
      .channel('public:photos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => {
        fetchGallery()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <main className={styles.main}>
      <Header />
      <Carousel images={heroImagesState} />

      {/* 1. Our Foundation (Left Aligned) */}
      <BackgroundCarouselSection
        images={foundationImagesState}
        badge="Our Foundation"
        title="Rooted in the Word, Rising in Spirit"
        description="VOSH Church International Kitengela is built on the apostolic mandate to disseminate the pure Gospel of Jesus Christ. We are a house of spiritual solutions where miracles are matched with sound teaching."
        scripture="Built on the foundation of the apostles and prophets, with Christ Jesus himself as the chief cornerstone. - Ephesians 2:20"
        ctaText="Discover Our Roots"
        ctaLink="/about"
        alignment="left"
        overlayVariant="navy"
      />

      {/* 2. Community Reach (Left Aligned) */}
      <BackgroundCarouselSection
        images={reachImagesState}
        badge="Community Reach"
        title="Love Beyond Our Walls"
        description="Our mission extends to the streets of Kitengela and beyond. Through our outreach programs, we bring hope, healing, and the tangible love of Christ to those who need it most."
        scripture="Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit. - Matthew 28:19"
        ctaText="Our Mission In Action"
        ctaLink="/outreach"
        alignment="left"
        overlayVariant="gold"
      />

      {/* 3. House of Prayer (Center Aligned) */}
      <BackgroundCarouselSection
        images={prayerImagesState}
        badge="House of Prayer"
        title="Experience the Supernatural"
        description="Join our vibrant community of believers as we lift our voices in prayer and worship. Experience a time of refreshment, healing, and divine encounters in the presence of God."
        scripture="For my house will be called a house of prayer for all nations. - Isaiah 56:7"
        ctaText="View Service Times"
        ctaLink="/services"
        alignment="center"
        overlayVariant="indigo"
      />

      {/* 4. Generous Living (Left Aligned) */}
      <BackgroundCarouselSection
        images={givingImagesState}
        badge="Generous Living"
        title="Partnering for Transformation"
        description="Your support enables us to reach more lives with the Gospel and impact our community through tangible acts of love. Partner with us today to build the kingdom of God together."
        scripture="Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver. - 2 Corinthians 9:7"
        ctaText="Ways to Give"
        ctaLink="/give"
        alignment="left"
        overlayVariant="dark"
        hideDivider={true}
      />

      {/* 5. Services Grid */}
      <div id="services">
        {loading ? <div className={styles.container} style={{ padding: '80px 20px', textAlign: 'center' }}>Loading services...</div> : <Services services={services} />}
      </div>

      {/* 6. Media In Pictures Section (Marquee) */}
      <section className={`${styles.section} ${styles.mediaSection}`}>
        <div className={styles.container}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className={styles.badge}>In Pictures</span>
            <h2 className={styles.title}>Life at VOSH Kitengela</h2>
          </motion.div>
        </div>
        
        {/* Infinite Marquee Container */}
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {/* Render images twice for seamless infinite scroll */}
            {[...galleryImages, ...galleryImages].map((img, i) => (
              <div key={i} className={styles.marqueeItem}>
                <img 
                  src={img} 
                  alt="Church gallery" 
                  className={styles.marqueeImg} 
                  loading="lazy" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    // Optionally hide the parent div to remove the empty box
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) parent.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CoreValues />
      <Footer />
    </main>
  )
}
