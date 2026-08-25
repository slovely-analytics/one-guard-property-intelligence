import { useEffect } from 'react'
import { AdvisorChat, ToastHost } from './components/Overlays'
import { Footer, Nav } from './components/Shell'
import { canVisit, roleDef } from './roles'
import { useHashRoute } from './routing/useHashRoute'
import { useDemo } from './store'
import Dashboard from './screens/Dashboard'
import Entry from './screens/Entry'
import Health from './screens/Health'
import Maintenance from './screens/Maintenance'
import Mobile from './screens/Mobile'
import Onboarding from './screens/Onboarding'
import Passport from './screens/Passport'
import Portfolio from './screens/Portfolio'
import ProToday from './screens/ProToday'
import Projects from './screens/Projects'
import Warranties from './screens/Warranties'

export default function App() {
  const route = useHashRoute()
  const { role } = useDemo()

  // A door only reaches its own screens. Landing anywhere else — usually '/',
  // the default hash — bounces to the role's home rather than showing another
  // role's product.
  const stray = role !== null && !canVisit(role, route)
  useEffect(() => {
    if (stray && role) window.location.hash = `#${roleDef(role).home}`
  }, [stray, role])

  if (!role || route === '/enter') return <Entry />

  const shown = stray ? roleDef(role).home : route

  return (
    <div className="app-root">
      <Nav current={shown} />
      {shown === '/' && <Dashboard />}
      {shown === '/passport' && <Passport />}
      {shown === '/health' && <Health />}
      {shown === '/maintenance' && <Maintenance />}
      {shown === '/projects' && <Projects />}
      {shown === '/warranties' && <Warranties />}
      {shown === '/portfolio' && <Portfolio />}
      {shown === '/pro' && <ProToday />}
      {shown === '/mobile' && <Mobile />}
      {shown === '/signup' && <Onboarding />}
      <Footer />
      <AdvisorChat />
      <ToastHost />
    </div>
  )
}
