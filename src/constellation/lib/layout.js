/**
 * Layered force layout for the constellation.
 *
 * Category sectors give the graph a readable orbital structure; a short,
 * deterministic spring/repulsion relaxation removes overlaps and pulls
 * related nodes together. Nothing animates continuously here — the layout is
 * computed once and memoised by the renderer.
 */

const ORDER = [
  'provider', 'model', 'project', 'tool', 'language',
  'framework', 'database', 'infrastructure', 'security',
]

const RADIUS = {
  provider: 220,
  model: 330,
  project: 265,
  tool: 400,
  language: 330,
  framework: 400,
  database: 460,
  infrastructure: 510,
  security: 560,
}

function hash(value) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

export function buildLayout(nodes, edges) {
  const positions = new Map([['ma', { x: 0, y: 0 }]])
  const anchors = new Map([['ma', { x: 0, y: 0 }]])
  const sectorSize = (Math.PI * 2) / ORDER.length

  ORDER.forEach((type, sectorIndex) => {
    const group = nodes.filter((node) => node.type === type)
    const centre = -Math.PI / 2 + sectorIndex * sectorSize
    const spread = Math.min(1.1, 0.22 + group.length * 0.065)

    group.forEach((node, index) => {
      const t = group.length === 1 ? 0.5 : index / (group.length - 1)
      const jitter = (hash(node.id) - 0.5) * 0.03
      const angle = centre - spread / 2 + t * spread + jitter
      const radius = RADIUS[type] + (index % 3) * 54 + (Math.floor(index / 3) % 2) * 22
      const point = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
      positions.set(node.id, { ...point })
      anchors.set(node.id, point)
    })
  })

  const ids = nodes.map((node) => node.id).filter((id) => id !== 'ma')
  const velocity = new Map(ids.map((id) => [id, { x: 0, y: 0 }]))

  for (let iteration = 0; iteration < 64; iteration += 1) {
    const cooling = 1 - iteration / 80
    const force = new Map(ids.map((id) => [id, { x: 0, y: 0 }]))

    // Repel close neighbours so labels stay legible.
    for (let i = 0; i < ids.length; i += 1) {
      const a = positions.get(ids[i])
      for (let j = i + 1; j < ids.length; j += 1) {
        const b = positions.get(ids[j])
        let dx = a.x - b.x
        let dy = a.y - b.y
        let distance = Math.hypot(dx, dy)
        if (distance >= 76) continue
        if (distance < 0.01) {
          dx = (hash(ids[i]) - 0.5) * 2
          dy = (hash(ids[j]) - 0.5) * 2
          distance = Math.hypot(dx, dy) || 1
        }
        const push = ((76 - distance) / distance) * 0.075
        force.get(ids[i]).x += dx * push
        force.get(ids[i]).y += dy * push
        force.get(ids[j]).x -= dx * push
        force.get(ids[j]).y -= dy * push
      }
    }

    // Spring connected nodes toward a comfortable distance.
    for (const edge of edges) {
      if (edge.source === 'ma' || edge.target === 'ma') continue
      const a = positions.get(edge.source)
      const b = positions.get(edge.target)
      if (!a || !b) continue
      const dx = b.x - a.x
      const dy = b.y - a.y
      const distance = Math.hypot(dx, dy) || 1
      const desired = edge.relationship.includes('would-use') ? 190 : 164
      if (distance <= desired) continue
      const pull = ((distance - desired) / distance) * 0.014
      force.get(edge.source).x += dx * pull
      force.get(edge.source).y += dy * pull
      force.get(edge.target).x -= dx * pull
      force.get(edge.target).y -= dy * pull
    }

    // Weak anchor back to the sector keeps categories recognisable.
    for (const id of ids) {
      const current = positions.get(id)
      const anchor = anchors.get(id)
      const f = force.get(id)
      f.x += (anchor.x - current.x) * 0.016
      f.y += (anchor.y - current.y) * 0.016
    }

    for (const id of ids) {
      const v = velocity.get(id)
      const f = force.get(id)
      v.x = (v.x + f.x) * 0.72
      v.y = (v.y + f.y) * 0.72
      const point = positions.get(id)
      point.x += v.x * cooling
      point.y += v.y * cooling
    }
  }

  return positions
}

export const GRAPH_VIEWBOX = '-760 -620 1520 1240'
