import { useRef } from 'react'
import type { GenerationCard } from '@/lib/carousels'
import styles from './GenerationsCarousel.module.css'

type Props = {
  groups: GenerationCard[]
}

export default function GenerationsCarousel({ groups }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.arrow} onClick={() => scroll(-1)} aria-label="Previous">
        ‹
      </button>
      <div className={styles.track} ref={trackRef}>
        {groups.map((group) => (
          <article key={group.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={group.imageUrl} alt={group.groupName} className={styles.image} loading="lazy" />
              <div className={styles.overlay}>
                <p className={styles.scripture}>&ldquo;{group.scriptureText}&rdquo;</p>
                <cite className={styles.ref}>— {group.scriptureRef}</cite>
              </div>
            </div>
            <h3 className={styles.title}>{group.groupName}</h3>
          </article>
        ))}
      </div>
      <button type="button" className={styles.arrow} onClick={() => scroll(1)} aria-label="Next">
        ›
      </button>
    </div>
  )
}
