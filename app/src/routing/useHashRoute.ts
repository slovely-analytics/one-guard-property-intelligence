import { useEffect, useState } from 'react'

export const routes = [
  '/enter',
  '/',
  '/passport',
  '/access',
  '/health',
  '/maintenance',
  '/projects',
  '/warranties',
  '/portfolio',
  '/pro',
  '/pro/calendar',
  '/pro/mine',
  '/pro/job',
  '/pro/capture',
  '/pro/review',
  '/mobile',
  '/signup',
] as const

export type Route = (typeof routes)[number]

/** A parsed location: a known path plus any identifier it carries, or the
 *  404 sentinel. `attempted` keeps the raw path for the not-found view. */
export interface RouteMatch {
  path: Route | '/404'
  jobId?: string
  updateId?: string
  attempted: string
}

const knownPaths = new Set<string>(routes)

export function parseHash(hash: string): RouteMatch {
  const path = hash.slice(1) || '/'
  if (knownPaths.has(path)) return { path: path as Route, attempted: path }
  // /update is the legacy composer address — capture replaced it (§10.4), and
  // old links should land in the flow, not on a 404.
  let m = path.match(/^\/pro\/job\/([\w-]+)\/(capture|update)$/)
  if (m) return { path: '/pro/capture', jobId: m[1], attempted: path }
  m = path.match(/^\/pro\/job\/([\w-]+)$/)
  if (m) return { path: '/pro/job', jobId: m[1], attempted: path }
  m = path.match(/^\/pro\/review\/([\w-]+)$/)
  if (m) return { path: '/pro/review', updateId: m[1], attempted: path }
  // A real 404, never a silent fallback to the landing.
  return { path: '/404', attempted: path }
}

export function useHashRoute(): RouteMatch {
  const [current, setCurrent] = useState<RouteMatch>(() => parseHash(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => {
      setCurrent(parseHash(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return current
}
