import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { projects } from '../data'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

export default function Projects() {
  return (
    <main style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Vendor coordination</Kicker>
          <h1 style={{ margin: 0 }}>Projects</h1>
        </div>
        <button className="btn btn-primary">Request a service</button>
      </div>
      <p className="text-muted" style={{ margin: '8px 0 0', maxWidth: 640 }}>
        Your advisor collects quotes from vetted providers, books the work and verifies it. You approve each step.
      </p>
      <Rule style={{ margin: '24px 0 0' }} />
      {projects.map((p) => (
        <div key={p.title} style={{ padding: '24px 0', borderBottom: '1px solid var(--color-divider)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'baseline' }}>
            <div>
              <strong style={{ fontSize: 16, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{p.title}</strong>
              <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{p.vendor}</p>
            </div>
            <span className={`tag ${p.tagClass}`}>{p.status}</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{p.cost}</span>
          </div>
          <div style={{ display: 'flex', gap: 0, marginTop: 16 }}>
            {p.stepLabels.map((label, i) => (
              <div key={label} style={{ flex: 1, padding: '8px 12px 8px 0' }}>
                <div style={{ height: 4, background: i <= p.stepsDone ? 'var(--color-accent)' : 'var(--color-neutral-300)' }} />
                <div style={{ fontSize: 12, marginTop: 6, color: i <= p.stepsDone ? 'var(--color-text)' : 'var(--color-neutral-500)' }}>{label}</div>
              </div>
            ))}
          </div>
          <p className="text-muted" style={{ fontSize: 13, margin: '10px 0 0' }}>{p.note}</p>
        </div>
      ))}
      <div className="card" style={{ marginTop: 32, maxWidth: 520 }}>
        <span className="card-kicker">How it works</span>
        <p className="card-body" style={{ fontSize: 14 }}>
          Request → we source 2–3 quotes from vetted vendors → you approve → we schedule and verify the work → it lands in your Property Passport automatically.
        </p>
      </div>
    </main>
  )
}
