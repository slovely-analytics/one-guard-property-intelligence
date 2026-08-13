import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { PHOTO_CREDIT } from '../photos'
import type { Slide } from '../photos'

const SLIDE_MS = 6500

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Crossfading property gallery with a slow Ken Burns drift.
 *
 * Auto-advances, pauses on hover/focus and when the tab is hidden, and holds
 * still (no drift, no auto-advance) for visitors who ask for reduced motion.
 */
export default function Gallery({
  slides,
  height = 380,
  style,
}: {
  slides: Slide[]
  height?: number | string
  style?: CSSProperties
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(prefersReducedMotion()).current

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  )

  useEffect(() => {
    if (reduced || paused || slides.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS)
    return () => clearInterval(id)
  }, [reduced, paused, slides.length, index])

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const active = slides[index]

  return (
    <section
      className="gallery"
      // Height goes through a custom property so the narrow-screen rules can
      // swap it for an aspect ratio without fighting inline styles.
      style={{ '--gallery-h': typeof height === 'number' ? `${height}px` : height, ...style } as CSSProperties}
      aria-roledescription="carousel"
      aria-label="Property photos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.src + i}
          className={`gallery-img${i === index ? ' is-active' : ''}${reduced ? ' is-still' : ''}${i % 2 ? ' drift-b' : ' drift-a'}`}
          src={s.src}
          alt={`${s.title} — ${s.note}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          aria-hidden={i === index ? undefined : true}
        />
      ))}
      <div className="gallery-scrim" />

      <div className="gallery-caption" key={index}>
        <span className="gallery-kicker">{active.kicker}</span>
        <strong className="gallery-title">{active.title}</strong>
        <p className="gallery-note">{active.note}</p>
      </div>

      <div className="gallery-controls">
        <button className="gallery-arrow" aria-label="Previous photo" onClick={() => go(index - 1)}>‹</button>
        <div className="gallery-dots" role="tablist">
          {slides.map((s, i) => (
            <button
              key={s.src + i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1}: ${s.title}`}
              className={`gallery-dot${i === index ? ' is-active' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button className="gallery-arrow" aria-label="Next photo" onClick={() => go(index + 1)}>›</button>
      </div>

      <a
        className="gallery-credit"
        href={PHOTO_CREDIT.sourceUrl}
        target="_blank"
        rel="noreferrer"
        title={`Photo: ${PHOTO_CREDIT.author}, ${PHOTO_CREDIT.license}`}
      >
        Photo: {PHOTO_CREDIT.author} · {PHOTO_CREDIT.license}
      </a>
    </section>
  )
}
