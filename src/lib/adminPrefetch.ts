import { ROUTES } from '@/lib/routes'

export type AdminRouteKey =
  | 'live-sessions'
  | 'services'
  | 'announcements'
  | 'leadership'
  | 'give-settings'

export function prefetchAdminRoute(route: AdminRouteKey) {
  switch (route) {
    case 'live-sessions':
      return import('@/components/admin/LiveStream')
    case 'services':
      return Promise.all([
        import('@/components/admin/Programs'),
        import('@/components/admin/MassSermons'),
        import('@/components/admin/PhotoManager'),
        import('@/components/admin/PhotoCarouselManager'),
        import('@/components/admin/AdminRights'),
      ])
    case 'announcements':
      return import('@/components/admin/TestimonialManager')
    case 'leadership':
      return import('@/components/admin/LeadersManager')
    case 'give-settings':
      return import('@/components/admin/UpdateLinks')
    default:
      return Promise.resolve()
  }
}

export function adminPathToKey(pathname: string): AdminRouteKey | null {
  if (pathname === ROUTES.admin.liveSessions) return 'live-sessions'
  if (pathname === ROUTES.admin.services) return 'services'
  if (pathname === ROUTES.admin.announcements) return 'announcements'
  if (pathname === ROUTES.admin.leadership) return 'leadership'
  if (pathname === ROUTES.admin.giveSettings) return 'give-settings'
  return null
}
