import { CATEGORIES, FILTERS } from '../data/ecosystem'

export function buildAdjacency(nodes, edges) {
  const adjacency = new Map(nodes.map((node) => [node.id, []]))
  for (const edge of edges) {
    adjacency.get(edge.source)?.push({ id: edge.target, edge, direction: 'out' })
    adjacency.get(edge.target)?.push({ id: edge.source, edge, direction: 'in' })
  }
  return adjacency
}

export function childrenMap(nodes, edges) {
  const children = new Map(nodes.map((node) => [node.id, []]))
  for (const edge of edges) {
    if (children.has(edge.source)) children.get(edge.source).push(edge.target)
  }
  for (const node of nodes) {
    if (node.parent && children.has(node.parent) && !children.get(node.parent).includes(node.id)) {
      children.get(node.parent).push(node.id)
    }
  }
  return children
}

export function getAncestors(nodes, id) {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const chain = []
  let cursor = byId.get(id)
  const guard = new Set()
  while (cursor?.parent && !guard.has(cursor.parent)) {
    guard.add(cursor.parent)
    chain.push(cursor.parent)
    cursor = byId.get(cursor.parent)
  }
  return chain
}

export function deriveVisibility(nodes, data, { filters, expanded }) {
  const allowed = new Set(['identity'])
  for (const filter of FILTERS) {
    if (filters === 'all' || filter.id === filters) allowed.add(filter.id)
  }
  const visible = new Set()
  const hiddenByFilter = new Set()
  const collapsed = new Set()

  for (const node of nodes) {
    const filterKey = CATEGORIES[node.type].filter
    if (!allowed.has(filterKey)) {
      hiddenByFilter.add(node.id)
      continue
    }
    if (node.parent && !expanded.has(node.parent)) {
      collapsed.add(node.id)
      continue
    }
    visible.add(node.id)
  }

  return { visible, hiddenByFilter, collapsed }
}

/** Breadth-first shortest path, used by TRACE THE ARCHITECTURE. */
export function tracePath(adjacency, from, to) {
  if (from === to) return [from]
  if (!adjacency.has(from) || !adjacency.has(to)) return []
  const queue = [from]
  const previous = new Map([[from, null]])
  while (queue.length) {
    const current = queue.shift()
    for (const neighbour of adjacency.get(current) || []) {
      if (previous.has(neighbour.id)) continue
      previous.set(neighbour.id, current)
      if (neighbour.id === to) {
        const path = [to]
        let cursor = current
        while (cursor !== null && cursor !== undefined) {
          path.push(cursor)
          cursor = previous.get(cursor)
        }
        return path.reverse()
      }
      queue.push(neighbour.id)
    }
  }
  return []
}

export function searchNodes(nodes, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return nodes
    .filter((node) => {
      const haystack = [node.name, CATEGORIES[node.type].label, node.description, ...(node.keywords || [])]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
    .slice(0, 8)
}

export function neighboursFor(adjacency, id) {
  return (adjacency.get(id) || []).map((link) => link.id)
}

export function edgeKey(source, target) {
  return [source, target].sort().join('::')
}

export function relationshipLabel(relationship) {
  return String(relationship || 'relates to').replace(/-/g, ' ')
}
