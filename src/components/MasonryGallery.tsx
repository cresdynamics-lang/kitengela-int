import { useState } from 'react'
import styles from './MasonryGallery.module.css'

type Props = {
  images: string[]
  altPrefix?: string
}

export default function MasonryGallery({ images, altPrefix = 'Gallery' }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const close = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  const next = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length))

  return (
    <>
      <div className={styles.grid}>
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            className={styles.item}
            onClick={() => setLightboxIndex(i)}
          >
            <img src={src} alt={`${altPrefix} ${i + 1}`} className={styles.image} loading="lazy" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" onClick={close}>
          <button type="button" className={styles.close} onClick={close} aria-label="Close">
            ×
          </button>
          <button
            type="button"
            className={styles.lbNav}
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous"
          >
            ‹
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`${altPrefix} ${lightboxIndex + 1}`}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className={styles.lbNav}
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}
