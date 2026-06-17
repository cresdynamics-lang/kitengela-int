import Programs from '@/components/admin/Programs'
import MassSermons from '@/components/admin/MassSermons'
import PhotoCarouselManager from '@/components/admin/PhotoCarouselManager'
import AdminRights from '@/components/admin/AdminRights'

export default function AdminServicesPage() {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#0B1F3A' }}>Services</h2>
      <section style={{ marginBottom: '3rem' }}>
        <Programs />
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <MassSermons />
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <PhotoCarouselManager />
      </section>
      <section>
        <AdminRights />
      </section>
    </div>
  )
}
