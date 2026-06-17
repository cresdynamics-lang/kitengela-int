import { getLiveJoinUrl, getNextSundayCalendarUrl } from '@/lib/live'
import type { NormalizedLive } from '@/lib/live'
import styles from './LiveStatusBar.module.css'

type LiveStatusBarProps = {
  live: NormalizedLive | null
  onJoinLive?: () => void
  className?: string
}

export default function LiveStatusBar({ live, onJoinLive, className = '' }: LiveStatusBarProps) {
  const calendarUrl = getNextSundayCalendarUrl()
  const liveJoinUrl = getLiveJoinUrl(live)

  const handleJoin = () => {
    if (onJoinLive) {
      onJoinLive()
      return
    }
    if (liveJoinUrl) {
      window.open(liveJoinUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section className={`${styles.bar} ${className}`.trim()} aria-live="polite">
      {live?.isLive ? (
        <div className={styles.inner}>
          <span className={styles.liveStatus}>
            <span className={styles.liveDot} aria-hidden />
            LIVE NOW: {live.title}
          </span>
          <button type="button" onClick={handleJoin} className={styles.action}>
            Join Now →
          </button>
        </div>
      ) : (
        <div className={styles.inner}>
          <div className={styles.next}>
            <span>🕐 Next Service: Sunday Worship — 9:30 AM</span>
            <span className={styles.meta}>Kitengela, Baraka Road | Online: Join via website</span>
          </div>
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className={styles.action}>
            Set Reminder
          </a>
        </div>
      )}
    </section>
  )
}
