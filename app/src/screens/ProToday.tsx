import { useState } from 'react'
import { FieldTabBar } from '../components/FieldTabBar'
import { ProLensSwitch } from '../components/ProControls'
import { StatusTag } from '../components/StatusTag'
import { useIsField } from '../components/useIsField'
import type { ProJob } from '../data'
import { accessLabel, accessStatusKind, proJobs, timeMinutes } from '../data'
import { portfolioThumbs } from '../photos'
import { activeNudge, effectiveJobAccess, jobWorkState, nudgeOwner, selectProJob, useDemo } from '../store'
import type { AccessGrantState, NudgeState, PassportUpdateState } from '../store'

type Horizon = 'TODAY' | 'WEEK' | 'MONTH'

const horizons: Array<{ id: Horizon; label: string }> = [
  { id: 'TODAY', label: 'Today' },
  { id: 'WEEK', label: 'Next 7 days' },
  { id: 'MONTH', label: 'Next 30 days' },
]

function isInHorizon(job: ProJob, horizon: Horizon) {
  if (horizon === 'MONTH') return true
  if (horizon === 'WEEK') return job.horizon !== 'MONTH'
  return job.horizon === 'TODAY'
}

function latestUpdate(jobId: string, updates: PassportUpdateState[]) {
  return updates.find((update) => update.jobId === jobId)
}

export default function ProToday() {
  const { proLens, passportUpdates, grants, nudges } = useDemo()
  const isField = useIsField()
  const [horizon, setHorizon] = useState<Horizon>('TODAY')
  const visible = proJobs.filter((job) => isInHorizon(job, horizon) && (proLens === 'MANAGEMENT' || job.assignee === 'Marcus Reyes'))

  if (isField) return <FieldToday proLens={proLens} updates={passportUpdates} grants={grants} nudges={nudges} />
  const blocked = visible.filter((job) => effectiveJobAccess(job, grants).access === 'PENDING').length
  const review = visible.filter((job) => latestUpdate(job.id, passportUpdates)?.status === 'IN_REVIEW').length

  const openJob = (job: ProJob) => {
    selectProJob(job.id)
    window.location.hash = `#/pro/job/${job.id}`
  }

  return (
    <main className="page-main pro-page">
      <header className="pro-page-head">
        <div>
          <h1>Service work</h1>
          <p>{proLens === 'TECHNICIAN' ? 'Your property-ready work for Thu, Aug 21.' : 'Current work, upcoming commitments, and decisions across the team.'}</p>
        </div>
        <ProLensSwitch />
      </header>

      <h2 className="vh">Work ledger</h2>
      <div className="pro-ledger-toolbar">
        <div className="pro-horizon" aria-label="Work horizon">
          {horizons.map((option) => (
            <button key={option.id} type="button" aria-pressed={horizon === option.id} onClick={() => setHorizon(option.id)}>
              {option.label}
            </button>
          ))}
        </div>
        <p aria-live="polite"><strong>{visible.length} work items</strong><span>{blocked} access blocked</span><span>{review} awaiting review</span></p>
      </div>

      <div className="pro-ledger" role="list" aria-label="Service work">
        <div className="pro-ledger-head" aria-hidden>
          <span>When</span><span>Property</span><span>Work and context</span><span>Owner</span><span>State and action</span>
        </div>
        {visible.map((job) => {
          const acc = effectiveJobAccess(job, grants)
          const state = jobWorkState(job, passportUpdates, grants)
          const nudge = acc.access === 'PENDING' ? activeNudge(job.id, nudges) : undefined
          const photo = portfolioThumbs[job.thumbKey]
          return (
            <article className="pro-ledger-row" key={job.id} role="listitem">
              <div className="pro-ledger-when"><strong>{job.time}</strong><span>{job.dateLabel}</span></div>
              <div className="pro-ledger-property">
                <span className="prop-thumb" role="img" aria-label={`${job.addr} exterior`} style={{ backgroundImage: `url(${photo.src})`, backgroundPosition: photo.focus, backgroundSize: photo.zoom }} />
                <div><strong>{job.addr}</strong><span>{job.city}</span></div>
              </div>
              <div className="pro-ledger-work">
                <strong>{job.job}</strong><span>{acc.access === 'PENDING' ? acc.scope : job.onFile}</span>
                {proLens === 'MANAGEMENT' && <small>Decision: {job.managementDecision}</small>}
              </div>
              <div className="pro-ledger-owner">
                <strong>{job.assignee}</strong>
                <StatusTag kind={accessStatusKind(acc.access)} family="access">{accessLabel(acc.access)}</StatusTag>
              </div>
              <div className="pro-ledger-action">
                <StatusTag kind={state.kind}>{state.label}</StatusTag>
                {acc.access === 'PENDING' ? (
                  <button className="btn btn-secondary" disabled={!!nudge} onClick={() => nudgeOwner(job.id, job.addr)}>
                    {nudge ? `Nudge sent · ${nudge.sentAt}` : 'Nudge owner'}
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => openJob(job)}>Open work</button>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {visible.length === 0 && <div className="pro-empty"><h3 className="pro-empty-title">No work in this view</h3><p>Change the time horizon or switch to management to see team work.</p></div>}
    </main>
  )
}

// ---------------------------------------------------------------------------
// Field projection (≤640px, brief §10.2): the same jobs and the same
// jobWorkState selector, laid out as the technician's day — time-ordered
// rows grouped by day, access-blocked stops pinned as an exception band,
// and a "now" marker. The demo day is frozen at Thu Aug 21, so "now" is the
// scripted 9:20 AM between the captured 8:00 stop and the 10:30 next stop.

const FIELD_NOW = { label: '9:20 AM', minutes: timeMinutes('9:20 AM') }

interface FieldTodayProps {
  proLens: 'TECHNICIAN' | 'MANAGEMENT'
  updates: PassportUpdateState[]
  grants: AccessGrantState[]
  nudges: Record<string, NudgeState>
}

function timePart(stamp?: string): string {
  return stamp?.split(', ')[1] ?? stamp ?? ''
}

function FieldToday({ proLens, updates, grants, nudges }: FieldTodayProps) {
  const mine = proJobs.filter((job) => proLens === 'MANAGEMENT' || job.assignee === 'Marcus Reyes')
  const blocked = mine.filter((job) => effectiveJobAccess(job, grants).access === 'PENDING')
  const scheduled = mine.filter((job) => !blocked.includes(job))

  // Group by day in fixture order; sort each day's stops by clock time.
  const days: Array<{ label: string; isToday: boolean; jobs: ProJob[] }> = []
  for (const job of scheduled) {
    const existing = days.find((day) => day.label === job.dateLabel)
    if (existing) existing.jobs.push(job)
    else days.push({ label: job.dateLabel, isToday: job.horizon === 'TODAY', jobs: [job] })
  }
  days.forEach((day) => day.jobs.sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time)))
  const todayCount = mine.filter((job) => job.horizon === 'TODAY').length

  return (
    <main className="pro-page field-main">
      <header className="field-head">
        <div>
          <h1>Today</h1>
          <span>Thu, Aug 21 · {todayCount} stop{todayCount === 1 ? '' : 's'} · {proLens === 'MANAGEMENT' ? 'full team' : 'Marcus Reyes'}</span>
        </div>
        <span className="field-sync">Synced from ServiceTitan 6:02 AM</span>
      </header>
      <div className="field-rule" />

      <div className="field-list">
        {blocked.map((job) => <FieldException key={job.id} job={job} nudges={nudges} />)}

        {days.map((day) => {
          const rows = day.jobs.map((job) => (
            <FieldRow key={job.id} job={job} updates={updates} grants={grants}
              isCurrent={day.isToday && timeMinutes(job.time) > FIELD_NOW.minutes && job === day.jobs.find((j) => timeMinutes(j.time) > FIELD_NOW.minutes)} />
          ))
          if (day.isToday) {
            // The now marker slots between the stops that are behind and ahead.
            const ahead = day.jobs.findIndex((job) => timeMinutes(job.time) > FIELD_NOW.minutes)
            const at = ahead === -1 ? rows.length : ahead
            rows.splice(at, 0, (
              <div key="now" className="field-now" aria-label={`Now, ${FIELD_NOW.label}`}>
                <span>Now · {FIELD_NOW.label}</span>
                <i />
              </div>
            ))
            return rows
          }
          return [
            <div key={day.label} className="field-day">
              <span>{day.label}</span>
              <i />
            </div>,
            ...rows,
          ]
        })}
      </div>

      <FieldTabBar active="today" />
    </main>
  )
}

function FieldException({ job, nudges }: { job: ProJob; nudges: Record<string, NudgeState> }) {
  const nudge = activeNudge(job.id, nudges)
  return (
    <section className="field-exception">
      <div className="field-exception-top">
        <StatusTag kind="blocked" family="access">ACCESS BLOCKED</StatusTag>
        <strong>{job.time}</strong>
      </div>
      <div>
        <strong className="field-row-title">{job.job}</strong>
        <span className="field-row-sub">{job.addr} · {job.city} — the owner hasn’t granted access yet.</span>
      </div>
      <button type="button" className="cap-cta field-exception-cta" disabled={!!nudge} onClick={() => nudgeOwner(job.id, job.addr)}>
        {nudge ? `Reminder sent · ${nudge.sentAt}` : 'Request access'}
      </button>
    </section>
  )
}

function FieldRow({ job, updates, grants, isCurrent }: {
  job: ProJob
  updates: PassportUpdateState[]
  grants: AccessGrantState[]
  isCurrent: boolean
}) {
  const state = jobWorkState(job, updates, grants)
  const update = updates.find((item) => item.jobId === job.id)
  const photo = portfolioThumbs[job.thumbKey]
  const meta = update?.status === 'IN_REVIEW'
    ? `${job.time} · captured ${timePart(update.submittedOn)}`
    : update?.status === 'PUBLISHED'
      ? `${job.time} · in the owner’s Passport`
      : update?.status === 'RETURNED'
        ? `${job.time} · returned — fix & resubmit`
        : `${job.time} · ${job.detail}`

  const open = () => {
    selectProJob(job.id)
    window.location.hash = `#/pro/job/${job.id}`
  }

  return (
    <button type="button" className={`field-row ${isCurrent ? 'is-current' : ''}`} onClick={open}>
      <span className="field-row-thumb" role="img" aria-label={`${job.addr} exterior`} style={{ backgroundImage: `url(${photo.src})`, backgroundPosition: photo.focus, backgroundSize: photo.zoom }} />
      <span className="field-row-body">
        <strong className="field-row-title">{job.job}</strong>
        <span className="field-row-sub">{job.addr} · {job.city}</span>
        <span className="field-row-meta">{meta}</span>
      </span>
      <StatusTag kind={state.kind}>{state.label}</StatusTag>
    </button>
  )
}
