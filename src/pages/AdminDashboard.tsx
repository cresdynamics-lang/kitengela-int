import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { prefetchAdminTabChunk, warmAdminTabData } from '@/lib/adminPrefetch'
import {
  clearAdminSession,
  getAdminActiveTab,
  getAdminToken,
  getAdminUser,
  setAdminActiveTab,
} from '@/lib/adminSession'
import { adminTabs, type TabKey } from './adminTabs'
import styles from './AdminDashboard.module.css'

const Programs = lazy(() => import('@/components/admin/Programs'))
const MassSermons = lazy(() => import('@/components/admin/MassSermons'))
const UpdateLinks = lazy(() => import('@/components/admin/UpdateLinks'))
const AdminRights = lazy(() => import('@/components/admin/AdminRights'))
const LiveStreamAdmin = lazy(() => import('@/components/admin/LiveStream'))
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

  useEffect(() => {
    const token = getAdminToken()
    if (!token || !admin) {
      navigate('/admin/login')
      return
    }

    void prefetchAdminTabChunk(activeTab)
    void warmAdminTabData(activeTab, token)
  }, [navigate, admin, activeTab])

  useEffect(() => {
    setAdminActiveTab(activeTab)
  }, [activeTab])

  const handleLogout = () => {
    clearAdminSession()
    navigate('/')
  }

  if (!admin) return <div className={styles.loading}>Loading...</div>

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
            <span>Welcome, {admin.username}</span>
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
          <Suspense fallback={<div className={styles.tabLoading}>Loading section...</div>}>
            {activeTab === 'programs' && <Programs />}
            {activeTab === 'events' && <div>Events management coming soon</div>}
            {activeTab === 'live' && <LiveStreamAdmin />}
            {activeTab === 'sermons' && <MassSermons />}
            {activeTab === 'links' && <UpdateLinks />}
            {activeTab === 'admins' && <AdminRights />}
            {activeTab === 'photos' && <PhotoManager />}
            {activeTab === 'carousel-manager' && <PhotoCarouselManager />}
            {activeTab === 'leaders' && <LeadersManager />}
            {activeTab === 'testimonials' && <TestimonialManager />}
          </Suspense>
        </main>
      </div>
    </div>
  )
}
