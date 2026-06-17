import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'
import { ROUTES } from '@/lib/routes'
import { getLiveJoinUrl } from '@/lib/live'
import { useLiveStatus } from '@/hooks/useLiveStatus'
import LivePlayer from './LivePlayer'

const NAV_ITEMS = [
  { name: 'Who We Are', path: ROUTES.whoWeAre },
  { name: 'Leadership', path: ROUTES.leadership },
  { name: 'Services', path: ROUTES.services },
  { name: 'Discipleship', path: ROUTES.discipleship },
  { name: 'Join Us', path: ROUTES.joinUs },
  { name: 'Give', path: ROUTES.give },
]

export default function Header() {
  const { live } = useLiveStatus()
  const [showPlayer, setShowPlayer] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const liveJoinUrl = getLiveJoinUrl(live)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setShowPlayer(false)
  }, [location.pathname])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleWatchLive = () => {
    if (live?.isLive && liveJoinUrl) {
      if (live.youtubeLiveUrl) {
        setShowPlayer(true)
      } else {
        window.open(liveJoinUrl, '_blank', 'noopener,noreferrer')
      }
    }
    closeMenu()
  }

  return (
    <>
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <Link to={ROUTES.home} className={styles.logoLink} onClick={closeMenu}>
              <img
                src="/logo/church-logo.jpeg"
                alt="VOSH Church Logo"
                className={styles.logo}
              />
              <div className={styles.logoText}>
                <h1 className={styles.churchName}>VOSH Church</h1>
                <p className={styles.locationTag}>KITENGELA</p>
              </div>
            </Link>
          </div>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}

            <div className={styles.navActions}>
              <button
                type="button"
                onClick={handleWatchLive}
                className={`${styles.watchLiveBtn} ${live?.isLive ? styles.watchLiveBtnActive : ''}`}
                disabled={!live?.isLive}
              >
                {live?.isLive && <span className={styles.liveDot} aria-hidden />}
                Watch Live
              </button>

              <Link to={`${ROUTES.joinUs}#plan-visit`} className={styles.planVisitBtn} onClick={closeMenu}>
                Plan Your Visit →
              </Link>
            </div>
          </nav>

          <div className={styles.mobileActions}>
            <button
              className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          </div>
        </div>
      </header>

      {showPlayer && live?.youtubeLiveUrl && (
        <LivePlayer url={live.youtubeLiveUrl} onClose={() => setShowPlayer(false)} />
      )}
    </>
  )
}
