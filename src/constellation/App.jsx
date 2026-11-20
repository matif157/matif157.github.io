import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ecosystem, { CATEGORIES } from './data/ecosystem'
import { buildLayout } from './lib/layout'
import {
  buildAdjacency, childrenMap, deriveVisibility, getAncestors, tracePath,
} from './lib/graph'
import ConstellationGraph from './components/ConstellationGraph'
import { FilterBar, GraphControls, Legend, SearchPanel } from './components/ConstellationUI'
import NodeInspector from './components/NodeInspector'
import {
  Contact, EngineeringCapabilities, FeaturedProjects, ProfessionalBackground,
  ResearchAndExperiments, TechnologyStack,
} from './components/Sections'

const withChildren = new Set(ecosystem.nodes.map((node) => node.id))

export default function App() {
  const [filters, setFilters] = useState('all')
  const [expanded, setExpanded] = useState(() => new Set([
    'ma', ...ecosystem.nodes.filter((node) => node.type === 'project').map((node) => node.id),
  ]))
  const [selectedId, setSelectedId] = useState(null)
  const [traceData, setTraceData] = useState({ path: [], edges: [], nodeIds: [] })
  const [focusRequest, setFocusRequest] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const graphRef = useRef(null)
  const stageRef = useRef(null)

  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = (event) => setReducedMotion(event.matches)
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  const data = useMemo(() => ({
    ...ecosystem,
    nodeById: new Map(ecosystem.nodes.map((node) => [node.id, node])),
  }), [])

  const positions = useMemo(() => buildLayout(ecosystem.nodes, ecosystem.edges), [])
  const children = useMemo(() => childrenMap(ecosystem.nodes, ecosystem.edges), [])
  const parentIds = useMemo(
    () => new Set([...children.entries()].filter(([, list]) => list.length).map(([id]) => id)),
    [children],
  )
  const fullAdjacency = useMemo(() => buildAdjacency(ecosystem.nodes, ecosystem.edges), [])
  const visibility = useMemo(
    () => deriveVisibility(ecosystem.nodes, ecosystem, { filters, expanded }),
    [filters, expanded],
  )

  const adjacency = useMemo(() => {
    const edges = ecosystem.edges.filter(
      (edge) => visibility.visible.has(edge.source) && visibility.visible.has(edge.target),
    )
    return buildAdjacency(ecosystem.nodes.filter((node) => visibility.visible.has(node.id)), edges)
  }, [visibility.visible])

  const selected = selectedId ? data.nodeById.get(selectedId) : null

  const related = useMemo(() => {
    if (!selectedId) return []
    const byId = data.nodeById
    return (adjacency.get(selectedId) || []).map((link) => ({
      node: byId.get(link.id),
      relationship: link.edge.relationship,
      direction: link.direction,
    })).filter((item) => item.node)
  }, [adjacency, data.nodeById, selectedId])

  const focusNode = useCallback((id, { toggle = false } = {}) => {
    const node = data.nodeById.get(id)
    if (!node) return
    setExpanded((current) => {
      const next = new Set(current)
      if (toggle && parentIds.has(id)) {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      }
      for (const ancestor of getAncestors(ecosystem.nodes, id)) next.add(ancestor)
      return next
    })
    const categoryFilter = CATEGORIES[node.type].filter
    setFilters((current) => {
      if (current === 'all' || current === categoryFilter) return current
      if (visibility.hiddenByFilter.has(id)) return categoryFilter
      return current
    })
    setSelectedId(id)
    setTraceData({ path: [], edges: [], nodeIds: [] })
    setInspectorOpen(true)
    setFocusRequest({ id, nonce: Date.now() })
  }, [data.nodeById, parentIds, visibility.hiddenByFilter])

  const handleTrace = useCallback((id) => {
    const path = tracePath(adjacency, 'ma', id)
    const resolvedPath = path.length ? path : tracePath(fullAdjacency, 'ma', id)
    const nodeIds = new Set(resolvedPath)
    const edges = []
    for (let i = 0; i < resolvedPath.length - 1; i += 1) {
      edges.push([resolvedPath[i], resolvedPath[i + 1]])
    }

    // A trace shows the route TO the project and then its immediate stack.
    const neighbours = (fullAdjacency.get(id) || [])
      .filter((link) => !nodeIds.has(link.id))
      .slice(0, 10)
    setExpanded((current) => {
      const next = new Set(current)
      for (const link of neighbours) {
        next.add(id)
        for (const ancestor of getAncestors(ecosystem.nodes, link.id)) next.add(ancestor)
      }
      return next
    })
    for (const link of neighbours) {
      edges.push([id, link.id])
      nodeIds.add(link.id)
    }
    setTraceData({ path: resolvedPath, edges, nodeIds: [...nodeIds] })
    setFocusRequest({ id: 'ma', nonce: Date.now() })
  }, [adjacency, fullAdjacency])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
    setTraceData({ path: [], edges: [], nodeIds: [] })
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') clearSelection()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clearSelection])

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else stageRef.current?.requestFullscreen?.()
  }

  const expandAll = () => setExpanded(new Set(withChildren))
  const collapseAll = () => setExpanded(new Set(['ma']))
  const visibleCount = visibility.visible.size

  return (
    <div className="constellation-app">
      <header className="c-header">
        <a className="c-brand" href="#explore" aria-label="MA Intelligence Constellation, home">
          <img src="./ma-monogram.svg" alt="" width="34" height="34" />
          <span>
            <b>MA</b>
            <small>Intelligence Constellation</small>
          </span>
        </a>
        <nav aria-label="Primary">
          <a href="#explore">Explore</a>
          <a href="#projects">Projects</a>
          <a href="#technologies">Technologies</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="c-header__back" href="./index.html">Classic portfolio ↗</a>
      </header>

      <main>
        <section className="c-hero" id="explore">
          <div className="c-hero__copy">
            <span className="c-eyebrow">An interconnected engineering ecosystem</span>
            <h1>MA — Intelligence<br /><em>Constellation</em></h1>
            <p>
              Not a list of tools. A living map of how AI providers, models, real projects,
              languages, frameworks, data systems, cloud infrastructure and security connect
              to one origin: MA.
            </p>
            <div className="c-hero__stats">
              <span><b>{ecosystem.nodes.length}</b> nodes</span>
              <span><b>{ecosystem.edges.length}</b> relationships</span>
              <span><b>{visibleCount}</b> in view</span>
              <span><b>9</b> domains</span>
            </div>
          </div>

          <div className="c-toolbar">
            <SearchPanel nodes={ecosystem.nodes} onSelect={focusNode} />
            <FilterBar active={filters} onChange={setFilters} />
          </div>

          <div className={`c-workspace${fullscreen ? ' is-fullscreen' : ''}`} ref={stageRef}>
            <ConstellationGraph
              ref={graphRef}
              data={data}
              positions={positions}
              visible={visibility.visible}
              selectedId={selectedId}
              trace={traceData}
              reducedMotion={reducedMotion}
              onSelect={(id) => focusNode(id, { toggle: true })}
              focusRequest={focusRequest}
            />
            <div className="c-workspace__badge">
              <i /> LIVE GRAPH · {visibleCount} NODES
            </div>
            <GraphControls
              graphRef={graphRef}
              onExpandAll={expandAll}
              onCollapseAll={collapseAll}
              onFullscreen={toggleFullscreen}
              fullscreen={fullscreen}
            />
            {inspectorOpen ? (
              <NodeInspector
                node={selected}
                related={related}
                trace={traceData}
                onSelect={focusNode}
                onTrace={handleTrace}
                onClose={() => { setInspectorOpen(false); clearSelection() }}
              />
            ) : (
              <button type="button" className="c-inspector-open" onClick={() => setInspectorOpen(true)}>
                Open inspector
              </button>
            )}
          </div>

          <Legend />
        </section>

        <FeaturedProjects />
        <EngineeringCapabilities />
        <TechnologyStack nodes={ecosystem.nodes} onSelect={(id) => {
          focusNode(id)
          document.getElementById('explore')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
        }} />
        <ResearchAndExperiments nodes={ecosystem.nodes} onSelect={(id) => {
          focusNode(id)
          document.getElementById('explore')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
        }} />
        <ProfessionalBackground />
        <Contact />
      </main>

      <footer className="c-footer">
        <span>MA — Intelligence Constellation</span>
        <span>Built by Muhammad Atif · Faisalabad, PK</span>
        <a href="#explore">Back to the graph ↑</a>
      </footer>
    </div>
  )
}
