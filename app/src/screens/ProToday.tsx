import { useState } from 'react'
import { ProLensSwitch } from '../components/ProControls'
import type { ProJob } from '../data'
import { accessTagClass, proJobs } from '../data'
import { portfolioThumbs } from '../photos'
import { selectProJob, toast, useDemo } from '../store'
import type { PassportUpdateState } from '../store'

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

function workState(job: ProJob, updates: PassportUpdateState[]) {
  const update = latestUpdate(job.id, updates)
  if (update?.status === 'PUBLISHED') return { label: 'PASSPORT UPDATED', className: 'tag-neutral' }
  if (update?.status === 'IN_REVIEW') return { label: 'IN REVIEW', className: 'tag-accent' }
  if (update?.status === 'RETURNED') return { label: 'ACTION NEEDED', className: 'tag-outline' }
  if (job.access === 'PENDING') return { label: 'ACCESS BLOCKED', className: 'tag-outline' }
  if (job.stage === 'PLANNED') return { label: 'PLANNED', className: 'tag-neutral' }
  return { label: 'READY', className: 'tag-accent' }
}

export default function ProToday() {
  const { proLens, passportUpdates } = useDemo()
  const [horizon, setHorizon] = useState<Horizon>('TODAY')
  const visible = proJobs.filter((job) => isInHorizon(job, horizon) && (proLens === 'MANAGEMENT' || job.assignee === 'Marcus Reyes'))
  const blocked = visible.filter((job) => job.access === 'PENDING').length
  const review = visible.filter((job) => latestUpdate(job.id, passportUpdates)?.status === 'IN_REVIEW').length

  const openJob = (job: ProJob) => {
    selectProJob(job.id)
    window.location.hash = '#/pro/job'
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
          const state = workState(job, passportUpdates)
          const photo = portfolioThumbs[job.thumbKey]
          return (
            <article className="pro-ledger-row" key={job.id} role="listitem">
              <div className="pro-ledger-when"><strong>{job.time}</strong><span>{job.dateLabel}</span></div>
              <div className="pro-ledger-property">
                <span className="prop-thumb" role="img" aria-label={`${job.addr} exterior`} style={{ backgroundImage: `url(${photo.src})`, backgroundPosition: photo.focus, backgroundSize: photo.zoom }} />
                <div><strong>{job.addr}</strong><span>{job.city}</span></div>
              </div>
              <div className="pro-ledger-work">
                <strong>{job.job}</strong><span>{job.onFile}</span>
                {proLens === 'MANAGEMENT' && <small>Decision: {job.managementDecision}</small>}
              </div>
              <div className="pro-ledger-owner">
                <strong>{job.assignee}</strong>
                <span className={`tag ${accessTagClass(job.access)}`}>{job.access === 'PENDING' ? 'ACCESS PENDING' : job.access === 'GRANTED' ? 'JOB ACCESS' : 'STANDING ACCESS'}</span>
              </div>
              <div className="pro-ledger-action">
                <span className={`tag ${state.className}`}>{state.label}</span>
                {job.access === 'PENDING' ? (
                  <button className="btn btn-secondary" onClick={() => toast(`Reminder sent to the owner at ${job.addr}.`)}>Nudge owner</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => openJob(job)}>Open work</button>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {visible.length === 0 && <div className="pro-empty"><h3>No work in this view</h3><p>Change the time horizon or switch to management to see team work.</p></div>}
    </main>
  )
}
