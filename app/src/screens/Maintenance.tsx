import { useState } from 'react'
import type { CSSProperties } from 'react'
import { ExtLink, Kicker, Rule } from '../components/Shell'
import { Modal, RequestServiceModal } from '../components/Overlays'
import { taskGuides } from '../data'
import {
  markTaskDone,
  openChat,
  reopenTask,
  setNotif,
  taskTagClass,
  useDemo,
} from '../store'
import type { TaskState } from '../store'

const main: CSSProperties = { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '40px 32px 64px' }

type View = 'upcoming' | 'completed' | 'all'
const views: Array<{ id: View; label: string }> = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'all', label: 'All' },
]

function taskAction(t: TaskState): { label: string; kind: 'done' | 'schedule' | 'details' | 'reopen' } {
  if (t.status === 'DONE') return { label: 'Reopen', kind: 'reopen' }
  if (t.status === 'SCHEDULED' || t.status === 'REQUESTED') return { label: 'Details', kind: 'details' }
  if (t.diy) return { label: 'Mark done', kind: 'done' }
  return { label: 'Schedule', kind: 'schedule' }
}

export default function Maintenance() {
  const { tasks, notif } = useDemo()
  const [view, setView] = useState<View>('upcoming')
  const [scheduling, setScheduling] = useState<TaskState | null>(null)
  const [details, setDetails] = useState<TaskState | null>(null)
  const [requesting, setRequesting] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const visible = tasks.filter((t) =>
    view === 'all' ? true : view === 'completed' ? t.status === 'DONE' : t.status !== 'DONE',
  )

  const act = (t: TaskState) => {
    const a = taskAction(t)
    if (a.kind === 'done') markTaskDone(t.id)
    else if (a.kind === 'reopen') reopenTask(t.id)
    else if (a.kind === 'schedule') setScheduling(t)
    else setDetails(t)
  }

  return (
    <main className="page-main" style={main}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Kicker>Maintenance plan</Kicker>
          <h1 style={{ margin: 0 }}>2026 schedule</h1>
        </div>
        <div className="seg">
          {views.map((v) => (
            <label key={v.id} className="seg-opt">
              <input type="radio" name="v" checked={view === v.id} onChange={() => setView(v.id)} />
              {v.label}
            </label>
          ))}
        </div>
      </div>
      <Rule style={{ margin: '24px 0 0' }} />
      {visible.length === 0 && (
        <p className="text-muted" style={{ padding: '24px 0', fontSize: 14 }}>
          Nothing completed yet — mark a task done and it lands here (and in your Property Passport).
        </p>
      )}
      {visible.map((t) => (
        <div key={t.id} className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '96px 1fr 160px 130px auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-divider)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>{t.date}</div>
            <span className="text-muted" style={{ fontSize: 12 }}>{t.season}</span>
          </div>
          <div>
            <strong style={{ fontSize: 14, textDecoration: t.status === 'DONE' ? 'line-through' : undefined }}>{t.what}</strong>
            <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>
              {t.status === 'DONE' && t.completedOn ? `Completed ${t.completedOn} — ` : ''}{t.detail}
              {taskGuides[t.id] && <> · <ExtLink href={taskGuides[t.id].url} style={{ fontSize: 12 }}>{taskGuides[t.id].label}</ExtLink></>}
            </p>
          </div>
          <span className="text-muted" style={{ fontSize: 13 }}>{t.who}</span>
          <span className={`tag ${t.status === 'DONE' ? 'tag-neutral' : taskTagClass(t.status)}`}>{t.status}</span>
          <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => act(t)}>{taskAction(t).label}</button>
        </div>
      ))}
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 40 }}>
        <div className="card">
          <span className="card-kicker">Vendor coordination</span>
          <span className="card-title">We handle the scheduling</span>
          <p className="card-body">
            Every task above can be routed to a vetted provider. Your advisor collects quotes, books the visit and verifies the work — you approve with one tap.
          </p>
          <button className="btn btn-primary btn-block" onClick={() => setRequesting(true)}>Request a service</button>
        </div>
        <div className="card">
          <span className="card-kicker">Reminders</span>
          <span className="card-title">Never miss a filter again</span>
          <p className="card-body">
            Reminders go out by {notif.email && notif.text ? 'email and text' : notif.email ? 'email' : notif.text ? 'text' : 'nothing (notifications off)'} {notif.leadDays} days before each due date, tuned to your home's systems and local climate.
          </p>
          <button className="btn btn-secondary btn-block" onClick={() => setNotifOpen(true)}>Notification settings</button>
        </div>
      </div>

      {scheduling && (
        <RequestServiceModal prefillTitle={scheduling.what} taskId={scheduling.id} onClose={() => setScheduling(null)} />
      )}
      {requesting && <RequestServiceModal onClose={() => setRequesting(false)} />}

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
              <tr><td className="text-muted">Reschedule / cancel</td><td>Message Dana — she coordinates directly with the vendor.</td></tr>
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => { setDetails(null); openChat() }}>Message Dana</button>
            <button className="btn btn-secondary" onClick={() => setDetails(null)}>Close</button>
          </div>
        </Modal>
      )}

      {notifOpen && (
        <Modal title="Notification settings" kicker="Reminders" onClose={() => setNotifOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label className="radio" style={{ gap: 12 }}>
              <input type="checkbox" checked={notif.email} onChange={(e) => setNotif({ email: e.target.checked })} style={{ position: 'static', opacity: 1, width: 16, height: 16, accentColor: 'var(--color-accent)' }} />
              Email reminders
            </label>
            <label className="radio" style={{ gap: 12 }}>
              <input type="checkbox" checked={notif.text} onChange={(e) => setNotif({ text: e.target.checked })} style={{ position: 'static', opacity: 1, width: 16, height: 16, accentColor: 'var(--color-accent)' }} />
              Text (SMS) reminders
            </label>
            <div className="field">
              <label>Lead time before due date</label>
              <div className="seg" style={{ width: '100%' }}>
                {[5, 10, 21].map((d) => (
                  <label key={d} className="seg-opt" style={{ flex: 1 }}>
                    <input type="radio" name="lead" checked={notif.leadDays === d} onChange={() => setNotif({ leadDays: d })} />
                    {d} days
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button className="btn btn-primary" onClick={() => setNotifOpen(false)}>Done</button>
          </div>
        </Modal>
      )}
    </main>
  )
}
