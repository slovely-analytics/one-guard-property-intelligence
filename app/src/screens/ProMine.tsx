// Mine — the technician's own Passport updates by state (brief §9.1), plus
// resumable capture drafts. This is the field projection of the review loop
// for the person whose name is on the work; the desktop Review screen stays
// the management surface.
import { useState } from 'react'
import { FieldTabBar } from '../components/FieldTabBar'
import { StatusTag } from '../components/StatusTag'
import { proJobs } from '../data'
import { roleDef } from '../roles'
import { useDemo } from '../store'
import type { CaptureDraft, PassportUpdateState } from '../store'
import { STEP_NAMES } from './ProCapture'

type Filter = 'ALL' | 'RETURNED' | 'IN_REVIEW'

function timePart(stamp?: string): string {
  return stamp?.split(', ')[1] ?? stamp ?? ''
}

function jobFor(jobId: string) {
  return proJobs.find((job) => job.id === jobId)
}

export default function ProMine() {
  const { passportUpdates, captureDrafts } = useDemo()
  const [filter, setFilter] = useState<Filter>('ALL')
  const me = roleDef('pro').persona.name

  const mine = passportUpdates.filter((update) => update.submittedBy === me)
  const returned = mine.filter((update) => update.status === 'RETURNED')
  const inReview = mine.filter((update) => update.status === 'IN_REVIEW')
  const published = mine.filter((update) => update.status === 'PUBLISHED')
  // A draft rides under its update once submitted — list it separately only
  // while nothing is in flight for that job.
  const drafts = Object.values(captureDrafts).filter(
    (draft) => draft.step < 7 && !mine.some((update) => update.jobId === draft.jobId && update.status !== 'PUBLISHED'),
  )

  const filters: Array<{ id: Filter; label: string }> = [
    { id: 'ALL', label: 'All' },
    { id: 'RETURNED', label: returned.length ? `Returned · ${returned.length}` : 'Returned' },
    { id: 'IN_REVIEW', label: 'In review' },
  ]

  return (
    <main className="pro-page field-main">
      <header className="field-head">
        <div>
          <h1>Mine</h1>
          <span>Your Passport updates</span>
        </div>
      </header>

      <div className="field-filters" role="group" aria-label="Filter updates">
        {filters.map((option) => (
          <button key={option.id} type="button" className={`cap-chip ${filter === option.id ? 'is-selected' : ''}`} aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
      <div className="field-rule" />

      <div className="field-list">
        {(filter === 'ALL' || filter === 'RETURNED') && returned.map((update) => <ReturnedCard key={update.id} update={update} />)}
        {(filter === 'ALL' || filter === 'IN_REVIEW') && inReview.map((update) => (
          <MineRow key={update.id} update={update} meta={`Submitted ${timePart(update.submittedOn)} · with management`} kind="review" label="IN REVIEW" href={`#/pro/review/${update.id}`} />
        ))}
        {filter === 'ALL' && published.map((update) => (
          <MineRow key={update.id} update={update} meta={`Published ${timePart(update.reviewedOn) || update.reviewedOn} · in the owner’s Passport`} kind="published" label="PUBLISHED" href={`#/pro/review/${update.id}`} />
        ))}
        {filter === 'ALL' && drafts.map((draft) => <DraftRow key={draft.jobId} draft={draft} />)}
        {filter === 'RETURNED' && returned.length === 0 && <p className="field-empty">Nothing returned — your submitted work is holding up.</p>}
        {filter === 'IN_REVIEW' && inReview.length === 0 && <p className="field-empty">Nothing in review right now.</p>}
        {filter === 'ALL' && returned.length + inReview.length + published.length + drafts.length === 0 && (
          <p className="field-empty">No Passport updates yet. Complete a stop and start a capture.</p>
        )}
      </div>

      <FieldTabBar active="mine" />
    </main>
  )
}

function ReturnedCard({ update }: { update: PassportUpdateState }) {
  const job = jobFor(update.jobId)
  return (
    <article className="field-return-card">
      <div className="field-return-top">
        <StatusTag kind="progress">RETURNED</StatusTag>
        <span>{timePart(update.reviewedOn)}</span>
      </div>
      <div>
        <strong className="field-row-title">{job?.job ?? update.systemName}</strong>
        <span className="field-row-sub">{update.propertyAddr}{job ? ` · ${job.city}` : ''}</span>
      </div>
      <p>“{update.reviewNote}” — {update.reviewedBy}</p>
      <a className="cap-cta field-return-cta" href={`#/pro/job/${update.jobId}/capture`}>Fix &amp; resubmit</a>
    </article>
  )
}

function MineRow({ update, meta, kind, label, href }: {
  update: PassportUpdateState
  meta: string
  kind: 'review' | 'published'
  label: string
  href: string
}) {
  const job = jobFor(update.jobId)
  return (
    <a className="field-row field-row-plain" href={href}>
      <span className="field-row-body">
        <strong className="field-row-title">{job?.job ?? update.systemName}</strong>
        <span className="field-row-sub">{update.propertyAddr}{job ? ` · ${job.city}` : ''}</span>
        <span className="field-row-meta">{meta}</span>
      </span>
      <StatusTag kind={kind}>{label}</StatusTag>
    </a>
  )
}

function DraftRow({ draft }: { draft: CaptureDraft }) {
  const job = jobFor(draft.jobId)
  if (!job) return null
  const resume = draft.step === 0 ? 'resumes at the template' : `resumes at step ${draft.step} · ${STEP_NAMES[draft.step - 1]}`
  return (
    <a className="field-row field-row-plain" href={`#/pro/job/${job.id}/capture`}>
      <span className="field-row-body">
        <strong className="field-row-title">{job.job}</strong>
        <span className="field-row-sub">{job.addr} · {job.city}</span>
        <span className="field-row-meta">Draft · {resume}</span>
      </span>
      <StatusTag kind="planned">DRAFT</StatusTag>
    </a>
  )
}
