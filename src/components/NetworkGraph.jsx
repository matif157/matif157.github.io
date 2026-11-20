import { useMemo, useState } from 'react'
import buildGraph from '../data/graph'

const CX = 600
const CY = 430
const HUB_RADIUS = 170
const LEAF_RADII = [295, 400]

/** A gently bent path — an OpenRouter-style routing feel, but deterministic. */
function curve(from, to, bend) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const cx = mx - (dy / length) * length * bend
  const cy = my + (dx / length) * length * bend
  return `M${from.x},${from.y} Q${cx},${cy} ${to.x},${to.y}`
}

export default function NetworkGraph({ github }) {
  const { hubs } = useMemo(() => buildGraph(github), [github])
  const [activeId, setActiveId] = useState(null)

  const { placed, hubById, edges } = useMemo(() => {
    const list = []
    const byId = new Map()
    const allEdges = []
    const centre = { id: 'ma', x: CX, y: CY, color: '#c8ff00', isHub: false, isCore: true }

    hubs.forEach((hub, hubIndex) => {
      const angle = -Math.PI / 2 + (hubIndex * Math.PI * 2) / hubs.length
      const hx = CX + Math.cos(angle) * HUB_RADIUS
      const hy = CY + Math.sin(angle) * HUB_RADIUS
      const placedHub = { ...hub, x: hx, y: hy, angle, isHub: true }
      list.push(placedHub)
      byId.set(hub.id, placedHub)
      allEdges.push({
        id: hub.id,
        d: curve(centre, placedHub, hubIndex % 2 === 0 ? 0.11 : -0.11),
        color: hub.color,
        core: true,
      })

      const count = hub.leaves.length
      const span = Math.min(0.8, Math.max(0.24, (count - 1) * 0.19))
      hub.leaves.forEach((leaf, leafIndex) => {
        const offset = count > 1 ? -span / 2 + (leafIndex * span) / (count - 1) : 0
        const leafAngle = angle + offset
        const radius = LEAF_RADII[leafIndex % LEAF_RADII.length]
        const placedLeaf = {
          ...leaf,
          id: `${hub.id}-${leafIndex}`,
          kind: hub.kind,
          color: hub.color,
          parent: hub.id,
          x: CX + Math.cos(leafAngle) * radius,
          y: CY + Math.sin(leafAngle) * radius,
          angle: leafAngle,
          isHub: false,
        }
        list.push(placedLeaf)
        allEdges.push({
          id: placedLeaf.id,
          d: curve(placedHub, placedLeaf, leafIndex % 2 === 0 ? 0.1 : -0.1),
          color: leaf.color,
          core: false,
        })
      })
    })

    return { placed: list, hubById: byId, edges: allEdges }
  }, [hubs])

  const activeNode = placed.find((node) => node.id === activeId) || null

  const route = useMemo(() => {
    const ids = new Set(['ma'])
    let cursor = activeNode
    while (cursor?.parent) {
      ids.add(cursor.parent)
      cursor = hubById.get(cursor.parent)
    }
    if (activeNode) ids.add(activeNode.id)
    return ids
  }, [activeNode, hubById])

  const state = (id) => {
    if (!activeId) return ''
    return route.has(id) ? ' is-lit' : ' is-dim'
  }

  return (
    <div className="network" id="network">
      <div className="network__bar">
        <span className="eyebrow">The network</span>
        <span className="network__hint">
          <span className="live-dot" />
          Hover or tap a node to trace its route from MA
        </span>
      </div>

      <div className="network__scroll">
        <svg
          className="network__svg"
          viewBox="0 0 1200 860"
          role="img"
          aria-label="Network of AI models, projects, tools, languages and live data, centred on Muhammad Atif"
        >
          <defs>
            <linearGradient id="ma-gradient" x1="-40" y1="-40" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffd24a" />
              <stop offset="55%" stopColor="#e9ff3d" />
              <stop offset="100%" stopColor="#c8ff00" />
            </linearGradient>
            <radialGradient id="core-glow">
              <stop offset="0%" stopColor="rgba(200,255,0,0.16)" />
              <stop offset="60%" stopColor="rgba(52,223,170,0.06)" />
              <stop offset="100%" stopColor="rgba(3,8,10,0)" />
            </radialGradient>
          </defs>

          {/* Guide rings: the "circle" the whole network sits in. */}
          <g className="network__rings" aria-hidden="true">
            {[HUB_RADIUS, ...LEAF_RADII].map((radius, index) => (
              <circle
                key={radius}
                cx={CX}
                cy={CY}
                r={radius}
                fill="none"
                stroke="rgba(252,252,254,0.075)"
                strokeWidth="1"
                strokeDasharray={index === 0 ? 'none' : '2 9'}
              />
            ))}
            <circle cx={CX} cy={CY} r={HUB_RADIUS - 26} fill="none" stroke="rgba(200,255,0,0.045)" />
          </g>

          {/* Routes */}
          <g className="network__edges" aria-hidden="true">
            {edges.map((edge) => (
              <path
                key={edge.id}
                d={edge.d}
                className={`network__edge${edge.core ? ' network__edge--core' : ''}${state(edge.id)}`}
                stroke={edge.color}
              />
            ))}
          </g>

          {/* Nodes */}
          <g className="network__nodes">
            {placed.map((node, index) => {
              const dx = Math.cos(node.angle)
              const dy = Math.sin(node.angle)
              const textX = node.x + dx * (node.isHub ? 19 : 12)
              const textY = node.y + dy * (node.isHub ? 19 : 12) + 4
              const anchor = dx > 0.25 ? 'start' : dx < -0.25 ? 'end' : 'middle'
              const label = (
                <g
                  className={`network__node${node.isHub ? ' network__node--hub' : ''}${state(node.id)}`}
                  style={{ '--node-delay': `${(index % 9) * -0.7}s` }}
                  tabIndex={node.href ? undefined : 0}
                  role={node.href ? undefined : 'button'}
                  aria-label={`${node.label} — ${node.detail || node.kind}`}
                  onMouseEnter={() => setActiveId(node.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(node.id)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => setActiveId((current) => (current === node.id ? null : node.id))}
                >
                  <g className="network__node-float">
                    {/* Generous invisible hit area so the small dots are easy to hover/tap. */}
                    <circle cx={node.x} cy={node.y} r={node.isHub ? 24 : 17} fill="transparent" />
                    {node.isHub && (
                      <circle cx={node.x} cy={node.y} r="19" fill={node.color} opacity="0.11" className="network__halo" />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.isHub ? 7 : 4.2}
                      fill={node.color}
                      className="network__dot"
                    />
                    {node.isHub && <circle cx={node.x} cy={node.y} r="2.4" fill="#03080a" />}
                    <text
                      x={textX}
                      y={textY}
                      textAnchor={anchor}
                      className={`network__label${node.isHub ? ' network__label--hub' : ''}`}
                    >
                      {node.label}
                    </text>
                  </g>
                </g>
              )

              return node.href ? (
                <a
                  key={node.id}
                  href={node.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${node.label} — ${node.detail || node.kind}`}
                  onMouseEnter={() => setActiveId(node.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(node.id)}
                  onBlur={() => setActiveId(null)}
                >
                  {label}
                </a>
              ) : (
                <g key={node.id}>{label}</g>
              )
            })}
          </g>

          {/* Centre: an OpenRouter-style link mark carrying MA. */}
          <g className="network__core" transform={`translate(${CX},${CY})`}>
            <circle r="76" fill="url(#core-glow)" />
            <circle r="52" fill="#061013" stroke="rgba(200,255,0,0.22)" />
            <circle
              r="38"
              fill="none"
              stroke="url(#ma-gradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="184 56"
              transform="rotate(-42)"
            />
            <circle cx="-30" cy="28" r="14" fill="none" stroke="#34dfaa" strokeWidth="5" />
            <text className="network__core-text" y="9" textAnchor="middle">MA</text>
            <text className="network__core-caption" y="78" textAnchor="middle">MUHAMMAD ATIF</text>
          </g>
        </svg>
      </div>

      <div className="network__foot">
        <div className={`network__detail${activeNode ? ' is-active' : ''}`} aria-live="polite">
          {activeNode ? (
            <>
              <span className="network__detail-kind" style={{ color: activeNode.color }}>
                <i style={{ background: activeNode.color }} />
                {activeNode.kind}
              </span>
              <h3>{activeNode.label}</h3>
              <p>{activeNode.detail || 'Part of the MA network.'}</p>
              {activeNode.href && (
                <a className="link-arrow" href={activeNode.href} target="_blank" rel="noreferrer">
                  Open
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </>
          ) : (
            <>
              <span className="network__detail-kind network__detail-kind--idle">Start anywhere</span>
              <h3>Every branch leads back to MA.</h3>
              <p>AI models, projects, tools, languages and live numbers — one hub, one network.</p>
            </>
          )}
        </div>

        <div className="network__legend" aria-hidden="true">
          {[
            ['AI models', '#b18cff'],
            ['Projects', '#c8ff00'],
            ['Tools', '#4d8dff'],
            ['Languages', '#34dfaa'],
            ['Live data', '#ffab00'],
          ].map(([label, color]) => (
            <span key={label}>
              <i style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
