import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './BackgroundCarouselSection.module.css'

interface Props {
  images: string[]
  badge: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
  alignment?: 'left' | 'right' | 'center'
  overlayVariant?: 'navy' | 'gold' | 'indigo' | 'dark'
  hideDivider?: boolean
}

export default function BackgroundCarouselSection({
  images,
  badge,
  title,
  description,
  ctaText,
  ctaLink,
  alignment = 'left',
  overlayVariant = 'navy',
  hideDivider = false
}: Props) {
  const [index, setIndex] = useState(0)

  // Ensure we only use 3 images as requested
  const sectionImages = images.slice(0, 3)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sectionImages.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [sectionImages.length])

  return (
    <section className={`${styles.section} ${hideDivider ? styles.noDivider : ''}`}>
      <div className={styles.backgroundContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className={styles.backgroundImage}
            style={{ backgroundImage: `url("${sectionImages[index]}")` }}
          />
        </AnimatePresence>
        <div className={`${styles.overlay} ${styles[`overlay_${overlayVariant}`]}`} />
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentWrapper} ${styles[alignment]}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.content}
          >
            <span className={styles.badge}>{badge}</span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
            <Link to={ctaLink} className={styles.btnPremium}>
              {ctaText}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
