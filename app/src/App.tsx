import { useEffect, useRef } from 'react'
import { AdvisorChat, ToastHost } from './components/Overlays'
import { Footer, Nav } from './components/Shell'
import { proJobs } from './data'
import { canVisit, roleDef } from './roles'
import { parseHash, useHashRoute } from './routing/useHashRoute'
import type { Route, RouteMatch } from './routing/useHashRoute'
import { setRole, useDemo } from './store'
import Access from './screens/Access'
import Dashboard from './screens/Dashboard'
import Entry from './screens/Entry'
import Health from './screens/Health'
import Maintenance from './screens/Maintenance'
import Mobile from './screens/Mobile'
import NotFound from './screens/NotFound'
import Onboarding from './screens/Onboarding'
import Passport from './screens/Passport'
import Portfolio from './screens/Portfolio'
import ProCalendar from './screens/ProCalendar'
import ProCapture from './screens/ProCapture'
import ProJob from './screens/ProJob'
import ProReview from './screens/ProReview'
import ProToday from './screens/ProToday'
import Projects from './screens/Projects'
import Warranties from './screens/Warranties'

const TITLES: Record<string, string> = {
  '/enter': 'Choose your door',
  '/': 'Dashboard',
  '/passport': 'Property Passport',
  '/access': 'Access',
  '/health': 'Health Assessment',
  '/maintenance': 'Maintenance',
  '/projects': 'Projects',
  '/warranties': 'Warranties',
  '/portfolio': 'Portfolio',
  '/pro': 'Service work',
  '/pro/calendar': 'Service calendar',
  '/pro/review': 'Passport review',
  '/mobile': 'Mobile app',
  '/signup': 'Sign up',
  '/404': 'Page not found',
}

function titleFor(shownPath: string, route: RouteMatch, updateName?: string): string {
  if (shownPath === '/pro/job' || shownPath === '/pro/capture') {
    const job = proJobs.find((j) => j.id === route.jobId)
    if (job) {
      const subject = `${job.addr} — ${job.system.name}`
      return shownPath === '/pro/capture' ? `Capture: ${subject}` : subject
    }
  }
  if (shownPath === '/pro/review' && updateName) return `Passport review — ${updateName}`
  return TITLES[shownPath] ?? 'Property Intelligence'
}

// The URL is authoritative on a cold load: a texted #/pro/job link opens the
// Pro shell directly, whatever door was stored. Runs at module scope — before
// the first render — so the stray-route guard never sees the stale role and
// bounces the deep link away. The door-chooser is #/enter only.
{
  const boot = parseHash(window.location.hash)
  if (boot.path !== '/404' && boot.path.startsWith('/pro')) setRole('pro')
}

/** The skip link's target is whatever <main> the current screen renders. */
function skipToContent(event: { preventDefault: () => void }) {
  event.preventDefault()
  const main = document.querySelector('main')
  if (main) {
    main.setAttribute('tabindex', '-1')
    main.focus()
  }
}

export default function App() {
  const route = useHashRoute()
  const { role, passportUpdates } = useDemo()

  // A door only reaches its own screens. Landing anywhere else — usually '/',
  // the default hash — bounces to the role's home rather than showing another
  // role's product. Unknown routes are handled as a 404 before this guard.
  const knownPath = route.path !== '/404' ? route.path : null
  const stray = role !== null && knownPath !== null && !canVisit(role, knownPath)
  useEffect(() => {
    if (stray && role) window.location.hash = `#${roleDef(role).home}`
  }, [stray, role])

  // Stale or mistyped identifiers are a 404 too, not a silent fallback.
  const jobMissing = (route.path === '/pro/job' || route.path === '/pro/capture') && route.jobId !== undefined && !proJobs.some((j) => j.id === route.jobId)
  const updateMissing = route.path === '/pro/review' && route.updateId !== undefined && !passportUpdates.some((u) => u.id === route.updateId)
  const notFound = route.path === '/404' || jobMissing || updateMissing

  const shown = notFound ? '/404' : !role || route.path === '/enter' ? '/enter' : stray ? roleDef(role).home : route.path

  // Route identity: unique document.title per route, and focus moved to the
  // new screen's <h1> on every route change (SPA navigations announce nothing
  // by default). Initial load keeps focus at the document start so the skip
  // link stays the first tab stop.
  const prevLocation = useRef<string | null>(null)
  const reviewUpdateName = route.updateId ? passportUpdates.find((u) => u.id === route.updateId)?.systemName : undefined
  useEffect(() => {
    document.title = `${titleFor(shown, route, reviewUpdateName)} · One Guard`
    if (prevLocation.current !== null && prevLocation.current !== route.attempted) {
      const h1 = document.querySelector('h1')
      if (h1) {
        h1.setAttribute('tabindex', '-1')
        h1.focus({ preventScroll: true })
      }
    }
    prevLocation.current = route.attempted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, route.attempted])

  if (notFound) return <NotFound attempted={route.attempted} />

  if (shown === '/enter') return <Entry />

  const page = shown as Route // '/404' and '/enter' returned above

  // Capture is a focused, full-screen task — the camera, not a portal page.
  // No nav or footer; its own header carries back/close (§10.4).
  if (page === '/pro/capture') {
    return (
      <>
        <ProCapture jobId={route.jobId} />
        <ToastHost />
      </>
    )
  }

  return (
    <div className="app-root">
      <a className="skip-link" href="#main" onClick={skipToContent}>Skip to content</a>
      <Nav current={page} />
      {page === '/' && <Dashboard />}
      {page === '/passport' && <Passport />}
      {page === '/access' && <Access />}
      {page === '/health' && <Health />}
      {page === '/maintenance' && <Maintenance />}
      {page === '/projects' && <Projects />}
      {page === '/warranties' && <Warranties />}
      {page === '/portfolio' && <Portfolio />}
      {page === '/pro' && <ProToday />}
      {page === '/pro/calendar' && <ProCalendar />}
      {page === '/pro/job' && <ProJob jobId={route.jobId} />}
      {page === '/pro/review' && <ProReview updateId={route.updateId} />}
      {page === '/mobile' && <Mobile />}
      {page === '/signup' && <Onboarding />}
      <Footer />
      <AdvisorChat />
      <ToastHost />
    </div>
  )
}
