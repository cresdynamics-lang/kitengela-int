import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SITE_IMAGE,
  SITE_KEYWORDS,
  SITE_NAME,
  breadcrumbJsonLd,
  canonicalUrl,
  organizationJsonLd,
  resolveSeo,
  websiteJsonLd,
} from '@/lib/seo'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`
  let el = document.head.querySelector(selector) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove()
}

export default function SeoHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = resolveSeo(pathname)
    const url = canonicalUrl(seo.path)
    const keywords = seo.keywords ?? SITE_KEYWORDS

    document.title = seo.title
    upsertMeta('name', 'description', seo.description)
    upsertMeta('name', 'keywords', keywords)
    upsertMeta('name', 'author', SITE_NAME)
    upsertMeta('name', 'geo.region', 'KE-200')
    upsertMeta('name', 'geo.placename', 'Kitengela, Kenya')
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', seo.title)
    upsertMeta('property', 'og:description', seo.description)
    upsertMeta('property', 'og:image', SITE_IMAGE)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:locale', 'en_KE')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', seo.title)
    upsertMeta('name', 'twitter:description', seo.description)
    upsertMeta('name', 'twitter:image', SITE_IMAGE)
    upsertLink('canonical', url)

    setJsonLd('seo-org', organizationJsonLd())

    if (pathname === '/') {
      setJsonLd('seo-website', websiteJsonLd())
    } else {
      removeJsonLd('seo-website')
    }

    if (seo.breadcrumbs?.length) {
      setJsonLd('seo-breadcrumb', breadcrumbJsonLd(seo.breadcrumbs))
    } else {
      removeJsonLd('seo-breadcrumb')
    }
  }, [pathname])

  return null
}
