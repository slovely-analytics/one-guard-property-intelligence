import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Route } from '../routing/useHashRoute'
import { PHOTO_CREDIT, systemThumb } from '../photos'
import { roleDef, roles } from '../roles'
import type { Role } from '../roles'
import { resetDemo, setRole, useDemo } from '../store'

export function Nav({ current }: { current: Route }) {
  const { role } = useDemo()
  if (!role) return null
  const def = roleDef(role)

  return (
    <nav className="nav">
      <a
        href="#/enter"
        className="nav-brand"
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 0, color: 'inherit', textDecoration: 'none' }}
        title="Back to the entry screen"
      >
        <span style={{ display: 'inline-block', width: 14, height: 14, background: 'var(--color-accent)', flex: 'none' }} />
        ONE GUARD <span className="nav-brand-sub" style={{ fontWeight: 400, color: 'var(--color-neutral-600)' }}>{def.label}</span>
      </a>

      {def.nav.map((l) => (
        <a key={l.path} href={`#${l.path}`} aria-current={current === l.path ? 'page' : undefined}>
          {l.label}
        </a>
      ))}

      <span className="nav-right">
        <a href="#/mobile" aria-current={current === '/mobile' ? 'page' : undefined}>Mobile app</a>
        <a href="#/signup" aria-current={current === '/signup' ? 'page' : undefined}>Sign up</a>
        <RoleSwitcher current={role} />
      </span>
    </nav>
  )
}

/** Hop between doors without going back through the entry screen — the
 *  continuity story plays all three roles inside a minute. */
function RoleSwitcher({ current }: { current: Role }) {
  const [open, setOpen] = useState(false)
  const def = roleDef(current)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const pick = (id: Role) => {
    setOpen(false)
    if (id === current) return
    setRole(id)
    window.location.hash = `#${roleDef(id).home}`
  }

  return (
    <span className="role-switch">
      {open && <span className="role-backdrop" onClick={() => setOpen(false)} />}
      <button
        className="role-switch-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Viewing as ${def.label} — switch door`}
      >
        <span className="role-dot" aria-hidden />
        <span>Viewing as <strong style={{ fontWeight: 800 }}>{def.label}</strong></span>
        <span aria-hidden style={{ fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <span className="role-menu" role="menu">
          <span className="role-menu-head">Switch door</span>
          {roles.map((r) => (
            <button
              key={r.id}
              className="role-menu-item"
              role="menuitem"
              aria-label={`${r.label} — ${r.persona.name}`}
              aria-current={r.id === current}
              onClick={() => pick(r.id)}
            >
              <strong style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14 }}>{r.label}</strong>
              <span className="text-muted" style={{ fontSize: 12 }}>{r.persona.name} · {r.persona.sub}</span>
            </button>
          ))}
          <span className="role-menu-foot">
            <a href="#/enter" onClick={() => { setOpen(false); setRole(null) }}>Back to the entry screen →</a>
          </span>
        </span>
      )}
    </span>
  )
}

export function Footer() {
  return (
    <footer
      className="text-muted footer"
      style={{ borderTop: '2px solid var(--color-divider)', padding: '16px 32px', display: 'flex', gap: '10px 24px', fontSize: 12, marginTop: 'auto', flexWrap: 'wrap' }}
    >
      <span>ONE GUARD Property Intelligence</span>
      <span>Demo — sample data</span>
      <a href="#" onClick={(e) => { e.preventDefault(); resetDemo() }}>Reset demo data</a>
      <span>
        Photos:{' '}
        <a href={PHOTO_CREDIT.sourceUrl} target="_blank" rel="noreferrer">{PHOTO_CREDIT.author}</a>,{' '}
        <a href={PHOTO_CREDIT.licenseUrl} target="_blank" rel="noreferrer">{PHOTO_CREDIT.license}</a>
      </span>
      <a href="#/enter" style={{ marginLeft: 'auto' }} onClick={() => setRole(null)}>Change door →</a>
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
