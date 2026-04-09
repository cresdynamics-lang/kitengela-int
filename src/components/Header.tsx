import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { publicApi } from '@/lib/api'

export default function Header() {
  const [isLive, setIsLive] = useState(false)
  const [liveStreamUrl, setLiveStreamUrl] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await publicApi.getLive()
        if (response.success && response.data) {
          const data = response.data as {
            isLive?: boolean
            youtubeLiveUrl?: string | null
            facebookLiveUrl?: string | null
            googleMeetUrl?: string | null
          }
          setIsLive(data.isLive || false)
          setLiveStreamUrl(data.youtubeLiveUrl || data.facebookLiveUrl || data.googleMeetUrl || null)
        }
      } catch (error) {
        console.error('Error fetching live stream:', error)
      }
    }

    fetchLiveData()
    const interval = setInterval(fetchLiveData, 30000)
    return () => clearInterval(interval)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logoLink} onClick={closeMenu}>
              <img
                src="/logo/chuurchlogo.jpeg"
                alt="VOSH Church Logo"
                width={80}
                height={80}
                className={styles.logo}
              />
              <div className={styles.logoText}>
                <h1 className={styles.churchName}>Voice Of Salvation And Healing Church Int&apos;l</h1>
                <p className={styles.location}>KITENGELA</p>
              </div>
            </Link>
          </div>

          <div className={styles.mobileActions}>
            {liveStreamUrl && (
              <a
                href={liveStreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.joinUsLiveButton}
              >
                {isLive && <span className={styles.liveDot}></span>}
                Join Us Live
              </a>
            )}
            <button
              className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </button>
          </div>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            <Link to="/" className={styles.navLink} onClick={closeMenu}>Home</Link>
            <Link to="/about" className={styles.navLink} onClick={closeMenu}>About</Link>
            <Link to="/services" className={styles.navLink} onClick={closeMenu}>Services</Link>
            <Link to="/leadership" className={styles.navLink} onClick={closeMenu}>Leadership</Link>
            <Link to="/outreach" className={styles.navLink} onClick={closeMenu}>Outreach</Link>
            <Link to="/give" className={styles.navLink} onClick={closeMenu}>Give</Link>
            <Link to="/contact" className={styles.navLink} onClick={closeMenu}>Contact</Link>
            {liveStreamUrl && (
              <a href={liveStreamUrl} target="_blank" rel="noopener noreferrer" className={styles.liveButton} onClick={closeMenu}>
                {isLive && <span className={styles.liveDot}></span>}
                LIVE STREAM
              </a>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
