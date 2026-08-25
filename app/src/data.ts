// Fixture data extracted from the design mockup (One Guard Property Intelligence.dc.html).
// Shapes here double as a first draft of the eventual API contract.

export type TagClass = 'tag-accent' | 'tag-neutral' | 'tag-outline'

export interface Alert {
  level: string
  tagClass: TagClass
  title: string
  detail: string
  action: string
}

export interface SystemRecord {
  name: string
  model: string
  installed: string
  life: string
  cond: string
  condClass: TagClass
  warranty: string
}

export interface HistoryEntry {
  date: string
  what: string
  who: string
  cost: string
}

export interface CapitalItem {
  year: string
  what: string
  why: string
  est: string
}

export interface CategoryScore {
  cat: string
  val: number
}

export interface Finding {
  level: string
  tagClass: TagClass
  title: string
  detail: string
}

export interface MaintenanceTask {
  date: string
  season: string
  what: string
  detail: string
  who: string
  status: string
  tagClass: TagClass
  action: string
}

export interface Project {
  title: string
  vendor: string
  status: string
  tagClass: TagClass
  cost: string
  note: string
  stepsDone: number
  stepLabels: string[]
}

export interface Warranty {
  item: string
  provider: string
  coverage: string
  expires: string
  status: string
  tagClass: TagClass
  action: string
}

export interface PortfolioProperty {
  addr: string
  type: string
  score: number
  tasks: number
  next: string
  flag: string
  tagClass: TagClass
}

export interface Plan {
  name: string
  kicker: string
  price: string
  blurb: string
  primary: boolean
  cta: string
  features: string[]
}

export interface OnboardingSystem {
  name: string
  hint: string
  year: string
  status: string
  tagClass: TagClass
}

export const property = {
  address: '1847 Maple Grove Lane',
  summary: 'Single-family · Built 1998 · 2,340 sq ft · Member since 2024',
  score: 82,
  scoreDelta: '+3 SINCE 2025',
  openTasks: 4,
  openTasksNote: '2 due this month',
  systemsTracked: 14,
  systemsNote: '3 warranties active',
  nextAssessment: 'Oct 14',
}

export const alerts: Alert[] = [
  { level: 'PRIORITY', tagClass: 'tag-outline', title: 'HVAC condenser at end of expected life', detail: '18 years old (typical life 15–20). Replacement recommended before summer 2027 — est. $6,200–7,800.', action: 'Get quotes' },
  { level: 'DUE AUG 20', tagClass: 'tag-accent', title: 'Replace HVAC air filters', detail: 'MERV 11, 20×25×1 — 2 units. Last replaced May 12.', action: 'Mark done' },
  { level: 'DUE SEP 05', tagClass: 'tag-accent', title: 'Flush water heater', detail: 'Annual sediment flush extends tank life. We can send a plumber.', action: 'Schedule' },
  { level: 'UPCOMING', tagClass: 'tag-neutral', title: 'Gutter cleaning before fall', detail: 'Recommended by Oct 15 based on tree coverage.', action: 'Schedule' },
]

export const systems: SystemRecord[] = [
  { name: 'HVAC — condenser', model: 'Carrier 24ACC636', installed: '2008', life: '0–2 yrs', cond: 'AGING', condClass: 'tag-outline', warranty: 'Expired' },
  { name: 'HVAC — furnace', model: 'Carrier 59SC2B', installed: '2016', life: '8–10 yrs', cond: 'GOOD', condClass: 'tag-neutral', warranty: 'Expired' },
  { name: 'Water heater', model: 'Rheem XG50 (50 gal)', installed: '2015', life: '1–3 yrs', cond: 'AGING', condClass: 'tag-outline', warranty: 'Expired' },
  { name: 'Roof', model: 'Asphalt shingle, 30-yr', installed: '2014', life: '15+ yrs', cond: 'GOOD', condClass: 'tag-neutral', warranty: 'Mfr — 2044' },
  { name: 'Electrical panel', model: 'Square D QO 200A', installed: '1998', life: '10+ yrs', cond: 'GOOD', condClass: 'tag-neutral', warranty: '—' },
  { name: 'Refrigerator', model: 'GE Profile PVD28', installed: '2023', life: '10+ yrs', cond: 'NEW', condClass: 'tag-accent', warranty: 'GE — Mar 2028' },
  { name: 'Dishwasher', model: 'Bosch 300 Series', installed: '2022', life: '7–9 yrs', cond: 'GOOD', condClass: 'tag-neutral', warranty: 'Bosch — Jun 2027' },
]

export interface SystemDetail {
  serial: string
  specs: Array<{ label: string; value: string }>
  brief: Array<{ date: string; note: string }>
  outlook: string
  manufacturer: string
  manualUrl: string
  siteUrl: string
}

// Keyed by SystemRecord.name — drives the Passport system-record side window.
export const systemDetails: Record<string, SystemDetail> = {
  'HVAC — condenser': {
    serial: 'CN-2008-4471K',
    specs: [
      { label: 'Capacity', value: '3 ton (36,000 BTU)' },
      { label: 'Refrigerant', value: 'R-410A' },
      { label: 'Efficiency', value: '13 SEER (as installed)' },
      { label: 'Location', value: 'East side yard, concrete pad' },
    ],
    brief: [
      { date: 'Jun 2026', note: 'A/C tune-up — compressor amp draw 12% above spec; refrigerant level OK. Comfort Air Mechanical.' },
      { date: 'Jul 2025', note: 'Run capacitor replaced after intermittent hard starts. $210.' },
      { date: 'Oct 2025', note: 'Assessment flag: end of expected life; replacement budgeted in 2027 capital plan.' },
    ],
    outlook: 'Replacement project is active — quotes were sourced and the install is being coordinated by Dana. New unit should cut cooling costs ~22%.',
    manufacturer: 'Carrier',
    manualUrl: 'https://www.carrier.com/residential/en/us/products/air-conditioners/',
    siteUrl: 'https://www.carrier.com/residential/en/us/',
  },
  'HVAC — furnace': {
    serial: 'FN-2016-88231',
    specs: [
      { label: 'Capacity', value: '80,000 BTU input' },
      { label: 'Efficiency', value: '96.5% AFUE, two-stage' },
      { label: 'Fuel', value: 'Natural gas' },
      { label: 'Location', value: 'Attic, center platform' },
    ],
    brief: [
      { date: 'Nov 2025', note: 'Pre-season inspection & filter service — heat exchanger clean, ignition normal. Comfort Air Mechanical. $149.' },
      { date: 'Nov 2024', note: 'Flame sensor cleaned; blower balanced.' },
    ],
    outlook: 'On track. Heat-exchanger warranty runs through 2036; keep annual tune-ups to maintain coverage.',
    manufacturer: 'Carrier',
    manualUrl: 'https://www.carrier.com/residential/en/us/products/furnaces/',
    siteUrl: 'https://www.carrier.com/residential/en/us/',
  },
  'Water heater': {
    serial: 'WH-2015-30157',
    specs: [
      { label: 'Capacity', value: '50 gallon tank' },
      { label: 'Fuel', value: 'Natural gas, atmospheric vent' },
      { label: 'Recovery', value: '40 gal/hr @ 90°F rise' },
      { label: 'Location', value: 'Garage, drain pan installed' },
    ],
    brief: [
      { date: 'Sep 2025', note: 'Annual sediment flush; anode rod inspected — ~40% depleted.' },
      { date: 'Oct 2025', note: 'Assessment flag: reduced recovery rate from sediment buildup; annual flushing scheduled.' },
    ],
    outlook: '1–3 years of expected life left. 2028 capital plan budgets replacement — consider tankless at swap ($1,800–3,400).',
    manufacturer: 'Rheem',
    manualUrl: 'https://www.rheem.com/support/',
    siteUrl: 'https://www.rheem.com/',
  },
  'Roof': {
    serial: 'Lot #GAF-TL-14-2207',
    specs: [
      { label: 'Material', value: 'GAF Timberline HDZ, 30-yr architectural shingle' },
      { label: 'Pitch', value: '6:12, gable' },
      { label: 'Underlayment', value: 'Synthetic, ice & water shield at valleys' },
      { label: 'Penetrations', value: '2 vents, 1 chimney, 3 pipe boots' },
    ],
    brief: [
      { date: 'Mar 2026', note: 'Chimney flashing leak repaired and sealed. Summit Roofing Co. $425.' },
      { date: 'Oct 2025', note: 'Assessment: shingles in good condition, no granule loss; flashing repair verified.' },
    ],
    outlook: '15+ years of life left. Inspection & gutter repair visit confirmed for Aug 21 keeps the manufacturer warranty documentation current.',
    manufacturer: 'GAF',
    manualUrl: 'https://www.gaf.com/en-us/for-homeowners/warranties',
    siteUrl: 'https://www.gaf.com/en-us/roofing-materials/residential-roofing-materials/shingles/timberline-hdz-shingles',
  },
  'Electrical panel': {
    serial: 'SQ-D-1998-QO140',
    specs: [
      { label: 'Rating', value: '200A service' },
      { label: 'Spaces', value: '40 (6 open)' },
      { label: 'Grounding', value: 'Rod + bonded water line' },
      { label: 'Location', value: 'Garage, west wall' },
    ],
    brief: [
      { date: 'Oct 2025', note: 'Thermal scan at annual assessment — no hot spots, all terminations tight.' },
      { date: 'Oct 2024', note: 'Panel schedule re-labeled during assessment.' },
    ],
    outlook: 'Healthy. AFCI breakers for bedrooms recommended at next electrical work — noted for the 2027 plan.',
    manufacturer: 'Square D (Schneider Electric)',
    manualUrl: 'https://www.se.com/us/en/product-range/755-square-d-qo/',
    siteUrl: 'https://www.se.com/us/en/',
  },
  'Refrigerator': {
    serial: 'GE-2023-PVD28-6642',
    specs: [
      { label: 'Capacity', value: '27.9 cu ft, French door' },
      { label: 'Features', value: 'Dual ice maker, hands-free autofill' },
      { label: 'Water filter', value: 'XWFE — replace every 6 months' },
    ],
    brief: [
      { date: 'Mar 2026', note: 'Water filter replaced (DIY). Next due Sep 2026.' },
      { date: 'Mar 2023', note: 'Installed new; registered for GE parts & labor warranty through Mar 2028.' },
    ],
    outlook: 'New condition. Condenser coil cleaning recommended annually — bundled into your spring maintenance visit.',
    manufacturer: 'GE Appliances',
    manualUrl: 'https://www.geappliances.com/support/manuals/',
    siteUrl: 'https://www.geappliances.com/',
  },
  'Dishwasher': {
    serial: 'BSH-2022-63W55-118',
    specs: [
      { label: 'Model', value: 'SHEM63W55N, 300 Series' },
      { label: 'Noise', value: '44 dBA' },
      { label: 'Racks', value: '3rd rack, adjustable middle' },
    ],
    brief: [
      { date: 'Dec 2025', note: 'Drain filter cleaned (DIY); no repairs to date.' },
      { date: 'Jun 2022', note: 'Installed new; Bosch parts & labor warranty registered.' },
    ],
    outlook: 'Good condition. Extended coverage through Bosch is available before the factory warranty lapses — tracked on the Warranties page.',
    manufacturer: 'Bosch Home',
    manualUrl: 'https://www.bosch-home.com/us/service/get-support/manuals',
    siteUrl: 'https://www.bosch-home.com/us/',
  },
}

// Manufacturer support portals, matched by warranty-provider name at render time
// (a lookup, not stored state — so persisted demo data needs no migration and
// user-added warranties pick up links automatically when the provider matches).
const providerSupport: Array<{ match: RegExp; url: string }> = [
  { match: /\bGE\b/i, url: 'https://www.geappliances.com/support/' },
  { match: /bosch/i, url: 'https://www.bosch-home.com/us/service' },
  { match: /\bGAF\b/i, url: 'https://www.gaf.com/en-us/for-homeowners/warranties' },
  { match: /\bLG\b/i, url: 'https://www.lg.com/us/support' },
  { match: /carrier/i, url: 'https://www.carrier.com/residential/en/us/support/' },
  { match: /rheem/i, url: 'https://www.rheem.com/support/' },
]

export function providerSupportUrl(provider: string): string | undefined {
  return providerSupport.find((p) => p.match.test(provider))?.url
}

// Owner-manual / how-to links for DIY-able maintenance tasks, keyed by task id.
export const taskGuides: Record<string, { label: string; url: string }> = {
  filters: { label: 'Carrier filter guide', url: 'https://www.carrier.com/residential/en/us/products/furnaces/' },
  'wh-flush': { label: 'Rheem maintenance guide', url: 'https://www.rheem.com/support/' },
  furnace: { label: 'Carrier furnace care', url: 'https://www.carrier.com/residential/en/us/products/furnaces/' },
}

export const history: HistoryEntry[] = [
  { date: 'Jun 2026', what: 'A/C tune-up & refrigerant check', who: 'Comfort Air Mechanical', cost: '$189' },
  { date: 'Mar 2026', what: 'Roof flashing repair (chimney)', who: 'Summit Roofing Co.', cost: '$425' },
  { date: 'Nov 2025', what: 'Furnace inspection & filter service', who: 'Comfort Air Mechanical', cost: '$149' },
  { date: 'Oct 2025', what: 'Annual Home Health Assessment', who: 'One Guard — M. Torres', cost: 'Included' },
]

export const capital: CapitalItem[] = [
  { year: '2027', what: 'HVAC condenser replacement', why: 'End of service life; efficiency gain ~22%', est: '$6,200–7,800' },
  { year: '2028', what: 'Water heater replacement', why: 'Tank units fail at 12–15 yrs; consider tankless', est: '$1,800–3,400' },
  { year: '2031', what: 'Exterior repaint', why: 'South-facing trim showing UV wear', est: '$4,500–6,000' },
]

export const categoryScores: CategoryScore[] = [
  { cat: 'Structure & foundation', val: 92 },
  { cat: 'Roofing & exterior', val: 88 },
  { cat: 'Electrical', val: 90 },
  { cat: 'Plumbing', val: 78 },
  { cat: 'HVAC', val: 64 },
  { cat: 'Appliances', val: 81 },
]

export function scoreColor(val: number): string {
  return val >= 85 ? 'var(--color-neutral-800)' : val >= 70 ? 'var(--color-accent-500)' : 'var(--color-accent-700)'
}

export const findings: Finding[] = [
  { level: 'PRIORITY', tagClass: 'tag-outline', title: 'HVAC condenser nearing failure risk', detail: 'Compressor amp draw 12% above spec. Budget for replacement in the 2027 capital plan.' },
  { level: 'MODERATE', tagClass: 'tag-accent', title: 'Water heater sediment buildup', detail: 'Reduced recovery rate observed. Annual flushing scheduled.' },
  { level: 'MODERATE', tagClass: 'tag-accent', title: 'Minor grading issue, NE corner', detail: 'Soil slopes toward foundation. Regrade recommended within 12 months.' },
  { level: 'RESOLVED', tagClass: 'tag-neutral', title: 'Chimney flashing leak', detail: 'Repaired Mar 2026 by Summit Roofing. Verified at follow-up.' },
]

export const tasks: MaintenanceTask[] = [
  { date: 'Aug 20', season: 'Summer', what: 'Replace HVAC air filters', detail: 'MERV 11, 20×25×1 — both units', who: 'DIY (guide included)', status: 'DUE SOON', tagClass: 'tag-accent', action: 'Mark done' },
  { date: 'Aug 21', season: 'Summer', what: 'Roof inspection & gutter repair', detail: 'Summit Roofing Co. — confirmed 8:00 AM', who: 'Summit Roofing Co.', status: 'SCHEDULED', tagClass: 'tag-neutral', action: 'Details' },
  { date: 'Sep 05', season: 'Fall', what: 'Flush water heater', detail: 'Annual sediment flush', who: 'Needs vendor', status: 'DUE SOON', tagClass: 'tag-accent', action: 'Schedule' },
  { date: 'Oct 01', season: 'Fall', what: 'Gutter cleaning', detail: 'Before leaf drop; includes downspout check', who: 'Needs vendor', status: 'UPCOMING', tagClass: 'tag-neutral', action: 'Schedule' },
  { date: 'Oct 14', season: 'Fall', what: 'Annual Home Health Assessment', detail: '74-point inspection with M. Torres', who: 'One Guard', status: 'SCHEDULED', tagClass: 'tag-neutral', action: 'Details' },
  { date: 'Nov 10', season: 'Fall', what: 'Furnace tune-up', detail: 'Pre-season inspection & filter service', who: 'Comfort Air Mechanical', status: 'UPCOMING', tagClass: 'tag-neutral', action: 'Schedule' },
]

export const projects: Project[] = [
  { title: 'Roof inspection & gutter repair', vendor: 'Summit Roofing Co. · Coordinator: Dana W.', status: 'SCHEDULED', tagClass: 'tag-neutral', cost: 'Est. $480',
    note: 'Confirmed for Aug 21, 8:00 AM. Access notes shared with the crew.',
    stepsDone: 2, stepLabels: ['Requested', 'Quotes (3)', 'Approved', 'Scheduled', 'Verified'] },
  { title: 'HVAC condenser replacement', vendor: 'Sourcing quotes · Coordinator: Dana W.', status: 'QUOTES IN', tagClass: 'tag-accent', cost: '$6,200–7,800',
    note: '2 of 3 quotes received. Comparison ready for your review by Aug 15.',
    stepsDone: 1, stepLabels: ['Requested', 'Quotes (2/3)', 'Approved', 'Scheduled', 'Verified'] },
  { title: 'NE corner regrading', vendor: 'Awaiting your approval', status: 'ACTION NEEDED', tagClass: 'tag-outline', cost: '$1,150',
    note: 'GreenScape Landworks quote recommended by Dana. Approve to schedule.',
    stepsDone: 1, stepLabels: ['Requested', 'Quote ready', 'Approve', 'Scheduled', 'Verified'] },
  { title: 'Chimney flashing repair', vendor: 'Summit Roofing Co.', status: 'COMPLETED', tagClass: 'tag-neutral', cost: '$425',
    note: 'Completed Mar 2026. Verified at follow-up; added to Property Passport.',
    stepsDone: 4, stepLabels: ['Requested', 'Quotes (3)', 'Approved', 'Scheduled', 'Verified'] },
]

export const warranties: Warranty[] = [
  { item: 'Refrigerator — GE Profile', provider: 'GE Appliances', coverage: 'Parts & labor', expires: 'Mar 2028', status: 'ACTIVE', tagClass: 'tag-accent', action: 'View docs' },
  { item: 'Dishwasher — Bosch 300', provider: 'Bosch', coverage: 'Parts & labor', expires: 'Jun 2027', status: 'EXPIRING', tagClass: 'tag-outline', action: 'Extend' },
  { item: 'Roof — 30-yr shingle', provider: 'GAF (manufacturer)', coverage: 'Materials', expires: '2044', status: 'ACTIVE', tagClass: 'tag-accent', action: 'View docs' },
  { item: 'Washer/dryer — LG', provider: 'LG + extended plan', coverage: 'Full replacement', expires: 'Sep 2026', status: 'EXPIRING', tagClass: 'tag-outline', action: 'Extend' },
  { item: 'HVAC furnace — Carrier', provider: 'Carrier', coverage: 'Heat exchanger', expires: '2036', status: 'ACTIVE', tagClass: 'tag-accent', action: 'View docs' },
  { item: 'Water heater — Rheem', provider: 'Rheem', coverage: '—', expires: 'Expired 2021', status: 'EXPIRED', tagClass: 'tag-neutral', action: 'Details' },
]

export const portfolio: PortfolioProperty[] = [
  { addr: '1847 Maple Grove Ln', type: 'Single-family', score: 82, tasks: 4, next: 'Oct 14', flag: 'HVAC AGING', tagClass: 'tag-outline' },
  { addr: '220 Birchwood Ct #A–D', type: '4-plex', score: 74, tasks: 7, next: 'Sep 02', flag: 'ROOF DUE', tagClass: 'tag-outline' },
  { addr: '918 Calloway Dr', type: 'Single-family', score: 88, tasks: 1, next: 'Nov 20', flag: 'ON TRACK', tagClass: 'tag-neutral' },
  { addr: '45 Fenwick Row', type: 'Townhome', score: 91, tasks: 0, next: 'Jan 08', flag: 'ON TRACK', tagClass: 'tag-neutral' },
  { addr: '1302 Alder St', type: 'Duplex', score: 68, tasks: 6, next: 'Aug 28', flag: 'PLUMBING', tagClass: 'tag-accent' },
  { addr: '77 Quarry Ridge Rd', type: 'Single-family', score: 79, tasks: 5, next: 'Oct 30', flag: 'WATER HEATER', tagClass: 'tag-accent' },
]

export const plans: Plan[] = [
  { name: 'Passport', kicker: 'Get organized', price: '$19', blurb: 'The digital record, self-serve.', primary: false, cta: 'Choose Passport',
    features: ['Property Passport™', 'Maintenance reminders', 'Warranty tracking', 'Document vault'] },
  { name: 'Guard', kicker: 'Most popular', price: '$49', blurb: 'Proactive management with a human advisor.', primary: true, cta: 'Choose Guard',
    features: ['Everything in Passport', 'Annual Home Health Assessment', 'Property score & capital plan', 'Dedicated advisor', 'Vendor coordination'] },
  { name: 'Guard+', kicker: 'Full service', price: '$99', blurb: 'For landlords and busy owners.', primary: false, cta: 'Choose Guard+',
    features: ['Everything in Guard', 'Semi-annual assessments', 'Priority scheduling', 'Claims filed for you', 'Multi-property discount'] },
]

export const onboardingSystems: OnboardingSystem[] = [
  { name: 'HVAC', hint: 'Heating & cooling — condenser and furnace', year: '2008', status: 'ADDED', tagClass: 'tag-accent' },
  { name: 'Water heater', hint: 'Tank or tankless', year: '2015', status: 'ADDED', tagClass: 'tag-accent' },
  { name: 'Roof', hint: 'Material and last replacement', year: '2014', status: 'ADDED', tagClass: 'tag-accent' },
  { name: 'Electrical panel', hint: 'Amperage if you know it', year: '1998', status: 'ADDED', tagClass: 'tag-accent' },
  { name: 'Major appliances', hint: 'Fridge, dishwasher, washer/dryer', year: '', status: 'SKIPPED', tagClass: 'tag-neutral' },
  { name: 'Plumbing', hint: 'Supply line material, known issues', year: '', status: 'SKIPPED', tagClass: 'tag-neutral' },
]

// ---------------------------------------------------------------------------
// Service Pro — today's route.
//
// `access` is the whole trust model in one field: standing access for the
// property's primary provider, an owner-granted grant that expires with the
// job, and a request still waiting on the owner. The record is withheld until
// a grant exists — that withholding is the point, not a missing state.

export type AccessState = 'STANDING' | 'GRANTED' | 'PENDING'

export interface ProJob {
  id: string
  time: string
  addr: string
  city: string
  job: string
  detail: string
  access: AccessState
  accessNote: string
  /** What the record opens up to, once access is in place. */
  onFile: string
  /** Key into portfolioThumbs. */
  thumbKey: string
}

export const proJobs: ProJob[] = [
  {
    id: 'wh-flush',
    time: '8:00 AM',
    addr: '1847 Maple Grove Ln',
    city: 'Fort Worth, TX',
    job: 'Water heater — annual flush & inspection',
    detail: 'A+ Comfort Club visit. Owner asked about noise on start-up.',
    access: 'STANDING',
    accessNote: 'Standing access — Comfort Professor is the primary provider',
    onFile: 'Rheem 50-gal · installed 2011 · 6 visits on file, last Aug 2025',
    thumbKey: '1847 Maple Grove Ln',
  },
  {
    id: 'toilet',
    time: '10:30 AM',
    addr: '1302 Alder St',
    city: 'Fort Worth, TX',
    job: 'Toilet replacement — second floor',
    detail: 'Owner supplying the fixture. Shut-off is behind the vanity panel.',
    access: 'GRANTED',
    accessNote: 'Granted by owner Aug 19 · expires 7 days after completion',
    onFile: 'Fixtures & plumbing · 2 entries on file, incl. supply-line photos',
    thumbKey: '1302 Alder St',
  },
  {
    id: 'no-hot-water',
    time: '1:15 PM',
    addr: '77 Quarry Ridge Rd',
    city: 'Fort Worth, TX',
    job: 'No hot water — diagnostic',
    detail: 'New customer, referred by the Alder St owner.',
    access: 'PENDING',
    accessNote: 'Access requested Aug 20 · waiting on the owner',
    onFile: 'Record withheld until the owner grants access',
    thumbKey: '77 Quarry Ridge Rd',
  },
]

export function accessTagClass(access: AccessState): TagClass {
  if (access === 'GRANTED') return 'tag-accent'
  if (access === 'PENDING') return 'tag-outline'
  return 'tag-neutral'
}
