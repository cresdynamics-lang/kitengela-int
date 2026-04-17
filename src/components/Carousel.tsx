import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Carousel.module.css'

interface CarouselImage {
  id: number
  title: string
  image: string
  description: string
  phoneNumbers?: string[]
  location?: string
  services?: string[]
}

interface CarouselProps {
  images: CarouselImage[]
  hideDivider?: boolean
}

export default function Carousel({ images, hideDivider = false }: CarouselProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (images.length === 0) return
    const timer = setInterval(() => {
      setDirection(1)
      setIndex((prev) => (prev + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [images.length])

  if (images.length === 0) return null

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.8 },
        scale: { duration: 1.2, ease: 'easeOut' },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setIndex((prev) => (prev + newDirection + images.length) % images.length)
  }

  const currentItem = images[index]

  return (
    <div className={`${styles.container} ${hideDivider ? styles.noDivider : ''}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={styles.slide}
        >
          <div className={styles.imageWrapper}>
            <img src={currentItem.image} alt={currentItem.title} className={styles.image} />
            <div className={styles.overlay} />
          </div>

          <div className={styles.contentContainer}>
            <div className={styles.contentInner}>
              <motion.h2
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.4,
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
                className={styles.title}
                style={{
                  textShadow: currentItem.title.includes('Katan Ngila') ? '0 0 30px rgba(255, 215, 0, 0.8)' : 'none'
                }}
              >
                {currentItem.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={styles.description}
              >
                {currentItem.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={styles.details}
              >
                {currentItem.location && (
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📍</span>
                    <span>{currentItem.location}</span>
                  </div>
                )}
                {currentItem.phoneNumbers && currentItem.phoneNumbers.length > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📞</span>
                    <span>{currentItem.phoneNumbers.join(' | ')}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button className={`${styles.navBtn} ${styles.prev}`} onClick={() => paginate(-1)}>
        ‹
      </button>
      <button className={`${styles.navBtn} ${styles.next}`} onClick={() => paginate(1)}>
        ›
      </button>

      <div className={styles.indicators}>
        {images.map((_, i) => (
          <button
            key={i}
            className={`${styles.indicator} ${i === index ? styles.indicatorActive : ''}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1)
              setIndex(i)
            }}
          />
        ))}
      </div>
    </div>
  )
}
