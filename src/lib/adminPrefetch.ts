import type { TabKey } from '@/pages/adminTabs'

export function prefetchAdminTabChunk(tab: TabKey) {
  switch (tab) {
    case 'programs':
      return import('@/components/admin/Programs')
    case 'live':
      return import('@/components/admin/LiveStream')
    case 'sermons':
      return import('@/components/admin/MassSermons')
    case 'links':
      return import('@/components/admin/UpdateLinks')
    case 'admins':
      return import('@/components/admin/AdminRights')
    case 'photos':
      return import('@/components/admin/PhotoManager')
    case 'carousel-manager':
      return import('@/components/admin/PhotoCarouselManager')
    case 'testimonials':
      return import('@/components/admin/TestimonialManager')
    case 'leaders':
      return import('@/components/admin/LeadersManager')
    default:
      return Promise.resolve()
  }
}
