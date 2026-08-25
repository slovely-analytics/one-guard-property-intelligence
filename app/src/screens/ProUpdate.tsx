import { useState } from 'react'
import { proJobs } from '../data'
import { setProLens, submitPassportUpdate, useDemo } from '../store'

const P = (name: string) => `${import.meta.env.BASE_URL}photos/${name}`
const evidenceOptions = [
  { id: 'unit', label: 'Unit condition after service', src: P('sys-water-heater.jpg') },
  { id: 'label', label: 'Model and serial label', src: P('sys-wh-label.jpg') },
]

export default function ProUpdate() {
  const { selectedProJobId, passportUpdates } = useDemo()
  const job = proJobs.find((item) => item.id === selectedProJobId) ?? proJobs[0]
  const existing = passportUpdates.find((item) => item.jobId === job.id && item.status === 'RETURNED')
  const [form, setForm] = useState({
    performed: existing?.performed ?? 'Flushed the tank and verified burner start-up after service.',
    observation: existing?.observation ?? 'Moderate sediment was removed. The anode is approximately 70% depleted; the start-up noise did not return after flushing.',
    materials: existing?.materials ?? 'Drain-hose adapter and replacement drain-valve cap',
    recommendation: existing?.recommendation ?? 'Move replacement planning from 2028 to 2027 and inspect the anode again at the next annual service.',
    confidence: (existing?.confidence ?? 'CONFIRMED') as 'CONFIRMED' | 'PROVISIONAL',
    evidenceIds: ['unit', 'label'],
  })
  const [submitted, setSubmitted] = useState(false)

  const toggleEvidence = (id: string) => setForm((current) => ({
    ...current,
    evidenceIds: current.evidenceIds.includes(id) ? current.evidenceIds.filter((item) => item !== id) : [...current.evidenceIds, id],
  }))

  const submit = () => {
    submitPassportUpdate({
      jobId: job.id,
      propertyAddr: job.addr,
      systemName: job.system.name,
      performed: form.performed.trim(),
      observation: form.observation.trim(),
      materials: form.materials.trim(),
      recommendation: form.recommendation.trim(),
      confidence: form.confidence,
      evidence: evidenceOptions.filter((item) => form.evidenceIds.includes(item.id)).map((item) => item.label),
      submittedBy: job.assignee,
    })
    setSubmitted(true)
  }

  const valid = Boolean(form.performed.trim() && form.observation.trim() && form.recommendation.trim() && form.evidenceIds.length > 0)

  if (submitted) {
    return (
      <main className="page-main pro-page">
        <section className="pro-submit-success" aria-live="polite">
          <span className="tag tag-accent">READY FOR REVIEW</span>
          <h1>The Passport update is with management</h1>
          <p>The job record remains in ServiceTitan. This submission contains the durable property evidence and next-step recommendation for One Guard.</p>
          <div>
            <button className="btn btn-primary" onClick={() => { setProLens('MANAGEMENT'); window.location.hash = '#/pro/review' }}>Continue as management</button>
            <a className="btn btn-secondary" href="#/pro">Back to work</a>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-main pro-page">
      <div className="pro-crumbs"><a href="#/pro/job">Back to job workspace</a></div>
      <header className="pro-page-head pro-update-head">
        <div><h1>Update the Property Passport</h1><p>{job.addr} · {job.system.name} · submitted under {job.assignee}</p></div>
        <span className="tag tag-neutral">ATTRIBUTED DRAFT</span>
      </header>

      {existing?.reviewNote && <section className="pro-review-note"><strong>Returned by {existing.reviewedBy}</strong><p>{existing.reviewNote}</p></section>}

      <div className="pro-update-layout">
        <form className="pro-update-form" onSubmit={(event) => { event.preventDefault(); submit() }}>
          <section>
            <h2>Work and observation</h2>
            <div className="field"><label htmlFor="performed">Work performed</label><textarea id="performed" className="input" value={form.performed} onChange={(event) => setForm({ ...form, performed: event.target.value })} /></div>
            <div className="field"><label htmlFor="observation">What changed or was learned?</label><textarea id="observation" className="input" value={form.observation} onChange={(event) => setForm({ ...form, observation: event.target.value })} /></div>
            <div className="field"><label htmlFor="materials">Materials that matter next time</label><input id="materials" className="input" value={form.materials} onChange={(event) => setForm({ ...form, materials: event.target.value })} /></div>
          </section>

          <section>
            <h2>Evidence</h2>
            <p className="pro-section-copy">Choose the evidence that supports this addition. These demo images are illustrative.</p>
            <div className="pro-evidence-grid">
              {evidenceOptions.map((item) => (
                <label key={item.id} className="pro-evidence-option">
                  <input type="checkbox" checked={form.evidenceIds.includes(item.id)} onChange={() => toggleEvidence(item.id)} />
                  <img src={item.src} alt="" />
                  <span><strong>{item.label}</strong><small>{form.evidenceIds.includes(item.id) ? 'Included in update' : 'Not included'}</small></span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2>Recommendation and certainty</h2>
            <div className="field"><label htmlFor="recommendation">Recommended next step</label><textarea id="recommendation" className="input" value={form.recommendation} onChange={(event) => setForm({ ...form, recommendation: event.target.value })} /></div>
            <fieldset className="pro-confidence">
              <legend>Evidence confidence</legend>
              {(['CONFIRMED', 'PROVISIONAL'] as const).map((value) => (
                <label key={value}><input type="radio" name="confidence" checked={form.confidence === value} onChange={() => setForm({ ...form, confidence: value })} /><span><strong>{value === 'CONFIRMED' ? 'Confirmed' : 'Provisional'}</strong><small>{value === 'CONFIRMED' ? 'Directly observed or measured on this visit' : 'Needs follow-up before it is treated as settled'}</small></span></label>
              ))}
            </fieldset>
          </section>

          <div className="pro-form-actions"><button className="btn btn-primary" type="submit" disabled={!valid}>Send for management review</button><a className="btn btn-secondary" href="#/pro/job">Cancel</a></div>
        </form>

        <aside className="pro-update-preview">
          <span>Owner handoff preview</span><h2>{job.system.name} service update</h2>
          <dl>
            <div><dt>Service Pro</dt><dd>{job.assignee} · Comfort Professor</dd></div>
            <div><dt>Work</dt><dd>{form.performed || 'Not entered'}</dd></div>
            <div><dt>Finding</dt><dd>{form.observation || 'Not entered'}</dd></div>
            <div><dt>Next step</dt><dd>{form.recommendation || 'Not entered'}</dd></div>
            <div><dt>Evidence</dt><dd>{form.evidenceIds.length} item{form.evidenceIds.length === 1 ? '' : 's'} selected</dd></div>
          </dl>
          <p>Management reviews the evidence and wording before this becomes part of the owner’s permanent record.</p>
        </aside>
      </div>
    </main>
  )
}
