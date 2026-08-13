import type { CSSProperties, ReactNode } from 'react'
import type { Route } from '../routing/useHashRoute'

const navLinks: Array<{ path: Route; label: string }> = [
  { path: '/', label: 'Dashboard' },
  { path: '/passport', label: 'Property Passport' },
  { path: '/health', label: 'Health Assessment' },
  { path: '/maintenance', label: 'Maintenance' },
  { path: '/projects', label: 'Projects' },
  { path: '/warranties', label: 'Warranties' },
]

export function Nav({ current }: { current: Route }) {
  return (
    <nav className="nav">
      <span className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'inline-block', width: 14, height: 14, background: 'var(--color-accent)' }} />
        ONE GUARD <span style={{ fontWeight: 400, color: 'var(--color-neutral-600)' }}>Property Intelligence</span>
      </span>
      {navLinks.map((l) => (
        <a key={l.path} href={`#${l.path}`} aria-current={current === l.path ? 'page' : undefined}>
          {l.label}
        </a>
      ))}
      <a
        href="#/portfolio"
        aria-current={current === '/portfolio' ? 'page' : undefined}
        style={{ borderLeft: '1px solid var(--color-divider)', paddingLeft: 16 }}
      >
        Portfolio ▸ PM view
      </a>
      <a href="#/mobile" aria-current={current === '/mobile' ? 'page' : undefined}>Mobile app</a>
      <a href="#/signup" aria-current={current === '/signup' ? 'page' : undefined}>Sign up</a>
      <span className="tag tag-accent">MEMBER</span>
    </nav>
  )
}

export function Footer() {
  return (
    <footer
      className="text-muted"
      style={{ borderTop: '2px solid var(--color-divider)', padding: '16px 32px', display: 'flex', gap: 24, fontSize: 12, marginTop: 'auto' }}
    >
      <span>ONE GUARD Property Intelligence</span>
      <span>Demo — sample data</span>
      <a href="#/mobile" style={{ marginLeft: 'auto' }}>Mobile app →</a>
      <a href="#/signup">Onboarding →</a>
    </footer>
  )
}

export function Kicker({ children }: { children: ReactNode }) {
  return <h6 style={{ color: 'var(--color-accent)' }}>{children}</h6>
}

export function Rule({ style }: { style?: CSSProperties }) {
  return <hr className="hr" style={style} />
}
