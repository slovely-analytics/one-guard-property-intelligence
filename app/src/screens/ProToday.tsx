// Service Pro home — the route for the day.
//
// The list is deliberately access-first: what a pro can see about a property is
// a property of the grant, not of the job. The withheld third stop is the
// argument for the whole permission layer, sitting on the first screen.
import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { accessTagClass, proJobs } from '../data'
import { portfolioThumbs } from '../photos'
import { roleDef } from '../roles'
import { toast } from '../store'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }
const statCell: CSSProperties = { padding: '16px 24px', borderRight: '1px solid var(--color-divider)' }
const statNum: CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 40, lineHeight: 1 }

export default function ProToday() {
  const pro = roleDef('pro')
  const readable = proJobs.filter((j) => j.access !== 'PENDING').length
  const waiting = proJobs.length - readable

  return (
    <main className="page-main" style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Service Pro · {pro.persona.sub}</Kicker>
          <h1 style={{ margin: 0 }}>Today&rsquo;s route — Thu, Aug 21</h1>
        </div>
        <span className="tag tag-neutral">LICENSE &amp; INSURANCE VERIFIED</span>
      </div>
      <Rule style={{ margin: '24px 0' }} />

      <div
        className="mobile-grid-2"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, borderBottom: '2px solid var(--color-divider)', marginBottom: 24 }}
      >
        <div style={{ ...statCell, padding: '16px 24px 16px 0' }}>
          <h6 style={{ marginBottom: 6 }}>Stops</h6><span style={statNum}>{proJobs.length}</span>
        </div>
        <div style={statCell}>
          <h6 style={{ marginBottom: 6 }}>Records available</h6><span style={statNum}>{readable}</span>
        </div>
        <div style={{ padding: '16px 0 16px 24px' }}>
          <h6 style={{ marginBottom: 6 }}>Awaiting access</h6>
          <span style={{ ...statNum, color: waiting ? 'var(--color-accent)' : undefined }}>{waiting}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {proJobs.map((j) => {
          const thumb = portfolioThumbs[j.thumbKey]
          const withheld = j.access === 'PENDING'
          return (
            <div
              key={j.id}
              className="mobile-grid-1"
              style={{
                display: 'grid',
                gridTemplateColumns: '76px 88px 1fr 300px',
                gap: 20,
                alignItems: 'start',
                padding: '20px 0',
                borderBottom: '1px solid var(--color-divider)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17, paddingTop: 2 }}>{j.time}</span>

              <span
                className="prop-thumb"
                aria-hidden
                style={{ backgroundImage: `url(${thumb.src})`, backgroundPosition: thumb.focus, backgroundSize: thumb.zoom }}
              />

              <div>
                <strong style={{ fontSize: 15 }}>{j.job}</strong>
                <p style={{ margin: '3px 0 0', fontSize: 13 }}>
                  {j.addr} <span className="text-muted">· {j.city}</span>
                </p>
                <p className="text-muted" style={{ margin: '4px 0 0', fontSize: 13 }}>{j.detail}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <span className={`tag ${accessTagClass(j.access)}`}>{j.access === 'STANDING' ? 'STANDING ACCESS' : j.access === 'GRANTED' ? 'ACCESS GRANTED' : 'AWAITING ACCESS'}</span>
                <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>{j.accessNote}</p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    padding: '8px 10px',
                    width: '100%',
                    background: withheld ? 'transparent' : 'var(--color-neutral-100)',
                    border: withheld ? '1px dashed var(--color-neutral-400)' : '1px solid var(--color-divider)',
                    color: withheld ? 'var(--color-neutral-600)' : undefined,
                  }}
                >
                  {j.onFile}
                </p>
                <button
                  className={`btn ${withheld ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() =>
                    toast(
                      withheld
                        ? `Reminder sent to the owner at ${j.addr}. You'll get the record the moment they approve.`
                        : `Opening the property record for ${j.addr} — job view lands in the next build.`,
                    )
                  }
                >
                  {withheld ? 'Nudge the owner' : 'Open property record'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-muted" style={{ fontSize: 13, marginTop: 20, maxWidth: 640 }}>
        Access is granted by the property owner, scoped to what the job needs, and expires on its own.
        Anything you log stays with the property under your name — no other company can edit it.
      </p>
    </main>
  )
}
