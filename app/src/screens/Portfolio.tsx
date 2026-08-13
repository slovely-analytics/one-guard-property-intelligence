import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { portfolio } from '../data'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

const statCell: CSSProperties = { padding: '16px 24px', borderRight: '1px solid var(--color-divider)' }
const statNum: CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 40, lineHeight: 1 }

export default function Portfolio() {
  return (
    <main style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Property manager view</Kicker>
          <h1 style={{ margin: 0 }}>Northgate Residential — 12 properties</h1>
        </div>
        <button className="btn btn-primary">Add property</button>
      </div>
      <Rule style={{ margin: '24px 0' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderBottom: '2px solid var(--color-divider)', marginBottom: 24 }}>
        <div style={{ ...statCell, padding: '16px 24px 16px 0' }}><h6 style={{ marginBottom: 6 }}>Avg. score</h6><span style={statNum}>79</span></div>
        <div style={statCell}><h6 style={{ marginBottom: 6 }}>Open tasks</h6><span style={statNum}>23</span></div>
        <div style={statCell}><h6 style={{ marginBottom: 6 }}>Active projects</h6><span style={statNum}>5</span></div>
        <div style={{ padding: '16px 0 16px 24px' }}><h6 style={{ marginBottom: 6 }}>2026 capital plan</h6><span style={statNum}>$48K</span></div>
      </div>
      <table className="table">
        <thead>
          <tr><th>Property</th><th>Type</th><th>Score</th><th>Open tasks</th><th>Next assessment</th><th>Attention</th></tr>
        </thead>
        <tbody>
          {portfolio.map((pp) => (
            <tr key={pp.addr}>
              <td><strong>{pp.addr}</strong></td>
              <td className="text-muted">{pp.type}</td>
              <td><span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16 }}>{pp.score}</span></td>
              <td>{pp.tasks}</td>
              <td className="text-muted">{pp.next}</td>
              <td><span className={`tag ${pp.tagClass}`}>{pp.flag}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
        Click any property to open its Passport, assessment history and maintenance plan.
      </p>
    </main>
  )
}
