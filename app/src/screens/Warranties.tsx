import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { warranties } from '../data'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

export default function Warranties() {
  return (
    <main style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Warranty management</Kicker>
          <h1 style={{ margin: 0 }}>Warranties</h1>
        </div>
        <button className="btn btn-secondary">Add a warranty</button>
      </div>
      <p className="text-muted" style={{ margin: '8px 0 0', maxWidth: 640 }}>
        Every warranty in one place. We track expirations, store documents and file claims on your behalf.
      </p>
      <Rule style={{ margin: '24px 0' }} />
      <table className="table">
        <thead>
          <tr><th>Item</th><th>Provider</th><th>Coverage</th><th>Expires</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {warranties.map((w) => (
            <tr key={w.item}>
              <td><strong>{w.item}</strong></td>
              <td className="text-muted">{w.provider}</td>
              <td className="text-muted">{w.coverage}</td>
              <td>{w.expires}</td>
              <td><span className={`tag ${w.tagClass}`}>{w.status}</span></td>
              <td><button className="btn btn-ghost" style={{ fontSize: 13 }}>{w.action}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 32 }}>
        <div className="card">
          <span className="card-kicker">Expiring soon</span>
          <span className="card-title">Bosch dishwasher — Jun 2027</span>
          <p className="card-body">
            Extended coverage available through Bosch until May 2027. We'll remind you 60 days out with a recommendation.
          </p>
        </div>
        <div className="card">
          <span className="card-kicker">Claims handled</span>
          <span className="card-title">We file for you</span>
          <p className="card-body">
            Send a photo and a sentence — your advisor handles the paperwork, calls and follow-up. 2 claims filed this year, $840 recovered.
          </p>
        </div>
      </div>
    </main>
  )
}
