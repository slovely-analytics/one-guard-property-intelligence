// The three doors — the first screen anyone sees.
//
// Deliberately not a login: no credentials, no password to fumble in a live
// demo. Picking a door sets the role, and the top bar keeps a switcher so the
// continuity story can hop between all three in one breath.
import { roles } from '../roles'
import type { RoleDef } from '../roles'
import { setRole } from '../store'

export default function Entry() {
  const enter = (r: RoleDef) => {
    setRole(r.id)
    window.location.hash = `#${r.home}`
  }

  return (
    <div className="entry">
      <header className="entry-head">
        <span style={{ display: 'inline-block', width: 14, height: 14, background: 'var(--color-accent)', flex: 'none' }} />
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18 }}>ONE GUARD</span>
        <span className="text-muted" style={{ fontSize: 13 }}>Property Intelligence</span>
        <span className="tag tag-outline" style={{ marginLeft: 'auto' }}>DEMO</span>
      </header>

      <div className="entry-hero">
        <h6 style={{ color: 'var(--color-accent)' }}>The record belongs to the property</h6>
        <p className="text-muted" style={{ maxWidth: 620, margin: 0, fontSize: 15 }}>
          Every visit a pro makes writes to the property&rsquo;s record — not to a filing cabinet
          in one contractor&rsquo;s back office. The owner decides who sees it, for how long.
        </p>
      </div>

      <div className="doors">
        {roles.map((r, i) => (
          <button key={r.id} className="door" aria-label={`Enter as ${r.label}`} onClick={() => enter(r)}>
            <img className="door-img" src={r.photo} alt="" loading="eager" decoding="async" />
            <span className="door-scrim" aria-hidden />
            <span className="door-bar" aria-hidden />
            <span className="door-body">
              <span className="door-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="door-label">{r.label}</span>
              <span className="door-tagline">{r.tagline}</span>
              <p className="door-blurb">{r.blurb}</p>
              <span className="door-enter">Enter <span aria-hidden>→</span></span>
            </span>
          </button>
        ))}
      </div>

      <footer className="entry-foot text-muted">
        <span>Demo — sample data, no sign-in.</span>
        <span>You can switch doors at any time from the top bar.</span>
        <a href="#/signup" style={{ marginLeft: 'auto' }}>See homeowner onboarding →</a>
      </footer>
    </div>
  )
}
