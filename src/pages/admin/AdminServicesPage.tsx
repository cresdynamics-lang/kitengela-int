import { lazy, Suspense } from 'react'
import Programs from '@/components/admin/Programs'
import AdminRights from '@/components/admin/AdminRights'

const MassSermons = lazy(() => import('@/components/admin/MassSermons'))
const PhotoManager = lazy(() => import('@/components/admin/PhotoManager')) as React.LazyExoticComponent<any>
const PhotoCarouselManager = lazy(() => import('@/components/admin/PhotoCarouselManager')) as React.LazyExoticComponent<any>

export default function AdminServicesPage() {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#0B1F3A' }}>Services</h2>
      <Suspense fallback={<div>Loading…</div>}>
        <section style={{ marginBottom: '3rem' }}>
          <Programs />
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <MassSermons />
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <PhotoManager />
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <PhotoCarouselManager />
        </section>
        <section>
          <AdminRights />
        </section>
      </Suspense>
    </div>
  )
}
