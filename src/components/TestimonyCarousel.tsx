import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './TestimonyCarousel.module.css'

export type TestimonyItem = {
  id: string
  name: string
  quote: string
  photoUrl?: string | null
  memberSince?: string
}

type Props = {
  testimonials: TestimonyItem[]
  intervalMs?: number
}

export default function TestimonyCarousel({ testimonials, intervalMs = 8000 }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [testimonials.length, intervalMs])

  if (testimonials.length === 0) return null

  const item = testimonials[index]

  const go = (dir: -1 | 1) => {
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length)
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.nav} onClick={() => go(-1)} aria-label="Previous testimony">
        ‹
      </button>

      <AnimatePresence mode="wait">
        <motion.article
          key={item.id}
          className={styles.card}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          {item.photoUrl ? (
            <img src={item.photoUrl} alt="" className={styles.photo} />
          ) : (
            <div className={styles.photoPlaceholder}>{item.name.charAt(0)}</div>
          )}
          <blockquote className={styles.quote}>
            &ldquo;{item.quote}&rdquo;
            <footer className={styles.footer}>
              — {item.name}
              {item.memberSince && <span className={styles.since}>, {item.memberSince}</span>}
            </footer>
          </blockquote>
        </motion.article>
      </AnimatePresence>

      <button type="button" className={styles.nav} onClick={() => go(1)} aria-label="Next testimony">
        ›
      </button>

      <div className={styles.dots}>
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            aria-label={`Testimony ${i + 1}`}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
