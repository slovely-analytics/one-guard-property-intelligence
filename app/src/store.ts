// Reactive demo store — single source of truth shared by every screen.
// Persists to localStorage so the demo survives refresh; "Reset demo" in the footer clears it.
import { useSyncExternalStore } from 'react'
import type { StatusKind } from './components/StatusTag'
import type { AccessState, ProJob, TagClass } from './data'
import type { Role } from './roles'

export type TaskStatus = 'DUE SOON' | 'UPCOMING' | 'SCHEDULED' | 'REQUESTED' | 'DONE'
export type ProjectStatus = 'REQUESTED' | 'QUOTES IN' | 'ACTION NEEDED' | 'SCHEDULED' | 'COMPLETED'
export type WarrantyStatus = 'ACTIVE' | 'EXPIRING' | 'EXPIRED'

export interface TaskState {
  id: string
  date: string
  season: string
  what: string
  detail: string
  who: string
  diy: boolean
  status: TaskStatus
  completedOn?: string
}

export interface Quote {
  vendor: string
  price: string
  timeline: string
  note: string
}

export interface ProjectState {
  id: string
  title: string
  vendor: string
  status: ProjectStatus
  cost: string
  note: string
  stepsDone: number
  stepLabels: string[]
  quotes?: Quote[]
}

export interface WarrantyState {
  id: string
  item: string
  provider: string
  coverage: string
  expires: string
  status: WarrantyStatus
  docs: string[]
}

export interface ChatMessage {
  from: 'you' | 'dana'
  text: string
  time: string
}

export interface PortfolioRow {
  addr: string
  type: string
  score: number | null
  tasks: number | null
  next: string
  flag: string
  tagClass: TagClass
}

export interface ToastItem {
  id: number
  text: string
  /** Optional action (e.g. a 10s undo). Toasts are ephemeral — never persisted. */
  actionLabel?: string
  onAction?: () => void
}

export interface NotifPrefs {
  email: boolean
  text: boolean
  leadDays: number
}

export type ProLens = 'TECHNICIAN' | 'MANAGEMENT'
export type PassportUpdateStatus = 'IN_REVIEW' | 'RETURNED' | 'PUBLISHED'

export interface PassportUpdateState {
  id: string
  jobId: string
  propertyAddr: string
  systemName: string
  performed: string
  observation: string
  materials: string
  recommendation: string
  confidence: 'CONFIRMED' | 'PROVISIONAL'
  evidence: string[]
  submittedBy: string
  submittedOn: string
  status: PassportUpdateStatus
  reviewedBy?: string
  reviewedOn?: string
  reviewNote?: string
}

export type GrantStatus = 'ACTIVE' | 'PENDING' | 'REVOKED' | 'DECLINED'
export type GrantKind = 'STANDING' | 'JOB'

export interface AccessGrantState {
  id: string
  company: string
  trade: string
  kind: GrantKind
  /** What the grant opens up — named systems, never the whole record. */
  scope: string
  /** The time bound, in owner language — "Since Mar 2024" or "Expires Aug 28". */
  window: string
  /** Why this company has (or wants) access. */
  note: string
  status: GrantStatus
  decidedOn?: string
  /** Service Pro door jobs that ride on this grant. */
  jobIds: string[]
}

export interface AccessLogEntry {
  on: string
  who: string
  what: string
}

export interface NudgeState {
  /** Display time — "2:14 PM". */
  sentAt: string
  /** Epoch ms, for the cooldown window. */
  sentAtMs: number
}

export interface DemoState {
  /** Which door we came through. null = show the entry screen. */
  role: Role | null
  tasks: TaskState[]
  projects: ProjectState[]
  warranties: WarrantyState[]
  portfolio: PortfolioRow[]
  messages: ChatMessage[]
  chatOpen: boolean
  danaReplies: number
  assessmentSlot: string | null
  notif: NotifPrefs
  highlightProject: string | null
  proLens: ProLens
  selectedProJobId: string
  passportUpdates: PassportUpdateState[]
  grants: AccessGrantState[]
  accessLog: AccessLogEntry[]
  /** Owner nudges sent from the Service Pro door, keyed by job id. */
  nudges: Record<string, NudgeState>
  toasts: ToastItem[]
}

function seed(): DemoState {
  return {
    role: null,
    tasks: [
      { id: 'filters', date: 'Aug 20', season: 'Summer', what: 'Replace HVAC air filters', detail: 'MERV 11, 20×25×1 — both units', who: 'DIY (guide included)', diy: true, status: 'DUE SOON' },
      // The same visit the Service Pro door shows as Marcus's 8:00 AM stop —
      // one record, two coordinated sides, so the two doors must agree.
      { id: 'wh-flush', date: 'Aug 21', season: 'Summer', what: 'Flush water heater', detail: 'Comfort Professor — Marcus Reyes, confirmed 8:00 AM', who: 'Comfort Professor', diy: false, status: 'SCHEDULED' },
      { id: 'roof-visit', date: 'Aug 21', season: 'Summer', what: 'Roof inspection & gutter repair', detail: 'Summit Roofing Co. — confirmed 9:30 AM', who: 'Summit Roofing Co.', diy: false, status: 'SCHEDULED' },
      { id: 'gutters', date: 'Oct 01', season: 'Fall', what: 'Gutter cleaning', detail: 'Before leaf drop; includes downspout check', who: 'Needs vendor', diy: false, status: 'UPCOMING' },
      { id: 'assessment', date: 'Oct 14', season: 'Fall', what: 'Annual Home Health Assessment', detail: '74-point inspection with M. Torres', who: 'One Guard', diy: false, status: 'SCHEDULED' },
      { id: 'furnace', date: 'Nov 10', season: 'Fall', what: 'Furnace tune-up', detail: 'Pre-season inspection & filter service', who: 'Comfort Air Mechanical', diy: false, status: 'UPCOMING' },
    ],
    projects: [
      { id: 'roof', title: 'Roof inspection & gutter repair', vendor: 'Summit Roofing Co. · Coordinator: Dana W.', status: 'SCHEDULED', cost: 'Est. $480',
        note: 'Confirmed for Aug 21, 9:30 AM. Access notes shared with the crew.',
        stepsDone: 3, stepLabels: ['Requested', 'Quotes (3)', 'Approved', 'Scheduled', 'Verified'] },
      { id: 'hvac', title: 'HVAC condenser replacement', vendor: 'Sourcing quotes · Coordinator: Dana W.', status: 'QUOTES IN', cost: '$6,200–7,800',
        note: '2 of 3 quotes received. Comparison ready for your review.',
        stepsDone: 1, stepLabels: ['Requested', 'Quotes (2/3)', 'Approved', 'Scheduled', 'Verified'],
        quotes: [
          { vendor: 'Comfort Air Mechanical', price: '$6,450', timeline: 'Install week of Sep 8', note: '16 SEER2 Carrier unit · 10-yr parts warranty · your existing service provider' },
          { vendor: 'Apex Climate Systems', price: '$7,100', timeline: 'Install week of Aug 25', note: '17 SEER2 Trane unit · 12-yr parts & labor warranty · faster slot' },
        ] },
      { id: 'regrade', title: 'NE corner regrading', vendor: 'Awaiting your approval', status: 'ACTION NEEDED', cost: '$1,150',
        note: 'GreenScape Landworks quote recommended by Dana. Approve to schedule.',
        stepsDone: 1, stepLabels: ['Requested', 'Quote ready', 'Approve', 'Scheduled', 'Verified'] },
      { id: 'chimney', title: 'Chimney flashing repair', vendor: 'Summit Roofing Co.', status: 'COMPLETED', cost: '$425',
        note: 'Completed Mar 2026. Verified at follow-up; added to Property Passport.',
        stepsDone: 4, stepLabels: ['Requested', 'Quotes (3)', 'Approved', 'Scheduled', 'Verified'] },
    ],
    warranties: [
      { id: 'fridge', item: 'Refrigerator — GE Profile', provider: 'GE Appliances', coverage: 'Parts & labor', expires: 'Mar 2028', status: 'ACTIVE', docs: ['GE-Profile-warranty-certificate.pdf', 'Purchase-receipt-2023-03.pdf'] },
      { id: 'dishwasher', item: 'Dishwasher — Bosch 300', provider: 'Bosch', coverage: 'Parts & labor', expires: 'Jun 2027', status: 'EXPIRING', docs: ['Bosch-300-warranty-terms.pdf'] },
      { id: 'roof-w', item: 'Roof — 30-yr shingle', provider: 'GAF (manufacturer)', coverage: 'Materials', expires: '2044', status: 'ACTIVE', docs: ['GAF-materials-warranty.pdf', 'Install-certification-2014.pdf'] },
      { id: 'laundry', item: 'Washer/dryer — LG', provider: 'LG + extended plan', coverage: 'Full replacement', expires: 'Sep 2026', status: 'EXPIRING', docs: ['LG-extended-plan.pdf'] },
      { id: 'furnace-w', item: 'HVAC furnace — Carrier', provider: 'Carrier', coverage: 'Heat exchanger', expires: '2036', status: 'ACTIVE', docs: ['Carrier-heat-exchanger-warranty.pdf'] },
      { id: 'wh-w', item: 'Water heater — Rheem', provider: 'Rheem', coverage: '—', expires: 'Expired 2021', status: 'EXPIRED', docs: ['Rheem-warranty-expired-2021.pdf'] },
    ],
    portfolio: [
      { addr: '1847 Maple Grove Ln', type: 'Single-family', score: 82, tasks: null, next: 'Oct 14', flag: 'HVAC AGING', tagClass: 'tag-outline' },
      { addr: '220 Birchwood Ct #A–D', type: '4-plex', score: 74, tasks: 7, next: 'Sep 02', flag: 'ROOF DUE', tagClass: 'tag-outline' },
      { addr: '918 Calloway Dr', type: 'Single-family', score: 88, tasks: 1, next: 'Nov 20', flag: 'ON TRACK', tagClass: 'tag-neutral' },
      { addr: '45 Fenwick Row', type: 'Townhome', score: 91, tasks: 0, next: 'Jan 08', flag: 'ON TRACK', tagClass: 'tag-neutral' },
      { addr: '1302 Alder St', type: 'Duplex', score: 68, tasks: 6, next: 'Aug 28', flag: 'PLUMBING', tagClass: 'tag-accent' },
      { addr: '77 Quarry Ridge Rd', type: 'Single-family', score: 79, tasks: 5, next: 'Oct 30', flag: 'WATER HEATER', tagClass: 'tag-accent' },
    ],
    messages: [
      { from: 'dana', text: "Hi, I'm Dana — your property advisor. Ask me about any task, project or warranty and I'll take it from there.", time: '' },
    ],
    chatOpen: false,
    danaReplies: 0,
    assessmentSlot: null,
    notif: { email: true, text: true, leadDays: 10 },
    highlightProject: null,
    proLens: 'TECHNICIAN',
    selectedProJobId: 'wh-flush',
    passportUpdates: [
      {
        id: 'update-toilet-demo',
        jobId: 'toilet',
        propertyAddr: '1302 Alder St',
        systemName: 'Second-floor toilet',
        performed: 'Removed the failed fixture and prepared the flange for the owner-supplied replacement.',
        observation: 'The flange sits slightly below the finished floor but is sound. No visible subfloor moisture.',
        materials: 'Reinforced wax ring and stainless closet bolts',
        recommendation: 'Publish the installed fixture model after the box label is photographed at completion.',
        confidence: 'CONFIRMED',
        evidence: ['Flange condition before installation', 'Supply valve and braided line'],
        submittedBy: 'Marcus Reyes',
        submittedOn: 'Aug 21, 10:52 AM',
        status: 'IN_REVIEW',
      },
    ],
    // Access to 1847 Maple Grove Ln, as the owner sees it. The Comfort
    // Professor grant is the one wired to the Service Pro door — revoking it
    // makes Marcus's water-heater job go dark over there.
    grants: [
      {
        id: 'cp',
        company: 'Comfort Professor',
        trade: 'HVAC & plumbing',
        kind: 'STANDING',
        scope: 'Mechanical systems — HVAC, water heater, and their service history',
        window: 'Since Mar 2024 · reviewed yearly',
        note: 'Your primary service provider. Standing access keeps every visit’s context ready without a new request each time.',
        status: 'ACTIVE',
        jobIds: ['wh-flush'],
      },
      {
        id: 'summit',
        company: 'Summit Roofing Co.',
        trade: 'Roofing',
        kind: 'JOB',
        scope: 'Roof & gutter record, exterior photos, chimney repair history',
        window: 'Expires Aug 28 — 7 days after the job completes',
        note: 'Granted for the Aug 21 roof inspection & gutter repair.',
        status: 'ACTIVE',
        jobIds: [],
      },
      {
        id: 'apex',
        company: 'Apex Climate Systems',
        trade: 'HVAC',
        kind: 'JOB',
        scope: 'HVAC condenser record, electrical-service summary, and install constraints',
        window: 'Requested Aug 20',
        note: 'Quoted your condenser replacement at $7,100. Wants to verify the line set and electrical service before the install window.',
        status: 'PENDING',
        jobIds: [],
      },
    ],
    accessLog: [
      { on: 'Aug 21, 7:42 AM', who: 'Marcus Reyes · Comfort Professor', what: 'Viewed the water heater record before today’s visit' },
      { on: 'Aug 20, 4:10 PM', who: 'Apex Climate Systems', what: 'Requested access to the HVAC condenser record' },
      { on: 'Aug 19, 2:26 PM', who: 'Summit Roofing Co.', what: 'Viewed the roof record ahead of the Aug 21 visit' },
      { on: 'Mar 2024', who: 'You', what: 'Granted Comfort Professor standing access' },
    ],
    nudges: {},
    toasts: [],
  }
}

// ---------------------------------------------------------------------------
// Store plumbing

// v2: seeds gained access grants and the reconciled Aug 21 visit schedule.
const STORAGE_KEY = 'oneguard-demo-v2'
const EPHEMERAL: Array<keyof DemoState> = ['toasts', 'chatOpen', 'highlightProject']

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    const saved = JSON.parse(raw) as Partial<DemoState>
    const base = seed()
    for (const key of EPHEMERAL) delete saved[key]
    return { ...base, ...saved }
  } catch {
    return seed()
  }
}

let state: DemoState = load()
const listeners = new Set<() => void>()

function save() {
  const toSave: Record<string, unknown> = { ...state }
  for (const key of EPHEMERAL) delete toSave[key]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // storage unavailable (private mode etc.) — demo still works in-memory
  }
}

function set(patch: Partial<DemoState>) {
  state = { ...state, ...patch }
  save()
  listeners.forEach((l) => l())
}

export function useDemo(): DemoState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
  )
}

export function resetDemo() {
  localStorage.removeItem(STORAGE_KEY)
  state = seed()
  listeners.forEach((l) => l())
  toast('Demo data reset.')
}

// ---------------------------------------------------------------------------
// Role

/** Enter (or leave) a door. Routing to the role's home is the caller's job —
 *  App's guard will redirect anyway if the current route isn't reachable. */
export function setRole(role: Role | null) {
  set({ role })
}

// ---------------------------------------------------------------------------
// Property access — the permission model, owner side.

function logAccess(what: string, who = 'You') {
  set({ accessLog: [{ on: `Aug 21, ${nowTime()}`, who, what }, ...state.accessLog] })
}

export function approveAccessRequest(id: string, kind: GrantKind, windowLabel: string) {
  const grant = state.grants.find((g) => g.id === id)
  if (!grant) return
  set({
    grants: state.grants.map((g) =>
      g.id === id ? { ...g, status: 'ACTIVE' as GrantStatus, kind, window: windowLabel, decidedOn: 'Aug 21' } : g,
    ),
  })
  logAccess(`Granted ${grant.company} scoped access — ${windowLabel.charAt(0).toLowerCase()}${windowLabel.slice(1)}`)
  toast(`Access granted — ${grant.company} can now see the scoped record.`)
}

export function declineAccessRequest(id: string) {
  const grant = state.grants.find((g) => g.id === id)
  if (!grant) return
  set({ grants: state.grants.map((g) => (g.id === id ? { ...g, status: 'DECLINED' as GrantStatus, decidedOn: 'Aug 21' } : g)) })
  logAccess(`Declined ${grant.company}'s request`)
  toast(`Request declined — ${grant.company} cannot see the record.`)
}

export function revokeAccess(id: string) {
  const grant = state.grants.find((g) => g.id === id)
  if (!grant) return
  set({ grants: state.grants.map((g) => (g.id === id ? { ...g, status: 'REVOKED' as GrantStatus, decidedOn: 'Aug 21' } : g)) })
  logAccess(`Revoked ${grant.company}'s access`)
  toast(`Access revoked — the record is hidden from ${grant.company} immediately.`)
}

export function restoreAccess(id: string) {
  const grant = state.grants.find((g) => g.id === id)
  if (!grant) return
  set({ grants: state.grants.map((g) => (g.id === id ? { ...g, status: 'ACTIVE' as GrantStatus, decidedOn: 'Aug 21' } : g)) })
  logAccess(`Restored ${grant.company}'s access`)
  toast(`Access restored — ${grant.company} can see the scoped record again.`)
}

/** What a Service Pro job can actually see right now: the static demo state,
 *  overridden live by whatever the owner has done on the Access screen. */
export function effectiveJobAccess(
  job: ProJob,
  grants: AccessGrantState[],
): { access: AccessState; note: string; scope: string } {
  const grant = grants.find((g) => g.jobIds.includes(job.id))
  if (!grant || grant.status === 'ACTIVE') return { access: job.access, note: job.accessNote, scope: job.accessScope }
  return {
    access: 'PENDING',
    note: `Access revoked by the owner${grant.decidedOn ? ` ${grant.decidedOn}` : ''} — ask for a new grant`,
    scope: 'Record withheld until the owner restores access',
  }
}

// A nudge is a real event (P0-6): it lands in persisted state — so it can
// surface on an access timeline later — cools down before it can repeat, and
// can be withdrawn inside the toast's 10s undo window.
const NUDGE_COOLDOWN_MS = 10 * 60 * 1000

export function activeNudge(jobId: string, nudges: Record<string, NudgeState>): NudgeState | undefined {
  const nudge = nudges[jobId]
  if (!nudge) return undefined
  return Date.now() - nudge.sentAtMs < NUDGE_COOLDOWN_MS ? nudge : undefined
}

export function nudgeOwner(jobId: string, addr: string) {
  if (activeNudge(jobId, state.nudges)) return
  set({ nudges: { ...state.nudges, [jobId]: { sentAt: nowTime(), sentAtMs: Date.now() } } })
  toast(`Reminder sent to the owner at ${addr}.`, {
    actionLabel: 'Undo',
    onAction: () => undoNudge(jobId),
    durationMs: 10000,
  })
}

export function undoNudge(jobId: string) {
  const { [jobId]: _drop, ...rest } = state.nudges
  set({ nudges: rest })
  toast('Nudge withdrawn — the owner was not notified.')
}

// ---------------------------------------------------------------------------
// Service Pro work and Passport review

export interface JobWorkState {
  label: string
  kind: StatusKind
}

/** The one selector every surface derives a job's work state from (P0-8).
 *  The ledger, the calendar, and any future surface must agree — no view
 *  computes status independently. */
export function jobWorkState(job: ProJob, updates: PassportUpdateState[], grants: AccessGrantState[]): JobWorkState {
  const update = updates.find((u) => u.jobId === job.id)
  if (update?.status === 'PUBLISHED') return { label: 'PASSPORT UPDATED', kind: 'published' }
  if (update?.status === 'IN_REVIEW') return { label: 'IN REVIEW', kind: 'review' }
  if (update?.status === 'RETURNED') return { label: 'ACTION NEEDED', kind: 'progress' }
  if (effectiveJobAccess(job, grants).access === 'PENDING') return { label: 'ACCESS BLOCKED', kind: 'blocked' }
  if (job.stage === 'PLANNED') return { label: 'PLANNED', kind: 'planned' }
  return { label: 'READY', kind: 'ready' }
}

export function setProLens(proLens: ProLens) {
  set({ proLens })
}

export function selectProJob(id: string) {
  set({ selectedProJobId: id })
}

export function submitPassportUpdate(fields: Omit<PassportUpdateState, 'id' | 'submittedOn' | 'status'>) {
  const existing = state.passportUpdates.find((u) => u.jobId === fields.jobId && u.status !== 'PUBLISHED')
  const update: PassportUpdateState = {
    ...fields,
    id: existing?.id ?? `pro-update-${Date.now()}`,
    submittedOn: 'Aug 21, 9:06 AM',
    status: 'IN_REVIEW',
  }
  set({
    passportUpdates: existing
      ? state.passportUpdates.map((u) => (u.id === existing.id ? update : u))
      : [update, ...state.passportUpdates],
  })
  toast('Passport update sent for management review.')
}

export function approvePassportUpdate(id: string) {
  set({
    passportUpdates: state.passportUpdates.map((u) =>
      u.id === id
        ? { ...u, status: 'PUBLISHED' as PassportUpdateStatus, reviewedBy: 'Elena Brooks', reviewedOn: 'Aug 21, 9:14 AM', reviewNote: 'Approved for the property record and owner handoff.' }
        : u,
    ),
  })
  toast('Published — the update is now part of the Property Passport.', {
    actionLabel: 'Undo',
    onAction: () => unpublishPassportUpdate(id),
    durationMs: 10000,
  })
}

/** The undo window on a publish: back to review, decision fields cleared. */
export function unpublishPassportUpdate(id: string) {
  set({
    passportUpdates: state.passportUpdates.map((u) => {
      if (u.id !== id) return u
      const { reviewedBy: _by, reviewedOn: _on, reviewNote: _note, ...rest } = u
      return { ...rest, status: 'IN_REVIEW' as PassportUpdateStatus }
    }),
  })
  toast('Publish undone — the update is back in management review.')
}

export function returnPassportUpdate(id: string, reviewNote: string) {
  set({
    passportUpdates: state.passportUpdates.map((u) =>
      u.id === id
        ? { ...u, status: 'RETURNED' as PassportUpdateStatus, reviewedBy: 'Elena Brooks', reviewedOn: 'Aug 21, 9:14 AM', reviewNote }
        : u,
    ),
  })
  toast('Returned to the technician with a review note.')
}

// ---------------------------------------------------------------------------
// Toasts

let toastId = 0
export function toast(text: string, opts?: { actionLabel: string; onAction: () => void; durationMs?: number }) {
  const id = ++toastId
  set({ toasts: [...state.toasts, { id, text, actionLabel: opts?.actionLabel, onAction: opts?.onAction }] })
  setTimeout(() => set({ toasts: state.toasts.filter((t) => t.id !== id) }), opts?.durationMs ?? 4000)
}

export function dismissToast(id: number) {
  set({ toasts: state.toasts.filter((t) => t.id !== id) })
}

// ---------------------------------------------------------------------------
// Helpers

export function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function nowTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function taskTagClass(status: TaskStatus): TagClass {
  if (status === 'DUE SOON' || status === 'REQUESTED') return 'tag-accent'
  return 'tag-neutral'
}

export function projectTagClass(status: ProjectStatus): TagClass {
  if (status === 'ACTION NEEDED') return 'tag-outline'
  if (status === 'QUOTES IN' || status === 'REQUESTED') return 'tag-accent'
  return 'tag-neutral'
}

export function warrantyTagClass(status: WarrantyStatus): TagClass {
  if (status === 'ACTIVE') return 'tag-accent'
  if (status === 'EXPIRING') return 'tag-outline'
  return 'tag-neutral'
}

// ---------------------------------------------------------------------------
// Advisor chat

const DANA_REPLIES = [
  "On it — I'll check with the vendor and get back to you today.",
  "Good question. I'll pull the details from your Property Passport and follow up by email.",
  'I can source quotes for that from our vetted providers. Give me a day or two and you’ll have options to compare.',
  "Noted — I've added it to your file. Anything else while I have you?",
]

export function openChat() {
  set({ chatOpen: true })
}

export function closeChat() {
  set({ chatOpen: false })
}

function danaSay(text: string) {
  set({ messages: [...state.messages, { from: 'dana', text, time: nowTime() }] })
}

export function sendChat(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return
  set({ messages: [...state.messages, { from: 'you', text: trimmed, time: nowTime() }] })
  const reply = DANA_REPLIES[state.danaReplies % DANA_REPLIES.length]
  set({ danaReplies: state.danaReplies + 1 })
  setTimeout(() => danaSay(reply), 1200)
}

// ---------------------------------------------------------------------------
// Maintenance tasks

export function markTaskDone(id: string) {
  set({
    tasks: state.tasks.map((t) =>
      t.id === id ? { ...t, status: 'DONE' as TaskStatus, completedOn: todayLabel() } : t,
    ),
  })
  const task = state.tasks.find((t) => t.id === id)
  toast(`Done: ${task?.what ?? 'task'} — logged to your Property Passport.`)
}

export function reopenTask(id: string) {
  set({
    tasks: state.tasks.map((t) => {
      if (t.id !== id) return t
      const { completedOn: _drop, ...rest } = t
      return { ...rest, status: 'DUE SOON' as TaskStatus }
    }),
  })
  toast('Task reopened.')
}

// ---------------------------------------------------------------------------
// Service requests & projects

let projectSeq = 0

export interface ServiceRequest {
  title: string
  notes: string
  timing: string
  taskId?: string
}

export function requestService(req: ServiceRequest) {
  projectSeq += 1
  const project: ProjectState = {
    id: `req-${Date.now()}-${projectSeq}`,
    title: req.title,
    vendor: 'Sourcing quotes · Coordinator: Dana W.',
    status: 'REQUESTED',
    cost: 'Quotes pending',
    note: `Dana is collecting 2–3 quotes from vetted providers${req.timing ? ` (${req.timing.toLowerCase()})` : ''}. Expect options within 2 business days.`,
    stepsDone: 0,
    stepLabels: ['Requested', 'Quotes', 'Approve', 'Scheduled', 'Verified'],
  }
  set({
    projects: [project, ...state.projects],
    tasks: req.taskId
      ? state.tasks.map((t) =>
          t.id === req.taskId ? { ...t, status: 'REQUESTED' as TaskStatus, who: 'One Guard — Dana W.' } : t,
        )
      : state.tasks,
  })
  toast('Request sent — Dana will follow up within 1 business day.')
  setTimeout(
    () => danaSay(`Got your request for “${req.title}.” I'm reaching out to our top-rated providers now — quotes to you within 2 business days.`),
    900,
  )
}

export function approveRegrade() {
  set({
    projects: state.projects.map((p) =>
      p.id === 'regrade'
        ? {
            ...p,
            status: 'SCHEDULED' as ProjectStatus,
            vendor: 'GreenScape Landworks · Coordinator: Dana W.',
            note: 'Approved. GreenScape Landworks scheduled for Aug 19, 7:30 AM. Dana will verify the grade after the work.',
            stepsDone: 3,
          }
        : p,
    ),
  })
  toast('Approved — GreenScape Landworks scheduled for Aug 19.')
  setTimeout(() => danaSay('Regrading approved — I booked GreenScape for Aug 19, 7:30 AM. No need to be home; crew works outside.'), 900)
}

export function chooseQuote(projectId: string, quote: Quote) {
  set({
    projects: state.projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            status: 'SCHEDULED' as ProjectStatus,
            vendor: `${quote.vendor} · Coordinator: Dana W.`,
            cost: quote.price,
            note: `Quote approved. ${quote.timeline}. Dana will confirm the exact date and send prep notes.`,
            stepsDone: 3,
            stepLabels: ['Requested', 'Quotes (3)', 'Approved', 'Scheduled', 'Verified'],
          }
        : p,
    ),
  })
  toast(`Approved ${quote.vendor} at ${quote.price}. Dana is scheduling the install.`)
  setTimeout(() => danaSay(`Great choice — ${quote.vendor} confirmed. ${quote.timeline}; I'll send prep notes the week before.`), 900)
}

export function setHighlightProject(id: string | null) {
  set({ highlightProject: id })
}

// ---------------------------------------------------------------------------
// Warranties

export function addWarranty(fields: { item: string; provider: string; coverage: string; expires: string }) {
  const w: WarrantyState = {
    id: `w-${Date.now()}`,
    ...fields,
    status: 'ACTIVE',
    docs: [],
  }
  set({ warranties: [...state.warranties, w] })
  toast(`Warranty added: ${fields.item}. We'll track the expiration for you.`)
}

export function extendWarranty(id: string) {
  set({
    warranties: state.warranties.map((w) => {
      if (w.id !== id) return w
      const yearMatch = w.expires.match(/(\d{4})/)
      const newExpiry = yearMatch ? w.expires.replace(yearMatch[1], String(Number(yearMatch[1]) + 2)) : w.expires
      return { ...w, status: 'ACTIVE' as WarrantyStatus, expires: newExpiry }
    }),
  })
  toast('Coverage extended 24 months. Confirmation and updated terms are in your document vault.')
}

// ---------------------------------------------------------------------------
// Assessment & notifications

export function bookAssessment(slot: string) {
  set({
    assessmentSlot: slot,
    tasks: state.tasks.map((t) =>
      t.id === 'assessment' ? { ...t, detail: `74-point inspection with M. Torres — confirmed ${slot}`, status: 'SCHEDULED' as TaskStatus } : t,
    ),
  })
  toast(`Assessment confirmed: ${slot}. Calendar invite sent.`)
}

export function setNotif(patch: Partial<NotifPrefs>) {
  set({ notif: { ...state.notif, ...patch } })
}

// ---------------------------------------------------------------------------
// Portfolio

export function addProperty(fields: { addr: string; type: string }) {
  const row: PortfolioRow = {
    addr: fields.addr,
    type: fields.type,
    score: null,
    tasks: 0,
    next: 'TBD',
    flag: 'ONBOARDING',
    tagClass: 'tag-accent',
  }
  set({ portfolio: [...state.portfolio, row] })
  toast(`${fields.addr} added. First Home Health Assessment will set its score.`)
}
