import type { CSSProperties } from 'react'
import { Rule } from '../components/Shell'
import { alerts, property } from '../data'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

export default function Dashboard() {
  return (
    <main style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>{property.address}</h1>
        <span className="text-muted" style={{ fontSize: 14 }}>{property.summary}</span>
      </div>
      <Rule style={{ margin: '24px 0' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderBottom: '2px solid var(--color-divider)' }}>
        <div style={{ padding: '20px 24px 20px 0', borderRight: '1px solid var(--color-divider)' }}>
          <h6 style={{ marginBottom: 8 }}>Property score</h6>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{property.score}</span>
            <span className="text-muted" style={{ fontSize: 13 }}>/ 100</span>
          </div>
          <span className="tag tag-accent" style={{ marginTop: 8 }}>GOOD · {property.scoreDelta}</span>
        </div>
        <div style={{ padding: '20px 24px', borderRight: '1px solid var(--color-divider)' }}>
          <h6 style={{ marginBottom: 8 }}>Open tasks</h6>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{property.openTasks}</div>
          <p className="text-muted" style={{ fontSize: 13, margin: '8px 0 0' }}>{property.openTasksNote}</p>
        </div>
        <div style={{ padding: '20px 24px', borderRight: '1px solid var(--color-divider)' }}>
          <h6 style={{ marginBottom: 8 }}>Systems tracked</h6>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{property.systemsTracked}</div>
          <p className="text-muted" style={{ fontSize: 13, margin: '8px 0 0' }}>{property.systemsNote}</p>
        </div>
        <div style={{ padding: '20px 0 20px 24px' }}>
          <h6 style={{ marginBottom: 8 }}>Next assessment</h6>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 32, lineHeight: 1.1, marginTop: 12 }}>{property.nextAssessment}</div>
          <p className="text-muted" style={{ fontSize: 13, margin: '8px 0 0' }}>Annual Home Health Assessment</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginTop: 32, alignItems: 'start' }}>
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0 }}>Needs attention</h4>
            <a className="btn btn-ghost" href="#/maintenance">View all →</a>
          </div>
          <Rule style={{ margin: '12px 0 0' }} />
          {alerts.map((a) => (
            <div key={a.title} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-divider)' }}>
              <span className={`tag ${a.tagClass}`}>{a.level}</span>
              <div>
                <strong style={{ fontSize: 14 }}>{a.title}</strong>
                <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{a.detail}</p>
              </div>
              <button className="btn btn-secondary" style={{ fontSize: 13 }}>{a.action}</button>
            </div>
          ))}
        </section>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <span className="card-kicker">Active project</span>
            <span className="card-title">Roof inspection & gutter repair</span>
            <p className="card-body">Summit Roofing Co. — scheduled Aug 21, 8:00 AM. Your coordinator: Dana W.</p>
            <div className="card-meta"><span className="tag tag-neutral">SCHEDULED</span><span>Est. $480</span></div>
          </div>
          <div className="card">
            <span className="card-kicker">Your team</span>
            <span className="card-title">Dana Whitfield</span>
            <p className="card-body">Dedicated property advisor. Coordinates vendors, reviews quotes, tracks warranties.</p>
            <button className="btn btn-primary btn-block">Message Dana</button>
          </div>
        </aside>
      </div>
    </main>
  )
}
