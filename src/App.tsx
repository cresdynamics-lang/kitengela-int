import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Leadership from './pages/Leadership'
import LeaderDetail from './pages/LeaderDetail'
import Outreach from './pages/Outreach'
import Give from './pages/Give'
import Contact from './pages/Contact'
import Discipleship from './pages/Discipleship'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import PageTransition from './components/PageTransition'

export default function App() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
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
        {/* Do not animate admin pages to keep them snappy */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  )
}
