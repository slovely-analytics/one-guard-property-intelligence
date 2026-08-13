import { useState } from 'react'
import type { CSSProperties } from 'react'
import { ExtLink, Kicker, Rule } from '../components/Shell'
import { Modal } from '../components/Overlays'
import { providerSupportUrl } from '../data'
import { addWarranty, extendWarranty, openChat, toast, useDemo, warrantyTagClass } from '../store'
import type { WarrantyState } from '../store'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

export default function Warranties() {
  const { warranties } = useDemo()
  const [adding, setAdding] = useState(false)
  const [viewing, setViewing] = useState<WarrantyState | null>(null)
  const [extending, setExtending] = useState<WarrantyState | null>(null)
  const [form, setForm] = useState({ item: '', provider: '', coverage: 'Parts & labor', expires: '' })

  const submitAdd = () => {
    if (!form.item.trim() || !form.provider.trim() || !form.expires.trim()) return
    addWarranty({ item: form.item.trim(), provider: form.provider.trim(), coverage: form.coverage, expires: form.expires.trim() })
    setForm({ item: '', provider: '', coverage: 'Parts & labor', expires: '' })
    setAdding(false)
  }

  const actionFor = (w: WarrantyState) => {
    if (w.status === 'EXPIRING') return <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setExtending(w)}>Extend</button>
    return <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setViewing(w)}>{w.status === 'EXPIRED' ? 'Details' : 'View docs'}</button>
  }

  return (
    <main style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Warranty management</Kicker>
          <h1 style={{ margin: 0 }}>Warranties</h1>
        </div>
        <button className="btn btn-secondary" onClick={() => setAdding(true)}>Add a warranty</button>
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
            <tr key={w.id}>
              <td><strong>{w.item}</strong></td>
              <td className="text-muted">
                {providerSupportUrl(w.provider)
                  ? <ExtLink href={providerSupportUrl(w.provider)!}>{w.provider}</ExtLink>
                  : w.provider}
              </td>
              <td className="text-muted">{w.coverage}</td>
              <td>{w.expires}</td>
              <td><span className={`tag ${warrantyTagClass(w.status)}`}>{w.status}</span></td>
              <td>{actionFor(w)}</td>
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
          <button className="btn btn-secondary btn-block" onClick={openChat}>Start a claim with Dana</button>
        </div>
      </div>

      {adding && (
        <Modal title="Add a warranty" kicker="Warranty management" onClose={() => setAdding(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label>Item</label>
              <input className="input" value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="e.g. Garage door opener — LiftMaster" autoFocus />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field">
                <label>Provider</label>
                <input className="input" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="Manufacturer or plan" />
              </div>
              <div className="field">
                <label>Expires</label>
                <input className="input" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} placeholder="e.g. Mar 2029" />
              </div>
            </div>
            <div className="field">
              <label>Coverage</label>
              <div className="seg" style={{ width: '100%' }}>
                {['Parts & labor', 'Parts only', 'Full replacement'].map((c) => (
                  <label key={c} className="seg-opt" style={{ flex: 1 }}>
                    <input type="radio" name="cov" checked={form.coverage === c} onChange={() => setForm({ ...form, coverage: c })} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
              Have the paperwork? Snap a photo in the mobile app and we'll extract the terms for you.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button className="btn btn-primary" onClick={submitAdd} disabled={!form.item.trim() || !form.provider.trim() || !form.expires.trim()}>Add warranty</button>
            <button className="btn btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={viewing.item} kicker="Document vault" onClose={() => setViewing(null)}>
          <table className="table" style={{ fontSize: 13 }}>
            <tbody>
              <tr><td className="text-muted">Provider</td><td>{viewing.provider}</td></tr>
              <tr><td className="text-muted">Coverage</td><td>{viewing.coverage}</td></tr>
              <tr><td className="text-muted">Expires</td><td>{viewing.expires}</td></tr>
            </tbody>
          </table>
          {providerSupportUrl(viewing.provider) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--color-divider)', fontSize: 13, marginTop: 4 }}>
              <span>🔗 {viewing.provider} — support & registration</span>
              <ExtLink href={providerSupportUrl(viewing.provider)!}>Open</ExtLink>
            </div>
          )}
          <h6 style={{ margin: '20px 0 8px' }}>Documents</h6>
          {viewing.docs.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No documents yet — forward paperwork to docs@oneguard.com and we file it here.</p>}
          {viewing.docs.map((d) => (
            <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 13 }}>
              <span>📄 {d}</span>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => toast('Demo: in the full product this downloads the PDF.')}>Download</button>
            </div>
          ))}
          {viewing.status === 'EXPIRED' && (
            <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
              This warranty has expired. The 2028 capital plan already budgets for water heater replacement — ask Dana about coverage on the new unit.
            </p>
          )}
          <button className="btn btn-secondary" style={{ marginTop: 20 }} onClick={() => setViewing(null)}>Close</button>
        </Modal>
      )}

      {extending && (
        <Modal title={`Extend coverage — ${extending.item}`} kicker="Extended plan" onClose={() => setExtending(null)}>
          <p style={{ fontSize: 14, margin: 0 }}>
            Extend coverage 24 months past the current expiration ({extending.expires}) through {extending.provider.split(' ')[0]}'s extended plan.
          </p>
          <table className="table" style={{ fontSize: 13, marginTop: 16 }}>
            <tbody>
              <tr><td className="text-muted">Term</td><td>24 months</td></tr>
              <tr><td className="text-muted">Coverage</td><td>{extending.coverage}</td></tr>
              <tr><td className="text-muted">Price</td><td><strong>$89</strong> one-time (member rate)</td></tr>
              {providerSupportUrl(extending.provider) && (
                <tr><td className="text-muted">Plan terms</td><td><ExtLink href={providerSupportUrl(extending.provider)!}>{extending.provider.split(' ')[0]} coverage details</ExtLink></td></tr>
              )}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => { extendWarranty(extending.id); setExtending(null) }}>Confirm extension</button>
            <button className="btn btn-secondary" onClick={() => setExtending(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </main>
  )
}
