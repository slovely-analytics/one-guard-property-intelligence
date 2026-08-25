import { useEffect, useState } from 'react'

export const routes = [
  '/enter',
  '/',
  '/passport',
  '/health',
  '/maintenance',
  '/projects',
  '/warranties',
  '/portfolio',
  '/pro',
  '/pro/job',
  '/pro/update',
  '/pro/review',
  '/mobile',
  '/signup',
] as const

export type Route = (typeof routes)[number]

const knownPaths = new Set<string>(routes)

function readPath(): Route {
  const hashPath = window.location.hash.slice(1) || '/'
  return knownPaths.has(hashPath) ? (hashPath as Route) : '/'
}

export function useHashRoute() {
  const [currentPath, setCurrentPath] = useState<Route>(readPath)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(readPath())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return currentPath
}
