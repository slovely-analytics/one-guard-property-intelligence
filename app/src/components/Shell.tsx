import type { CSSProperties, ReactNode } from 'react'
import type { Route } from '../routing/useHashRoute'
import { PHOTO_CREDIT, systemThumb } from '../photos'
import { resetDemo } from '../store'

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
      <a href="#" onClick={(e) => { e.preventDefault(); resetDemo() }}>Reset demo data</a>
      <span>
        Photos:{' '}
        <a href={PHOTO_CREDIT.sourceUrl} target="_blank" rel="noreferrer">{PHOTO_CREDIT.author}</a>,{' '}
        <a href={PHOTO_CREDIT.licenseUrl} target="_blank" rel="noreferrer">{PHOTO_CREDIT.license}</a>
      </span>
      <a href="#/mobile" style={{ marginLeft: 'auto' }}>Mobile app →</a>
      <a href="#/signup">Onboarding →</a>
    </footer>
  )
}

export function ExtLink({ href, children, style }: { href: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ whiteSpace: 'nowrap', ...style }}>
      {children} ↗
    </a>
  )
}

/** Small square-ish photo for a system row; falls back to a neutral tile. */
export function SysThumb({ name }: { name: string }) {
  const photo = systemThumb(name)
  if (!photo?.src) return <span className="sys-thumb sys-thumb-empty" aria-hidden>📷</span>
  if (photo.thumbZoom) {
    return (
      <span
        className="sys-thumb"
        role="img"
        aria-label=""
        style={{
          backgroundImage: `url(${photo.src})`,
          backgroundSize: photo.thumbZoom,
          backgroundPosition: photo.focus ?? '50% 50%',
          backgroundRepeat: 'no-repeat',
        }}
      />
    )
  }
  return (
    <img
      className="sys-thumb"
      src={photo.src}
      alt=""
      style={photo.focus ? { objectPosition: photo.focus } : undefined}
      loading="lazy"
      decoding="async"
    />
  )
}

export function Kicker({ children }: { children: ReactNode }) {
  return <h6 style={{ color: 'var(--color-accent)' }}>{children}</h6>
}

export function Rule({ style }: { style?: CSSProperties }) {
  return <hr className="hr" style={style} />
}
