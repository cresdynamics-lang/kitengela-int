import { lazy, Suspense } from 'react'

const LeadersManager = lazy(() => import('@/components/admin/LeadersManager'))

export default function AdminLeadershipPage() {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#0B1F3A' }}>Leadership</h2>
      <Suspense fallback={<div>Loading…</div>}>
        <LeadersManager />
      </Suspense>
    </div>
  )
}
