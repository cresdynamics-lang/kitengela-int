import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { prefetchAdminTabChunk } from '@/lib/adminPrefetch'
import {
  clearAdminSession,
  getAdminActiveTab,
  getAdminToken,
  getAdminUser,
  setAdminActiveTab,
} from '@/lib/adminSession'
import { adminTabs, type TabKey } from './adminTabs'
import styles from './AdminDashboard.module.css'
import LiveStreamAdmin from '@/components/admin/LiveStream'

const Programs = lazy(() => import('@/components/admin/Programs'))
const MassSermons = lazy(() => import('@/components/admin/MassSermons'))
const UpdateLinks = lazy(() => import('@/components/admin/UpdateLinks'))
const AdminRights = lazy(() => import('@/components/admin/AdminRights'))
const PhotoManager = lazy(() => import('@/components/admin/PhotoManager')) as React.LazyExoticComponent<any>
const PhotoCarouselManager = lazy(() => import('@/components/admin/PhotoCarouselManager')) as React.LazyExoticComponent<any>
const TestimonialManager = lazy(() => import('@/components/admin/TestimonialManager'))
const LeadersManager = lazy(() => import('@/components/admin/LeadersManager'))

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    return getAdminActiveTab<TabKey>('live')
  })
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [admin] = useState<any>(() => getAdminUser())
  const token = getAdminToken()

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }

    void prefetchAdminTabChunk(activeTab)
  }, [navigate, token, activeTab])

  useEffect(() => {
    setAdminActiveTab(activeTab)
  }, [activeTab])

  const handleLogout = () => {
    clearAdminSession()
    navigate('/')
  }

  if (!token) return null

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setIsNavOpen((prev) => !prev)}
              aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isNavOpen ? '✕' : '☰'}
            </button>
            <h1>Admin Dashboard</h1>
          </div>
          <div className={styles.userInfo}>
            <span>Welcome, {admin?.username ?? 'Admin'}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </div>
        </div>
      </header>
      <div className={styles.workspace}>
        {isNavOpen && <button className={styles.backdrop} onClick={() => setIsNavOpen(false)} aria-label="Close menu overlay" />}
        <nav className={`${styles.tabs} ${!isNavOpen ? styles.tabsHidden : ''}`}>
          {adminTabs.map((tabItem) => (
            <button
              key={tabItem.key}
              className={`${styles.tab} ${activeTab === tabItem.key ? styles.active : ''}`}
              onMouseEnter={() => {
                void prefetchAdminTabChunk(tabItem.key)
              }}
              onFocus={() => {
                void prefetchAdminTabChunk(tabItem.key)
              }}
              onClick={() => {
                setActiveTab(tabItem.key)
                setIsNavOpen(false)
              }}
            >
              {tabItem.label}
            </button>
          ))}
        </nav>
        <main className={styles.content}>
          {activeTab === 'live' ? (
            <LiveStreamAdmin />
          ) : (
            <Suspense fallback={<div className={styles.tabLoading}>Loading section...</div>}>
              {activeTab === 'programs' && <Programs />}
              {activeTab === 'events' && <div>Events management coming soon</div>}
              {activeTab === 'sermons' && <MassSermons />}
              {activeTab === 'links' && <UpdateLinks />}
              {activeTab === 'admins' && <AdminRights />}
              {activeTab === 'photos' && <PhotoManager />}
              {activeTab === 'carousel-manager' && <PhotoCarouselManager />}
              {activeTab === 'leaders' && <LeadersManager />}
              {activeTab === 'testimonials' && <TestimonialManager />}
            </Suspense>
          )}
        </main>
      </div>
    </div>
  )
}
