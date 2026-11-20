import { CATEGORIES, STATUSES } from '../data/ecosystem'
import { relationshipLabel } from '../lib/graph'

const LINK_LABELS = {
  docs: 'Documentation',
  github: 'GitHub',
  demo: 'Live demo',
}

export default function NodeInspector({ node, related, trace, onSelect, onTrace, onClose }) {
  if (!node) {
    return (
      <aside className="c-inspector c-inspector--empty" aria-label="Node inspector">
        <span className="c-inspector__eyebrow">Node inspector</span>
        <h2>Select a point in the constellation.</h2>
        <p>
          Every node is real data. Click a provider, model, project or technology to see
          what it connects to — then trace the architecture back to MA.
        </p>
        <div className="c-inspector__hint">
          <span>Scroll to zoom</span><span>Drag to pan</span><span>Tab to explore</span>
        </div>
      </aside>
    )
  }

  const category = CATEGORIES[node.type]
  const status = STATUSES[node.status]
  const links = Object.entries(node.links || {}).filter(([, url]) => Boolean(url))

  return (
    <aside className="c-inspector" aria-label={`Details for ${node.name}`}>
      <div className="c-inspector__top">
        <span className="c-inspector__eyebrow">Node inspector</span>
        <button type="button" className="c-inspector__close" onClick={onClose} aria-label="Close inspector">×</button>
      </div>

      <div className="c-inspector__badges">
        <span className="c-badge" style={{ '--badge': category.color }}>
          <i />{category.label}
        </span>
        <span className="c-badge" style={{ '--badge': status.color }}>
          <i />{status.label}
        </span>
      </div>

      <h2>{node.name}</h2>
      <p className="c-inspector__desc">{node.description}</p>

      {node.meta?.length > 0 && (
        <dl className="c-inspector__meta">
          {node.meta.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      )}

      {node.type === 'project' && (
        <button type="button" className="c-trace-button" onClick={() => onTrace(node.id)}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 18c4 0 4-12 8-12s4 12 8 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Trace the architecture
        </button>
      )}

      {trace?.path?.length > 1 && (
        <div className="c-trace-path">
          <span>Architecture path</span>
          <ol>
            {trace.path.map((id, index) => (
              <li key={`${id}-${index}`}>
                <button type="button" onClick={() => onSelect(id)}>{id === 'ma' ? 'MA' : id.replace(/-/g, ' ')}</button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {related.length > 0 && (
        <section className="c-inspector__related">
          <h3>Connected to <span>{related.length}</span></h3>
          <ul>
            {related.map(({ node: other, relationship, direction }) => (
              <li key={`${other.id}-${relationship}-${direction}`}>
                <button type="button" onClick={() => onSelect(other.id)}>
                  <i style={{ background: CATEGORIES[other.type].color }} />
                  <span className="c-related__name">{other.name}</span>
                  <span className="c-related__type">{CATEGORIES[other.type].label}</span>
                  <small>{direction === 'in' ? '← ' : '→ '}{relationshipLabel(relationship)}</small>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {links.length > 0 && (
        <div className="c-inspector__links">
          {links.map(([kind, url]) => (
            <a key={kind} href={url} target="_blank" rel="noreferrer">
              {LINK_LABELS[kind] || kind}
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}
