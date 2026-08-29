// The owner side of the permission model — the counterpart to the access
// states the Service Pro door shows on every job. A request arrives here,
// gets scoped and time-boxed here, and can be taken back here. The Comfort
// Professor grant is live-wired to the pro door: revoke it and Marcus's
// water-heater job goes dark over there.
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { Modal } from '../components/Overlays'
import {
  approveAccessRequest,
  declineAccessRequest,
  restoreAccess,
  revokeAccess,
  useDemo,
} from '../store'
import type { AccessGrantState, GrantKind } from '../store'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

const durations: Array<{ id: string; kind: GrantKind; label: string; sub: string; window: string }> = [
  { id: 'job', kind: 'JOB', label: 'This job only', sub: 'Expires 7 days after the work completes', window: 'Expires 7 days after the job completes' },
  { id: '30d', kind: 'JOB', label: '30 days', sub: 'Covers the quote and any follow-up visit', window: 'Expires Sep 20' },
  { id: 'standing', kind: 'STANDING', label: 'Standing access', sub: 'Until you revoke it — reviewed yearly', window: 'Since Aug 21 · reviewed yearly' },
]

function grantTag(g: AccessGrantState): { label: string; className: string } {
  if (g.status === 'PENDING') return { label: 'WAITING ON YOU', className: 'tag-outline' }
  if (g.status === 'REVOKED') return { label: 'REVOKED', className: 'tag-outline' }
  if (g.status === 'DECLINED') return { label: 'DECLINED', className: 'tag-neutral' }
  return g.kind === 'STANDING'
    ? { label: 'STANDING ACCESS', className: 'tag-neutral' }
    : { label: 'JOB ACCESS', className: 'tag-accent' }
}

export default function Access() {
  const { grants, accessLog } = useDemo()
  const [approving, setApproving] = useState<AccessGrantState | null>(null)
  const [duration, setDuration] = useState('job')

  const pending = grants.filter((g) => g.status === 'PENDING')
  const decided = grants.filter((g) => g.status !== 'PENDING')

  const openApprove = (g: AccessGrantState) => {
    setDuration('job')
    setApproving(g)
  }

  const grant = () => {
    if (!approving) return
    const chosen = durations.find((d) => d.id === duration) ?? durations[0]
    approveAccessRequest(approving.id, chosen.kind, chosen.window)
    setApproving(null)
  }

  return (
    <main className="page-main" style={main}>
      <div style={{ maxWidth: 720 }}>
        <Kicker>Property access</Kicker>
        <h1 style={{ margin: 0 }}>Who can see this record</h1>
        <p className="text-muted" style={{ fontSize: 15, margin: '12px 0 0' }}>
          Access belongs to you, not the contractor. Every grant is scoped to named systems,
          time-boxed, and revocable — and every view of the record is logged below.
        </p>
      </div>

      {pending.map((g) => (
        <section
          key={g.id}
          aria-label={`Access request from ${g.company}`}
          className="mobile-grid-1"
          style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start', border: '2px solid var(--color-accent)', padding: '24px 28px', margin: '32px 0 0' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span className="tag tag-outline">WAITING ON YOU</span>
              <span className="text-muted" style={{ fontSize: 12 }}>{g.window}</span>
            </div>
            <h3 style={{ margin: '12px 0 0' }}>{g.company} <span className="text-muted" style={{ fontWeight: 400, fontSize: 15 }}>· {g.trade}</span></h3>
            <p className="text-muted" style={{ fontSize: 14, margin: '8px 0 0', maxWidth: '64ch' }}>{g.note}</p>
            <h6 style={{ margin: '16px 0 2px' }}>What they would see</h6>
            <p style={{ fontSize: 13, margin: 0 }}>{g.scope}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
            <button className="btn btn-primary" onClick={() => openApprove(g)}>Grant access…</button>
            <button className="btn btn-secondary" onClick={() => declineAccessRequest(g.id)}>Decline</button>
          </div>
        </section>
      ))}

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginTop: 40 }}>
        <h4 style={{ margin: 0 }}>Current grants</h4>
        <span className="text-muted" style={{ fontSize: 12 }}>42 Highland Ave</span>
      </div>
      <Rule style={{ margin: '12px 0 0' }} />
      {decided.map((g) => {
        const tag = grantTag(g)
        return (
          <div
            key={g.id}
            className="mobile-grid-1"
            style={{ display: 'grid', gridTemplateColumns: '150px 1.3fr 1.2fr auto', gap: 16, alignItems: 'center', padding: '18px 0', borderBottom: '1px solid var(--color-divider)', opacity: g.status === 'DECLINED' ? 0.65 : 1 }}
          >
            <span className={`tag ${tag.className}`} style={{ justifySelf: 'start' }}>{tag.label}</span>
            <div>
              <strong style={{ fontSize: 14 }}>{g.company} <span className="text-muted" style={{ fontWeight: 400, fontSize: 12 }}>· {g.trade}</span></strong>
              <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{g.note}</p>
            </div>
            <div>
              <p style={{ fontSize: 13, margin: 0 }}>{g.scope}</p>
              <p className="text-muted" style={{ fontSize: 12, margin: '2px 0 0' }}>
                {g.status === 'REVOKED' ? `Revoked ${g.decidedOn} — record hidden` : g.status === 'DECLINED' ? `Declined ${g.decidedOn}` : g.window}
              </p>
            </div>
            {g.status === 'ACTIVE' && (
              <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => revokeAccess(g.id)}>Revoke</button>
            )}
            {g.status === 'REVOKED' && (
              <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => restoreAccess(g.id)}>Restore</button>
            )}
            {g.status === 'DECLINED' && (
              <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => openApprove(g)}>Reconsider</button>
            )}
          </div>
        )
      })}
      <p className="text-muted" style={{ fontSize: 12, margin: '12px 0 0' }}>
        Demo: revoke Comfort Professor's standing access, then switch to the Service Pro door —
        this morning's water-heater visit loses the property record until you restore it.
      </p>

      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, marginTop: 40, alignItems: 'start' }}>
        <section>
          <h4 style={{ margin: 0 }}>Access log</h4>
          <Rule style={{ margin: '12px 0 0' }} />
          <table className="table" style={{ fontSize: 13 }}>
            <tbody>
              {accessLog.map((entry, i) => (
                <tr key={`${entry.on}-${i}`}>
                  <td className="text-muted" style={{ whiteSpace: 'nowrap', width: 140 }}>{entry.on}</td>
                  <td style={{ width: 220 }}>{entry.who}</td>
                  <td className="text-muted">{entry.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <span className="card-kicker">How access works</span>
            <span className="card-title">Scoped, time-boxed, revocable</span>
            <p className="card-body">
              A grant covers named systems, never the whole record. It ends on its own schedule,
              and you can end it sooner. This is not an open network — nobody sees your home
              without your say-so.
            </p>
          </div>
          <div className="card">
            <span className="card-kicker">When you revoke</span>
            <span className="card-title">The record hides immediately</span>
            <p className="card-body">
              The company loses the view right away. Work they already logged stays in your
              Passport, attributed to them — history is never quietly rewritten.
            </p>
          </div>
        </aside>
      </div>

      {approving && (
        <Modal title={`Grant ${approving.company} access`} kicker="Scoped grant" onClose={() => setApproving(null)}>
          <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>{approving.note}</p>
          <h6 style={{ margin: '16px 0 2px' }}>What they will see</h6>
          <p style={{ fontSize: 13, margin: 0 }}>{approving.scope}</p>
          <div className="field" style={{ marginTop: 20 }}>
            <label>For how long</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {durations.map((d) => (
                <label key={d.id} className="radio" style={{ gap: 12, alignItems: 'flex-start' }}>
                  <input
                    type="radio"
                    name="duration"
                    checked={duration === d.id}
                    onChange={() => setDuration(d.id)}
                    style={{ position: 'static', opacity: 1, width: 16, height: 16, accentColor: 'var(--color-accent)', marginTop: 2 }}
                  />
                  <span>
                    <strong style={{ display: 'block', fontSize: 14 }}>{d.label}</strong>
                    <span className="text-muted" style={{ fontSize: 12 }}>{d.sub}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" onClick={grant}>Grant access</button>
            <button className="btn btn-secondary" onClick={() => setApproving(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </main>
  )
}
