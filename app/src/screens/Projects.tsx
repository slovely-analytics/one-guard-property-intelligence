import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Kicker, Rule } from '../components/Shell'
import { Modal, RequestServiceModal } from '../components/Overlays'
import {
  approveRegrade,
  chooseQuote,
  openChat,
  projectTagClass,
  setHighlightProject,
  useDemo,
} from '../store'
import type { ProjectState } from '../store'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

export default function Projects() {
  const { projects, highlightProject } = useDemo()
  const [requesting, setRequesting] = useState(false)
  const [reviewing, setReviewing] = useState<ProjectState | null>(null)
  const [flashId, setFlashId] = useState<string | null>(null)

  useEffect(() => {
    if (highlightProject) {
      setFlashId(highlightProject)
      setHighlightProject(null)
      const el = document.getElementById(`project-${highlightProject}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const timer = setTimeout(() => setFlashId(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [highlightProject])

  const actionFor = (p: ProjectState) => {
    if (p.status === 'QUOTES IN' && p.quotes) {
      return <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setReviewing(p)}>Review quotes</button>
    }
    if (p.status === 'ACTION NEEDED') {
      return <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={approveRegrade}>Approve {p.cost} quote</button>
    }
    if (p.status === 'REQUESTED') {
      return <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={openChat}>Message Dana</button>
    }
    return null
  }

  return (
    <main className="page-main" style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Vendor coordination</Kicker>
          <h1 style={{ margin: 0 }}>Projects</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setRequesting(true)}>Request a service</button>
      </div>
      <p className="text-muted" style={{ margin: '8px 0 0', maxWidth: 640 }}>
        Your advisor collects quotes from vetted providers, books the work and verifies it. You approve each step.
      </p>
      <Rule style={{ margin: '24px 0 0' }} />
      {projects.map((p) => (
        <div key={p.id} id={`project-${p.id}`} className={flashId === p.id ? 'flash' : undefined} style={{ padding: '24px 0', borderBottom: '1px solid var(--color-divider)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'baseline' }}>
            <div>
              <strong style={{ fontSize: 16, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{p.title}</strong>
              <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>{p.vendor}</p>
            </div>
            <span className={`tag ${projectTagClass(p.status)}`}>{p.status}</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{p.cost}</span>
          </div>
          <div style={{ display: 'flex', gap: 0, marginTop: 16 }}>
            {p.stepLabels.map((label, i) => (
              <div key={label} style={{ flex: 1, padding: '8px 12px 8px 0' }}>
                <div style={{ height: 4, background: i <= p.stepsDone ? 'var(--color-accent)' : 'var(--color-neutral-300)' }} />
                <div style={{ fontSize: 12, marginTop: 6, color: i <= p.stepsDone ? 'var(--color-text)' : 'var(--color-neutral-500)' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 10 }}>
            <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>{p.note}</p>
            {actionFor(p)}
          </div>
        </div>
      ))}
      <div className="card" style={{ marginTop: 32, maxWidth: 520 }}>
        <span className="card-kicker">How it works</span>
        <p className="card-body" style={{ fontSize: 14 }}>
          Request → we source 2–3 quotes from vetted vendors → you approve → we schedule and verify the work → it lands in your Property Passport automatically.
        </p>
      </div>

      {requesting && <RequestServiceModal onClose={() => setRequesting(false)} />}

      {reviewing && reviewing.quotes && (
        <Modal title={reviewing.title} kicker="Compare quotes" onClose={() => setReviewing(null)} width={640}>
          <p className="text-muted" style={{ fontSize: 13, margin: '0 0 20px' }}>
            Dana's comparison — both vendors are vetted, insured and warranty-backed. A third quote (TruTemp HVAC) is still pending; you can approve now or wait.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviewing.quotes.map((q) => (
              <div key={q.vendor} className="card" style={{ borderTop: '4px solid var(--color-accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
                  <span className="card-title" style={{ margin: 0 }}>{q.vendor}</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 22 }}>{q.price}</span>
                </div>
                <p className="card-body" style={{ fontSize: 13 }}>{q.note}</p>
                <div className="card-meta"><span className="tag tag-neutral">{q.timeline.toUpperCase()}</span></div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => { chooseQuote(reviewing.id, q); setReviewing(null) }}
                >
                  Approve {q.vendor}
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => setReviewing(null)}>Wait for the third quote</button>
        </Modal>
      )}
    </main>
  )
}
