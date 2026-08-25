import type { ProLens } from '../store'
import { setProLens, useDemo } from '../store'

export function ProLensSwitch({ compact = false }: { compact?: boolean }) {
  const { proLens } = useDemo()
  const options: Array<{ id: ProLens; label: string; detail: string }> = [
    { id: 'TECHNICIAN', label: 'Technician', detail: 'Marcus Reyes' },
    { id: 'MANAGEMENT', label: 'Management', detail: 'Team operations' },
  ]

  return (
    <div className={`pro-lens ${compact ? 'is-compact' : ''}`} aria-label="Service Pro view">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="pro-lens-option"
          aria-pressed={proLens === option.id}
          onClick={() => setProLens(option.id)}
        >
          <strong>{option.label}</strong>
          {!compact && <span>{option.detail}</span>}
        </button>
      ))}
    </div>
  )
}
