import { useState } from 'react'
import type { CSSProperties } from 'react'
import Gallery from '../components/Gallery'
import { ExtLink, Rule } from '../components/Shell'
import { Modal, RequestServiceModal } from '../components/Overlays'
import { property, taskGuides } from '../data'
import { gallery } from '../photos'
import {
  markTaskDone,
  openChat,
  setHighlightProject,
  taskTagClass,
  useDemo,
} from '../store'
import type { AccessGrantState, TaskState } from '../store'

/** Access at a glance — leads with whatever is waiting on the owner. */
function AccessCard({ grants }: { grants: AccessGrantState[] }) {
  const pending = grants.filter((g) => g.status === 'PENDING')
  const active = grants.filter((g) => g.status === 'ACTIVE')
  if (pending.length > 0) {
    return (
      <div className="card" style={{ borderTop: '3px solid var(--color-accent)' }}>
        <span className="card-kicker">Property access</span>
        <span className="card-title">{pending[0].company} is asking</span>
        <p className="card-body">{pending[0].note}</p>
        <a className="btn btn-primary btn-block" href="#/access">Review request</a>
      </div>
    )
  }
  return (
    <div className="card">
      <span className="card-kicker">Property access</span>
      <span className="card-title">{active.length === 1 ? '1 company can' : `${active.length} companies can`} see this record</span>
      <p className="card-body">Every grant is scoped and time-boxed, and every view is logged. Nothing is waiting on you.</p>
      <a className="btn btn-secondary btn-block" href="#/access">Manage access</a>
    </div>
  )
}

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

export default function Dashboard() {
  const { tasks, projects, assessmentSlot, grants } = useDemo()
  const [scheduling, setScheduling] = useState<TaskState | null>(null)
  const [details, setDetails] = useState<TaskState | null>(null)

  const open = tasks.filter((t) => t.status !== 'DONE')
  const dueSoon = open.filter((t) => t.status === 'DUE SOON')
  const hvac = projects.find((p) => p.id === 'hvac')
  const activeProject = projects.find((p) => p.status === 'SCHEDULED') ?? projects[0]

  const goToProject = (id: string) => {
    setHighlightProject(id)
    window.location.hash = '#/projects'
  }

  const alertRows = open.slice(0, 3)
  const alertLevel = (t: TaskState) =>
    t.status === 'DUE SOON' ? `DUE ${t.date.toUpperCase()}` : t.status

  const taskButton = (t: TaskState) => {
    if (t.status === 'SCHEDULED' || t.status === 'REQUESTED') {
      return <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => setDetails(t)}>Details</button>
    }
    if (t.diy) {
      return <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => markTaskDone(t.id)}>Mark done</button>
    }
    return <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => setScheduling(t)}>Schedule</button>
  }

  return (
    <main className="page-main" style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>{property.address}</h1>
        <span className="text-muted" style={{ fontSize: 14 }}>{property.summary}</span>
      </div>
      <Rule style={{ margin: '24px 0' }} />
      <Gallery slides={gallery} height={400} style={{ marginBottom: 32 }} />
      <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderBottom: '2px solid var(--color-divider)' }}>
        <div style={{ padding: '20px 24px 20px 0', borderRight: '1px solid var(--color-divider)' }}>
          <h6 style={{ marginBottom: 8 }}>Property score</h6>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{property.score}</span>
            <span className="text-muted" style={{ fontSize: 13 }}>/ 100</span>
          </div>
          <span className="tag tag-accent" style={{ marginTop: 8 }}>GOOD · {property.scoreDelta}</span>
        </div>
        <div style={{ padding: '20px 24px', borderRight: '1px solid var(--color-divider)' }}>
          <h6 style={{ marginBottom: 8 }}>Open tasks</h6>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{open.length}</div>
          <p className="text-muted" style={{ fontSize: 13, margin: '8px 0 0' }}>
            {dueSoon.length === 0 ? 'Nothing due this month' : `${dueSoon.length} due this month`}
          </p>
        </div>
        <div style={{ padding: '20px 24px', borderRight: '1px solid var(--color-divider)' }}>
          <h6 style={{ marginBottom: 8 }}>Systems tracked</h6>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{property.systemsTracked}</div>
          <p className="text-muted" style={{ fontSize: 13, margin: '8px 0 0' }}>{property.systemsNote}</p>
        </div>
        <div style={{ padding: '20px 0 20px 24px' }}>
          <h6 style={{ marginBottom: 8 }}>Next assessment</h6>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 32, lineHeight: 1.1, marginTop: 12 }}>{property.nextAssessment}</div>
          <p className="text-muted" style={{ fontSize: 13, margin: '8px 0 0' }}>
            {assessmentSlot ? `Confirmed — ${assessmentSlot}` : 'Annual Home Health Assessment'}
          </p>
        </div>
      </div>
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginTop: 32, alignItems: 'start' }}>
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0 }}>Needs attention</h4>
            <a className="btn btn-ghost" href="#/maintenance">View all →</a>
          </div>
          <Rule style={{ margin: '12px 0 0' }} />
          {hvac && hvac.status !== 'COMPLETED' && (
            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-divider)' }}>
              <span className="tag tag-outline">PRIORITY</span>
              <div>
                <strong style={{ fontSize: 14 }}>HVAC condenser at end of expected life</strong>
                <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>
                  {hvac.status === 'SCHEDULED'
                    ? `Replacement approved — ${hvac.vendor.split(' · ')[0]}, ${hvac.cost}.`
                    : '18 years old (typical life 15–20). Replacement recommended before summer 2027 — est. $6,200–7,800.'}
                </p>
              </div>
              <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => goToProject('hvac')}>
                {hvac.status === 'QUOTES IN' ? 'Review quotes' : 'View project'}
              </button>
            </div>
          )}
          {alertRows.map((t) => (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-divider)' }}>
              <span className={`tag ${taskTagClass(t.status)}`}>{alertLevel(t)}</span>
              <div>
                <strong style={{ fontSize: 14 }}>{t.what}</strong>
                <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>
                  {t.detail}
                  {taskGuides[t.id] && <> · <ExtLink href={taskGuides[t.id].url} style={{ fontSize: 12 }}>{taskGuides[t.id].label}</ExtLink></>}
                </p>
              </div>
              {taskButton(t)}
            </div>
          ))}
          {alertRows.length === 0 && (
            <p className="text-muted" style={{ padding: '20px 0', fontSize: 14 }}>All caught up — nothing needs attention right now.</p>
          )}
        </section>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AccessCard grants={grants} />
          <div className="card">
            <span className="card-kicker">Active project</span>
            <span className="card-title">{activeProject.title}</span>
            <p className="card-body">{activeProject.note}</p>
            <div className="card-meta"><span className={`tag tag-neutral`}>{activeProject.status}</span><span>{activeProject.cost}</span></div>
          </div>
          <div className="card">
            <span className="card-kicker">Your team</span>
            <span className="card-title">Dana Whitfield</span>
            <p className="card-body">Dedicated property advisor. Coordinates vendors, reviews quotes, tracks warranties.</p>
            <button className="btn btn-primary btn-block" onClick={openChat}>Message Dana</button>
          </div>
        </aside>
      </div>

      {scheduling && (
        <RequestServiceModal prefillTitle={scheduling.what} taskId={scheduling.id} onClose={() => setScheduling(null)} />
      )}
      {details && (
        <Modal title={details.what} kicker={`${details.date} · ${details.season}`} onClose={() => setDetails(null)}>
          <p style={{ fontSize: 14, margin: 0 }}>{details.detail}</p>
          <table className="table" style={{ fontSize: 13, marginTop: 16 }}>
            <tbody>
              <tr><td className="text-muted">Handled by</td><td>{details.who}</td></tr>
              <tr><td className="text-muted">Status</td><td><span className={`tag ${taskTagClass(details.status)}`}>{details.status}</span></td></tr>
              {taskGuides[details.id] && (
                <tr><td className="text-muted">Owner's manual</td><td><ExtLink href={taskGuides[details.id].url}>{taskGuides[details.id].label}</ExtLink></td></tr>
              )}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => { setDetails(null); openChat() }}>Message Dana</button>
            <button className="btn btn-secondary" onClick={() => setDetails(null)}>Close</button>
          </div>
        </Modal>
      )}
    </main>
  )
}
