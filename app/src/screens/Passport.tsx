import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { capital, history, property, systems } from '../data'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

export default function Passport() {
  return (
    <main style={main}>
      <Kicker>Property Passport™</Kicker>
      <h1 style={{ margin: 0 }}>{property.address}</h1>
      <p className="text-muted" style={{ margin: '8px 0 0', maxWidth: 640 }}>
        A permanent record of every major system in your home — install dates, condition, warranties and full service history.
      </p>
      <Rule style={{ margin: '24px 0' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0 }}>Major systems</h4>
        <button className="btn btn-secondary" style={{ fontSize: 13 }}>Export PDF</button>
      </div>
      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr><th>System</th><th>Make / model</th><th>Installed</th><th>Est. life left</th><th>Condition</th><th>Warranty</th></tr>
        </thead>
        <tbody>
          {systems.map((s) => (
            <tr key={s.name}>
              <td><strong>{s.name}</strong></td>
              <td className="text-muted">{s.model}</td>
              <td>{s.installed}</td>
              <td>{s.life}</td>
              <td><span className={`tag ${s.condClass}`}>{s.cond}</span></td>
              <td className="text-muted">{s.warranty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 40, alignItems: 'start' }}>
        <section>
          <h4 style={{ margin: 0 }}>Service history</h4>
          <Rule style={{ margin: '12px 0 0' }} />
          {history.map((h) => (
            <div key={h.date + h.what} style={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 14 }}>
              <span className="text-muted">{h.date}</span>
              <div>
                <strong>{h.what}</strong>
                <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{h.who}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{h.cost}</span>
            </div>
          ))}
        </section>
        <section>
          <h4 style={{ margin: 0 }}>Capital plan</h4>
          <Rule style={{ margin: '12px 0 0' }} />
          {capital.map((c) => (
            <div key={c.year} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 14, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18 }}>{c.year}</span>
              <div>
                <strong>{c.what}</strong>
                <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{c.why}</p>
              </div>
              <span className="text-muted">{c.est}</span>
            </div>
          ))}
          <p className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
            Estimates refreshed at each annual assessment. Plan ahead — no surprise expenses.
          </p>
        </section>
      </div>
    </main>
  )
}
