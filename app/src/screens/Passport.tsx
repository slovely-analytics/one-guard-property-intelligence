import { useState } from 'react'
import type { CSSProperties } from 'react'
import { ExtLink, Kicker, Rule, SysThumb } from '../components/Shell'
import { SideDrawer } from '../components/Overlays'
import { capital, history, property, systemDetails, systems } from '../data'
import type { SystemRecord } from '../data'
import { PHOTO_CREDIT, creditsFor, passportStrip, systemPhotos } from '../photos'
import { openChat, toast, useDemo } from '../store'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

function exportPdf() {
  toast('Opening your browser print dialog — choose "Save as PDF".')
  setTimeout(() => window.print(), 400)
}

export default function Passport() {
  const { tasks, passportUpdates } = useDemo()
  const completed = tasks.filter((t) => t.status === 'DONE')
  const proUpdates = passportUpdates.filter((update) => update.status === 'PUBLISHED' && update.propertyAddr.startsWith('1847 Maple Grove'))
  const [selected, setSelected] = useState<SystemRecord | null>(null)
  const detail = selected ? systemDetails[selected.name] : undefined
  return (
    <main className="page-main" style={main}>
      <Kicker>Property Passport™</Kicker>
      <h1 style={{ margin: 0 }}>{property.address}</h1>
      <p className="text-muted" style={{ margin: '8px 0 0', maxWidth: 640 }}>
        A permanent record of every major system in your home — install dates, condition, warranties and full service history.
      </p>
      <Rule style={{ margin: '24px 0' }} />
      <h6 style={{ marginBottom: 8 }}>Property photos</h6>
      <div className="photo-strip">
        {passportStrip.map((s) => (
          <img key={s.src} src={s.src} alt={`${s.title} — ${s.note}`} loading="lazy" decoding="async" />
        ))}
      </div>
      <p className="text-muted" style={{ fontSize: 12, margin: '8px 0 0' }}>
        Captured at the Oct 2025 Home Health Assessment · Photo:{' '}
        <a href={PHOTO_CREDIT.sourceUrl} target="_blank" rel="noreferrer">{PHOTO_CREDIT.author}</a>,{' '}
        <a href={PHOTO_CREDIT.licenseUrl} target="_blank" rel="noreferrer">{PHOTO_CREDIT.license}</a>
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 40 }}>
        <h4 style={{ margin: 0 }}>Major systems</h4>
        <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={exportPdf}>Export PDF</button>
      </div>
      <p className="text-muted" style={{ fontSize: 13, margin: '8px 0 0' }}>
        Click any system to open its full record — model details, service brief and photos.
      </p>
      <div className="table-scroll">
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>System</th><th>Make / model</th><th>Installed</th><th>Est. life left</th><th>Condition</th><th>Warranty</th></tr>
          </thead>
          <tbody>
            {systems.map((s) => (
              <tr key={s.name} className="row-link" onClick={() => setSelected(s)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <SysThumb name={s.name} />
                    <strong>{s.name}</strong>
                  </div>
                </td>
                <td className="text-muted">{s.model}</td>
                <td>{s.installed}</td>
                <td>{s.life}</td>
                <td><span className={`tag ${s.condClass}`}>{s.cond}</span></td>
                <td className="text-muted">{s.warranty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 40, alignItems: 'start' }}>
        <section>
          <h4 style={{ margin: 0 }}>Service history</h4>
          <Rule style={{ margin: '12px 0 0' }} />
          {proUpdates.map((update) => (
            <article key={update.id} className="passport-service-receipt">
              <div><span className="tag tag-accent">NEW SERVICE RECORD</span><span>{update.reviewedOn}</span></div>
              <h5>{update.systemName} — {update.performed}</h5>
              <p>{update.observation}</p>
              <dl>
                <div><dt>Service Pro</dt><dd>{update.submittedBy} · Comfort Professor</dd></div>
                <div><dt>Next step</dt><dd>{update.recommendation}</dd></div>
                <div><dt>Evidence</dt><dd>{update.evidence.join(' · ')}</dd></div>
              </dl>
            </article>
          ))}
          {completed.map((t) => (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 14 }}>
              <span className="text-muted">{t.completedOn} 2026</span>
              <div>
                <strong>{t.what}</strong>
                <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{t.who} · logged from your maintenance plan</p>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>DIY</span>
            </div>
          ))}
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

      {selected && (
        <SideDrawer key={selected.name} title={selected.name} kicker="System record" onClose={() => setSelected(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span className={`tag ${selected.condClass}`}>{selected.cond}</span>
            <span className="text-muted" style={{ fontSize: 13 }}>Est. life left: {selected.life}</span>
          </div>

          <h6 style={{ marginBottom: 8 }}>Photos</h6>
          {(() => {
            const photos = systemPhotos[selected.name] ?? [{ cap: 'Unit overview' }, { cap: 'Data plate' }]
            const credits = creditsFor(photos)
            return (
              <>
                <div className="photo-grid">
                  {photos.map((p) =>
                    p.src ? (
                      <figure key={p.cap} className="photo-real" style={{ margin: 0 }}>
                        <img
                          src={p.src}
                          alt={`${selected.name} — ${p.cap}`}
                          style={p.focus ? { objectPosition: p.focus } : undefined}
                          loading="lazy"
                          decoding="async"
                        />
                        <figcaption className="cap">{p.cap}</figcaption>
                      </figure>
                    ) : (
                      <div key={p.cap} className="photo-ph">
                        <span className="glyph">📷</span>
                        <span className="cap">{p.cap}</span>
                        <span className="soon">Photo coming soon</span>
                      </div>
                    ),
                  )}
                </div>
                {credits.length > 0 && (
                  <p className="text-muted" style={{ fontSize: 11, margin: '6px 0 0' }}>
                    {credits.map((c, i) => (
                      <span key={c.author}>
                        {i > 0 && ' · '}
                        <a href={c.url} target="_blank" rel="noreferrer">{c.author}</a> ({c.license})
                      </span>
                    ))}
                  </p>
                )}
              </>
            )
          })()}

          <h6 style={{ margin: '24px 0 4px' }}>Model details</h6>
          <table className="table" style={{ fontSize: 13 }}>
            <tbody>
              <tr><td className="text-muted">Make / model</td><td>{selected.model}</td></tr>
              {detail && <tr><td className="text-muted">Serial</td><td>{detail.serial}</td></tr>}
              <tr><td className="text-muted">Installed</td><td>{selected.installed}</td></tr>
              <tr><td className="text-muted">Warranty</td><td>{selected.warranty}</td></tr>
              {detail?.specs.map((sp) => (
                <tr key={sp.label}><td className="text-muted">{sp.label}</td><td>{sp.value}</td></tr>
              ))}
            </tbody>
          </table>

          <h6 style={{ margin: '24px 0 4px' }}>Maintenance brief</h6>
          {detail ? (
            detail.brief.map((b) => (
              <div key={b.date + b.note} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 13 }}>
                <span className="text-muted">{b.date}</span>
                <span>{b.note}</span>
              </div>
            ))
          ) : (
            <p className="text-muted" style={{ fontSize: 13 }}>No service records yet — history is added automatically as work is completed.</p>
          )}

          {detail && (
            <>
              <h6 style={{ margin: '24px 0 4px' }}>Documentation</h6>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 13 }}>
                <span>📄 Owner's manual & product docs</span>
                <ExtLink href={detail.manualUrl}>Open</ExtLink>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 13 }}>
                <span>🔗 {detail.manufacturer} — manufacturer site</span>
                <ExtLink href={detail.siteUrl}>Visit</ExtLink>
              </div>
            </>
          )}

          {detail && (
            <div className="card" style={{ marginTop: 20 }}>
              <span className="card-kicker">Outlook</span>
              <p className="card-body" style={{ fontSize: 13 }}>{detail.outlook}</p>
            </div>
          )}

          <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} onClick={() => { setSelected(null); openChat() }}>
            Ask Dana about this system
          </button>
        </SideDrawer>
      )}
    </main>
  )
}
