import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { tasks } from '../data'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

export default function Maintenance() {
  return (
    <main style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Maintenance plan</Kicker>
          <h1 style={{ margin: 0 }}>2026 schedule</h1>
        </div>
        <div className="seg">
          <label className="seg-opt"><input type="radio" name="v" defaultChecked />Upcoming</label>
          <label className="seg-opt"><input type="radio" name="v" />Completed</label>
          <label className="seg-opt"><input type="radio" name="v" />All</label>
        </div>
      </div>
      <Rule style={{ margin: '24px 0 0' }} />
      {tasks.map((t) => (
        <div key={t.date + t.what} style={{ display: 'grid', gridTemplateColumns: '96px 1fr 140px 130px auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-divider)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>{t.date}</div>
            <span className="text-muted" style={{ fontSize: 12 }}>{t.season}</span>
          </div>
          <div>
            <strong style={{ fontSize: 14 }}>{t.what}</strong>
            <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{t.detail}</p>
          </div>
          <span className="text-muted" style={{ fontSize: 13 }}>{t.who}</span>
          <span className={`tag ${t.tagClass}`}>{t.status}</span>
          <button className="btn btn-secondary" style={{ fontSize: 13 }}>{t.action}</button>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 40 }}>
        <div className="card">
          <span className="card-kicker">Vendor coordination</span>
          <span className="card-title">We handle the scheduling</span>
          <p className="card-body">
            Every task above can be routed to a vetted provider. Your advisor collects quotes, books the visit and verifies the work — you approve with one tap.
          </p>
          <button className="btn btn-primary btn-block">Request a service</button>
        </div>
        <div className="card">
          <span className="card-kicker">Reminders</span>
          <span className="card-title">Never miss a filter again</span>
          <p className="card-body">
            Reminders go out by email and text 10 days before each due date, tuned to your home's systems and local climate.
          </p>
          <button className="btn btn-secondary btn-block">Notification settings</button>
        </div>
      </div>
    </main>
  )
}
