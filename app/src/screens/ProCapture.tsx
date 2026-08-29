// The capture flow (brief §10.4) — a guided, mostly-tapping, camera-forward
// mobile flow that replaces the old desktop composer. Photo first, prose last;
// structured before unstructured; every input autosaves to the store's
// per-job draft, so the flow survives reload and resumes at the last step.
// Hardware is simulated: the shutter attaches bundled demo photos and the
// hold-to-talk control produces a canned transcript.
import { useEffect, useState } from 'react'
import { StatusTag } from '../components/StatusTag'
import {
  accessLabel, accessStatusKind, captureEvidenceFor, captureKitFor, captureTemplates, composeFinding,
  composeNext, composeWork, defaultTemplateFor, findingsSchemaFor, proJobs, timeMinutes,
} from '../data'
import type { CaptureTemplateId, EvidenceOption, MeasurementField, ProJob } from '../data'
import {
  beginCapture, effectiveJobAccess, patchCaptureDraft, reopenReturnedCapture, submitCapture, useDemo,
} from '../store'
import type { CaptureDraft, PassportUpdateState } from '../store'

export const STEP_NAMES = ['Evidence', 'Work done', 'Findings', 'Confidence', 'Next step', 'Owner preview', 'Submitted']

const TEMPLATE_SHORT: Record<CaptureTemplateId, string> = {
  tuneup: 'A+ tune-up',
  diagnostic: 'Diagnostic',
  install: 'Install',
  emergency: 'Emergency',
}

// --- Inline icons (stroke inherits currentColor) ----------------------------

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}

const PATH_BACK = 'M15 18l-6-6 6-6'
const PATH_CLOSE = 'M18 6L6 18M6 6l12 12'
const PATH_CHECK = 'M20 6L9 17l-5-5'
const PATH_PLUS = 'M12 5v14M5 12h14'
const PATH_CAMERA = 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0z'
const PATH_TORCH = 'M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z M12 1v3M12 20v3M1 12h3M20 12h3'
const PATH_FLIP = 'M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5 M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5 M16 3l3 2-3 2'
const PATH_ROLL = 'M3 3h18v18H3z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21'
const PATH_PENCIL = 'M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z'
const PATH_MIC = 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4'

// ---------------------------------------------------------------------------

export default function ProCapture({ jobId }: { jobId?: string }) {
  const { captureDrafts, passportUpdates, grants, selectedProJobId } = useDemo()
  const job = proJobs.find((item) => item.id === (jobId ?? selectedProJobId)) ?? proJobs[0]

  // Legacy bare address: canonicalise so a reload resumes the same draft.
  useEffect(() => {
    if (!jobId) window.location.replace(`#/pro/job/${job.id}/capture`)
  }, [jobId, job.id])

  const draft = captureDrafts[job.id]
  const returned = passportUpdates.find((u) => u.jobId === job.id && u.status === 'RETURNED')
  const access = effectiveJobAccess(job, grants)

  // A returned update re-enters this same flow: the submitted draft (step 7)
  // re-opens at the flagged step with the fix timer restarted.
  const returnStep = returned?.returnFlag?.step ?? 1
  useEffect(() => {
    if (returned && draft && draft.step === 7) reopenReturnedCapture(job, returnStep)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returned?.id, draft?.step, job.id])

  if (access.access === 'PENDING') {
    return (
      <main className="cap-screen">
        <header className="cap-head">
          <a className="cap-icon-btn" href={`#/pro/job/${job.id}`} aria-label="Back to the job"><Icon d={PATH_BACK} size={24} /></a>
          <div className="cap-head-title"><strong>{job.addr}</strong><span>Capture unavailable</span></div>
        </header>
        <div className="cap-rule" />
        <div className="cap-body">
          <h2 className="cap-step-title">The property record is not available</h2>
          <p className="cap-step-sub">The owner hasn’t granted access yet, so there is no equipment record to capture against. Request access from the job brief.</p>
        </div>
        <div className="cap-actionbar">
          <a className="cap-cta" href={`#/pro/job/${job.id}`}>Back to the job brief</a>
        </div>
      </main>
    )
  }

  if (!draft || draft.step === 0) return <StartStep job={job} draft={draft} />
  if (draft.step === 7) return <SubmittedStep job={job} draft={draft} updates={passportUpdates} />
  return <FlowStep job={job} draft={draft} returned={returned} />
}

// --- Step 0 · Start ---------------------------------------------------------

function StartStep({ job, draft }: { job: ProJob; draft?: CaptureDraft }) {
  const templateId = draft?.templateId ?? defaultTemplateFor(job)
  const dayLabel = job.horizon === 'TODAY' ? 'Today' : job.dateLabel
  return (
    <main className="cap-screen">
      <header className="cap-head">
        <a className="cap-icon-btn" href={`#/pro/job/${job.id}`} aria-label="Back to the job brief"><Icon d={PATH_BACK} size={24} /></a>
        <div className="cap-head-title">
          <strong>Start capture</strong>
          <span>Under 90 seconds · saves as you go</span>
        </div>
      </header>
      <div className="cap-rule" />

      <div className="cap-body">
        <section className="cap-jobcard">
          <div className="cap-jobcard-top">
            <span className="cap-kicker">{dayLabel} · {job.time}</span>
            <StatusTag kind={accessStatusKind(job.access)} family="access">{accessLabel(job.access)}</StatusTag>
          </div>
          <h1 className="cap-jobcard-title">{job.job}</h1>
          <p className="cap-meta">{job.addr} · {job.city} · {job.system.model} · {job.assignee}</p>
        </section>

        <section className="cap-ownerask">
          <span className="cap-kicker cap-kicker-muted">Owner asked</span>
          <p>“{job.ownerNote}”</p>
        </section>

        <section className="cap-templates">
          <div className="cap-label-row">
            <span className="cap-label">Template</span>
            <span className="cap-hint">chosen from the work type</span>
          </div>
          {captureTemplates.map((template) => {
            const active = template.id === templateId
            return (
              <button
                key={template.id}
                type="button"
                className={`cap-option ${active ? 'is-selected' : ''}`}
                aria-pressed={active}
                onClick={() => patchCaptureDraft(job, { templateId: template.id })}
              >
                <span className="cap-option-check">{active && <Icon d={PATH_CHECK} />}</span>
                <span className="cap-option-body">
                  <strong>{template.name}</strong>
                  {active && <small>{template.sub}</small>}
                </span>
              </button>
            )
          })}
        </section>
      </div>

      <div className="cap-actionbar">
        <button type="button" className="cap-cta" onClick={() => beginCapture(job)}>
          <Icon d={PATH_CAMERA} />
          Open camera &amp; start
        </button>
      </div>
    </main>
  )
}

// --- Steps 1–6 · the capture shell ------------------------------------------

function FlowStep({ job, draft, returned }: { job: ProJob; draft: CaptureDraft; returned?: PassportUpdateState }) {
  const [confirmClose, setConfirmClose] = useState(false)
  const step = draft.step
  const setStep = (next: number) => patchCaptureDraft(job, { step: next })
  const flaggedStep = returned?.returnFlag?.step ?? 1
  const onFlaggedStep = Boolean(returned) && step === flaggedStep

  const back = () => {
    if (step > 1) setStep(step - 1)
    else setStep(0)
  }

  return (
    <main className="cap-screen">
      <header className="cap-head">
        <button type="button" className="cap-icon-btn" aria-label={step > 1 ? `Back to step ${step - 1}` : 'Back to the template'} onClick={back}>
          <Icon d={PATH_BACK} size={24} />
        </button>
        <div className="cap-head-title">
          <strong>{job.addr}</strong>
          <span>{job.system.name} · {TEMPLATE_SHORT[draft.templateId]}</span>
        </div>
        {returned
          ? <StatusTag kind="progress">RETURNED</StatusTag>
          : <StatusTag kind="planned">DRAFT SAVED</StatusTag>}
        <button type="button" className="cap-icon-btn" aria-label="Close capture" onClick={() => setConfirmClose(true)}>
          <Icon d={PATH_CLOSE} />
        </button>
      </header>

      <Progress step={step} flagged={returned ? flaggedStep : undefined} onJump={setStep} />

      {onFlaggedStep && returned && <ReturnBand returned={returned} />}

      {step === 1 && <EvidenceStep job={job} draft={draft} returned={returned} />}
      {step === 2 && <WorkStep job={job} draft={draft} />}
      {step === 3 && <FindingsStep job={job} draft={draft} />}
      {step === 4 && <ConfidenceStep job={job} draft={draft} />}
      {step === 5 && <NextStepStep job={job} draft={draft} />}
      {step === 6 && <PreviewStep job={job} draft={draft} returned={returned} />}

      {confirmClose && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Leave capture">
          <div className="modal cap-modal">
            <h3>Leave capture?</h3>
            <p>Your draft is saved. Reopening this job resumes right here, at step {step} · {STEP_NAMES[step - 1]}.</p>
            <div className="cap-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmClose(false)}>Keep working</button>
              <a className="btn btn-primary" href={`#/pro/job/${job.id}`}>Save &amp; leave</a>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Progress({ step, flagged, onJump }: { step: number; flagged?: number; onJump: (step: number) => void }) {
  const flaggedName = flagged ? ` — fix requested` : ''
  return (
    <div className="cap-progress">
      <div className="cap-progress-bar">
        {STEP_NAMES.map((name, index) => {
          const n = index + 1
          const state = n === step ? 'is-current' : n < step || (flagged && n < 7) ? 'is-done' : 'is-todo'
          if (n === 7) return <span key={name} className={`cap-progress-seg ${n === step ? 'is-current' : 'is-todo'}`} aria-hidden><i /></span>
          return (
            <button
              key={name}
              type="button"
              className={`cap-progress-seg ${state}`}
              aria-label={`Go to step ${n} · ${name}`}
              aria-current={n === step ? 'step' : undefined}
              onClick={() => onJump(n)}
            >
              <i />
            </button>
          )
        })}
      </div>
      <div className="cap-progress-labels">
        <span className="cap-progress-name">{step} · {STEP_NAMES[step - 1]}{step === flagged ? flaggedName : ''}</span>
        <span>Step {step} of 7</span>
      </div>
    </div>
  )
}

function ReturnBand({ returned }: { returned: PassportUpdateState }) {
  return (
    <section className="cap-returnband">
      <div>
        <span className="cap-returnband-who">◐ Returned by {returned.reviewedBy} · {timePart(returned.reviewedOn)}</span>
        {returned.returnFlag && <span className="cap-returnband-flag">{returned.returnFlag.label}</span>}
      </div>
      <p>“{returned.reviewNote}”</p>
      <small>Everything you entered is kept. Fix the flagged item and resubmit.</small>
    </section>
  )
}

// --- Step 1 · Evidence ------------------------------------------------------

function EvidenceStep({ job, draft, returned }: { job: ProJob; draft: CaptureDraft; returned?: PassportUpdateState }) {
  const [torch, setTorch] = useState(false)
  const [rollOpen, setRollOpen] = useState(false)
  const options = captureEvidenceFor(job)
  const kit = captureKitFor(job)
  const attached = options.filter((option) => draft.photoIds.includes(option.id))
  const matchedShots = new Set(attached.map((option) => option.shot))

  const shoot = () => {
    const next = options.find((option) => !draft.photoIds.includes(option.id))
    if (next) patchCaptureDraft(job, { photoIds: [...draft.photoIds, next.id] })
  }
  const allShot = attached.length === options.length

  // Returned-mode gating: resubmit waits for the flagged shot, nothing else.
  const neededShot = returned?.returnFlag?.shot
  const neededShotDone = !neededShot || matchedShots.has(neededShot)

  return (
    <>
      <div className="cap-camera" role="img" aria-label="Camera viewfinder (simulated)">
        <span className="cap-camera-tag"><Icon d={PATH_CHECK} size={14} />Auto-tag · {job.system.name} {job.system.serial}</span>
        <button
          type="button"
          className={`cap-camera-torch ${torch ? 'is-on' : ''}`}
          aria-pressed={torch}
          aria-label="Toggle torch"
          onClick={() => setTorch((on) => !on)}
        >
          <Icon d={PATH_TORCH} />
        </button>
        <div className="cap-camera-controls">
          <button type="button" className="cap-camera-roll" aria-label="Open photo roll" onClick={() => setRollOpen(true)}>
            {attached.length > 0 && <img src={attached[attached.length - 1].src} alt="" />}
          </button>
          <button type="button" className="cap-shutter" aria-label={allShot ? 'All demo shots attached' : 'Take photo (attaches a demo shot)'} disabled={allShot} onClick={shoot}>
            <span />
          </button>
          <span className="cap-camera-flip" aria-hidden><Icon d={PATH_FLIP} size={24} /></span>
        </div>
      </div>

      <div className="cap-body">
        <div className="cap-shotlist">
          <span className="cap-label">{neededShot && !neededShotDone ? 'One shot still missing' : `The template suggests ${kit.shots.length} shots`}</span>
          <div className="cap-chip-row">
            {kit.shots.map((shot) => {
              const matched = matchedShots.has(shot)
              const flagged = shot === neededShot && !matched
              return (
                <span key={shot} className={`cap-shot ${matched ? 'is-matched' : ''} ${flagged ? 'is-flagged' : ''}`}>
                  {matched ? '✓ ' : flagged ? '▲ ' : ''}{shot}
                </span>
              )
            })}
          </div>
        </div>

        {attached.length > 0 && (
          <div className="cap-thumbs">
            {attached.map((option) => (
              <figure key={option.id} className="cap-thumb">
                <span className="cap-thumb-img">
                  <img src={option.src} alt={option.shot} />
                  <span className="cap-thumb-annotate" aria-hidden><Icon d={PATH_PENCIL} size={14} /></span>
                </span>
                <figcaption>{option.shot}</figcaption>
              </figure>
            ))}
          </div>
        )}

        {returned && <p className="cap-hint-block">Your readings, work list, and next step are unchanged — review them from the progress bar if anything else needs a fix.</p>}
      </div>

      <div className="cap-actionbar">
        <div className="cap-actionbar-row">
          <button type="button" className="cap-linkbtn" onClick={() => setRollOpen(true)}>
            <Icon d={PATH_ROLL} size={18} />
            Add from photo roll
          </button>
          <span className="cap-hint">{attached.length} photo{attached.length === 1 ? '' : 's'} attached</span>
        </div>
        {returned && draft.step === (returned.returnFlag?.step ?? 1) ? (
          <>
            <button type="button" className="cap-cta" disabled={!neededShotDone} onClick={() => submitCapture(job)}>Resubmit for review</button>
            {!neededShotDone && <span className="cap-cta-note">Enabled once the flagged photo is added</span>}
          </>
        ) : (
          <button type="button" className="cap-cta" onClick={() => patchCaptureDraft(job, { step: 2 })}>Next · Work done</button>
        )}
      </div>

      {rollOpen && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Photo roll">
          <div className="modal cap-modal">
            <h3>Photo roll</h3>
            <p className="cap-hint">Demo stand-in for the device roll — pick the shots taken earlier.</p>
            <div className="cap-roll-list">
              {options.map((option) => <RollRow key={option.id} option={option} job={job} draft={draft} />)}
            </div>
            <div className="cap-modal-actions">
              <button type="button" className="btn btn-primary" onClick={() => setRollOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function RollRow({ option, job, draft }: { option: EvidenceOption; job: ProJob; draft: CaptureDraft }) {
  const checked = draft.photoIds.includes(option.id)
  const toggle = () => patchCaptureDraft(job, {
    photoIds: checked ? draft.photoIds.filter((id) => id !== option.id) : [...draft.photoIds, option.id],
  })
  return (
    <button type="button" className={`cap-roll-row ${checked ? 'is-selected' : ''}`} aria-pressed={checked} onClick={toggle}>
      <img src={option.src} alt="" />
      <span>{option.shot}</span>
      <span className="cap-option-check">{checked && <Icon d={PATH_CHECK} />}</span>
    </button>
  )
}

// --- Step 2 · Work done -----------------------------------------------------

function WorkStep({ job, draft }: { job: ProJob; draft: CaptureDraft }) {
  const kit = captureKitFor(job)
  const [otherOpen, setOtherOpen] = useState(draft.otherWork.trim() !== '')
  const [addingMaterial, setAddingMaterial] = useState(false)
  const [newMaterial, setNewMaterial] = useState('')
  const template = captureTemplates.find((t) => t.id === draft.templateId)

  const toggleTask = (id: string) => patchCaptureDraft(job, {
    tasksDone: draft.tasksDone.includes(id) ? draft.tasksDone.filter((t) => t !== id) : [...draft.tasksDone, id],
  })
  const materialOptions = [...kit.materials, ...draft.materials.filter((m) => !kit.materials.includes(m))]
  const toggleMaterial = (label: string) => patchCaptureDraft(job, {
    materials: draft.materials.includes(label) ? draft.materials.filter((m) => m !== label) : [...draft.materials, label],
  })
  const addMaterial = () => {
    const label = newMaterial.trim()
    if (label && !draft.materials.includes(label)) patchCaptureDraft(job, { materials: [...draft.materials, label] })
    setNewMaterial('')
    setAddingMaterial(false)
  }

  return (
    <>
      <div className="cap-rule-inset" />
      <div className="cap-body">
        <div>
          <h2 className="cap-step-title">What did you do?</h2>
          <p className="cap-step-sub">Tap everything that applies — from the {template?.name ?? 'visit'} template.</p>
        </div>

        <div className="cap-option-list">
          {kit.tasks.map((task) => {
            const active = draft.tasksDone.includes(task.id)
            return (
              <button key={task.id} type="button" className={`cap-option ${active ? 'is-selected' : ''}`} aria-pressed={active} onClick={() => toggleTask(task.id)}>
                <span className="cap-option-check">{active && <Icon d={PATH_CHECK} />}</span>
                <span className="cap-option-body"><strong>{task.label}</strong></span>
              </button>
            )
          })}
          {otherOpen ? (
            <div className="cap-other">
              <label className="cap-label" htmlFor="cap-other-work">Other work</label>
              <textarea
                id="cap-other-work"
                className="input cap-textarea"
                rows={2}
                value={draft.otherWork}
                placeholder="Anything the template didn’t list"
                onChange={(event) => patchCaptureDraft(job, { otherWork: event.target.value })}
              />
            </div>
          ) : (
            <button type="button" className="cap-option is-dashed" onClick={() => setOtherOpen(true)}>
              <span className="cap-option-check"><Icon d={PATH_PLUS} /></span>
              <span className="cap-option-body"><strong className="cap-accent">Other work…</strong></span>
            </button>
          )}
        </div>

        <div className="cap-materials">
          <span className="cap-label">Materials that matter next time</span>
          <div className="cap-chip-row">
            {materialOptions.map((label) => {
              const active = draft.materials.includes(label)
              return (
                <button key={label} type="button" className={`cap-chip ${active ? 'is-selected' : ''}`} aria-pressed={active} onClick={() => toggleMaterial(label)}>
                  {label}
                </button>
              )
            })}
            {addingMaterial ? (
              <span className="cap-chip-add">
                <input
                  className="input"
                  value={newMaterial}
                  placeholder="Material"
                  autoFocus
                  onChange={(event) => setNewMaterial(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') addMaterial() }}
                  onBlur={addMaterial}
                />
              </span>
            ) : (
              <button type="button" className="cap-chip is-dashed" onClick={() => setAddingMaterial(true)}>+ Add</button>
            )}
          </div>
        </div>
      </div>

      <div className="cap-actionbar">
        <button type="button" className="cap-cta" onClick={() => patchCaptureDraft(job, { step: 3 })}>Next · Findings</button>
      </div>
    </>
  )
}

// --- Step 3 · Findings ------------------------------------------------------

function FindingsStep({ job, draft }: { job: ProJob; draft: CaptureDraft }) {
  const fields = findingsSchemaFor(job)
  return (
    <>
      <div className="cap-rule-inset" />
      <div className="cap-body">
        <div>
          <h2 className="cap-step-title">What did you find?</h2>
          <p className="cap-step-sub">Readings for this equipment type. Skip what you didn’t measure.</p>
        </div>

        {fields.length === 0 && <p className="cap-hint-block">No measurement schema for this equipment yet — say it instead.</p>}
        {fields.map((field) => field.kind === 'stepper'
          ? <StepperField key={field.id} field={field} job={job} draft={draft} />
          : <ChipsField key={field.id} field={field} job={job} draft={draft} />)}

        <VoicePanel job={job} draft={draft} />
      </div>

      <div className="cap-actionbar">
        <button type="button" className="cap-cta" onClick={() => patchCaptureDraft(job, { step: 4 })}>Next · Confidence</button>
      </div>
    </>
  )
}

function StepperField({ field, job, draft }: { field: MeasurementField; job: ProJob; draft: CaptureDraft }) {
  const raw = draft.measurements[field.id]
  const value = typeof raw === 'number' ? raw : null
  const min = field.min ?? 0
  const max = field.max ?? 100
  const step = field.step ?? 1
  const setValue = (next: number | null) => patchCaptureDraft(job, { measurements: { ...draft.measurements, [field.id]: next } })
  const bump = (dir: 1 | -1) => {
    if (value === null) setValue(field.start ?? min)
    else setValue(Math.min(max, Math.max(min, value + dir * step)))
  }
  return (
    <div className="cap-field">
      <div className="cap-stepper-row">
        <span className="cap-field-label">{field.label}</span>
        <div className="cap-stepper" role="group" aria-label={field.label}>
          <button type="button" aria-label={`Decrease ${field.label}`} disabled={value === null || value <= min} onClick={() => bump(-1)}>−</button>
          <output className={value === null ? 'is-empty' : ''}>{value === null ? `— ${field.unit ?? ''}`.trim() : `${value}${field.unit ?? ''}`}</output>
          <button type="button" aria-label={`Increase ${field.label}`} disabled={value !== null && value >= max} onClick={() => bump(1)}>+</button>
        </div>
      </div>
      {field.prior && <span className="cap-prior">{field.prior}</span>}
    </div>
  )
}

function ChipsField({ field, job, draft }: { field: MeasurementField; job: ProJob; draft: CaptureDraft }) {
  const value = draft.measurements[field.id]
  const pick = (option: string) => patchCaptureDraft(job, {
    measurements: { ...draft.measurements, [field.id]: value === option ? null : option },
  })
  return (
    <div className="cap-field">
      <span className="cap-field-label">{field.label}</span>
      <div className="cap-chip-row">
        {(field.options ?? []).map((option) => (
          <button key={option} type="button" className={`cap-chip is-tall ${value === option ? 'is-selected' : ''}`} aria-pressed={value === option} onClick={() => pick(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function VoicePanel({ job, draft }: { job: ProJob; draft: CaptureDraft }) {
  const kit = captureKitFor(job)
  const [editing, setEditing] = useState(false)
  const voice = draft.voice
  const setVoice = (next: CaptureDraft['voice']) => patchCaptureDraft(job, { voice: next })
  return (
    <div className="cap-voice">
      <div className="cap-voice-head">
        <button
          type="button"
          className="cap-voice-mic"
          aria-label="Hold to talk (simulated — produces a demo transcript)"
          onClick={() => { if (!voice) setVoice({ transcript: kit.voiceDemo, status: 'review' }) }}
        >
          <Icon d={PATH_MIC} size={22} />
        </button>
        <div>
          <strong>Hold to talk</strong>
          <span>Transcribed — you confirm before it’s included</span>
        </div>
      </div>
      {voice && !editing && (
        <>
          <p className="cap-voice-transcript">“{voice.transcript}”</p>
          <div className="cap-voice-actions">
            {voice.status === 'kept' ? (
              <StatusTag kind="ready">INCLUDED</StatusTag>
            ) : (
              <button type="button" className="cap-voice-btn" onClick={() => setVoice({ ...voice, status: 'kept' })}>Keep</button>
            )}
            <button type="button" className="cap-voice-btn" onClick={() => setEditing(true)}>Edit</button>
            <button type="button" className="cap-voice-btn is-muted" onClick={() => setVoice(null)}>Discard</button>
          </div>
        </>
      )}
      {voice && editing && (
        <>
          <textarea
            className="input cap-textarea"
            rows={3}
            value={voice.transcript}
            aria-label="Edit transcript"
            onChange={(event) => setVoice({ ...voice, transcript: event.target.value })}
          />
          <div className="cap-voice-actions">
            <button type="button" className="cap-voice-btn" onClick={() => { setVoice({ transcript: voice.transcript, status: 'kept' }); setEditing(false) }}>Keep</button>
            <button type="button" className="cap-voice-btn is-muted" onClick={() => { setVoice(null); setEditing(false) }}>Discard</button>
          </div>
        </>
      )}
    </div>
  )
}

// --- Step 4 · Confidence ----------------------------------------------------

function ConfidenceStep({ job, draft }: { job: ProJob; draft: CaptureDraft }) {
  const pick = (confidence: CaptureDraft['confidence']) => patchCaptureDraft(job, { confidence })
  return (
    <>
      <div className="cap-rule-inset" />
      <div className="cap-body">
        <div>
          <h2 className="cap-step-title">How certain is this?</h2>
          <p className="cap-step-sub">This becomes part of the property’s permanent record.</p>
        </div>

        <div className="cap-option-list">
          {([
            { id: 'CONFIRMED' as const, label: 'Confirmed', sub: 'Directly observed or measured on this visit.' },
            { id: 'PROVISIONAL' as const, label: 'Provisional', sub: 'Needs follow-up before it is treated as settled.' },
          ]).map((option) => {
            const active = draft.confidence === option.id
            return (
              <button key={option.id} type="button" className={`cap-option is-roomy ${active ? 'is-selected' : ''}`} aria-pressed={active} onClick={() => pick(option.id)}>
                <span className="cap-option-check">{active && <Icon d={PATH_CHECK} size={22} />}</span>
                <span className="cap-option-body">
                  <strong className="cap-option-big">{option.label}</strong>
                  <small>{option.sub}</small>
                </span>
              </button>
            )
          })}
        </div>

        <p className="cap-hint-block">Provisional entries appear in the owner’s record marked as awaiting confirmation — honest beats polished.</p>
      </div>

      <div className="cap-actionbar">
        <button type="button" className="cap-cta" onClick={() => patchCaptureDraft(job, { step: 5 })}>Next · Next step</button>
      </div>
    </>
  )
}

// --- Step 5 · Next step -----------------------------------------------------

function NextStepStep({ job, draft }: { job: ProJob; draft: CaptureDraft }) {
  const kit = captureKitFor(job)
  const toggle = (id: string) => patchCaptureDraft(job, {
    nextChips: draft.nextChips.includes(id) ? draft.nextChips.filter((c) => c !== id) : [...draft.nextChips, id],
  })
  const length = draft.nextText.length
  return (
    <>
      <div className="cap-rule-inset" />
      <div className="cap-body">
        <div>
          <h2 className="cap-step-title">What should happen next?</h2>
          <p className="cap-step-sub">Suggestions follow your findings. The owner reads this.</p>
        </div>

        <div className="cap-option-list">
          {kit.nextSteps.map((chip) => {
            const active = draft.nextChips.includes(chip.id)
            return (
              <button key={chip.id} type="button" className={`cap-option ${active ? 'is-selected' : ''}`} aria-pressed={active} onClick={() => toggle(chip.id)}>
                <span className="cap-option-check">{active && <Icon d={PATH_CHECK} />}</span>
                <span className="cap-option-body"><strong>{chip.label}</strong></span>
              </button>
            )
          })}
        </div>

        <div className="cap-field">
          <label className="cap-label" htmlFor="cap-next-text">In your words — optional</label>
          <textarea
            id="cap-next-text"
            className="input cap-textarea cap-textarea-tall"
            value={draft.nextText}
            placeholder={composeNext(kit, draft.nextChips, '')}
            onChange={(event) => patchCaptureDraft(job, { nextText: event.target.value })}
          />
          <div className="cap-counter">
            <span>Short reads best in the owner’s record</span>
            <span className={length > 150 ? 'is-over' : ''}>{length} / ~150</span>
          </div>
        </div>
      </div>

      <div className="cap-actionbar">
        <button type="button" className="cap-cta" onClick={() => patchCaptureDraft(job, { step: 6 })}>Preview owner handoff</button>
      </div>
    </>
  )
}

// --- Step 6 · Owner preview -------------------------------------------------

function PreviewStep({ job, draft, returned }: { job: ProJob; draft: CaptureDraft; returned?: PassportUpdateState }) {
  const kit = captureKitFor(job)
  const [editing, setEditing] = useState(false)
  const [photoNudgeSkipped, setPhotoNudgeSkipped] = useState(false)
  const attached = captureEvidenceFor(job).filter((option) => draft.photoIds.includes(option.id))
  const voiceKept = draft.voice?.status === 'kept' ? draft.voice.transcript : null

  const composed = {
    work: composeWork(kit, draft.tasksDone, draft.otherWork),
    finding: composeFinding(job, draft.measurements, voiceKept),
    next: composeNext(kit, draft.nextChips, draft.nextText),
  }
  const lines = {
    work: draft.overrides.work ?? composed.work,
    finding: draft.overrides.finding ?? composed.finding,
    next: draft.overrides.next ?? composed.next,
  }
  const setOverride = (key: keyof typeof composed, value: string) => {
    const overrides = { ...draft.overrides }
    if (value === composed[key] || value.trim() === '') delete overrides[key]
    else overrides[key] = value
    patchCaptureDraft(job, { overrides })
  }

  const showPhotoNudge = attached.length === 0 && !photoNudgeSkipped

  return (
    <>
      <div className="cap-rule-inset" />
      <div className="cap-body">
        {showPhotoNudge && (
          <div className="cap-softvalidate" role="status">
            <p>No photo attached — owner records with photos are opened 3× more often. Add one?</p>
            <div>
              <button type="button" className="btn btn-primary" onClick={() => patchCaptureDraft(job, { step: 1 })}>Add photo</button>
              <button type="button" className="btn btn-secondary" onClick={() => setPhotoNudgeSkipped(true)}>Skip</button>
            </div>
          </div>
        )}

        <section className="cap-preview elev-md">
          <div className="cap-preview-top">
            <span className="cap-kicker">Property Passport · {job.addr}</span>
            <button type="button" className="cap-linkbtn" aria-pressed={editing} onClick={() => setEditing((on) => !on)}>
              <Icon d={PATH_PENCIL} size={16} />
              {editing ? 'Done editing' : 'Edit a line'}
            </button>
          </div>
          <div>
            <h3 className="cap-preview-title">{job.system.name} service update</h3>
            <span className="cap-meta">{job.assignee} · Comfort Professor · Aug 21, 2026</span>
          </div>

          {attached.length > 0 && (
            <div className="cap-preview-photos">
              {attached.map((option) => <img key={option.id} src={option.src} alt={option.shot} />)}
            </div>
          )}

          <div className="cap-preview-lines">
            {([
              { key: 'work' as const, label: 'Work' },
              { key: 'finding' as const, label: 'Finding' },
              { key: 'next' as const, label: 'Next step' },
            ]).map(({ key, label }) => (
              <div key={key} className="cap-preview-line">
                <span className="cap-kicker cap-kicker-muted">{label}</span>
                {editing ? (
                  <textarea className="input cap-textarea" rows={3} value={lines[key]} aria-label={`${label} — as the owner will read it`} onChange={(event) => setOverride(key, event.target.value)} />
                ) : (
                  <p>{lines[key]}</p>
                )}
              </div>
            ))}
          </div>

          <StatusTag kind={draft.confidence === 'CONFIRMED' ? 'ready' : 'planned'}>{draft.confidence}</StatusTag>
        </section>

        <p className="cap-hint-block">Management reviews this before it reaches the owner’s permanent record.</p>
      </div>

      <div className="cap-actionbar">
        <button type="button" className="cap-cta" onClick={() => submitCapture(job)}>
          {returned ? 'Resubmit for review' : 'Submit for review'}
        </button>
      </div>
    </>
  )
}

// --- Step 7 · Submitted -----------------------------------------------------

function timePart(stamp?: string): string {
  return stamp?.split(', ')[1] ?? stamp ?? ''
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`
  return `${Math.floor(seconds / 60)} min ${seconds % 60} s`
}

function SubmittedStep({ job, draft, updates }: { job: ProJob; draft: CaptureDraft; updates: PassportUpdateState[] }) {
  const update = updates.find((u) => u.jobId === job.id && u.status !== 'PUBLISHED')
  const readings = findingsSchemaFor(job).filter((field) => {
    const value = draft.measurements[field.id]
    return value !== null && value !== undefined && value !== ''
  }).length
  const nextStop = proJobs
    .filter((item) => item.horizon === 'TODAY' && item.assignee === job.assignee && item.id !== job.id && timeMinutes(item.time) > timeMinutes(job.time))
    .sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time))[0]
  const seconds = draft.capturedSeconds
  const timing = seconds && seconds <= 600 ? `Capture took ${formatDuration(seconds)}. ` : ''

  return (
    <main className="cap-screen">
      <header className="cap-head cap-head-end">
        <a className="cap-icon-btn" href="#/pro" aria-label="Close and go to today’s work"><Icon d={PATH_CLOSE} /></a>
      </header>

      <div className="cap-progress">
        <div className="cap-progress-bar">
          {STEP_NAMES.map((name) => <span key={name} className="cap-progress-seg is-done" aria-hidden><i /></span>)}
        </div>
        <div className="cap-progress-labels">
          <span className="cap-progress-name is-done">7 · Submitted</span>
          <span>Step 7 of 7</span>
        </div>
      </div>

      <div className="cap-body cap-body-roomy">
        <StatusTag kind="review">IN REVIEW</StatusTag>
        <h1 className="cap-done-title">With management for review</h1>
        <p className="cap-done-copy">{timing}You’ll hear back if anything is returned — otherwise it publishes to the owner’s Passport.</p>

        <dl className="cap-receipt">
          <div><dt>Photos</dt><dd>{draft.photoIds.length} attached</dd></div>
          <div><dt>Readings</dt><dd>{readings} recorded</dd></div>
          <div><dt>Confidence</dt><dd>{draft.confidence === 'CONFIRMED' ? 'Confirmed' : 'Provisional'}</dd></div>
          <div><dt>Submitted by</dt><dd>{job.assignee}{update ? ` · ${timePart(update.submittedOn)}` : ''}</dd></div>
        </dl>

        {nextStop && (
          <section className="cap-nextstop">
            <span className="cap-kicker">Next stop · {nextStop.time}</span>
            <strong>{nextStop.job}</strong>
            <span className="cap-meta">{nextStop.addr} · {nextStop.city}</span>
            <a className="cap-cta-outline" href={`#/pro/job/${nextStop.id}`}>Open job brief</a>
          </section>
        )}
      </div>

      <div className="cap-actionbar">
        <a className="cap-cta" href="#/pro">Back to Today</a>
      </div>
    </main>
  )
}
