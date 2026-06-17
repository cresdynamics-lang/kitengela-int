import { useState } from 'react'
import LivePlayer from '@/components/LivePlayer'
import styles from './SermonCarousel.module.css'

export type SermonItem = {
  id: string
  title: string
  date?: string
  description?: string
  thumbnailUrl?: string | null
  videoUrl?: string | null
}

type Props = {
  sermons: SermonItem[]
}

export default function SermonCarousel({ sermons }: Props) {
  const [playerUrl, setPlayerUrl] = useState<string | null>(null)

  if (sermons.length === 0) {
    return <p className={styles.empty}>Sermons coming soon.</p>
  }

  return (
    <>
      <div className={styles.track}>
        {sermons.map((sermon) => (
          <article key={sermon.id} className={styles.card}>
            <button
              type="button"
              className={styles.thumbBtn}
              onClick={() => sermon.videoUrl && setPlayerUrl(sermon.videoUrl)}
              disabled={!sermon.videoUrl}
            >
              {sermon.thumbnailUrl ? (
                <img src={sermon.thumbnailUrl} alt="" className={styles.thumb} loading="lazy" />
              ) : (
                <div className={styles.thumbPlaceholder} />
              )}
              <span className={styles.play} aria-hidden>▶</span>
            </button>
            <div className={styles.body}>
              <h3 className={styles.title}>{sermon.title}</h3>
              {sermon.date && <p className={styles.date}>{sermon.date}</p>}
              {sermon.description && <p className={styles.desc}>{sermon.description}</p>}
            </div>
          </article>
        ))}
      </div>
      {playerUrl && <LivePlayer url={playerUrl} onClose={() => setPlayerUrl(null)} />}
    </>
  )
}
