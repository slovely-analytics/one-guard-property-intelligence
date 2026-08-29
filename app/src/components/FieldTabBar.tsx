// The field shell's 4-item bottom tab bar (brief §10.1) — rendered by the
// Today and Mine screens and shown at ≤640px only (CSS hides it above).
// Search and Account are Phase-2 destinations; tapping them says so instead
// of dead-ending.
import { roleDef } from '../roles'
import { toast, useDemo } from '../store'

function TabIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  )
}

export function FieldTabBar({ active }: { active: 'today' | 'mine' }) {
  const { passportUpdates } = useDemo()
  const me = roleDef('pro').persona.name
  const returned = passportUpdates.filter((u) => u.status === 'RETURNED' && u.submittedBy === me).length

  return (
    <nav className="field-tabbar" aria-label="Field navigation">
      <a href="#/pro" className={active === 'today' ? 'is-active' : ''} aria-current={active === 'today' ? 'page' : undefined}>
        <TabIcon><rect x="3" y="4" width="18" height="18" /><path d="M16 2v4M8 2v4M3 10h18" /></TabIcon>
        <span>Today</span>
      </a>
      <button type="button" onClick={() => toast('Search arrives in Phase 2 — properties, equipment, serials.')}>
        <TabIcon><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></TabIcon>
        <span>Search</span>
      </button>
      <a href="#/pro/mine" className={active === 'mine' ? 'is-active' : ''} aria-current={active === 'mine' ? 'page' : undefined}>
        <TabIcon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></TabIcon>
        <span>Mine</span>
        {returned > 0 && <span className="field-tab-badge" aria-label={`${returned} returned update${returned === 1 ? '' : 's'}`}>{returned}</span>}
      </a>
      <button type="button" onClick={() => toast('Account settings arrive in Phase 2.')}>
        <TabIcon><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></TabIcon>
        <span>Account</span>
      </button>
    </nav>
  )
}
