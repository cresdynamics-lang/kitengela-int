import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'
import { publicApi } from '@/lib/api'
import LivePlayer from './LivePlayer'

export default function Header() {
  const [isLive, setIsLive] = useState(false)
  const [liveData, setLiveData] = useState<any>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await publicApi.getLive()
        if (response.success && response.data) {
          setLiveData(response.data)
          setIsLive(response.data.isLive || false)
        }
      } catch (error) {
        console.error('Error fetching live stream:', error)
      }
    }

    fetchLiveData()
    const interval = setInterval(fetchLiveData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setShowPlayer(false)
  }, [location.pathname])

  // Ensure overlays are closed on mount
  useEffect(() => {
    setIsMenuOpen(false)
    setShowPlayer(false)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logoLink} onClick={closeMenu}>
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
            {[
              { name: 'Home', path: '/' },
              { name: 'Who We Are', path: '/about' },
              { name: 'Join Us', path: '/services' },
              { name: 'Leadership', path: '/leadership' },
              { name: 'Give', path: '/give' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            
            <Link to="/contact" className={styles.planVisitBtn} onClick={closeMenu}>
              Plan Your Visit
            </Link>

            {liveData?.youtubeLiveUrl && (
              <button 
                onClick={() => { setShowPlayer(true); closeMenu(); }} 
                className={styles.liveButton}
              >
                <span className={styles.liveDot}></span>
                WATCH LIVE
              </button>
            )}

            {liveData?.googleMeetUrl && (
              <a 
                href={liveData.googleMeetUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.prayerButton}
                onClick={closeMenu}
              >
                JOIN PRAYERS
              </a>
            )}

            {!liveData?.youtubeLiveUrl && liveData?.facebookLiveUrl && (
              <a 
                href={liveData.facebookLiveUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.liveButton}
                onClick={closeMenu}
              >
                JOIN LIVE
              </a>
            )}
          </nav>

          <div className={styles.mobileActions}>
            <button
              className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </button>
          </div>
        </div>
      </header>
      
      {showPlayer && liveData?.youtubeLiveUrl && (
        <LivePlayer 
          url={liveData.youtubeLiveUrl} 
          onClose={() => setShowPlayer(false)} 
        />
      )}
    </>
  )
}
