// A real 404. Unknown routes and stale ids land here instead of silently
// falling back to the landing — a link that stops working should say so.
import { roleDef } from '../roles'
import { useDemo } from '../store'

export default function NotFound({ attempted }: { attempted: string }) {
  const { role } = useDemo()
  const home = role ? roleDef(role).home : '/enter'

  return (
    <main className="page-main pro-page notfound">
      <p className="notfound-code">404</p>
      <h1>This page isn&rsquo;t in the record</h1>
      <p>
        Nothing lives at <code>#{attempted}</code>. The link may be stale, or the id it points to may no longer exist.
      </p>
      <div className="notfound-actions">
        <a className="btn btn-primary" href={`#${home}`}>{role ? 'Back to your workspace' : 'Go to the entry screen'}</a>
        {role && <a className="btn btn-secondary" href="#/enter">Change door</a>}
      </div>
    </main>
  )
}
