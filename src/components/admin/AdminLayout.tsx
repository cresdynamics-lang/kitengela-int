import { Link, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/routes'
import { clearAdminSession } from '@/lib/adminSession'

interface AdminLayoutProps {
  children: React.ReactNode
  adminName?: string
}

const menuItems = [
  { label: 'Live Sessions', href: ROUTES.admin.liveSessions },
  { label: 'Services', href: ROUTES.admin.services },
  { label: 'Announcements', href: ROUTES.admin.announcements },
  { label: 'Leadership', href: ROUTES.admin.leadership },
  { label: 'Give Settings', href: ROUTES.admin.giveSettings },
]

export function AdminLayout({ children, adminName = 'Admin' }: AdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAdminSession()
    navigate(ROUTES.home)
  }

  return (
    <div className="flex h-screen bg-surface">
      <aside className="bg-navy text-surface w-64 overflow-y-auto hidden lg:block">
        <div className="p-6">
          <h1 className="text-2xl font-display font-bold text-gold">VOSH Admin</h1>
          <p className="text-surface/80 text-sm mt-2">{adminName}</p>
        </div>

        <nav className="mt-4 space-y-1 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'bg-gold/20 text-gold'
                  : 'hover:bg-gold/10 text-surface'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface/10 w-64">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 bg-live/20 hover:bg-live/30 text-surface rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
