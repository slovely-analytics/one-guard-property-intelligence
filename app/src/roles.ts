// The three doors.
//
// Homeowner, Property Manager and Service Pro are genuinely different products
// sharing one data spine, so each one owns its entry copy, its nav and the
// persona the demo signs in as. Everything role-shaped reads from this file —
// the entry screen, the top-bar switcher and App's route guard.
import type { Route } from './routing/useHashRoute'

export type Role = 'homeowner' | 'pm' | 'pro'

export interface RoleDef {
  id: Role
  label: string
  /** One line under the door label — who this is for. */
  tagline: string
  /** What you actually do once you're through the door. */
  blurb: string
  photo: string
  /** Where this role lands, and the only routes it can reach. */
  home: Route
  nav: Array<{ path: Route; label: string }>
  /** Who the demo is signed in as, shown in the switcher. */
  persona: { name: string; sub: string }
}

const P = (name: string) => `${import.meta.env.BASE_URL}photos/${name}`

export const roles: RoleDef[] = [
  {
    id: 'homeowner',
    label: 'Homeowner',
    tagline: 'One property, and everyone who works on it.',
    blurb: 'See what your home is made of, what needs attention, and who is coming. Grant a pro access to the record, and take it back when the job is done.',
    photo: P('exterior-front.jpg'),
    home: '/',
    nav: [
      { path: '/', label: 'Dashboard' },
      { path: '/passport', label: 'Property Passport' },
      { path: '/access', label: 'Access' },
      { path: '/health', label: 'Health Assessment' },
      { path: '/maintenance', label: 'Maintenance' },
      { path: '/projects', label: 'Projects' },
      { path: '/warranties', label: 'Warranties' },
    ],
    persona: { name: '42 Highland Ave', sub: 'Guard plan · member since 2024' },
  },
  {
    id: 'pm',
    label: 'Property Manager',
    tagline: 'A portfolio, by exception.',
    blurb: 'Every door you manage in one roll-up — what is overdue, what it is costing, and which vendors are actually showing up. Drill into any property record.',
    photo: P('prop-birchwood.jpg'),
    home: '/portfolio',
    nav: [
      { path: '/portfolio', label: 'Portfolio' },
      { path: '/passport', label: 'Property record' },
      { path: '/projects', label: 'Projects' },
    ],
    persona: { name: 'Northgate Residential', sub: '12 properties · 4 managers' },
  },
  {
    id: 'pro',
    label: 'Service Pro',
    tagline: 'Know the job before you open the truck.',
    blurb: 'Your route for the day, and the property record for each stop — model, serial, age and what the last tech found. Log what you did once, and it stays with the property.',
    photo: P('sys-condenser.jpg'),
    home: '/pro',
    nav: [
      { path: '/pro', label: 'Work' },
      { path: '/pro/calendar', label: 'Calendar' },
      { path: '/pro/review', label: 'Review' },
    ],
    persona: { name: 'Marcus Reyes', sub: 'Comfort Professor · HVAC & plumbing' },
  },
]

export function roleDef(id: Role): RoleDef {
  return roles.find((r) => r.id === id) ?? roles[0]
}

/** Routes any role can reach — demo extras that hang off the top bar. */
export const sharedRoutes: Route[] = ['/enter', '/mobile', '/signup']
const proWorkflowRoutes: Route[] = ['/pro/job', '/pro/capture', '/pro/mine']

export function canVisit(id: Role, route: Route): boolean {
  return sharedRoutes.includes(route) || roleDef(id).nav.some((l) => l.path === route) || (id === 'pro' && proWorkflowRoutes.includes(route))
}
