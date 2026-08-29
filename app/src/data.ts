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
  address: '42 Highland Ave',
  summary: 'Two-family · Built 1912 · 2,340 sq ft · Member since 2024',
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
  { level: 'AUG 21', tagClass: 'tag-neutral', title: 'Flush water heater', detail: 'Scheduled — Comfort Professor, Marcus Reyes at 8:00 AM.', action: 'Details' },
  { level: 'UPCOMING', tagClass: 'tag-neutral', title: 'Gutter cleaning before fall', detail: 'Recommended by Oct 15 based on tree coverage.', action: 'Schedule' },
]

export const systems: SystemRecord[] = [
  { name: 'HVAC — condenser', model: 'Carrier 24ACC636', installed: '2008', life: '0–2 yrs', cond: 'AGING', condClass: 'tag-outline', warranty: 'Expired' },
  { name: 'Heating — steam boiler', model: 'Weil-McLain EG-40 (gas steam)', installed: '2016', life: '10+ yrs', cond: 'GOOD', condClass: 'tag-neutral', warranty: 'Mfr — 2036' },
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
  'Heating — steam boiler': {
    serial: 'BL-2016-88231',
    specs: [
      { label: 'Capacity', value: '117,000 BTU input, gas-fired steam' },
      { label: 'Distribution', value: 'One-pipe steam · 9 cast-iron radiators' },
      { label: 'Efficiency', value: '82.9% AFUE' },
      { label: 'Location', value: 'Basement, north wall' },
    ],
    brief: [
      { date: 'Nov 2025', note: 'Pre-season tune-up — burners cleaned, low-water cutoff tested, sight glass and pigtail cleared. Comfort Air Mechanical. $149.' },
      { date: 'Nov 2024', note: 'Boiler skimmed after surging; two radiator air vents replaced.' },
    ],
    outlook: 'On track. Heat-exchanger warranty runs through 2036; keep annual tune-ups to maintain coverage, and an annual skim keeps the steam dry.',
    manufacturer: 'Weil-McLain',
    manualUrl: 'https://www.weil-mclain.com/products/residential-boilers',
    siteUrl: 'https://www.weil-mclain.com/',
  },
  'Water heater': {
    serial: 'WH-2015-30157',
    specs: [
      { label: 'Capacity', value: '50 gallon tank' },
      { label: 'Fuel', value: 'Natural gas, atmospheric vent' },
      { label: 'Recovery', value: '40 gal/hr @ 90°F rise' },
      { label: 'Location', value: 'Basement, drain pan installed' },
    ],
    brief: [
      { date: 'Sep 2025', note: 'Annual sediment flush; anode rod inspected — ~40% depleted.' },
      { date: 'Oct 2025', note: 'Assessment flag: reduced recovery rate from sediment buildup; annual flushing scheduled.' },
    ],
    outlook: '1–3 years of expected life left. 2028 capital plan budgets replacement — consider an indirect tank fed off the boiler at swap ($1,800–3,400).',
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
  { match: /weil.?mclain/i, url: 'https://www.weil-mclain.com/support' },
]

export function providerSupportUrl(provider: string): string | undefined {
  return providerSupport.find((p) => p.match.test(provider))?.url
}

// Owner-manual / how-to links for DIY-able maintenance tasks, keyed by task id.
export const taskGuides: Record<string, { label: string; url: string }> = {
  filters: { label: 'Carrier filter guide', url: 'https://www.carrier.com/residential/en/us/products/furnaces/' },
  'wh-flush': { label: 'Rheem maintenance guide', url: 'https://www.rheem.com/support/' },
  furnace: { label: 'Weil-McLain boiler care', url: 'https://www.weil-mclain.com/homeowner-resources' },
}

export const history: HistoryEntry[] = [
  { date: 'Jun 2026', what: 'A/C tune-up & refrigerant check', who: 'Comfort Air Mechanical', cost: '$189' },
  { date: 'Mar 2026', what: 'Roof flashing repair (chimney)', who: 'Summit Roofing Co.', cost: '$425' },
  { date: 'Nov 2025', what: 'Boiler tune-up & low-water cutoff test', who: 'Comfort Air Mechanical', cost: '$149' },
  { date: 'Oct 2025', what: 'Annual Home Health Assessment', who: 'One Guard — M. Torres', cost: 'Included' },
]

export const capital: CapitalItem[] = [
  { year: '2027', what: 'HVAC condenser replacement', why: 'End of service life; heat-pump option is Mass Save rebate eligible', est: '$6,200–7,800' },
  { year: '2028', what: 'Water heater replacement', why: 'Tank units fail at 12–15 yrs; consider an indirect tank off the boiler', est: '$1,800–3,400' },
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
  { date: 'Aug 21', season: 'Summer', what: 'Flush water heater', detail: 'Comfort Professor — Marcus Reyes, confirmed 8:00 AM', who: 'Comfort Professor', status: 'SCHEDULED', tagClass: 'tag-neutral', action: 'Details' },
  { date: 'Aug 21', season: 'Summer', what: 'Roof inspection & gutter repair', detail: 'Summit Roofing Co. — confirmed 9:30 AM', who: 'Summit Roofing Co.', status: 'SCHEDULED', tagClass: 'tag-neutral', action: 'Details' },
  { date: 'Oct 01', season: 'Fall', what: 'Gutter cleaning', detail: 'Before leaf drop; includes downspout check', who: 'Needs vendor', status: 'UPCOMING', tagClass: 'tag-neutral', action: 'Schedule' },
  { date: 'Oct 14', season: 'Fall', what: 'Annual Home Health Assessment', detail: '74-point inspection with M. Torres', who: 'One Guard', status: 'SCHEDULED', tagClass: 'tag-neutral', action: 'Details' },
  { date: 'Nov 10', season: 'Fall', what: 'Boiler tune-up', detail: 'Pre-season burner service & low-water cutoff test', who: 'Comfort Air Mechanical', status: 'UPCOMING', tagClass: 'tag-neutral', action: 'Schedule' },
]

export const projects: Project[] = [
  { title: 'Roof inspection & gutter repair', vendor: 'Summit Roofing Co. · Coordinator: Dana W.', status: 'SCHEDULED', tagClass: 'tag-neutral', cost: 'Est. $480',
    note: 'Confirmed for Aug 21, 9:30 AM. Access notes shared with the crew.',
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
  { item: 'Steam boiler — Weil-McLain', provider: 'Weil-McLain', coverage: 'Heat exchanger', expires: '2036', status: 'ACTIVE', tagClass: 'tag-accent', action: 'View docs' },
  { item: 'Water heater — Rheem', provider: 'Rheem', coverage: '—', expires: 'Expired 2021', status: 'EXPIRED', tagClass: 'tag-neutral', action: 'Details' },
]

export const portfolio: PortfolioProperty[] = [
  { addr: '42 Highland Ave', type: 'Two-family', score: 82, tasks: 4, next: 'Oct 14', flag: 'HVAC AGING', tagClass: 'tag-outline' },
  { addr: '30 Winter St #1–4', type: '4-plex', score: 74, tasks: 7, next: 'Sep 02', flag: 'ROOF DUE', tagClass: 'tag-outline' },
  { addr: '7 Grove Ln', type: 'Single-family', score: 88, tasks: 1, next: 'Nov 20', flag: 'ON TRACK', tagClass: 'tag-neutral' },
  { addr: '45 Fenwick Row', type: 'Townhome', score: 91, tasks: 0, next: 'Jan 08', flag: 'ON TRACK', tagClass: 'tag-neutral' },
  { addr: '88 Chestnut St', type: 'Single-family', score: 68, tasks: 6, next: 'Aug 28', flag: 'PLUMBING', tagClass: 'tag-accent' },
  { addr: '215 Broadway #4', type: 'Condo', score: 79, tasks: 5, next: 'Oct 30', flag: 'WATER HEATER', tagClass: 'tag-accent' },
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
  { name: 'HVAC', hint: 'Heating & cooling — steam boiler and condenser', year: '2008', status: 'ADDED', tagClass: 'tag-accent' },
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
  horizon: 'TODAY' | 'WEEK' | 'MONTH'
  dateLabel: string
  time: string
  addr: string
  city: string
  job: string
  detail: string
  assignee: string
  trade: string
  stage: 'READY' | 'BLOCKED' | 'PLANNED'
  access: AccessState
  accessNote: string
  accessScope: string
  /** What the record opens up to, once access is in place. */
  onFile: string
  system: {
    name: string
    model: string
    serial: string
    installed: string
    location: string
  }
  ownerNote: string
  priorVisits: Array<{ date: string; note: string; source: string }>
  unknowns: string[]
  managementDecision: string
  /** Key into portfolioThumbs. */
  thumbKey: string
}

export const proJobs: ProJob[] = [
  {
    id: 'wh-flush',
    horizon: 'TODAY',
    dateLabel: 'Thu, Aug 21',
    time: '8:00 AM',
    addr: '42 Highland Ave',
    city: 'Somerville, MA',
    job: 'Water heater — annual flush & inspection',
    detail: 'A+ Comfort Club visit. Owner asked about noise on start-up.',
    assignee: 'Marcus Reyes',
    trade: 'Plumbing',
    stage: 'READY',
    access: 'STANDING',
    accessNote: 'Standing access — Comfort Professor is the primary provider',
    accessScope: 'Water heater record, related plumbing history, and this visit',
    onFile: 'Rheem 50-gal · installed 2015 · 6 visits on file, last Sep 2025',
    system: { name: 'Water heater', model: 'Rheem XG50 · 50 gallon', serial: 'WH-2015-30157', installed: '2015', location: 'Basement · drain pan installed' },
    ownerNote: 'A low knocking sound happens for about 20 seconds on start-up. Please tell us whether it changes the replacement timing.',
    priorVisits: [
      { date: 'Sep 2025', note: 'Annual sediment flush; anode rod inspected at roughly 40% depleted.', source: 'Comfort Air Mechanical' },
      { date: 'Oct 2025', note: 'Assessment noted reduced recovery from sediment buildup.', source: 'One Guard assessment' },
    ],
    unknowns: ['Current anode depletion', 'Whether start-up noise remains after flushing'],
    managementDecision: 'Confirm whether the existing 2028 replacement horizon should move forward.',
    thumbKey: '42 Highland Ave',
  },
  {
    id: 'toilet',
    horizon: 'TODAY',
    dateLabel: 'Thu, Aug 21',
    time: '10:30 AM',
    addr: '88 Chestnut St',
    city: 'Newton, MA',
    job: 'Toilet replacement — second floor',
    detail: 'Owner supplying the fixture. Shut-off is behind the vanity panel.',
    assignee: 'Marcus Reyes',
    trade: 'Plumbing',
    stage: 'READY',
    access: 'GRANTED',
    accessNote: 'Granted by owner Aug 19 · expires 7 days after completion',
    accessScope: 'Second-floor fixtures, supply-line evidence, and this visit',
    onFile: 'Fixtures & plumbing · 2 entries on file, incl. supply-line photos',
    system: { name: 'Second-floor toilet', model: 'Owner-supplied fixture', serial: 'Not recorded', installed: 'To be installed', location: 'Second-floor hall bath' },
    ownerNote: 'Fixture is in the garage. Preserve the existing bidet seat if it is compatible.',
    priorVisits: [{ date: 'Mar 2024', note: 'Supply valve replaced; braided line condition photographed.', source: 'Northline Plumbing' }],
    unknowns: ['Fixture model and serial', 'Bidet-seat compatibility'],
    managementDecision: 'No decision expected unless hidden damage is found.',
    thumbKey: '88 Chestnut St',
  },
  {
    id: 'no-hot-water',
    horizon: 'TODAY',
    dateLabel: 'Thu, Aug 21',
    time: '1:15 PM',
    addr: '215 Broadway #4',
    city: 'Cambridge, MA',
    job: 'No hot water — diagnostic',
    detail: 'New customer, referred by the Chestnut St owner.',
    // Marcus's stop (not Priya's) so the field Today shows the access-blocked
    // exception band on the technician's own day, per the shell artboards.
    assignee: 'Marcus Reyes',
    trade: 'Plumbing',
    stage: 'BLOCKED',
    access: 'PENDING',
    accessNote: 'Access requested Aug 20 · waiting on the owner',
    accessScope: 'Requested: water-heater record and related service history',
    onFile: 'Record withheld until the owner grants access',
    system: { name: 'Water heater', model: 'Withheld until access is granted', serial: 'Withheld', installed: 'Unknown', location: 'Unknown' },
    ownerNote: 'No owner note is visible until access is granted.',
    priorVisits: [],
    unknowns: ['Equipment identity', 'Prior failure history', 'Access location'],
    managementDecision: 'Resolve access before dispatch or proceed as a context-free diagnostic.',
    thumbKey: '215 Broadway #4',
  },
  {
    id: 'furnace-tune',
    horizon: 'WEEK',
    dateLabel: 'Mon, Aug 25',
    time: '9:00 AM',
    addr: '30 Winter St #1–4',
    city: 'Medford, MA',
    job: 'Boiler tune-ups — units 1–4',
    detail: 'Four-unit preventive visit. Unit 3 had an ignition delay last winter.',
    assignee: 'Priya Shah',
    trade: 'HVAC',
    stage: 'PLANNED',
    access: 'GRANTED',
    accessNote: 'Granted by Northgate Residential · expires Aug 29',
    accessScope: 'Heating systems and mechanical-room records for units 1–4',
    onFile: '4 gas boilers with indirect water heaters · 11 service entries · unit 3 needs follow-up evidence',
    system: { name: 'Boilers 1–4', model: 'Mixed Weil-McLain CGa series · indirect tanks', serial: 'Four records on file', installed: '2016–2019', location: 'Shared basement mechanical room' },
    ownerNote: 'Coordinate entry with the onsite manager. Begin with unit 3.',
    priorVisits: [{ date: 'Nov 2025', note: 'Unit 3 igniter cleaned after intermittent ignition delay.', source: 'Comfort Professor' }],
    unknowns: ['Whether unit 3 ignition delay returned', 'Indirect-tank anode condition for units 2 and 4'],
    managementDecision: 'Decide whether unit 3 needs a separate diagnostic appointment.',
    thumbKey: '30 Winter St #1–4',
  },
  {
    id: 'condenser-plan',
    horizon: 'MONTH',
    dateLabel: 'Tue, Sep 9',
    time: '11:00 AM',
    addr: '7 Grove Ln',
    city: 'Brookline, MA',
    job: 'Oil-to-heat-pump conversion — planning visit',
    detail: 'Confirm electrical service, outdoor-unit placement, and line-set routing before the final proposal.',
    assignee: 'Marcus Reyes',
    trade: 'HVAC',
    stage: 'PLANNED',
    access: 'STANDING',
    accessNote: 'Standing access — Comfort Professor is the primary provider',
    accessScope: 'Heating, electrical-service summary, and exterior equipment evidence',
    onFile: 'Buderus oil boiler · 26 years old · Mass Save rebate note on file',
    system: { name: 'Heating — oil boiler', model: 'Buderus G115 · oil-fired', serial: 'BD-2000-7741', installed: '2000', location: 'Basement · 275-gal oil tank in adjacent bay' },
    ownerNote: 'Owner prefers the quietest outdoor units and wants the oil tank removed in the same season as the conversion.',
    priorVisits: [{ date: 'Jun 2026', note: 'Heat-loss survey completed; Mass Save heat-pump rebate pre-approval added to the record.', source: 'Comfort Professor' }],
    unknowns: ['Electrical service headroom for two outdoor units', 'Line-set routing to the second floor'],
    managementDecision: 'Validate conversion scope and rebate paperwork before an estimate is prepared in ServiceTitan.',
    thumbKey: '7 Grove Ln',
  },
]

// ---------------------------------------------------------------------------
// Capture flow (brief §10.4) — templates, per-equipment measurement kits, and
// the owner-voice composition that turns structured taps into Passport prose.
//
// Templates are work-type shells; the *content* (shot list, tasks, readings)
// comes from the equipment's capture kit, so the A+ tune-up adapts per system.
// Only the water heater ships fully specced; other equipment stays minimal
// until ride-alongs validate the schemas (spec, open question 5).

export type CaptureTemplateId = 'tuneup' | 'diagnostic' | 'install' | 'emergency'

export interface CaptureTemplate {
  id: CaptureTemplateId
  name: string
  sub: string
}

export const captureTemplates: CaptureTemplate[] = [
  { id: 'tuneup', name: 'A+ Comfort Club · tune-up', sub: 'Shot list, tune-up tasks, and readings for this equipment' },
  { id: 'diagnostic', name: 'Diagnostic visit', sub: 'Symptom evidence and findings first' },
  { id: 'install', name: 'Replacement or install', sub: 'Before/after evidence and the new equipment record' },
  { id: 'emergency', name: 'Emergency visit', sub: 'Everything optional except one photo' },
]

/** Template pre-selected from the job's work type — one tap through for the
 *  common case, changeable when dispatch got it wrong. */
export function defaultTemplateFor(job: ProJob): CaptureTemplateId {
  const text = `${job.job} ${job.detail}`.toLowerCase()
  if (text.includes('diagnostic') || text.includes('no hot water')) return 'diagnostic'
  if (text.includes('replacement') || text.includes('install') || text.includes('conversion')) return 'install'
  if (text.includes('emergency')) return 'emergency'
  return 'tuneup'
}

export interface CaptureTask {
  id: string
  label: string
  /** The same act in the owner's record — "flushed the tank". */
  owner: string
}

export interface MeasurementField {
  id: string
  label: string
  kind: 'stepper' | 'chips'
  unit?: string
  min?: number
  max?: number
  step?: number
  /** First value a null stepper lands on. */
  start?: number
  /** Prior reading under the field — the cross-contractor record earning its
   *  keep mid-capture. */
  prior?: string
  /** Position of this field's sentence in the composed owner finding, when it
   *  differs from screen order (screen order follows the hands; prose order
   *  follows how an owner would ask). Defaults to screen order. */
  composeOrder?: number
  options?: string[]
  /** Owner-voice line per chip option. */
  ownerLines?: Record<string, string>
  /** Owner-voice line for a stepper value. */
  ownerLine?: (value: number) => string
}

export interface NextStepChip {
  id: string
  label: string
  /** Sentence fragment for the composed owner line — lowercase, no period. */
  owner: string
}

export interface EquipmentCaptureKit {
  shots: string[]
  tasks: CaptureTask[]
  materials: string[]
  measurements: MeasurementField[]
  nextSteps: NextStepChip[]
  /** Canned transcript for the simulated hold-to-talk control. */
  voiceDemo: string
}

const genericKit: EquipmentCaptureKit = {
  shots: ['Before service', 'After service', 'Model & serial label'],
  tasks: [
    { id: 'work', label: 'Completed the scheduled work', owner: 'completed the scheduled work' },
    { id: 'tested', label: 'Tested operation after service', owner: 'tested everything after the work' },
  ],
  materials: [],
  measurements: [],
  nextSteps: [
    { id: 'follow-up', label: 'Schedule a follow-up visit', owner: 'we recommend scheduling a follow-up visit' },
    { id: 'none', label: 'No action needed', owner: 'no action is needed before the next scheduled visit' },
  ],
  voiceDemo: 'Work went as planned; no surprises worth flagging for the record.',
}

// Keyed by ProJob.system.name.
export const captureKits: Record<string, EquipmentCaptureKit> = {
  'Water heater': {
    shots: ['Unit after service', 'Model & serial label', 'Anode rod', 'Drain valve'],
    tasks: [
      { id: 'flush', label: 'Flushed tank & removed sediment', owner: 'flushed the tank' },
      { id: 'anode', label: 'Inspected anode rod', owner: 'inspected the anode rod' },
      { id: 'burner', label: 'Verified burner start-up', owner: 'confirmed the burner starts cleanly' },
      { id: 'tp-valve', label: 'Checked T&P relief valve', owner: 'checked the safety relief valve' },
      { id: 'drain', label: 'Tested drain valve & cap', owner: 'tested the drain valve' },
    ],
    materials: ['Drain-hose adapter', 'Drain-valve cap'],
    measurements: [
      {
        id: 'anode-depletion', label: 'Anode depletion', kind: 'stepper',
        unit: '%', min: 0, max: 100, step: 5, start: 40, composeOrder: 2,
        prior: 'Sep 2025 reading: 40% · Comfort Air Mechanical',
        ownerLine: (v) => `The anode rod — the part that protects the tank from rust — is about ${v}% worn.`,
      },
      {
        id: 'sediment', label: 'Sediment removed', kind: 'chips', composeOrder: 1,
        options: ['Light', 'Moderate', 'Heavy'],
        ownerLines: {
          Light: 'Only light sediment came out of the tank.',
          Moderate: 'Moderate sediment was removed.',
          Heavy: 'A heavy load of sediment was removed.',
        },
      },
      {
        id: 'temp-rise', label: 'Temperature rise', kind: 'stepper',
        unit: '°F', min: 0, max: 140, step: 5, start: 70, composeOrder: 4,
        ownerLine: (v) => `The tank heats incoming water by about ${v}°F.`,
      },
    ],
    nextSteps: [
      { id: 'move-plan', label: 'Move replacement planning to 2027 (currently 2028)', owner: 'plan for replacement in 2027 rather than 2028' },
      { id: 'reinspect', label: 'Re-inspect anode at next annual visit', owner: 'we’ll check the anode again at next year’s visit' },
      { id: 'quote-now', label: 'Quote replacement now', owner: 'we’ll prepare a replacement quote for you now' },
      { id: 'none', label: 'No action needed', owner: 'no action is needed before your next annual visit' },
    ],
    voiceDemo: 'Moderate sediment came out; the knocking didn’t return after the flush.',
  },
  'Boilers 1–4': {
    shots: ['Boiler front', 'Serial plate', 'Combustion readout'],
    tasks: [
      { id: 'burners', label: 'Cleaned burners & heat exchanger', owner: 'cleaned the burners' },
      { id: 'cutoff', label: 'Tested low-water cutoff', owner: 'tested the low-water cutoff' },
      { id: 'combustion', label: 'Checked combustion readings', owner: 'checked combustion performance' },
    ],
    materials: [],
    measurements: [
      {
        id: 'co2', label: 'Combustion CO₂', kind: 'stepper',
        unit: '%', min: 0, max: 14, step: 1, start: 9,
        ownerLine: (v) => `Combustion measured a healthy ${v}% CO₂.`,
      },
    ],
    nextSteps: [
      { id: 'unit3-diag', label: 'Book a separate diagnostic for unit 3', owner: 'we recommend a separate diagnostic visit for unit 3' },
      { id: 'none', label: 'No action needed', owner: 'no action is needed before next season' },
    ],
    voiceDemo: 'Unit 3 lit clean this time; no ignition delay on three restarts.',
  },
  'Second-floor toilet': {
    shots: ['Installed fixture', 'Supply connection', 'Box label'],
    tasks: [
      { id: 'remove', label: 'Removed old fixture', owner: 'removed the old fixture' },
      { id: 'set', label: 'Set & sealed the new fixture', owner: 'set and sealed the new fixture' },
      { id: 'test', label: 'Tested supply & flush', owner: 'tested the supply line and flush' },
    ],
    materials: ['Reinforced wax ring', 'Stainless closet bolts'],
    measurements: [],
    nextSteps: [
      { id: 'photo-model', label: 'Record the installed model from the box label', owner: 'we’ll add the installed model to your record from the box label' },
      { id: 'none', label: 'No action needed', owner: 'no further work is needed' },
    ],
    voiceDemo: 'Flange was sound; the owner’s bidet seat fit the new fixture.',
  },
}

export function captureKitFor(job: ProJob): EquipmentCaptureKit {
  return captureKits[job.system.name] ?? genericKit
}

/** '8:00 AM' → minutes since midnight, for time-ordering the day's stops. */
export function timeMinutes(time: string): number {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  const hours = (Number(m[1]) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0)
  return hours * 60 + Number(m[2])
}

// The owner's instruction becomes a one-tap chip row in Findings — answering
// the customer is a tap, not a paragraph. Keyed by job id.
export const captureQuestions: Record<string, MeasurementField> = {
  'wh-flush': {
    id: 'owner-noise', label: 'Start-up noise the owner asked about', kind: 'chips', composeOrder: 3,
    options: ['Resolved', 'Persists', 'Not observed'],
    ownerLines: {
      Resolved: 'The start-up noise did not return.',
      Persists: 'The start-up noise is still present — see the next step.',
      'Not observed': 'We didn’t hear the start-up noise during this visit.',
    },
  },
}

/** Findings schema for a job: the equipment kit's fields with the owner's
 *  question spliced in ahead of the tail readings, per the Findings artboard. */
export function findingsSchemaFor(job: ProJob): MeasurementField[] {
  const kit = captureKitFor(job)
  const question = captureQuestions[job.id]
  if (!question) return kit.measurements
  const fields = [...kit.measurements]
  fields.splice(Math.min(2, fields.length), 0, question)
  return fields
}

export interface EvidenceOption {
  id: string
  /** Shot-list slot this photo satisfies (flips the chip green). */
  shot: string
  src: string
}

const photo = (name: string) => `${import.meta.env.BASE_URL}photos/${name}`

// Simulated camera roll per job — the demo stand-in for getUserMedia. The
// shutter attaches the next unattached option; the roll sheet lets you pick.
const captureEvidence: Record<string, EvidenceOption[]> = {
  'wh-flush': [
    { id: 'unit', shot: 'Unit after service', src: photo('sys-water-heater.jpg') },
    { id: 'label', shot: 'Model & serial label', src: photo('sys-wh-label.jpg') },
  ],
  'furnace-tune': [
    { id: 'front', shot: 'Boiler front', src: photo('sys-furnace.jpg') },
    { id: 'plate', shot: 'Serial plate', src: photo('sys-wh-label.jpg') },
    { id: 'combustion', shot: 'Combustion readout', src: photo('sys-panel-open.jpg') },
  ],
  toilet: [
    { id: 'fixture', shot: 'Installed fixture', src: photo('sys-dishwasher.jpg') },
    { id: 'supply', shot: 'Supply connection', src: photo('sys-garage.jpg') },
  ],
}

export function captureEvidenceFor(job: ProJob): EvidenceOption[] {
  return captureEvidence[job.id] ?? [
    { id: 'before', shot: 'Before service', src: photo('sys-furnace-filter.jpg') },
    { id: 'after', shot: 'After service', src: photo('sys-condenser-service.jpg') },
  ]
}

// --- Owner-voice composition -----------------------------------------------
// Structured inputs compose the prose draft; the tech can edit any line in
// the preview before submitting.

function sentenceJoin(parts: string[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
}

export function composeWork(kit: EquipmentCaptureKit, taskIds: string[], otherWork: string): string {
  const phrases = kit.tasks.filter((t) => taskIds.includes(t.id)).map((t) => t.owner)
  const base = phrases.length ? `We ${sentenceJoin(phrases)}.` : ''
  const extra = otherWork.trim() ? ` Also: ${otherWork.trim().replace(/\.?$/, '.')}` : ''
  return `${base}${extra}`.trim() || 'No work recorded for this visit.'
}

export function composeFinding(
  job: ProJob,
  measurements: Record<string, number | string | null>,
  voiceKept: string | null,
): string {
  const lines: Array<{ order: number; text: string }> = []
  findingsSchemaFor(job).forEach((field, index) => {
    const value = measurements[field.id]
    if (value === null || value === undefined || value === '') return
    const order = field.composeOrder ?? index
    if (field.kind === 'chips' && typeof value === 'string') lines.push({ order, text: field.ownerLines?.[value] ?? `${field.label}: ${value}.` })
    if (field.kind === 'stepper' && typeof value === 'number') lines.push({ order, text: field.ownerLine?.(value) ?? `${field.label} measured ${value}${field.unit ?? ''}.` })
  })
  const ordered = lines.sort((a, b) => a.order - b.order).map((line) => line.text)
  if (voiceKept) ordered.push(voiceKept.trim().replace(/\.?$/, '.'))
  return ordered.join(' ') || 'Nothing unusual was found on this visit.'
}

export function composeNext(kit: EquipmentCaptureKit, chipIds: string[], freeText: string): string {
  if (freeText.trim()) return freeText.trim()
  const phrases = kit.nextSteps.filter((c) => chipIds.includes(c.id)).map((c) => c.owner)
  if (!phrases.length) return 'No next step is needed.'
  const joined = phrases.join('; ')
  return `${joined.charAt(0).toUpperCase()}${joined.slice(1)}.`
}

// Access-family status kinds (P0-1): standing access reads as settled/neutral,
// a job-scoped grant as an active review-coloured window, a pending request as
// the blocking condition it is.
export function accessStatusKind(access: AccessState): 'published' | 'review' | 'blocked' {
  if (access === 'GRANTED') return 'review'
  if (access === 'PENDING') return 'blocked'
  return 'published'
}

export function accessLabel(access: AccessState): string {
  if (access === 'GRANTED') return 'JOB ACCESS'
  if (access === 'PENDING') return 'ACCESS PENDING'
  return 'STANDING ACCESS'
}
