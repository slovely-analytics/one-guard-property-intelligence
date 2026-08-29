import { useEffect, useMemo, useState } from 'react'
import { ProLensSwitch } from '../components/ProControls'
import { StatusTag } from '../components/StatusTag'
import type { StatusKind } from '../components/StatusTag'
import { proJobs } from '../data'
import type { PassportUpdateStatus } from '../store'
import { approvePassportUpdate, returnPassportUpdate, setRole, useDemo } from '../store'

const updateStatusKind: Record<PassportUpdateStatus, StatusKind> = {
  IN_REVIEW: 'review',
  RETURNED: 'progress',
  PUBLISHED: 'published',
}

export default function ProReview({ updateId }: { updateId?: string }) {
  const { passportUpdates, proLens } = useDemo()
  const ordered = useMemo(() => [...passportUpdates].sort((a, b) => {
    const order = { IN_REVIEW: 0, RETURNED: 1, PUBLISHED: 2 }
    return order[a.status] - order[b.status]
  }), [passportUpdates])
  const [selectedId, setSelectedId] = useState(updateId ?? ordered[0]?.id ?? '')
  const [returnNote, setReturnNote] = useState('')

  // Deep link into a specific update: #/pro/review/:updateId selects it, and
  // selecting from the list writes the id back to the address (replace, so
  // browsing the queue doesn't pile up history entries).
  useEffect(() => {
    if (updateId) { setSelectedId(updateId); setReturnNote('') }
  }, [updateId])
  const choose = (id: string) => {
    setSelectedId(id)
    setReturnNote('')
    history.replaceState(null, '', `#/pro/review/${id}`)
  }

  const selected = ordered.find((item) => item.id === selectedId) ?? ordered[0]
  const job = selected ? proJobs.find((item) => item.id === selected.jobId) : undefined
  const pending = passportUpdates.filter((item) => item.status === 'IN_REVIEW').length

  const openAsOwner = () => {
    setRole('homeowner')
    // App's role guard first sees the old Service Pro route. Let that render
    // settle, then send the homeowner to the intended receipt surface.
    setTimeout(() => { window.location.hash = '#/passport' }, 0)
  }

  return (
    <main className="page-main pro-page">
      <header className="pro-page-head">
        <div><h1>{proLens === 'MANAGEMENT' ? 'Passport review' : 'My Passport updates'}</h1><p>{proLens === 'MANAGEMENT' ? `${pending} update${pending === 1 ? ' needs' : 's need'} a management decision.` : 'Track what you submitted, what was returned, and what reached the owner.'}</p></div>
        <ProLensSwitch />
      </header>

      {ordered.length === 0 ? (
        <div className="pro-empty"><h2 className="pro-empty-title">No Passport updates yet</h2><p>Complete a job and submit durable property evidence to start the review loop.</p><a className="btn btn-primary" href="#/pro">Open work</a></div>
      ) : (
        <div className="pro-review-layout">
          <div className="pro-review-list" role="list" aria-label="Passport updates">
            {ordered.map((update) => (
              <button key={update.id} type="button" className="pro-review-list-item" aria-pressed={selected?.id === update.id} onClick={() => choose(update.id)}>
                <StatusTag kind={updateStatusKind[update.status]}>{update.status.replace('_', ' ')}</StatusTag>
                <strong>{update.systemName}</strong><span>{update.propertyAddr}</span><small>{update.submittedBy} · {update.submittedOn}</small>
              </button>
            ))}
          </div>

          {selected && job && (
            <article className="pro-review-detail" aria-live="polite">
              <header><div><p>{selected.propertyAddr}</p><h2>{selected.systemName} update</h2></div><StatusTag kind={selected.confidence === 'CONFIRMED' ? 'ready' : 'planned'}>{selected.confidence}</StatusTag></header>

              <div className="pro-review-compare">
                <section><span>Record before this visit</span><h3>{job.onFile}</h3><p>{job.priorVisits[0]?.note ?? 'No prior service evidence in scope.'}</p><small>{job.priorVisits[0]?.source ?? 'No source available'}</small></section>
                <section><span>{selected.status === 'PUBLISHED' ? 'Published Passport entry' : 'Proposed Passport addition'}</span><h3>{selected.performed}</h3><p>{selected.observation}</p><small>{selected.submittedBy} · {selected.submittedOn}</small></section>
              </div>

              <section className="pro-review-facts">
                <div><span>Materials</span><p>{selected.materials || 'None recorded'}</p></div>
                <div><span>Recommendation</span><p>{selected.recommendation}</p></div>
                <div><span>Evidence</span><ul>{selected.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </section>

              <section className="pro-handoff-preview"><span>Owner-ready handoff</span><h3>{selected.systemName} was serviced by {selected.submittedBy}</h3><p>{selected.observation}</p><strong>Next: {selected.recommendation}</strong></section>

              {selected.status === 'IN_REVIEW' && proLens === 'MANAGEMENT' && (
                <section className="pro-review-actions">
                  <div className="field"><label htmlFor="return-note">Return note (required only when returning)</label><textarea id="return-note" className="input" value={returnNote} onChange={(event) => setReturnNote(event.target.value)} placeholder="Name the missing evidence or wording that needs correction." /></div>
                  <div><button className="btn btn-primary" onClick={() => approvePassportUpdate(selected.id)}>Approve and publish</button><button className="btn btn-secondary" disabled={!returnNote.trim()} onClick={() => returnPassportUpdate(selected.id, returnNote.trim())}>Return to technician</button></div>
                </section>
              )}

              {selected.status === 'IN_REVIEW' && proLens === 'TECHNICIAN' && <p className="pro-readonly-note">Management review is pending. The submitted evidence remains read-only until a decision is made.</p>}
              {selected.status === 'RETURNED' && <p className="pro-readonly-note"><strong>Returned by {selected.reviewedBy}:</strong> {selected.reviewNote} <a href={`#/pro/job/${selected.jobId}/update`}>Revise update</a></p>}
              {selected.status === 'PUBLISHED' && (
                <div className="pro-published-actions"><p><strong>Published by {selected.reviewedBy}</strong><span>{selected.reviewedOn} · visible in the property record</span></p>{selected.propertyAddr === '1847 Maple Grove Ln' && <button className="btn btn-primary" onClick={openAsOwner}>View the owner’s Passport</button>}</div>
              )}
            </article>
          )}
        </div>
      )}
    </main>
  )
}
