import { useState } from 'react'
import type { CSSProperties } from 'react'
import { onboardingSystems, plans } from '../data'
import { toast } from '../store'

const main: CSSProperties = { maxWidth: 920, width: '100%', margin: '0 auto', padding: '8px 32px 64px' }
const stepLabels = ['Plan', 'Property', 'Systems', 'Done']

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [planName, setPlanName] = useState('Guard')
  const [booked, setBooked] = useState(false)
  const next = () => setStep((n) => Math.min(n + 1, 4))
  const back = () => setStep((n) => Math.max(n - 1, 1))
  const plan = plans.find((p) => p.name === planName) ?? plans[1]

  return (
    <div>
      <div style={{ maxWidth: 920, width: '100%', margin: '0 auto', padding: '40px 32px 24px' }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--color-divider)' }}>
          {stepLabels.map((label, i) => (
            <div key={label} style={{ flex: 1, padding: '0 16px 12px 0' }}>
              <div style={{ height: 4, background: i + 1 <= step ? 'var(--color-accent)' : 'var(--color-neutral-300)' }} />
              <div style={{ fontSize: 12, marginTop: 8, color: i + 1 <= step ? 'var(--color-text)' : 'var(--color-neutral-500)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{String(i + 1).padStart(2, '0')}</span> {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <main style={main}>
          <h1 style={{ margin: '0 0 8px' }}>Choose your membership</h1>
          <p className="text-muted" style={{ maxWidth: 560, margin: '0 0 32px' }}>
            Every plan includes your Property Passport™, annual Home Health Assessment and a dedicated advisor. Cancel anytime.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'stretch' }}>
            {plans.map((p) => (
              <div
                key={p.name}
                className="card"
                style={{ borderTop: `4px solid ${p.primary ? 'var(--color-accent)' : 'var(--color-neutral-400)'}`, cursor: 'pointer' }}
                onClick={() => { setPlanName(p.name); next() }}
              >
                <span className="card-kicker">{p.kicker}</span>
                <span className="card-title" style={{ fontSize: 22 }}>{p.name}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 36 }}>{p.price}</span>
                  <span className="text-muted" style={{ fontSize: 13 }}>/mo</span>
                </div>
                <p className="card-body" style={{ fontSize: 13 }}>{p.blurb}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, margin: '4px 0 8px' }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 800 }}>—</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button className={`btn ${p.primary ? 'btn-primary' : 'btn-secondary'} btn-block`}>{p.cta}</button>
              </div>
            ))}
          </div>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 24 }}>
            Managing multiple properties? <a href="#/portfolio">See portfolio pricing for property managers →</a>
          </p>
        </main>
      )}

      {step === 2 && (
        <main style={main}>
          <h1 style={{ margin: '0 0 8px' }}>Tell us about your property</h1>
          <p className="text-muted" style={{ maxWidth: 560, margin: '0 0 32px' }}>
            We pre-fill what we can from public records — check it and correct anything that's off.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field"><label>Property address</label><input className="input" defaultValue="1847 Maple Grove Lane, Fort Worth, TX 76107" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="field"><label>Year built</label><input className="input" defaultValue="1998" /></div>
                <div className="field"><label>Square feet</label><input className="input" defaultValue="2,340" /></div>
              </div>
              <div className="field">
                <label>Property type</label>
                <div className="seg" style={{ width: '100%' }}>
                  <label className="seg-opt" style={{ flex: 1 }}><input type="radio" name="pt" defaultChecked />Single-family</label>
                  <label className="seg-opt" style={{ flex: 1 }}><input type="radio" name="pt" />Townhome</label>
                  <label className="seg-opt" style={{ flex: 1 }}><input type="radio" name="pt" />Condo</label>
                  <label className="seg-opt" style={{ flex: 1 }}><input type="radio" name="pt" />Multi-unit</label>
                </div>
              </div>
              <div className="field">
                <label>You are the…</label>
                <div style={{ display: 'flex', gap: 24, padding: '4px 0' }}>
                  <label className="radio"><input type="radio" name="rl" defaultChecked /><span className="dot" />Owner-occupant</label>
                  <label className="radio"><input type="radio" name="rl" /><span className="dot" />Landlord</label>
                  <label className="radio"><input type="radio" name="rl" /><span className="dot" />Property manager</label>
                </div>
              </div>
            </div>
            <div className="card">
              <span className="card-kicker">From public records</span>
              <span className="card-title">1847 Maple Grove Lane</span>
              <p className="card-body" style={{ fontSize: 13 }}>
                Built 1998 · 2,340 sq ft · 4 bed / 2.5 bath · Last sold 2019. We'll verify systems at your first assessment.
              </p>
              <div className="card-meta"><span className="tag tag-neutral">TARRANT COUNTY</span><span>Parcel 04-118-2207</span></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <button className="btn btn-secondary" onClick={back}>← Back</button>
            <button className="btn btn-primary" onClick={next}>Continue</button>
          </div>
        </main>
      )}

      {step === 3 && (
        <main style={main}>
          <h1 style={{ margin: '0 0 8px' }}>Start your Property Passport™</h1>
          <p className="text-muted" style={{ maxWidth: 560, margin: '0 0 32px' }}>
            Tap what you know — skip the rest. Your first assessment fills in every gap, model numbers included.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {onboardingSystems.map((s) => (
              <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '1fr 220px 140px', gap: 24, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-divider)' }}>
                <div>
                  <strong style={{ fontSize: 14 }}>{s.name}</strong>
                  <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{s.hint}</p>
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <input className="input" placeholder="Install year (approx.)" defaultValue={s.year} />
                </div>
                <span className={`tag ${s.tagClass}`} style={{ justifySelf: 'start' }}>{s.status}</span>
              </div>
            ))}
          </div>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
            Don't know a year? Leave it blank — our inspector reads it off the data plate.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button className="btn btn-secondary" onClick={back}>← Back</button>
            <button className="btn btn-primary" onClick={next}>Continue</button>
            <button className="btn btn-ghost" onClick={next}>Skip for now</button>
          </div>
        </main>
      )}

      {step === 4 && (
        <main style={main}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <h6 style={{ color: 'var(--color-accent)' }}>Membership active</h6>
              <h1 style={{ margin: '0 0 8px' }}>Welcome, member.</h1>
              <p className="text-muted" style={{ maxWidth: 440 }}>
                Your Property Passport is started with 5 systems. One thing left: book your first Home Health Assessment — it's included.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 24, borderTop: '2px solid var(--color-divider)' }}>
                {[
                  { n: '1', accent: true, title: 'Book your assessment', detail: '74 checkpoints, ~2 hours. First available: Aug 26.' },
                  { n: '2', accent: false, title: 'Meet your advisor', detail: 'Dana Whitfield reaches out within one business day.' },
                  { n: '3', accent: false, title: 'Get your score & plan', detail: 'Property score, findings and a maintenance calendar within 48 hours of the visit.' },
                ].map((row) => (
                  <div key={row.n} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--color-divider)' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, color: row.accent ? 'var(--color-accent)' : undefined }}>{row.n}</span>
                    <div>
                      <strong style={{ fontSize: 14 }}>{row.title}</strong>
                      <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{row.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                {booked ? (
                  <span className="tag tag-accent" style={{ alignSelf: 'center' }}>ASSESSMENT BOOKED · AUG 26, 9:00 AM</span>
                ) : (
                  <button className="btn btn-primary" onClick={() => { setBooked(true); toast('Assessment booked for Aug 26, 9:00 AM. Calendar invite sent.') }}>
                    Book assessment — Aug 26
                  </button>
                )}
                <a className="btn btn-secondary" href="#/">Go to dashboard</a>
              </div>
            </div>
            <div className="card elev-md">
              <span className="card-kicker">Your membership</span>
              <span className="card-title">{plan.name} plan — {plan.price}/mo</span>
              <table className="table" style={{ fontSize: 13 }}>
                <tbody>
                  <tr><td className="text-muted">Property</td><td>1847 Maple Grove Lane</td></tr>
                  <tr><td className="text-muted">Annual assessment</td><td>Included</td></tr>
                  <tr><td className="text-muted">Advisor</td><td>Dana Whitfield</td></tr>
                  <tr><td className="text-muted">Systems on file</td><td>5 of ~14</td></tr>
                  <tr><td className="text-muted">First billing</td><td>Sep 12, 2026</td></tr>
                </tbody>
              </table>
              <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ alignSelf: 'flex-start' }}>Restart demo flow</button>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
