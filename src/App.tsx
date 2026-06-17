import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'
import { ROUTES, LEGACY_SERVICE_SLUGS } from './lib/routes'

const Home = lazy(() => import('./pages/Home'))
const WhoWeAre = lazy(() => import('./pages/WhoWeAre'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Leadership = lazy(() => import('./pages/Leadership'))
const LeaderDetail = lazy(() => import('./pages/LeaderDetail'))
const JoinUs = lazy(() => import('./pages/JoinUs'))
const Give = lazy(() => import('./pages/Give'))
const Discipleship = lazy(() => import('./pages/Discipleship'))
const NextGeneration = lazy(() => import('./pages/NextGeneration'))
const Outreach = lazy(() => import('./pages/Outreach'))
const Sermons = lazy(() => import('./pages/Sermons'))
const Testimonies = lazy(() => import('./pages/Testimonies'))
const Events = lazy(() => import('./pages/Events'))
const PrayerWall = lazy(() => import('./pages/PrayerWall'))
import AdminLogin from './pages/AdminLogin'
import AdminShell from './pages/admin/AdminShell'
import AdminLiveSessions from './pages/admin/AdminLiveSessions'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminLeadershipPage from './pages/admin/AdminLeadershipPage'
import AdminGiveSettings from './pages/admin/AdminGiveSettings'

function PublicFallback() {
  return (
    <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading…
    </div>
  )
}

function AdminFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading admin…
    </div>
  )
}

function LegacyServiceRedirect({ legacySlug }: { legacySlug: string }) {
  const target = LEGACY_SERVICE_SLUGS[legacySlug]
  if (!target) return <Navigate to={ROUTES.services} replace />
  return <Navigate to={`${ROUTES.services}/${target}`} replace />
}

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login'

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={isAdminRoute ? <AdminFallback /> : <PublicFallback />}>
        <Routes location={location} key={location.pathname} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/who-we-are" element={<PageTransition><WhoWeAre /></PageTransition>} />
          <Route path="/about" element={<Navigate to={ROUTES.whoWeAre} replace />} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/services/:slug" element={<PageTransition><ServiceDetail /></PageTransition>} />
          <Route path="/leadership" element={<PageTransition><Leadership /></PageTransition>} />
          <Route path="/leadership/:id" element={<PageTransition><LeaderDetail /></PageTransition>} />
          <Route path={ROUTES.nextGeneration} element={<PageTransition><NextGeneration /></PageTransition>} />
          <Route path={ROUTES.outreach} element={<PageTransition><Outreach /></PageTransition>} />
          <Route path={ROUTES.sermons} element={<PageTransition><Sermons /></PageTransition>} />
          <Route path={ROUTES.testimonies} element={<PageTransition><Testimonies /></PageTransition>} />
          <Route path={ROUTES.events} element={<PageTransition><Events /></PageTransition>} />
          <Route path={ROUTES.prayerWall} element={<PageTransition><PrayerWall /></PageTransition>} />
          <Route path="/join-us" element={<PageTransition><JoinUs /></PageTransition>} />
          <Route path="/contact" element={<Navigate to={`${ROUTES.joinUs}#contact-form`} replace />} />
          <Route path="/give" element={<PageTransition><Give /></PageTransition>} />
          <Route path="/discipleship" element={<PageTransition><Discipleship /></PageTransition>} />

          {Object.keys(LEGACY_SERVICE_SLUGS).map((slug) => (
            <Route key={slug} path={`/services/${slug}`} element={<LegacyServiceRedirect legacySlug={slug} />} />
          ))}

          <Route path="/admin" element={<Navigate to={ROUTES.admin.login} replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<Navigate to={ROUTES.admin.login} replace />} />
          <Route path="/admin/dashboard" element={<Navigate to={ROUTES.admin.liveSessions} replace />} />
          <Route path={ROUTES.admin.liveSessions} element={<AdminShell><AdminLiveSessions /></AdminShell>} />
          <Route path={ROUTES.admin.services} element={<AdminShell><AdminServicesPage /></AdminShell>} />
          <Route path={ROUTES.admin.announcements} element={<AdminShell><AdminAnnouncements /></AdminShell>} />
          <Route path={ROUTES.admin.leadership} element={<AdminShell><AdminLeadershipPage /></AdminShell>} />
          <Route path={ROUTES.admin.giveSettings} element={<AdminShell><AdminGiveSettings /></AdminShell>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}
