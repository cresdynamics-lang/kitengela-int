import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LivePlayer.module.css'

interface Props {
  url: string
  onClose: () => void
}

export default function LivePlayer({ url, onClose }: Props) {
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() => {
    // Extract video ID from youtube URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      setVideoId(match[2])
    }
  }, [url])

  if (!videoId) return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.overlay}
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={styles.modal}
          onClick={e => e.stopPropagation()}
        >
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
          <div className={styles.videoWrapper}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className={styles.info}>
            <span className={styles.liveBadge}>LIVE NOW</span>
            <p>Join us for our live service or prayer session.</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
