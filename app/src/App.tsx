import { useEffect, useLayoutEffect } from 'react'
import { AdvisorChat, ToastHost } from './components/Overlays'
import { Footer, Nav } from './components/Shell'
import { proJobs } from './data'
import { canVisit, roleDef } from './roles'
import { parseHash, useHashRoute } from './routing/useHashRoute'
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
import ProJob from './screens/ProJob'
import ProReview from './screens/ProReview'
import ProToday from './screens/ProToday'
import ProUpdate from './screens/ProUpdate'
import Projects from './screens/Projects'
import Warranties from './screens/Warranties'

export default function App() {
  const route = useHashRoute()
  const { role, passportUpdates } = useDemo()

  // The URL is authoritative on a cold load: a texted #/pro/job link opens the
  // Pro shell directly. The door-chooser is #/enter only. Runs once, before
  // paint, against the boot-time hash.
  useLayoutEffect(() => {
    const boot = parseHash(window.location.hash)
    if (boot.path !== '/404' && boot.path.startsWith('/pro')) setRole('pro')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A door only reaches its own screens. Landing anywhere else — usually '/',
  // the default hash — bounces to the role's home rather than showing another
  // role's product. Unknown routes are handled as a 404 before this guard.
  const knownPath = route.path !== '/404' ? route.path : null
  const stray = role !== null && knownPath !== null && !canVisit(role, knownPath)
  useEffect(() => {
    if (stray && role) window.location.hash = `#${roleDef(role).home}`
  }, [stray, role])

  // Stale or mistyped identifiers are a 404 too, not a silent fallback.
  const jobMissing = (route.path === '/pro/job' || route.path === '/pro/update') && route.jobId !== undefined && !proJobs.some((j) => j.id === route.jobId)
  const updateMissing = route.path === '/pro/review' && route.updateId !== undefined && !passportUpdates.some((u) => u.id === route.updateId)
  if (route.path === '/404' || jobMissing || updateMissing) return <NotFound attempted={route.attempted} />

  if (!role || route.path === '/enter') return <Entry />

  const shown = stray ? roleDef(role).home : route.path

  return (
    <div className="app-root">
      <Nav current={shown} />
      {shown === '/' && <Dashboard />}
      {shown === '/passport' && <Passport />}
      {shown === '/access' && <Access />}
      {shown === '/health' && <Health />}
      {shown === '/maintenance' && <Maintenance />}
      {shown === '/projects' && <Projects />}
      {shown === '/warranties' && <Warranties />}
      {shown === '/portfolio' && <Portfolio />}
      {shown === '/pro' && <ProToday />}
      {shown === '/pro/calendar' && <ProCalendar />}
      {shown === '/pro/job' && <ProJob jobId={route.jobId} />}
      {shown === '/pro/update' && <ProUpdate jobId={route.jobId} />}
      {shown === '/pro/review' && <ProReview updateId={route.updateId} />}
      {shown === '/mobile' && <Mobile />}
      {shown === '/signup' && <Onboarding />}
      <Footer />
      <AdvisorChat />
      <ToastHost />
    </div>
  )
}
