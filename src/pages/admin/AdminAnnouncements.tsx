import { lazy, Suspense } from 'react'

const TestimonialManager = lazy(() => import('@/components/admin/TestimonialManager'))

export default function AdminAnnouncements() {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#0B1F3A' }}>Announcements</h2>
      <Suspense fallback={<div>Loading…</div>}>
        <TestimonialManager />
        <section style={{ marginTop: '2rem', padding: '2rem', background: '#fff', borderRadius: '8px' }}>
          <h3 style={{ color: '#0B1F3A', marginBottom: '0.5rem' }}>Events</h3>
          <p style={{ color: '#666' }}>Events management coming soon.</p>
        </section>
      </Suspense>
    </div>
  )
}
