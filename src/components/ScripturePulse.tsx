import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ScriptureVerse } from '@/lib/scripture'
import styles from './ScripturePulse.module.css'

type Props = {
  verses: ScriptureVerse[]
  backgroundImage?: string
  intervalMs?: number
}

export default function ScripturePulse({ verses, backgroundImage, intervalMs = 6000 }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (verses.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % verses.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [verses.length, intervalMs])

  if (verses.length === 0) return null

  const verse = verses[index]

  return (
    <section
      className={styles.section}
      style={backgroundImage ? { '--pulse-bg': `url(${backgroundImage})` } as React.CSSProperties : undefined}
      aria-live="polite"
    >
      <div className={styles.inner}>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={verse.id}
            className={styles.quote}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7 }}
          >
            &ldquo;{verse.text}&rdquo;
            <cite>— {verse.reference}</cite>
          </motion.blockquote>
        </AnimatePresence>

        {verses.length > 1 && (
          <div className={styles.dots}>
            {verses.map((v, i) => (
              <button
                key={v.id}
                type="button"
                aria-label={`Scripture ${i + 1}`}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
