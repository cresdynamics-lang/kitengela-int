import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '@/lib/api'
import {
  clearAdminSession,
  getAdminActiveTab,
  getAdminToken,
  getAdminUser,
  setAdminActiveTab,
} from '@/lib/adminSession'
import styles from './AdminDashboard.module.css'

const Programs = lazy(() => import('@/components/admin/Programs'))
const MassSermons = lazy(() => import('@/components/admin/MassSermons'))
const UpdateLinks = lazy(() => import('@/components/admin/UpdateLinks'))
const AdminRights = lazy(() => import('@/components/admin/AdminRights'))
const LiveStreamAdmin = lazy(() => import('@/components/admin/LiveStream'))

type TabKey = 'programs' | 'events' | 'live' | 'sermons' | 'links' | 'admins'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    return getAdminActiveTab<TabKey>('live')
  })
  const [admin] = useState<any>(() => getAdminUser())

  useEffect(() => {
    const token = getAdminToken()
    if (!token || !admin) {
      navigate('/admin/login')
      return
    }

    // Warm common data in the background to make tab switching instant.
    void Promise.allSettled([
      adminApi.getLive(token),
      adminApi.getSermons(token),
      adminApi.getPrograms(token),
      adminApi.getUpdateLinks(token),
    ])

    // Warm lazy chunks in the background.
    void Promise.allSettled([
      import('@/components/admin/LiveStream'),
      import('@/components/admin/MassSermons'),
      import('@/components/admin/Programs'),
      import('@/components/admin/UpdateLinks'),
      import('@/components/admin/AdminRights'),
    ])
  }, [navigate, admin])

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
          <h1>Admin Dashboard</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {admin.username}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </div>
        </div>
      </header>
      <nav className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'programs' ? styles.active : ''}`} onClick={() => setActiveTab('programs')}>Programs</button>
        <button className={`${styles.tab} ${activeTab === 'events' ? styles.active : ''}`} onClick={() => setActiveTab('events')}>Events</button>
        <button className={`${styles.tab} ${activeTab === 'live' ? styles.active : ''}`} onClick={() => setActiveTab('live')}>Live Stream</button>
        <button className={`${styles.tab} ${activeTab === 'sermons' ? styles.active : ''}`} onClick={() => setActiveTab('sermons')}>Sermons</button>
        <button className={`${styles.tab} ${activeTab === 'links' ? styles.active : ''}`} onClick={() => setActiveTab('links')}>Links</button>
        <button className={`${styles.tab} ${activeTab === 'admins' ? styles.active : ''}`} onClick={() => setActiveTab('admins')}>Admin Rights</button>
      </nav>
      <main className={styles.content}>
        <Suspense fallback={<div className={styles.tabLoading}>Loading section...</div>}>
          {activeTab === 'programs' && <Programs />}
          {activeTab === 'events' && <div>Events management coming soon</div>}
          {activeTab === 'live' && <LiveStreamAdmin />}
          {activeTab === 'sermons' && <MassSermons />}
          {activeTab === 'links' && <UpdateLinks />}
          {activeTab === 'admins' && <AdminRights />}
        </Suspense>
      </main>
    </div>
  )
}
