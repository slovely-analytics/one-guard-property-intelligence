import { ProLensSwitch } from '../components/ProControls'
import { accessTagClass, proJobs } from '../data'
import { portfolioThumbs } from '../photos'
import { effectiveJobAccess, toast, useDemo } from '../store'

export default function ProJob() {
  const { selectedProJobId, passportUpdates, proLens, grants } = useDemo()
  const job = proJobs.find((item) => item.id === selectedProJobId) ?? proJobs[0]
  const update = passportUpdates.find((item) => item.jobId === job.id)
  const photo = portfolioThumbs[job.thumbKey]
  const acc = effectiveJobAccess(job, grants)
  const withheld = acc.access === 'PENDING'

  return (
    <main className="page-main pro-page">
      <div className="pro-crumbs"><a href="#/pro">Back to work</a><ProLensSwitch compact /></div>

      <header className="pro-job-head">
        <span className="pro-job-photo" role="img" aria-label={`${job.addr} exterior`} style={{ backgroundImage: `url(${photo.src})`, backgroundPosition: photo.focus, backgroundSize: photo.zoom }} />
        <div>
          <p>{job.dateLabel} at {job.time} · {job.assignee}</p>
          <h1>{job.job}</h1>
          <strong>{job.addr} · {job.city}</strong>
        </div>
        <div className="pro-job-head-action">
          <span className={`tag ${accessTagClass(acc.access)}`}>{acc.access === 'PENDING' ? 'ACCESS PENDING' : acc.access === 'GRANTED' ? 'JOB ACCESS' : 'STANDING ACCESS'}</span>
          {update && <span className={`tag ${update.status === 'PUBLISHED' ? 'tag-neutral' : update.status === 'RETURNED' ? 'tag-outline' : 'tag-accent'}`}>{update.status.replace('_', ' ')}</span>}
        </div>
      </header>

      <section className={`pro-access-band ${withheld ? 'is-withheld' : ''}`}>
        <div><strong>{acc.note}</strong><span>{acc.scope}</span></div>
        <span>{withheld ? 'Property detail remains withheld.' : 'Access is visible, scoped, and owner-controlled.'}</span>
      </section>

      {withheld ? (
        <section className="pro-withheld">
          <div><h2>The property record is not available</h2><p>Equipment identity, prior work, and owner instructions stay hidden until the owner grants access.</p></div>
          <button className="btn btn-primary" onClick={() => toast(`Access reminder sent for ${job.addr}.`)}>Send access reminder</button>
        </section>
      ) : (
        <div className="pro-workbench">
          <div className="pro-workbench-main">
            <section>
              <div className="pro-section-head"><h2>Relevant property record</h2><span>{job.onFile}</span></div>
              <table className="table pro-facts"><tbody>
                <tr><th>System</th><td>{job.system.name}</td></tr>
                <tr><th>Make / model</th><td>{job.system.model}</td></tr>
                <tr><th>Serial</th><td>{job.system.serial}</td></tr>
                <tr><th>Installed</th><td>{job.system.installed}</td></tr>
                <tr><th>Location</th><td>{job.system.location}</td></tr>
              </tbody></table>
            </section>

            <section>
              <div className="pro-section-head"><h2>Prior evidence</h2><span>Attributed entries only</span></div>
              {job.priorVisits.length ? job.priorVisits.map((visit) => (
                <div className="pro-history-row" key={visit.date + visit.note}><strong>{visit.date}</strong><p>{visit.note}<span>{visit.source}</span></p></div>
              )) : <p className="text-muted">No prior entries are available for this scope.</p>}
            </section>

            <section>
              <div className="pro-section-head"><h2>Owner instruction</h2><span>Shared for this visit</span></div>
              <blockquote>{job.ownerNote}</blockquote>
            </section>
          </div>

          <aside className="pro-workbench-side">
            <section><h2>What this visit should resolve</h2><p>{job.detail}</p><ul>{job.unknowns.map((unknown) => <li key={unknown}>{unknown}</li>)}</ul></section>
            <section><h2>{proLens === 'MANAGEMENT' ? 'Management decision' : 'Likely follow-through'}</h2><p>{job.managementDecision}</p></section>
            <section className="pro-job-actions">
              {update?.status === 'IN_REVIEW' ? (
                <><p>This visit already has an update waiting for management.</p><a className="btn btn-primary" href="#/pro/review">Open review</a></>
              ) : update?.status === 'PUBLISHED' ? (
                <><p>The approved update is now in the owner’s Passport.</p><a className="btn btn-secondary" href="#/pro/review">View handoff</a></>
              ) : (
                <><p>Record the property knowledge this visit creates. Ordinary job operations remain in ServiceTitan.</p><a className="btn btn-primary" href="#/pro/update">Create Passport update</a></>
              )}
              <a className="btn btn-secondary" href="#/pro">Back to work</a>
            </section>
          </aside>
        </div>
      )}
    </main>
  )
}
