import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  closeChat,
  requestService,
  sendChat,
  useDemo,
} from '../store'

// ---------------------------------------------------------------------------
// Modal

export function Modal({ title, kicker, onClose, children, width = 560 }: {
  title: string
  kicker?: string
  onClose: () => void
  children: ReactNode
  width?: number
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            {kicker && <h6 style={{ color: 'var(--color-accent)', marginBottom: 4 }}>{kicker}</h6>}
            <h3 style={{ margin: 0 }}>{title}</h3>
          </div>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close" style={{ fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>
        <hr className="hr" style={{ margin: '16px 0' }} />
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Side drawer (right-hand "side window" — used for Passport system records)

export function SideDrawer({ title, kicker, onClose, children, width = 440 }: {
  title: string
  kicker?: string
  onClose: () => void
  children: ReactNode
  width?: number
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="detail-drawer" style={{ width }} role="dialog" aria-label={title}>
      <div style={{ padding: '20px 24px', borderBottom: '2px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          {kicker && <h6 style={{ color: 'var(--color-accent)', marginBottom: 2 }}>{kicker}</h6>}
          <strong style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>{title}</strong>
        </div>
        <button className="btn btn-ghost" onClick={onClose} aria-label="Close" style={{ fontSize: 18, lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px' }}>{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toast host

export function ToastHost() {
  const { toasts } = useDemo()
  if (toasts.length === 0) return null
  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div key={t.id} className="toast">{t.text}</div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Advisor chat drawer

export function AdvisorChat() {
  const { chatOpen, messages } = useDemo()
  const [draft, setDraft] = useState('')
  if (!chatOpen) return null

  const send = () => {
    sendChat(draft)
    setDraft('')
  }

  return (
    <div className="chat-drawer">
      <div style={{ padding: '20px 24px', borderBottom: '2px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h6 style={{ color: 'var(--color-accent)', marginBottom: 2 }}>Your advisor</h6>
          <strong style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18 }}>Dana Whitfield</strong>
          <p className="text-muted" style={{ fontSize: 12, margin: '2px 0 0' }}>Typically replies within minutes</p>
        </div>
        <button className="btn btn-ghost" onClick={closeChat} aria-label="Close chat" style={{ fontSize: 18 }}>✕</button>
      </div>
      <div className="chat-scroll">
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === 'you' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div className={m.from === 'you' ? 'chat-bubble chat-you' : 'chat-bubble chat-dana'}>{m.text}</div>
            <div className="text-muted" style={{ fontSize: 10, marginTop: 2, textAlign: m.from === 'you' ? 'right' : 'left' }}>
              {m.from === 'dana' ? 'Dana' : 'You'}{m.time ? ` · ${m.time}` : ''}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: '2px solid var(--color-divider)', display: 'flex', gap: 8 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder="Message Dana…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          autoFocus
        />
        <button className="btn btn-primary" onClick={send} disabled={!draft.trim()}>Send</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Request-a-service modal (shared by Dashboard, Maintenance, Projects)

const fieldCol: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 }

export function RequestServiceModal({ prefillTitle = '', taskId, onClose }: {
  prefillTitle?: string
  taskId?: string
  onClose: () => void
}) {
  const [title, setTitle] = useState(prefillTitle)
  const [notes, setNotes] = useState('')
  const [timing, setTiming] = useState('Within 2 weeks')

  const submit = () => {
    if (!title.trim()) return
    requestService({ title: title.trim(), notes: notes.trim(), timing, taskId })
    onClose()
  }

  return (
    <Modal title="Request a service" kicker="Vendor coordination" onClose={onClose}>
      <p className="text-muted" style={{ fontSize: 13, margin: '0 0 20px' }}>
        Dana collects 2–3 quotes from vetted providers, you approve one, we schedule and verify the work.
      </p>
      <div style={fieldCol}>
        <div className="field">
          <label>What do you need done?</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Flush water heater" autoFocus={!prefillTitle} />
        </div>
        <div className="field">
          <label>Anything the vendor should know? (optional)</label>
          <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Access notes, symptoms, preferences…" />
        </div>
        <div className="field">
          <label>Timing</label>
          <div className="seg" style={{ width: '100%' }}>
            {['ASAP', 'Within 2 weeks', 'Flexible'].map((t) => (
              <label key={t} className="seg-opt" style={{ flex: 1 }}>
                <input type="radio" name="timing" checked={timing === t} onChange={() => setTiming(t)} />
                {t}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
        <button className="btn btn-primary" onClick={submit} disabled={!title.trim()}>Send request to Dana</button>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  )
}
