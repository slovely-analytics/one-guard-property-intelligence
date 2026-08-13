import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { Modal } from '../components/Overlays'
import { categoryScores, findings, scoreColor } from '../data'
import { bookAssessment, useDemo } from '../store'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

const slots = ['Oct 14, 9:00 AM', 'Oct 15, 1:00 PM', 'Oct 21, 9:00 AM']

export default function Health() {
  const { assessmentSlot } = useDemo()
  const [booking, setBooking] = useState(false)
  return (
    <main className="page-main" style={main}>
      <Kicker>Annual Home Health Assessment</Kicker>
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 48, alignItems: 'end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 120, lineHeight: 0.95 }}>82</span>
            <span className="text-muted" style={{ fontSize: 16 }}>/ 100</span>
          </div>
          <p className="text-muted" style={{ margin: '8px 0 0', fontSize: 14 }}>Assessed Oct 2025 · Inspector: M. Torres · 74 checkpoints</p>
        </div>
        <div>
          <p style={{ maxWidth: 520, margin: '0 0 12px' }}>
            Your home is in good condition. Two aging systems — the HVAC condenser and water heater — account for most of the gap to a top score.
          </p>
          {assessmentSlot ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="tag tag-accent">SCHEDULED · {assessmentSlot.toUpperCase()}</span>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setBooking(true)}>Change</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setBooking(true)}>Schedule 2026 assessment</button>
          )}
        </div>
      </div>
      {booking && (
        <Modal title="Schedule your 2026 assessment" kicker="Annual Home Health Assessment" onClose={() => setBooking(false)}>
          <p className="text-muted" style={{ fontSize: 13, margin: '0 0 16px' }}>
            74 checkpoints, about 2 hours. M. Torres is your inspector again this year. Pick a slot:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {slots.map((s) => (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--color-divider)' }}>
                <strong style={{ fontSize: 14 }}>{s}</strong>
                <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => { bookAssessment(s); setBooking(false) }}>
                  {assessmentSlot === s ? 'Keep this slot' : 'Book'}
                </button>
              </div>
            ))}
          </div>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>Need a different time? Message Dana — evenings and weekends available.</p>
        </Modal>
      )}
      <Rule style={{ margin: '32px 0' }} />
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        <section>
          <h4 style={{ margin: '0 0 16px' }}>Score by category</h4>
          {categoryScores.map((sc) => (
            <div key={sc.cat} style={{ padding: '12px 0', borderBottom: '1px solid var(--color-divider)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <strong style={{ fontSize: 14 }}>{sc.cat}</strong>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18 }}>{sc.val}</span>
              </div>
              <div className="meter"><div style={{ background: scoreColor(sc.val), width: `${sc.val}%` }} /></div>
            </div>
          ))}
        </section>
        <section>
          <h4 style={{ margin: '0 0 4px' }}>Key findings</h4>
          {findings.map((f) => (
            <div key={f.title} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--color-divider)', alignItems: 'start' }}>
              <span className={`tag ${f.tagClass}`}>{f.level}</span>
              <div>
                <strong style={{ fontSize: 14 }}>{f.title}</strong>
                <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{f.detail}</p>
              </div>
            </div>
          ))}
          <div className="card" style={{ marginTop: 24 }}>
            <span className="card-kicker">What changed since 2024</span>
            <p className="card-body" style={{ fontSize: 14 }}>
              Score rose from 79 to 82. Roof flashing repair (+2) and new smoke/CO detectors (+1). Water heater aging offset −1.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
