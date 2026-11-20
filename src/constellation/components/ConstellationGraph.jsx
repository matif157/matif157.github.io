import {
  forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react'
import { CATEGORIES, STATUSES } from '../data/ecosystem'
import { GRAPH_VIEWBOX } from '../lib/layout'

const VIEWBOX = GRAPH_VIEWBOX.split(' ').map(Number)
const MIN_K = 0.45
const MAX_K = 2.8

const shortLabel = (name) => name
  .replace(/[^a-zA-Z0-9 ]/g, '')
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0])
  .join('')
  .toUpperCase()

const radiusFor = (type) => (
  { identity: 46, provider: 13, project: 12, model: 9 }[type] || 9
)

function curvePath(a, b, index) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const length = Math.hypot(dx, dy) || 1
  const bend = (index % 3 - 1) * 0.1
  const cx = (a.x + b.x) / 2 - (dy / length) * length * bend
  const cy = (a.y + b.y) / 2 + (dx / length) * length * bend
  return `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`
}

const ConstellationGraph = forwardRef(function ConstellationGraph({
  data, positions, visible, selectedId, trace, reducedMotion, onSelect, focusRequest,
}, ref) {
  const svgRef = useRef(null)
  const cameraRef = useRef(null)
  const camera = useRef({ x: 0, y: 0, k: 1 })
  const pointers = useRef(new Map())
  const pan = useRef(null)
  const animation = useRef(null)
  const [hovered, setHovered] = useState(null)

  const applyCamera = useCallback(() => {
    const { x, y, k } = camera.current
    cameraRef.current?.setAttribute('transform', `translate(${x} ${y}) scale(${k})`)
  }, [])

  const animateTo = useCallback((target, duration = 520) => {
    if (animation.current) cancelAnimationFrame(animation.current)
    if (reducedMotion || duration === 0) {
      camera.current = target
      applyCamera()
      return
    }
    const from = { ...camera.current }
    const start = performance.now()
    const ease = (t) => 1 - (1 - t) ** 3
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const e = ease(t)
      camera.current = {
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        k: from.k + (target.k - from.k) * e,
      }
      applyCamera()
      if (t < 1) animation.current = requestAnimationFrame(tick)
    }
    animation.current = requestAnimationFrame(tick)
  }, [applyCamera, reducedMotion])

  const zoomAt = useCallback((factor, point) => {
    const { x, y, k } = camera.current
    const next = Math.min(MAX_K, Math.max(MIN_K, k * factor))
    if (next === k) return
    const localX = (point.x - x) / k
    const localY = (point.y - y) / k
    animateTo({ x: point.x - localX * next, y: point.y - localY * next, k: next }, 220)
  }, [animateTo])

  const centreOn = useCallback((id, scale = 1.25) => {
    const point = positions.get(id)
    if (!point) return
    animateTo({ x: -point.x * scale, y: -point.y * scale, k: scale })
  }, [animateTo, positions])

  useImperativeHandle(ref, () => ({
    zoomIn: () => zoomAt(1.25, { x: 0, y: 0 }),
    zoomOut: () => zoomAt(0.8, { x: 0, y: 0 }),
    reset: () => animateTo({ x: 0, y: 0, k: 1 }),
    centreOn,
    centreMA: () => animateTo({ x: 0, y: 0, k: 1 }),
  }), [animateTo, centreOn, zoomAt])

  useEffect(() => {
    if (!focusRequest?.nonce) return
    centreOn(focusRequest.id, focusRequest.id === 'ma' ? 1 : 1.4)
  }, [focusRequest, centreOn])

  const clientToViewBox = useCallback((event) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const matrix = svg.getScreenCTM()
    if (!matrix) return { x: 0, y: 0 }
    const mapped = point.matrixTransform(matrix.inverse())
    return { x: mapped.x, y: mapped.y }
  }, [])

  // Non-passive wheel listener so zoom does not scroll the page.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return undefined
    const onWheel = (event) => {
      event.preventDefault()
      zoomAt(event.deltaY < 0 ? 1.12 : 0.89, clientToViewBox(event))
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [clientToViewBox, zoomAt])

  const onPointerDown = (event) => {
    if (event.target.closest?.('.graph-node')) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture?.(event.pointerId)
    if (pointers.current.size === 1) {
      pan.current = { x: event.clientX, y: event.clientY }
    }
  }

  const onPointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const previous = pan.current?.pinchDistance
      if (previous && distance) zoomAt(distance / previous, clientToViewBox(event))
      pan.current = { ...(pan.current || {}), pinchDistance: distance }
      return
    }

    if (!pan.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const scale = VIEWBOX[2] / rect.width
    camera.current.x += (event.clientX - pan.current.x) * scale
    camera.current.y += (event.clientY - pan.current.y) * scale
    pan.current.x = event.clientX
    pan.current.y = event.clientY
    applyCamera()
  }

  const endPointer = (event) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size === 0) pan.current = null
    else pan.current = { pinchDistance: pan.current?.pinchDistance }
  }

  const traceEdges = useMemo(() => {
    const keys = new Set()
    for (const [source, target] of trace?.edges || []) {
      keys.add(`${source}|${target}`)
      keys.add(`${target}|${source}`)
    }
    return keys
  }, [trace])

  const traceSet = useMemo(() => new Set(trace?.nodeIds || []), [trace])
  const nodeById = useMemo(
    () => new Map(data.nodes.map((node) => [node.id, node])),
    [data.nodes],
  )
  const focusId = hovered || selectedId

  const activeEdges = useMemo(() => {
    const links = new Set()
    if (focusId) {
      for (const edge of data.edges) {
        if (edge.source === focusId || edge.target === focusId) {
          links.add(`${edge.source}|${edge.target}`)
        }
      }
    }
    return links
  }, [data.edges, focusId])

  const renderedEdges = useMemo(() => data.edges
    .filter((edge) => visible.has(edge.source) && visible.has(edge.target))
    .map((edge, index) => {
      const isTrace = traceEdges.has(`${edge.source}|${edge.target}`)
      const isActive = activeEdges.has(`${edge.source}|${edge.target}`)
      const isRelated = focusId && (edge.source === focusId || edge.target === focusId)
      const isPlanned = edge.relationship.startsWith('would') || edge.relationship.startsWith('propos')
      const sourceColor = CATEGORIES[nodeById.get(edge.source)?.type]?.color || '#558BFF'
      return {
        key: `${edge.source}-${edge.target}`,
        d: curvePath(positions.get(edge.source), positions.get(edge.target), index),
        color: isPlanned ? '#5A6480' : sourceColor,
        isTrace, isActive, isRelated, isPlanned,
      }
    }), [data.edges, nodeById, visible, positions, traceEdges, activeEdges, focusId])

  return (
    <div className="graph-stage">
      <svg
        ref={svgRef}
        className="graph-svg"
        viewBox={GRAPH_VIEWBOX}
        role="application"
        aria-label="Interactive MA intelligence constellation. Use Tab to reach nodes, Enter to select, arrow keys to pan and plus or minus to zoom."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onKeyDown={(event) => {
          const step = 60
          if (event.key === 'ArrowLeft') camera.current.x += step
          else if (event.key === 'ArrowRight') camera.current.x -= step
          else if (event.key === 'ArrowUp') camera.current.y += step
          else if (event.key === 'ArrowDown') camera.current.y -= step
          else if (event.key === '+' || event.key === '=') zoomAt(1.2, { x: 0, y: 0 })
          else if (event.key === '-') zoomAt(0.83, { x: 0, y: 0 })
          else return
          event.preventDefault()
          applyCamera()
        }}
      >
        <defs>
          <linearGradient id="ma-stroke" x1="-20" y1="-20" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#54DFFF" />
            <stop offset="50%" stopColor="#B39BFF" />
            <stop offset="100%" stopColor="#59E0B2" />
          </linearGradient>
          <radialGradient id="core-halo">
            <stop offset="0%" stopColor="#B39BFF" stopOpacity=".26" />
            <stop offset="55%" stopColor="#8178FF" stopOpacity=".08" />
            <stop offset="100%" stopColor="#080B17" stopOpacity="0" />
          </radialGradient>
          <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g className="graph-stars" aria-hidden="true">
          {Array.from({ length: 46 }, (_, i) => {
            const angle = (i / 46) * Math.PI * 2
            const distance = 250 + ((i * 97) % 480)
            return <circle key={i} cx={Math.cos(angle) * distance} cy={Math.sin(angle) * distance} r={i % 7 === 0 ? 1.5 : 0.8} />
          })}
        </g>

        <g ref={cameraRef} className="graph-camera">
          <g className="graph-orbits" aria-hidden="true">
            {[220, 330, 420, 510, 570].map((r) => (
              <circle key={r} r={r} />
            ))}
          </g>

          <g className="graph-edges" aria-hidden="true">
            {renderedEdges.map((edge) => (
              <path
                key={edge.key}
                d={edge.d}
                stroke={edge.color}
                className={[
                  'graph-edge',
                  edge.isPlanned ? 'graph-edge--planned' : '',
                  edge.isTrace ? 'graph-edge--trace' : '',
                  edge.isRelated ? 'graph-edge--related' : '',
                  focusId && !edge.isRelated && !edge.isTrace ? 'graph-edge--dim' : '',
                ].filter(Boolean).join(' ')}
              />
            ))}
          </g>

          {!reducedMotion && trace?.edges?.length > 1 && (
            <g className="graph-particles" aria-hidden="true">
              {renderedEdges.filter((edge) => edge.isTrace).slice(0, 10).map((edge, i) => (
                <circle key={`p-${edge.key}`} r="2.6" fill="#C6FF6E" opacity=".9">
                  <animateMotion dur={`${1.4 + (i % 3) * 0.35}s`} repeatCount="indefinite" path={edge.d} />
                </circle>
              ))}
            </g>
          )}

          <g className="graph-nodes">
            {data.nodes.filter((node) => visible.has(node.id)).map((node) => {
              const point = positions.get(node.id)
              const color = CATEGORIES[node.type].color
              const radius = radiusFor(node.type)
              const isIdentity = node.type === 'identity'
              const isSelected = selectedId === node.id
              const isTrace = traceSet.has(node.id)
              const isFocus = focusId === node.id
              const isDim = focusId && !isFocus && !isTrace
                && !activeEdges.has(`${focusId}|${node.id}`)
                && !activeEdges.has(`${node.id}|${focusId}`)
              const label = (
                <g
                  className={[
                    'graph-node', `graph-node--${node.type}`,
                    isSelected ? 'is-selected' : '',
                    isTrace ? 'is-trace' : '',
                    isDim ? 'is-dim' : '',
                  ].filter(Boolean).join(' ')}
                  transform={`translate(${point.x} ${point.y})`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${node.name}, ${CATEGORIES[node.type].label}, ${STATUSES[node.status].label}. ${node.description}`}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(node.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => onSelect(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(node.id)
                    }
                  }}
                >
                  <circle className="graph-node__hit" r={radius + 12} fill="transparent" />
                  <circle className="graph-node__halo" r={radius * 2.2} fill={color} />
                  {isIdentity && <circle r="74" fill="url(#core-halo)" />}
                  <circle
                    className="graph-node__core"
                    r={radius}
                    fill={isIdentity ? '#0B1020' : '#0C1326'}
                    stroke={color}
                    strokeWidth={isIdentity ? 2 : 1.6}
                  />
                  {isIdentity ? (
                    <g className="graph-node__monogram" fill="none" stroke="url(#ma-stroke)" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M-15 11 -9 -11 0 6 9 -11 15 11" strokeWidth="3.4" />
                      <path d="M-6 8 H6" strokeWidth="2.4" />
                    </g>
                  ) : (
                    <text className="graph-node__glyph" textAnchor="middle" y="3.6" fill={color}>
                      {shortLabel(node.name)}
                    </text>
                  )}
                  <circle className="graph-node__status" cx={radius - 1} cy={-radius + 1} r="3" fill={STATUSES[node.status].color} />
                  <text className={`graph-node__label${isIdentity ? ' graph-node__label--core' : ''}`} textAnchor="middle" y={radius + 20}>
                    {node.name}
                  </text>
                </g>
              )
              return label
            })}
          </g>
        </g>
      </svg>
    </div>
  )
})

export default ConstellationGraph
