// Semantic status tags — the P0-1 replacement for tag-accent/tag-neutral on
// the Service Pro surfaces. Work state and access state are separate families
// (filled vs. outlined) drawing on the shared --status-* palette, and every
// tag carries a glyph (via CSS pseudo-content) so state never rides on colour
// alone.
import type { ReactNode } from 'react'

export type StatusKind = 'ready' | 'planned' | 'review' | 'published' | 'blocked' | 'progress'
export type StatusFamily = 'work' | 'access'

export function StatusTag({ kind, family = 'work', children }: { kind: StatusKind; family?: StatusFamily; children: ReactNode }) {
  return <span className={`tag status-tag status-${kind}${family === 'access' ? ' is-access' : ''}`}>{children}</span>
}
