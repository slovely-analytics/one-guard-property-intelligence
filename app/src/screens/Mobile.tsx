import type { CSSProperties, ReactNode } from 'react'
import { IOSDevice } from '../components/IOSFrame'
import { Kicker, SysThumb } from '../components/Shell'
import { PHOTO_CREDIT, gallery } from '../photos'

const screenPad: CSSProperties = {
  fontFamily: 'var(--font-body)',
  color: 'var(--color-text)',
  background: 'var(--color-bg)',
  minHeight: '100%',
  padding: '12px 20px 32px',
}

function Phone({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div>
      <IOSDevice>
        <div style={screenPad}>{children}</div>
      </IOSDevice>
      <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>{caption}</p>
    </div>
  )
}

function MobileHome() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0 16px', borderBottom: '2px solid var(--color-divider)' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 11, height: 11, background: 'var(--color-accent)' }} />ONE GUARD
        </span>
        <span className="tag tag-accent">MEMBER</span>
      </div>
      <figure className="phone-hero">
        <img src={gallery[0].src} alt="1847 Maple Grove Lane — southeast elevation" loading="lazy" decoding="async" />
        <figcaption>
          <span className="phone-hero-addr">1847 Maple Grove Lane</span>
          <span className="phone-hero-sub">Single-family · Built 1998</span>
        </figcaption>
      </figure>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 16 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 72, lineHeight: 1 }}>82</span>
        <span className="text-muted" style={{ fontSize: 13 }}>/ 100 property score</span>
      </div>
      <div className="meter" style={{ margin: '12px 0 4px' }}><div style={{ width: '82%', background: 'var(--color-accent)' }} /></div>
      <p className="text-muted" style={{ fontSize: 12, margin: '0 0 20px' }}>+3 since last assessment · Next: Oct 14</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'flex-start' }}>Request service</button>
        <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'flex-start' }}>Message Dana</button>
      </div>
      <h6 style={{ marginBottom: 0 }}>Needs attention</h6>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          { tag: 'tag-outline', label: 'PRIORITY', title: 'HVAC condenser at end of life', detail: '2 quotes in — review by Aug 15' },
          { tag: 'tag-accent', label: 'DUE AUG 20', title: 'Replace HVAC air filters', detail: 'MERV 11, 20×25×1 — 2 units' },
          { tag: 'tag-neutral', label: 'AUG 21', title: 'Roof inspection — confirmed', detail: 'Summit Roofing Co. · 8:00 AM' },
        ].map((row) => (
          <div key={row.title} style={{ padding: '14px 0', borderBottom: '1px solid var(--color-divider)' }}>
            <span className={`tag ${row.tag}`}>{row.label}</span>
            <p style={{ fontSize: 14, fontWeight: 600, margin: '8px 0 2px' }}>{row.title}</p>
            <p className="text-muted" style={{ fontSize: 12, margin: 0 }}>{row.detail}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function MobilePassport() {
  const rows = [
    { name: 'HVAC — condenser', detail: '2008 · 0–2 yrs left', tag: 'tag-outline', label: 'AGING' },
    { name: 'Water heater', detail: '2015 · 1–3 yrs left', tag: 'tag-outline', label: 'AGING' },
    { name: 'Roof', detail: '2014 · 15+ yrs · Warranty 2044', tag: 'tag-neutral', label: 'GOOD' },
    { name: 'Electrical panel', detail: '1998 · 200A', tag: 'tag-neutral', label: 'GOOD' },
    { name: 'Refrigerator', detail: '2023 · Warranty Mar 2028', tag: 'tag-accent', label: 'NEW' },
    { name: 'Dishwasher', detail: '2022 · Warranty Jun 2027', tag: 'tag-neutral', label: 'GOOD' },
  ]
  return (
    <>
      <div style={{ padding: '8px 0 12px', borderBottom: '2px solid var(--color-divider)' }}>
        <h6 style={{ color: 'var(--color-accent)', margin: '0 0 2px' }}>Property Passport™</h6>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18 }}>Major systems</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r) => (
          <div key={r.name} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-divider)' }}>
            <SysThumb name={r.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{r.name}</p>
              <p className="text-muted" style={{ fontSize: 12, margin: 0 }}>{r.detail}</p>
            </div>
            <span className={`tag ${r.tag}`}>{r.label}</span>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <span className="card-kicker">Capital plan</span>
        <p className="card-body" style={{ fontSize: 13 }}>2027 — HVAC condenser, $6.2–7.8K · 2028 — Water heater, $1.8–3.4K</p>
      </div>
    </>
  )
}

function MobileRequest() {
  return (
    <>
      <div style={{ padding: '8px 0 12px', borderBottom: '2px solid var(--color-divider)' }}>
        <h6 style={{ color: 'var(--color-accent)', margin: '0 0 2px' }}>Request a service</h6>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18 }}>We handle the rest</span>
      </div>
      <div className="field" style={{ marginTop: 20 }}>
        <label>What needs attention?</label>
        <input className="input" defaultValue="Water heater flush" />
      </div>
      <div className="field" style={{ marginTop: 16 }}>
        <label>When works for you?</label>
        <div className="seg" style={{ width: '100%' }}>
          <label className="seg-opt" style={{ flex: 1 }}><input type="radio" name="w" defaultChecked />This week</label>
          <label className="seg-opt" style={{ flex: 1 }}><input type="radio" name="w" />Next week</label>
          <label className="seg-opt" style={{ flex: 1 }}><input type="radio" name="w" />Flexible</label>
        </div>
      </div>
      <div className="field" style={{ marginTop: 16 }}>
        <label>Notes for your advisor</label>
        <textarea className="input" placeholder="Anything the crew should know?" />
      </div>
      <button className="btn btn-primary btn-block" style={{ marginTop: 20 }}>Send to Dana</button>
      <div className="card" style={{ marginTop: 24 }}>
        <span className="card-kicker">What happens next</span>
        <p className="card-body" style={{ fontSize: 13 }}>
          Dana sources 2–3 quotes from vetted vendors. You approve one tap — we schedule, verify, and log it in your Passport.
        </p>
      </div>
    </>
  )
}

export default function Mobile() {
  return (
    <main className="page-main" style={{ maxWidth: 1400, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }}>
      <Kicker>One Guard Property Intelligence</Kicker>
      <h2 style={{ margin: '0 0 4px' }}>Mobile app</h2>
      <p className="text-muted" style={{ margin: '0 0 32px', maxWidth: 560 }}>
        Homeowner companion — score at a glance, tasks, and one-tap service requests.
      </p>
      <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Phone caption="Home — score & tasks"><MobileHome /></Phone>
        <Phone caption="Property Passport — systems"><MobilePassport /></Phone>
        <Phone caption="Service request — one tap to your advisor"><MobileRequest /></Phone>
      </div>
      <p className="text-muted" style={{ fontSize: 12, marginTop: 32 }}>
        Property photos:{' '}
        <a href={PHOTO_CREDIT.sourceUrl} target="_blank" rel="noreferrer">{PHOTO_CREDIT.author}</a>,{' '}
        <a href={PHOTO_CREDIT.licenseUrl} target="_blank" rel="noreferrer">{PHOTO_CREDIT.license}</a>
        {' '}· system photos credited on each record.
      </p>
    </main>
  )
}
