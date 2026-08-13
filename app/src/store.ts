// Reactive demo store — single source of truth shared by every screen.
// Persists to localStorage so the demo survives refresh; "Reset demo" in the footer clears it.
import { useSyncExternalStore } from 'react'
import type { TagClass } from './data'

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
}

export interface NotifPrefs {
  email: boolean
  text: boolean
  leadDays: number
}

export interface DemoState {
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
  toasts: ToastItem[]
}

function seed(): DemoState {
  return {
    tasks: [
      { id: 'filters', date: 'Aug 20', season: 'Summer', what: 'Replace HVAC air filters', detail: 'MERV 11, 20×25×1 — both units', who: 'DIY (guide included)', diy: true, status: 'DUE SOON' },
      { id: 'roof-visit', date: 'Aug 21', season: 'Summer', what: 'Roof inspection & gutter repair', detail: 'Summit Roofing Co. — confirmed 8:00 AM', who: 'Summit Roofing Co.', diy: false, status: 'SCHEDULED' },
      { id: 'wh-flush', date: 'Sep 05', season: 'Fall', what: 'Flush water heater', detail: 'Annual sediment flush', who: 'Needs vendor', diy: false, status: 'DUE SOON' },
      { id: 'gutters', date: 'Oct 01', season: 'Fall', what: 'Gutter cleaning', detail: 'Before leaf drop; includes downspout check', who: 'Needs vendor', diy: false, status: 'UPCOMING' },
      { id: 'assessment', date: 'Oct 14', season: 'Fall', what: 'Annual Home Health Assessment', detail: '74-point inspection with M. Torres', who: 'One Guard', diy: false, status: 'SCHEDULED' },
      { id: 'furnace', date: 'Nov 10', season: 'Fall', what: 'Furnace tune-up', detail: 'Pre-season inspection & filter service', who: 'Comfort Air Mechanical', diy: false, status: 'UPCOMING' },
    ],
    projects: [
      { id: 'roof', title: 'Roof inspection & gutter repair', vendor: 'Summit Roofing Co. · Coordinator: Dana W.', status: 'SCHEDULED', cost: 'Est. $480',
        note: 'Confirmed for Aug 21, 8:00 AM. Access notes shared with the crew.',
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
    toasts: [],
  }
}

// ---------------------------------------------------------------------------
// Store plumbing

const STORAGE_KEY = 'oneguard-demo-v1'
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
// Toasts

let toastId = 0
export function toast(text: string) {
  const id = ++toastId
  set({ toasts: [...state.toasts, { id, text }] })
  setTimeout(() => set({ toasts: state.toasts.filter((t) => t.id !== id) }), 4000)
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
