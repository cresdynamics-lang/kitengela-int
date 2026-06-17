import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { HeroSlide } from '@/lib/carousels'
import styles from './HeroCarousel.module.css'

type Props = {
  slides: HeroSlide[]
  intervalMs?: number
  liveSlot?: React.ReactNode
}

export default function HeroCarousel({ slides, intervalMs = 7000, liveSlot }: Props) {
  const [index, setIndex] = useState(0)

  const goTo = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => goTo(index + 1), intervalMs)
    return () => clearInterval(timer)
  }, [slides.length, intervalMs, index, goTo])

  if (slides.length === 0) return null

  const slide = slides[index]

  return (
    <section className={styles.hero} aria-roledescription="carousel" aria-label="Featured highlights">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className={styles.slide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <div
            className={styles.bg}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden
          />
          <div className={styles.overlay} />
        </motion.div>
      </AnimatePresence>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${slide.id}`}
            className={styles.textBlock}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {slide.label && <p className={styles.label}>{slide.label}</p>}
            <h1 className={styles.headline}>{slide.headline}</h1>
            {slide.scriptureText && (
              <blockquote className={styles.scripture}>
                &ldquo;{slide.scriptureText}&rdquo;
                {slide.scriptureRef && <cite>— {slide.scriptureRef}</cite>}
              </blockquote>
            )}
            {slide.ctaText && slide.ctaLink && (
              <Link to={slide.ctaLink} className={styles.cta}>
                {slide.ctaText} →
              </Link>
            )}
          </motion.div>
        </AnimatePresence>

        {liveSlot && <div className={styles.actionsSlot}>{liveSlot}</div>}

        {slides.length > 1 && (
          <div className={styles.dots} role="tablist" aria-label="Slide navigation">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.headline}`}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
