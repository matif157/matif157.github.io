import { useEffect, useRef } from 'react'

/* ------------------------------------------------------------------ math */

const TAU = Math.PI * 2
const HOME = { lat: 31.42, lon: 73.08 } // Faisalabad

const HUBS = [
  { lat: 25.2, lon: 55.27 }, // Dubai
  { lat: 24.71, lon: 46.68 }, // Riyadh
  { lat: 51.51, lon: -0.13 }, // London
  { lat: 52.52, lon: 13.4 }, // Berlin
  { lat: 55.76, lon: 37.62 }, // Moscow
  { lat: 24.86, lon: 67.01 }, // Karachi
  { lat: 1.35, lon: 103.82 }, // Singapore
  { lat: 35.68, lon: 139.69 }, // Tokyo
  { lat: -33.87, lon: 151.21 }, // Sydney
  { lat: 40.71, lon: -74.0 }, // New York
  { lat: 37.77, lon: -122.42 }, // San Francisco
  { lat: 43.65, lon: -79.38 }, // Toronto
  { lat: 41.0, lon: 28.98 }, // Istanbul
  { lat: 28.61, lon: 77.21 }, // Delhi
]

const ARC_COLORS = ['#c8ff00', '#34dfaa', '#4d8dff', '#c8ff00', '#34dfaa']

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

function toVec(lat, lon) {
  const phi = (lat * Math.PI) / 180
  const theta = (lon * Math.PI) / 180
  return [Math.cos(phi) * Math.cos(theta), Math.sin(phi), Math.cos(phi) * Math.sin(theta)]
}

function buildDots(count) {
  const dots = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = i * golden
    // Deterministic jitter so the sphere never shimmers between frames.
    const jitter = Math.sin(i * 127.1 + 311.7) * 43758.5453
    const rnd = jitter - Math.floor(jitter)
    dots.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      size: 0.55 + rnd * 0.7,
      color: rnd > 0.965 ? ARC_COLORS[i % 3] : rnd > 0.93 ? ARC_COLORS[(i + 1) % 3] : '#fcfcfe',
      accent: rnd > 0.93,
    })
  }
  return dots
}

function buildArc(from, to, steps = 42) {
  const dot = clamp(from[0] * to[0] + from[1] * to[1] + from[2] * to[2], -1, 1)
  const omega = Math.acos(dot)
  const sin = Math.sin(omega) || 1e-6
  const points = []
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const a = Math.sin((1 - t) * omega) / sin
    const b = Math.sin(t * omega) / sin
    let x = from[0] * a + to[0] * b
    let y = from[1] * a + to[1] * b
    let z = from[2] * a + to[2] * b
    const len = Math.hypot(x, y, z) || 1
    const lift = 1 + 0.17 * Math.sin(Math.PI * t)
    x = (x / len) * lift
    y = (y / len) * lift
    z = (z / len) * lift
    points.push([x, y, z])
  }
  return points
}

/* --------------------------------------------------------------- component */

export default function Globe() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const homeVec = toVec(HOME.lat, HOME.lon)
    const arcs = HUBS.map((hub, i) => ({
      points: buildArc(homeVec, toVec(hub.lat, hub.lon)),
      color: ARC_COLORS[i % ARC_COLORS.length],
      speed: 0.052 + (i % 5) * 0.011,
      offset: (i * 0.137) % 1,
      width: i % 3 === 0 ? 1.1 : 0.8,
    }))

    let width = 0
    let height = 0
    let radius = 0
    let cx = 0
    let cy = 0
    let dots = []
    let frame = 0
    let last = performance.now()
    let clock = 0
    let visible = true

    function resize() {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = width / 2
      cy = height * (width < 760 ? 0.5 : 0.47)
      radius = Math.min(width * (width < 760 ? 0.55 : 0.4), height * 0.42)
      const count = Math.round(clamp((width * height) / 520, 1200, 2600))
      if (count !== dots.length) dots = buildDots(count)
      if (reduce) draw(0)
    }

    function projector(rot, tilt) {
      const cr = Math.cos(rot)
      const sr = Math.sin(rot)
      const ct = Math.cos(tilt)
      const st = Math.sin(tilt)
      return (p) => {
        const x1 = p[0] * cr - p[2] * sr
        const z1 = p[0] * sr + p[2] * cr
        const y1 = p[1]
        const y2 = y1 * ct - z1 * st
        const z2 = y1 * st + z1 * ct
        return [cx + x1 * radius, cy - y2 * radius, z2]
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height)

      // Atmosphere
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius * 1.35)
      glow.addColorStop(0, 'rgba(200,255,0,0.05)')
      glow.addColorStop(0.55, 'rgba(52,223,170,0.028)')
      glow.addColorStop(1, 'rgba(3,8,10,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.35, 0, TAU)
      ctx.fill()

      // Faint rim so the sphere reads as a sphere, not a starfield.
      ctx.globalAlpha = 0.1
      ctx.strokeStyle = '#fcfcfe'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, TAU)
      ctx.stroke()

      const rot = time * 0.055
      const tilt = -0.33
      const project = projector(rot, tilt)

      // Dotted sphere
      for (const dot of dots) {
        const [x, y, z] = project([dot.x, dot.y, dot.z])
        if (z < -0.55) continue
        const light = Math.max(0, -0.42 * dot.x + 0.6 * dot.y + 0.68 * dot.z)
        const front = z > 0
        let alpha = front ? 0.26 + 0.56 * Math.pow(z, 0.72) : 0.045 + 0.03 * (1 + z)
        alpha *= 0.7 + 0.3 * light
        if (dot.accent) alpha *= 0.95
        if (alpha < 0.02) continue
        ctx.globalAlpha = alpha
        ctx.fillStyle = dot.color
        const size = front ? dot.size * (0.8 + z * 0.7) : dot.size * 0.6
        ctx.beginPath()
        ctx.arc(x, y, size, 0, TAU)
        ctx.fill()
      }

      // Arcs — only the half facing the viewer
      ctx.lineCap = 'round'
      for (const arc of arcs) {
        const projected = arc.points.map(project)
        ctx.strokeStyle = arc.color
        ctx.lineWidth = arc.width
        ctx.globalAlpha = 0.14
        let drawing = false
        ctx.beginPath()
        for (let i = 0; i < projected.length; i += 1) {
          const [x, y, z] = projected[i]
          if (z > -0.02) {
            if (!drawing) {
              ctx.moveTo(x, y)
              drawing = true
            } else {
              ctx.lineTo(x, y)
            }
          } else if (drawing) {
            ctx.stroke()
            ctx.beginPath()
            drawing = false
          }
        }
        if (drawing) ctx.stroke()

        // A packet travelling the route
        const head = (time * arc.speed + arc.offset) % 1
        const index = clamp(Math.floor(head * (projected.length - 1)), 0, projected.length - 1)
        const [px, py, pz] = projected[index]
        if (pz > 0.02) {
          const fade = Math.sin(Math.PI * Math.min(1, head * 1.4)) * 0.9 + 0.1
          ctx.globalAlpha = 0.2 * fade
          ctx.fillStyle = arc.color
          ctx.beginPath()
          ctx.arc(px, py, 4.2, 0, TAU)
          ctx.fill()
          ctx.globalAlpha = 0.9 * fade
          ctx.beginPath()
          ctx.arc(px, py, 1.4, 0, TAU)
          ctx.fill()
        }
      }

      // Orbiting agent nodes — the API layer
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-0.24)
      ctx.globalAlpha = 0.5
      ctx.strokeStyle = 'rgba(252,252,254,0.075)'
      ctx.lineWidth = 1
      ctx.setLineDash([2, 7])
      ctx.beginPath()
      ctx.ellipse(0, 0, radius * 1.17, radius * 0.36, 0, 0, TAU)
      ctx.stroke()
      ctx.setLineDash([])

      const nodes = [
        { speed: 0.24, offset: 0.1, color: '#c8ff00' },
        { speed: -0.17, offset: 0.55, color: '#34dfaa' },
        { speed: 0.31, offset: 0.82, color: '#4d8dff' },
      ]
      for (const node of nodes) {
        const angle = time * node.speed + node.offset * TAU
        const x = Math.cos(angle) * radius * 1.17
        const y = Math.sin(angle) * radius * 0.36
        const front = Math.sin(angle) > -0.1
        ctx.globalAlpha = front ? 0.95 : 0.22
        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(x, y, front ? 2.1 : 1.5, 0, TAU)
        ctx.fill()
        ctx.globalAlpha = front ? 0.16 : 0.05
        ctx.beginPath()
        ctx.arc(x, y, front ? 7 : 5, 0, TAU)
        ctx.fill()
      }
      ctx.restore()

      // Home beacon
      const [hx, hy, hz] = project(homeVec)
      if (hz > 0) {
        const ring = (time * 0.45) % 1
        ctx.globalAlpha = (1 - ring) * 0.36
        ctx.strokeStyle = '#c8ff00'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(hx, hy, 3 + ring * radius * 0.09, 0, TAU)
        ctx.stroke()

        ctx.globalAlpha = 0.18
        ctx.fillStyle = '#c8ff00'
        ctx.beginPath()
        ctx.arc(hx, hy, 7, 0, TAU)
        ctx.fill()

        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(hx, hy, 2.2, 0, TAU)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    function loop(now) {
      if (!visible) {
        frame = 0
        return
      }
      const delta = clamp((now - last) / 1000, 0, 0.05)
      last = now
      clock += delta
      draw(clock)
      frame = requestAnimationFrame(loop)
    }

    function start() {
      if (reduce || frame) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0.02 },
    )
    visibilityObserver.observe(canvas)

    if (reduce) draw(0)
    else start()

    return () => {
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" />
}
