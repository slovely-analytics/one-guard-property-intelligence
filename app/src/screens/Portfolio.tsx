import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { Modal } from '../components/Overlays'
import { portfolioThumbs } from '../photos'
import { addProperty, toast, useDemo } from '../store'
import type { PortfolioRow } from '../store'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

const statCell: CSSProperties = { padding: '16px 24px', borderRight: '1px solid var(--color-divider)' }
const statNum: CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 40, lineHeight: 1 }

const types = ['Single-family', 'Townhome', 'Condo', 'Duplex', '4-plex']

export default function Portfolio() {
  const { portfolio, tasks } = useDemo()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ addr: '', type: 'Single-family' })

  const mapleOpenTasks = tasks.filter((t) => t.status !== 'DONE').length
  const rowTasks = (r: PortfolioRow) => (r.tasks === null ? mapleOpenTasks : r.tasks)
  const scored = portfolio.filter((r) => r.score !== null)
  const avgScore = Math.round(scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / Math.max(scored.length, 1))
  const openTasks = portfolio.reduce((sum, r) => sum + rowTasks(r), 0)

  const openRow = (r: PortfolioRow) => {
    if (r.addr.startsWith('1847 Maple')) {
      window.location.hash = '#/passport'
    } else {
      toast(`Demo data covers 42 Highland Ave only — ${r.addr} is illustrative.`)
    }
  }

  const submitAdd = () => {
    if (!form.addr.trim()) return
    addProperty({ addr: form.addr.trim(), type: form.type })
    setForm({ addr: '', type: 'Single-family' })
    setAdding(false)
  }

  return (
    <main className="page-main" style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Property manager view</Kicker>
          <h1 style={{ margin: 0 }}>Northgate Residential — {portfolio.length + 6} properties</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setAdding(true)}>Add property</button>
      </div>
      <Rule style={{ margin: '24px 0' }} />
      <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderBottom: '2px solid var(--color-divider)', marginBottom: 24 }}>
        <div style={{ ...statCell, padding: '16px 24px 16px 0' }}><h6 style={{ marginBottom: 6 }}>Avg. score</h6><span style={statNum}>{avgScore}</span></div>
        <div style={statCell}><h6 style={{ marginBottom: 6 }}>Open tasks</h6><span style={statNum}>{openTasks + 13}</span></div>
        <div style={statCell}><h6 style={{ marginBottom: 6 }}>Active projects</h6><span style={statNum}>5</span></div>
        <div style={{ padding: '16px 0 16px 24px' }}><h6 style={{ marginBottom: 6 }}>2026 capital plan</h6><span style={statNum}>$48K</span></div>
      </div>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Score</th><th>Open tasks</th><th>Next assessment</th><th>Attention</th></tr>
          </thead>
          <tbody>
            {portfolio.map((pp) => (
              <tr key={pp.addr} className="row-link" onClick={() => openRow(pp)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {portfolioThumbs[pp.addr] ? (
                      <span
                        className="prop-thumb"
                        role="img"
                        aria-label={`${pp.addr} exterior`}
                        style={{
                          backgroundImage: `url(${portfolioThumbs[pp.addr].src})`,
                          backgroundPosition: portfolioThumbs[pp.addr].focus,
                          backgroundSize: portfolioThumbs[pp.addr].zoom,
                        }}
                      />
                    ) : (
                      <span
                        className="prop-thumb"
                        aria-hidden
                        style={{ background: 'var(--color-neutral-200)', display: 'grid', placeItems: 'center', fontSize: 16 }}
                      >
                        🏠
                      </span>
                    )}
                    <strong>{pp.addr}</strong>
                  </div>
                </td>
                <td className="text-muted">{pp.type}</td>
                <td><span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16 }}>{pp.score ?? '—'}</span></td>
                <td>{rowTasks(pp)}</td>
                <td className="text-muted">{pp.next}</td>
                <td><span className={`tag ${pp.tagClass}`}>{pp.flag}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
        Click any property to open its Passport, assessment history and maintenance plan.
      </p>

      {adding && (
        <Modal title="Add a property" kicker="Portfolio" onClose={() => setAdding(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label>Property address</label>
              <input className="input" value={form.addr} onChange={(e) => setForm({ ...form, addr: e.target.value })} placeholder="Street address" autoFocus />
            </div>
            <div className="field">
              <label>Type</label>
              <div className="seg" style={{ width: '100%' }}>
                {types.map((t) => (
                  <label key={t} className="seg-opt" style={{ flex: 1, justifyContent: 'center' }}>
                    <input type="radio" name="ptype" checked={form.type === t} onChange={() => setForm({ ...form, type: t })} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
              We pull public records automatically and schedule the first Home Health Assessment — the score appears after the visit.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button className="btn btn-primary" onClick={submitAdd} disabled={!form.addr.trim()}>Add property</button>
            <button className="btn btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </main>
  )
}
