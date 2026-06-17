import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  clearAdminSession,
  getAdminToken,
  getAdminUser,
} from '@/lib/adminSession'
import { ROUTES } from '@/lib/routes'
import styles from './AdminShell.module.css'

const adminNav = [
  { label: 'Live Sessions', path: ROUTES.admin.liveSessions },
  { label: 'Services', path: ROUTES.admin.services },
  { label: 'Announcements', path: ROUTES.admin.announcements },
  { label: 'Leadership', path: ROUTES.admin.leadership },
  { label: 'Give Settings', path: ROUTES.admin.giveSettings },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const token = getAdminToken()
  const admin = getAdminUser()

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.admin.login)
    }
  }, [navigate, token])

  if (!token) return null

  const handleLogout = () => {
    clearAdminSession()
    navigate(ROUTES.home)
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h1>VOSH Admin</h1>
          <p>Kitengela</p>
        </div>
        <nav className={styles.nav}>
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${location.pathname === item.path ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <span className={styles.userName}>{admin?.username ?? 'Admin'}</span>
          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>
      <div className={styles.main}>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
