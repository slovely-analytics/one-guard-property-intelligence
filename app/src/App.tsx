import { AdvisorChat, ToastHost } from './components/Overlays'
import { Footer, Nav } from './components/Shell'
import { useHashRoute } from './routing/useHashRoute'
import Dashboard from './screens/Dashboard'
import Health from './screens/Health'
import Maintenance from './screens/Maintenance'
import Mobile from './screens/Mobile'
import Onboarding from './screens/Onboarding'
import Passport from './screens/Passport'
import Portfolio from './screens/Portfolio'
import Projects from './screens/Projects'
import Warranties from './screens/Warranties'

export default function App() {
  const route = useHashRoute()
  return (
    <div className="app-root">
      <Nav current={route} />
      {route === '/' && <Dashboard />}
      {route === '/passport' && <Passport />}
      {route === '/health' && <Health />}
      {route === '/maintenance' && <Maintenance />}
      {route === '/projects' && <Projects />}
      {route === '/warranties' && <Warranties />}
      {route === '/portfolio' && <Portfolio />}
      {route === '/mobile' && <Mobile />}
      {route === '/signup' && <Onboarding />}
      <Footer />
      <AdvisorChat />
      <ToastHost />
    </div>
  )
}
