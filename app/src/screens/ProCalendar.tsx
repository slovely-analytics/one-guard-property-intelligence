import { useMemo, useState } from 'react'
import { ProLensSwitch } from '../components/ProControls'
import type { ProJob } from '../data'
import { accessTagClass, proJobs } from '../data'
import { portfolioThumbs } from '../photos'
import { selectProJob, toast, useDemo } from '../store'

type CalendarMode = 'WEEK' | 'MONTH'

const DEMO_TODAY = new Date(2025, 7, 21)
const DEMO_WEEK_START = new Date(2025, 7, 18)

const jobDates: Record<string, string> = {
  'wh-flush': '2025-08-21',
  toilet: '2025-08-21',
  'no-hot-water': '2025-08-21',
  'furnace-tune': '2025-08-25',
  'condenser-plan': '2025-09-09',
}

function isoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

function shortDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function weekRange(start: Date) {
  const end = addDays(start, 6)
  const sameMonth = start.getMonth() === end.getMonth()
  return sameMonth
    ? `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}–${end.getDate()}`
    : `${shortDate(start)}–${shortDate(end)}`
}

function monthRange(start: Date) {
  const end = addDays(start, 34)
  return `${start.toLocaleDateString('en-US', { month: 'long' })}–${end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
}

function eventState(job: ProJob) {
  if (job.access === 'PENDING') return { label: 'Access blocked', className: 'is-blocked' }
  if (job.stage === 'PLANNED') return { label: 'Planned', className: 'is-planned' }
  return { label: 'Ready', className: 'is-ready' }
}

function DirectionIcon({ direction }: { direction: 'previous' | 'next' }) {
  const points = direction === 'previous' ? '14 5 7 12 14 19' : '10 5 17 12 10 19'
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  )
}

function jobsForDate(date: Date, jobs: ProJob[]) {
  const key = isoDate(date)
  return jobs.filter((job) => jobDates[job.id] === key)
}

export default function ProCalendar() {
  const { proLens, passportUpdates } = useDemo()
  const [mode, setMode] = useState<CalendarMode>('WEEK')
  const [weekOffset, setWeekOffset] = useState(0)
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState(DEMO_TODAY)
  const [selectedJobId, setSelectedJobId] = useState<string | null>('wh-flush')

  const weekStart = useMemo(() => addDays(DEMO_WEEK_START, weekOffset * 7), [weekOffset])
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart])
  const monthStart = useMemo(() => addDays(DEMO_WEEK_START, monthOffset * 35), [monthOffset])
  const monthDays = useMemo(() => Array.from({ length: 35 }, (_, index) => addDays(monthStart, index)), [monthStart])
  const visibleJobs = proJobs.filter((job) => proLens === 'MANAGEMENT' || job.assignee === 'Marcus Reyes')
  const weekJobs = visibleJobs.filter((job) => weekDays.some((day) => jobDates[job.id] === isoDate(day)))
  const monthJobs = visibleJobs.filter((job) => monthDays.some((day) => jobDates[job.id] === isoDate(day)))
  const periodJobs = mode === 'WEEK' ? weekJobs : monthJobs
  const selectedDayJobs = jobsForDate(selectedDate, visibleJobs)
  const selectedJob = periodJobs.find((job) => job.id === selectedJobId && jobDates[job.id] === isoDate(selectedDate)) ?? selectedDayJobs.find((job) => periodJobs.includes(job))
  const pendingAccess = periodJobs.filter((job) => job.access === 'PENDING').length
  const reviewCount = passportUpdates.filter((update) => update.status === 'IN_REVIEW' && periodJobs.some((job) => job.id === update.jobId)).length

  const selectPeriodJob = (job: ProJob | undefined, fallbackDate: Date) => {
    if (!job) {
      setSelectedDate(fallbackDate)
      setSelectedJobId(null)
      return
    }
    const [year, month, day] = jobDates[job.id].split('-').map(Number)
    setSelectedDate(new Date(year, month - 1, day))
    setSelectedJobId(job.id)
  }

  const changeWeek = (amount: number) => {
    const nextOffset = weekOffset + amount
    const nextStart = addDays(DEMO_WEEK_START, nextOffset * 7)
    setWeekOffset(nextOffset)
    const nextJob = jobsForDate(nextStart, visibleJobs)[0] ?? visibleJobs.find((job) => {
      const date = jobDates[job.id]
      return date && date >= isoDate(nextStart) && date <= isoDate(addDays(nextStart, 6))
    })
    selectPeriodJob(nextJob, nextStart)
  }

  const changePeriod = (amount: number) => {
    if (mode === 'WEEK') {
      changeWeek(amount)
      return
    }
    const nextOffset = monthOffset + amount
    const nextStart = addDays(DEMO_WEEK_START, nextOffset * 35)
    setMonthOffset(nextOffset)
    const nextJob = visibleJobs.find((job) => {
      const date = jobDates[job.id]
      return date && date >= isoDate(nextStart) && date <= isoDate(addDays(nextStart, 34))
    })
    selectPeriodJob(nextJob, nextStart)
  }

  const returnToToday = () => {
    setWeekOffset(0)
    setMonthOffset(0)
    setSelectedDate(DEMO_TODAY)
    setSelectedJobId(proLens === 'TECHNICIAN' ? 'wh-flush' : 'no-hot-water')
  }

  const chooseDate = (date: Date) => {
    const firstJob = jobsForDate(date, visibleJobs)[0]
    selectPeriodJob(firstJob, date)
  }

  const chooseJob = (job: ProJob) => {
    setSelectedJobId(job.id)
    const date = jobDates[job.id]
    if (date) {
      const [year, month, day] = date.split('-').map(Number)
      setSelectedDate(new Date(year, month - 1, day))
    }
  }

  const openWork = (job: ProJob) => {
    selectProJob(job.id)
    window.location.hash = '#/pro/job'
  }

  const dateRange = mode === 'WEEK' ? weekRange(weekStart) : monthRange(monthStart)

  return (
    <main className="page-main pro-page pro-calendar-page">
      <header className="pro-page-head">
        <div>
          <h1>Service calendar</h1>
          <p>{proLens === 'TECHNICIAN' ? 'See the day in sequence, with property context ready before each stop.' : 'Read team capacity, access risk, and Passport decisions on one shared time map.'}</p>
        </div>
        <ProLensSwitch />
      </header>

      <section className="pro-calendar-command" aria-label="Calendar controls">
        <div className="pro-calendar-range">
          <button type="button" className="pro-calendar-icon-btn" aria-label={`Previous ${mode === 'WEEK' ? 'week' : 'month'}`} onClick={() => changePeriod(-1)}><DirectionIcon direction="previous" /></button>
          <button type="button" className="pro-calendar-today" onClick={returnToToday}>Today</button>
          <button type="button" className="pro-calendar-icon-btn" aria-label={`Next ${mode === 'WEEK' ? 'week' : 'month'}`} onClick={() => changePeriod(1)}><DirectionIcon direction="next" /></button>
          <strong aria-live="polite">{dateRange}</strong>
        </div>
        <div className="pro-calendar-mode" aria-label="Calendar span">
          <button type="button" aria-pressed={mode === 'WEEK'} onClick={() => setMode('WEEK')}>Week</button>
          <button type="button" aria-pressed={mode === 'MONTH'} onClick={() => setMode('MONTH')}>Month</button>
        </div>
      </section>

      <section className="pro-calendar-statebar" aria-label="Calendar summary">
        <div className="is-date"><span>Selected</span><strong>{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong></div>
        <div><span>{proLens === 'TECHNICIAN' ? 'Your stops' : 'Team work'}</span><strong>{mode === 'WEEK' ? weekJobs.length : monthJobs.length} scheduled</strong></div>
        <div className={pendingAccess ? 'is-alert' : ''}><span>Readiness</span><strong>{pendingAccess ? `${pendingAccess} access block` : 'Clear to proceed'}</strong></div>
        <div><span>Passport</span><strong>{reviewCount} awaiting review</strong></div>
      </section>

      {mode === 'WEEK' ? (
        <div className="pro-calendar-workspace">
          <section className="pro-calendar-canvas" aria-label={`${proLens === 'TECHNICIAN' ? 'Technician' : 'Management'} weekly calendar`}>
            <div className="pro-calendar-days" role="group" aria-label="Days in week">
              {weekDays.map((day) => {
                const count = jobsForDate(day, visibleJobs).length
                const selected = isoDate(day) === isoDate(selectedDate)
                return (
                  <button key={isoDate(day)} type="button" aria-pressed={selected} onClick={() => chooseDate(day)}>
                    <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <strong>{day.getDate()}</strong>
                    <small>{count ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Open'}</small>
                  </button>
                )
              })}
            </div>

            {proLens === 'TECHNICIAN' ? (
              <div className="pro-calendar-agenda">
                <header><h2>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2><span>{selectedDayJobs.length ? `${selectedDayJobs.length} scheduled stops` : 'No assigned work'}</span></header>
                {selectedDayJobs.length ? selectedDayJobs.map((job) => {
                  const state = eventState(job)
                  return (
                    <button key={job.id} type="button" className={`pro-calendar-agenda-event ${state.className}`} aria-pressed={selectedJob?.id === job.id} onClick={() => chooseJob(job)}>
                      <time>{job.time}</time>
                      <span><strong>{job.job}</strong><small>{job.addr} · {job.trade}</small></span>
                      <span><small>{job.onFile}</small><em>{state.label}</em></span>
                    </button>
                  )
                }) : <div className="pro-calendar-open-day"><strong>Route space is open</strong><p>No work is assigned to Marcus on this day. Move through the week to inspect upcoming stops.</p></div>}
              </div>
            ) : (
              <div className="pro-calendar-team">
                <div className="pro-calendar-team-head" aria-hidden="true"><span>Technician</span>{weekDays.map((day) => <span key={isoDate(day)}>{day.toLocaleDateString('en-US', { weekday: 'short' })} {day.getDate()}</span>)}</div>
                {['Marcus Reyes', 'Priya Shah'].map((assignee) => (
                  <div className="pro-calendar-team-row" key={assignee}>
                    <div><strong>{assignee}</strong><span>{proJobs.filter((job) => job.assignee === assignee && weekJobs.includes(job)).length} scheduled</span></div>
                    {weekDays.map((day) => {
                      const jobs = proJobs.filter((job) => job.assignee === assignee && jobDates[job.id] === isoDate(day))
                      return (
                        <div key={isoDate(day)} className={isoDate(day) === isoDate(selectedDate) ? 'is-selected-day' : ''}>
                          {jobs.map((job) => {
                            const state = eventState(job)
                            return <button key={job.id} type="button" className={`pro-calendar-team-event ${state.className}`} aria-pressed={selectedJob?.id === job.id} onClick={() => chooseJob(job)}><time>{job.time}</time><strong>{job.addr.replace(/ Lane| Ln| Street| St| Road| Rd| Court| Ct| Drive| Dr/g, '')}</strong><span>{state.label}</span></button>
                          })}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </section>

          {selectedJob ? <JobCalendarDetail job={selectedJob} proLens={proLens} openWork={openWork} /> : <CalendarEmptyDetail selectedDate={selectedDate} />}
        </div>
      ) : (
        <div className="pro-calendar-workspace is-month">
          <section className="pro-calendar-month" aria-label="Five week planning calendar">
            <div className="pro-calendar-month-head" aria-hidden="true">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}</div>
            <div className="pro-calendar-month-grid">
              {monthDays.map((day) => {
                const jobs = jobsForDate(day, visibleJobs)
                const selected = isoDate(day) === isoDate(selectedDate)
                return (
                  <div key={isoDate(day)} className={`pro-calendar-month-day ${selected ? 'is-selected' : ''}`}>
                    <button type="button" className="pro-calendar-month-date" aria-label={`Select ${day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`} onClick={() => chooseDate(day)}>
                      <span>{day.getDate()}</span>{day.getDate() === 1 && <small>{day.toLocaleDateString('en-US', { month: 'short' })}</small>}
                    </button>
                    {jobs.map((job) => {
                      const state = eventState(job)
                      return <button key={job.id} type="button" className={`pro-calendar-month-event ${state.className}`} aria-pressed={selectedJob?.id === job.id} onClick={() => chooseJob(job)}><time>{job.time}</time><span>{job.addr}</span></button>
                    })}
                  </div>
                )
              })}
            </div>
          </section>
          {selectedJob ? <JobCalendarDetail job={selectedJob} proLens={proLens} openWork={openWork} /> : <CalendarEmptyDetail selectedDate={selectedDate} />}
        </div>
      )}

      <p className="pro-calendar-boundary"><strong>Scheduling boundary:</strong> this view mirrors One Guard demo work and property decisions. Dispatch, assignments, and schedule changes remain in ServiceTitan.</p>
    </main>
  )
}

function CalendarEmptyDetail({ selectedDate }: { selectedDate: Date }) {
  return (
    <aside className="pro-calendar-detail is-empty" aria-label="Selected calendar work">
      <div className="pro-calendar-detail-body">
        <p>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h2>No scheduled work</h2>
        <span>This date is clear in the current view.</span>
        <dl><div><dt>Next step</dt><dd>Choose another date or return to today. New assignments and schedule changes stay in ServiceTitan.</dd></div></dl>
      </div>
    </aside>
  )
}

function JobCalendarDetail({ job, proLens, openWork }: { job: ProJob; proLens: 'TECHNICIAN' | 'MANAGEMENT'; openWork: (job: ProJob) => void }) {
  const photo = portfolioThumbs[job.thumbKey]
  const state = eventState(job)
  return (
    <aside className="pro-calendar-detail" aria-label="Selected calendar work">
      <div className="pro-calendar-detail-photo" role="img" aria-label={`${job.addr} exterior`} style={{ backgroundImage: `url(${photo.src})`, backgroundPosition: photo.focus, backgroundSize: photo.zoom }}>
        <span className={`pro-calendar-detail-state ${state.className}`}>{state.label}</span>
      </div>
      <div className="pro-calendar-detail-body">
        <p>{job.time} · {job.assignee}</p>
        <h2>{job.job}</h2>
        <strong>{job.addr}</strong>
        <span>{job.city}</span>
        <dl>
          <div><dt>Property record</dt><dd>{job.onFile}</dd></div>
          <div><dt>Access</dt><dd>{job.accessNote}</dd></div>
          <div><dt>{proLens === 'TECHNICIAN' ? 'Know before arrival' : 'Decision on deck'}</dt><dd>{proLens === 'TECHNICIAN' ? job.ownerNote : job.managementDecision}</dd></div>
        </dl>
        {job.access === 'PENDING' ? <button type="button" className="btn btn-primary" onClick={() => toast(`Reminder sent to the owner at ${job.addr}.`)}>Nudge owner</button> : <button type="button" className="btn btn-primary" onClick={() => openWork(job)}>Open work</button>}
        <span className={`tag ${accessTagClass(job.access)}`}>{job.access === 'PENDING' ? 'ACCESS PENDING' : job.access === 'GRANTED' ? 'JOB ACCESS' : 'STANDING ACCESS'}</span>
      </div>
    </aside>
  )
}
