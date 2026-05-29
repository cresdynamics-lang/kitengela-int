import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Leadership = lazy(() => import('./pages/Leadership'))
const LeaderDetail = lazy(() => import('./pages/LeaderDetail'))
const Outreach = lazy(() => import('./pages/Outreach'))
const Give = lazy(() => import('./pages/Give'))
const Contact = lazy(() => import('./pages/Contact'))
const Discipleship = lazy(() => import('./pages/Discipleship'))
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

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

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login'

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={isAdminRoute ? <AdminFallback /> : <PublicFallback />}>
        <Routes location={location} key={location.pathname} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/services/:id" element={<PageTransition><ServiceDetail /></PageTransition>} />
          <Route path="/leadership" element={<PageTransition><Leadership /></PageTransition>} />
          <Route path="/leadership/:id" element={<PageTransition><LeaderDetail /></PageTransition>} />
          <Route path="/outreach" element={<PageTransition><Outreach /></PageTransition>} />
          <Route path="/give" element={<PageTransition><Give /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/discipleship" element={<PageTransition><Discipleship /></PageTransition>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}
