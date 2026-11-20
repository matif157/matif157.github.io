import { useMemo, useState } from 'react'
import { CATEGORIES, FILTERS, STATUSES } from '../data/ecosystem'
import { searchNodes } from '../lib/graph'

const Icon = ({ path, label }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={path} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <title>{label}</title>
  </svg>
)

export function SearchPanel({ nodes, onSelect }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchNodes(nodes, query), [nodes, query])

  return (
    <div className="c-search">
      <div className="c-search__field">
        <Icon path="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3" label="Search" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setQuery('')
            if (event.key === 'Enter' && results[0]) {
              onSelect(results[0].id)
              setQuery('')
            }
          }}
          placeholder="Search the constellation…"
          aria-label="Search AI providers, models, projects and technologies"
        />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
      </div>
      {query && (
        <div className="c-search__results" role="listbox">
          {results.length ? results.map((node) => (
            <button
              type="button"
              role="option"
              aria-selected="false"
              key={node.id}
              onClick={() => { onSelect(node.id); setQuery('') }}
            >
              <i style={{ background: CATEGORIES[node.type].color }} />
              <span>{node.name}</span>
              <small>{CATEGORIES[node.type].label}</small>
            </button>
          )) : <p>No matches in the ecosystem.</p>}
        </div>
      )}
    </div>
  )
}

export function FilterBar({ active, onChange }) {
  return (
    <div className="c-filters" role="group" aria-label="Filter graph categories">
      {FILTERS.map((filter) => (
        <button
          type="button"
          key={filter.id}
          className={active === filter.id ? 'is-active' : ''}
          onClick={() => onChange(filter.id)}
          aria-pressed={active === filter.id}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export function GraphControls({ graphRef, onExpandAll, onCollapseAll, onFullscreen, fullscreen }) {
  const call = (method) => () => graphRef.current?.[method]?.()
  return (
    <div className="c-controls" role="group" aria-label="Graph navigation controls">
      <button type="button" onClick={call('zoomIn')} title="Zoom in" aria-label="Zoom in">
        <Icon path="M12 5v14M5 12h14" label="Zoom in" />
      </button>
      <button type="button" onClick={call('zoomOut')} title="Zoom out" aria-label="Zoom out">
        <Icon path="M5 12h14" label="Zoom out" />
      </button>
      <button type="button" onClick={call('reset')} title="Reset view" aria-label="Reset view">
        <Icon path="M4 10V4h6M20 14v6h-6M4 4l6 6M20 20l-6-6" label="Reset view" />
      </button>
      <button type="button" onClick={call('centreMA')} title="Center on MA" aria-label="Center on MA">
        <Icon path="M12 3v3m0 12v3M3 12h3m12 0h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" label="Center on MA" />
      </button>
      <span className="c-controls__divider" />
      <button type="button" onClick={onExpandAll} title="Expand all branches" aria-label="Expand all branches">
        <Icon path="M8 4h11v11M19 4 5 18" label="Expand all" />
      </button>
      <button type="button" onClick={onCollapseAll} title="Collapse all branches" aria-label="Collapse all branches">
        <Icon path="M16 20H5V9M5 20 19 6" label="Collapse all" />
      </button>
      <button type="button" onClick={onFullscreen} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} aria-label="Fullscreen">
        <Icon path="M4 9V4h5M20 15v5h-5M4 4l5 5M20 20l-5-5" label="Fullscreen" />
      </button>
    </div>
  )
}

export function Legend() {
  return (
    <div className="c-legend">
      <div>
        <span className="c-legend__title">Categories</span>
        <div className="c-legend__row">
          {Object.entries(CATEGORIES).filter(([key]) => key !== 'identity').map(([key, value]) => (
            <span key={key}><i style={{ background: value.color }} />{value.label}</span>
          ))}
        </div>
      </div>
      <div>
        <span className="c-legend__title">Status</span>
        <div className="c-legend__row">
          {Object.entries(STATUSES).map(([key, value]) => (
            <span key={key}><i style={{ background: value.color }} />{value.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
