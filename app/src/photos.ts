// Photo manifest for the demo property.
//
// Every image is a real, freely-licensed photograph from Wikimedia Commons by a
// single photographer (Famartin, CC BY-SA 4.0), all shot in one late-1990s
// suburban subdivision — the exterior/interior set is one house photographed on
// a single walk-around, so the "property" reads as one consistent building
// rather than a stock-photo pile-up. Files live in public/photos/.
const P = (name: string) => `${import.meta.env.BASE_URL}photos/${name}`

export interface Slide {
  src: string
  kicker: string
  title: string
  note: string
}

export const PHOTO_CREDIT = {
  author: 'Famartin',
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  sourceUrl: 'https://commons.wikimedia.org/wiki/User:Famartin',
}

// Main-page gallery: a walk around the property, then inside.
export const gallery: Slide[] = [
  {
    src: P('exterior-front.jpg'),
    kicker: 'Exterior · front',
    title: 'Southeast elevation',
    note: 'Siding, trim and porch inspected at the Oct 2025 assessment — no defects logged.',
  },
  {
    src: P('exterior-side.jpg'),
    kicker: 'Exterior · southwest',
    title: 'Garage & south wall',
    note: 'South-facing trim shows UV wear. Exterior repaint budgeted for 2031.',
  },
  {
    src: P('exterior-corner.jpg'),
    kicker: 'Exterior · northeast',
    title: 'East side yard',
    note: 'HVAC condenser sits on the concrete pad here — replacement project is active.',
  },
  {
    src: P('exterior-rear.jpg'),
    kicker: 'Exterior · rear',
    title: 'North elevation & grade',
    note: 'NE corner slopes toward the foundation. Regrading quote is awaiting your approval.',
  },
  {
    src: P('roof-view.jpg'),
    kicker: 'Roof',
    title: 'From the ridge, looking south',
    note: 'GAF Timberline HDZ, installed 2014 — 15+ years of expected life left.',
  },
  {
    src: P('living-dining.jpg'),
    kicker: 'Interior',
    title: 'Living & dining',
    note: '2,340 sq ft · built 1912 · under One Guard management since 2024.',
  },
  {
    src: P('kitchen.jpg'),
    kicker: 'Interior',
    title: 'Kitchen',
    note: 'GE Profile refrigerator and Bosch 300 dishwasher — both under active warranty.',
  },
]

// Passport header strip — same house, four angles.
export const passportStrip: Slide[] = gallery.slice(0, 4)

export interface Credit {
  author: string
  license: string
  url: string
}

// The property set is one photographer; the equipment close-ups are individually
// sourced, so each carries its own credit.
const FAMARTIN: Credit = {
  author: PHOTO_CREDIT.author,
  license: PHOTO_CREDIT.license,
  url: PHOTO_CREDIT.sourceUrl,
}
const CC = (author: string, license: string, url: string): Credit => ({ author, license, url })

export interface SystemPhoto {
  src?: string
  cap: string
  credit?: Credit
  /** object-position for tight crops, where the equipment is off-centre. */
  focus?: string
  /** background-size for row thumbnails, when the tile is too small to read
   *  without zooming in (wide panoramas, mostly). */
  thumbZoom?: string
}

// Per-system record photos, keyed by SystemRecord.name. Entries without a `src`
// render as the existing "photo coming soon" placeholder tile.
export const systemPhotos: Record<string, SystemPhoto[]> = {
  'HVAC — condenser': [
    { src: P('sys-condenser.jpg'), cap: 'Condenser — east side pad', focus: '45% 66%', credit: CC('jeffcovey', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/jeffcovey/6209852108') },
    { src: P('sys-condenser-service.jpg'), cap: 'Coil rinse — Jun 2026 tune-up', credit: CC('Phyxter Home Services', 'CC BY 2.0', 'https://www.flickr.com/photos/193557723@N06/51327327962') },
  ],
  // The boiler has no honest photo in the freely-licensed set (the furnace
  // shots read as forced-air) — placeholder tiles beat a mislabeled image.
  'Heating — steam boiler': [
    { cap: 'Boiler & near-boiler piping' },
    { cap: 'Radiator vents — 2nd floor' },
  ],
  'Water heater': [
    { src: P('sys-water-heater.jpg'), cap: 'Tank & supply lines', credit: FAMARTIN },
    { src: P('sys-wh-label.jpg'), cap: 'EnergyGuide & data plate', credit: CC('Tony Webster', 'CC BY 2.0', 'https://www.flickr.com/photos/diversey/54273678438') },
  ],
  Roof: [
    { src: P('roof-view.jpg'), cap: 'South slope from the ridge', credit: FAMARTIN },
    { src: P('sys-chimney.jpg'), cap: 'Chimney & flashing detail', credit: FAMARTIN },
  ],
  'Electrical panel': [
    { src: P('sys-panel-open.jpg'), cap: 'Breakers & schedule, cover off', credit: CC('davef3138', 'CC BY 2.0', 'https://www.flickr.com/photos/davef3138/3573729611') },
    { src: P('sys-garage.jpg'), cap: 'Location — garage, west wall', focus: '15% 42%', credit: FAMARTIN },
  ],
  Refrigerator: [
    { src: P('kitchen.jpg'), cap: 'Unit — kitchen', focus: '0% 50%', thumbZoom: '480%', credit: FAMARTIN },
    { cap: 'Model tag inside door' },
  ],
  Dishwasher: [
    { src: P('sys-dishwasher.jpg'), cap: 'Unit — kitchen, racks out', credit: CC('Editor B', 'CC BY 2.0', 'https://www.flickr.com/photos/editor/2083900935') },
    { cap: 'Model tag on door edge' },
  ],
}

/** First real photo for a system — used by list rows and the mobile app screens. */
export function systemThumb(name: string): SystemPhoto | undefined {
  return systemPhotos[name]?.find((p) => p.src)
}

/** Distinct credits for the photos actually shown, so attribution stays short. */
export function creditsFor(photos: SystemPhoto[]): Credit[] {
  const seen = new Set<string>()
  return photos.flatMap((p) => {
    if (!p.credit || seen.has(p.credit.author)) return []
    seen.add(p.credit.author)
    return [p.credit]
  })
}

// Portfolio thumbnails. The source frames are street-level shots of the same
// subdivision, so each row needs a focal point and zoom to put its building in
// the middle of an 88x64 tile.
export interface Thumb {
  src: string
  /** background-position */
  focus: string
  /** background-size */
  zoom: string
}

export const portfolioThumbs: Record<string, Thumb> = {
  '42 Highland Ave': { src: P('exterior-front.jpg'), focus: '52% 46%', zoom: '150%' },
  '30 Winter St #1–4': { src: P('prop-birchwood.jpg'), focus: '65% 47%', zoom: '300%' },
  '7 Grove Ln': { src: P('prop-calloway.jpg'), focus: '100% 32%', zoom: '500%' },
  '45 Fenwick Row': { src: P('prop-fenwick.jpg'), focus: '21% 36%', zoom: '275%' },
  '88 Chestnut St': { src: P('prop-alder.jpg'), focus: '13% 42%', zoom: '250%' },
  '215 Broadway #4': { src: P('prop-quarry.jpg'), focus: '69% 40%', zoom: '270%' },
}
