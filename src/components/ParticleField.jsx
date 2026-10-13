import { useEffect, useRef } from 'react'

// Ambient particle field + magic cursor, all on one canvas / render loop.
//  • A drifting constellation sits in the background.
//  • The cursor carries a soft ember aura + ring that smoothly trails it and
//    sheds twinkling "fairy-dust" sparkles as it moves.
//  • Every click pumps global "energy" that makes all particles bloom
//    (grow + brighten) and fires a localized burst + ripple.
export default function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia?.('(pointer: fine)').matches !== false

    // On-brand palette (rgba prefixes — alpha is appended per draw).
    const COLORS = [
      'rgba(224,132,63,',   // ember
      'rgba(240,168,102,',  // ember-soft
      'rgba(236,231,222,',  // cream
      'rgba(126,155,134,',  // sage
    ]
    const tint = (i) => COLORS[i % COLORS.length]
    const rand = (a, b) => a + Math.random() * (b - a)

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let energy = 0 // global bloom: clicks pump it up, it decays every frame

    const ambient = []
    const bursts = []
    const rings = []
    const sparks = [] // magic-cursor trail

    // Cursor state — `glow` chases `pointer` with a lag for a floaty feel.
    const pointer = { x: 0, y: 0, has: false }
    const glow = { x: 0, y: 0 }
    let emitX = 0
    let emitY = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Density scales with viewport area, capped for performance.
      const count = Math.max(24, Math.min(90, Math.round((w * h) / 24000)))
      ambient.length = 0
      for (let i = 0; i < count; i++) {
        ambient.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: rand(0.6, 2.2),
          vx: rand(-0.12, 0.12),
          vy: rand(-0.12, 0.12),
          a: rand(0.12, 0.5),
          c: i,
          tw: Math.random() * Math.PI * 2, // twinkle phase
        })
      }
    }

    const burst = (x, y) => {
      energy = Math.min(1.2, energy + 0.4) // pump global bloom (capped)
      const n = 14
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + rand(-0.3, 0.3)
        const sp = rand(0.6, 2.6)
        bursts.push({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          r: 0,
          rmax: rand(1.6, 4.5),
          life: 0,
          ttl: rand(45, 80),
          c: i,
        })
      }
      rings.push({ x, y, life: 0, ttl: 46 })
    }

    // Shed a few sparkles along the path the cursor just travelled.
    const trail = () => {
      const dx = pointer.x - emitX
      const dy = pointer.y - emitY
      const dist = Math.hypot(dx, dy)
      if (dist < 5) return
      const steps = Math.min(4, Math.ceil(dist / 7))
      for (let i = 0; i < steps; i++) {
        const t = i / steps
        sparks.push({
          x: emitX + dx * t + rand(-3, 3),
          y: emitY + dy * t + rand(-3, 3),
          vx: rand(-0.35, 0.35),
          vy: rand(-0.55, -0.05), // drift gently upward
          r: rand(0.6, 2),
          life: 0,
          ttl: rand(28, 60),
          tw: Math.random() * Math.PI * 2,
          c: Math.random() < 0.7 ? 1 : 2, // mostly ember-soft, some cream
        })
      }
      emitX = pointer.x
      emitY = pointer.y
    }

    const drawCursor = () => {
      glow.x += (pointer.x - glow.x) * 0.2
      glow.y += (pointer.y - glow.y) * 0.2

      const aura = 24 + energy * 46
      const g = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, aura)
      g.addColorStop(0, 'rgba(224,132,63,0.22)')
      g.addColorStop(0.5, 'rgba(224,132,63,0.07)')
      g.addColorStop(1, 'rgba(224,132,63,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(glow.x, glow.y, aura, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(224,132,63,' + (0.4 + energy * 0.3).toFixed(3) + ')'
      ctx.lineWidth = 1
      ctx.arc(glow.x, glow.y, 9 + energy * 5, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle = 'rgba(240,168,102,0.92)'
      ctx.arc(glow.x, glow.y, 2.4, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const bloom = 1 + energy * 1.9

      for (const p of ambient) {
        p.x += p.vx
        p.y += p.vy
        p.tw += 0.018
        if (p.x < -6) p.x = w + 6
        else if (p.x > w + 6) p.x = -6
        if (p.y < -6) p.y = h + 6
        else if (p.y > h + 6) p.y = -6
        const tw = 0.72 + Math.sin(p.tw) * 0.28
        ctx.beginPath()
        ctx.fillStyle = tint(p.c) + (p.a * tw * (0.85 + energy * 0.5)).toFixed(3) + ')'
        ctx.arc(p.x, p.y, p.r * bloom, 0, Math.PI * 2)
        ctx.fill()
      }

      if (finePointer && pointer.has) {
        trail()
        drawCursor()
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life++
        const t = s.life / s.ttl
        if (t >= 1) {
          sparks.splice(i, 1)
          continue
        }
        s.x += s.vx
        s.y += s.vy
        s.tw += 0.3
        const tw = 0.6 + Math.sin(s.tw) * 0.4
        ctx.beginPath()
        ctx.fillStyle = tint(s.c) + ((1 - t) * tw * 0.9).toFixed(3) + ')'
        ctx.arc(s.x, s.y, s.r * (1 - t * 0.4), 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]
        b.life++
        const t = b.life / b.ttl
        if (t >= 1) {
          bursts.splice(i, 1)
          continue
        }
        b.x += b.vx
        b.y += b.vy
        b.vx *= 0.95
        b.vy *= 0.95
        b.r = b.rmax * Math.min(1, b.life / 9) // grow in fast, then hold
        ctx.beginPath()
        ctx.fillStyle = tint(b.c) + ((1 - t) * 0.9).toFixed(3) + ')'
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i]
        rg.life++
        const t = rg.life / rg.ttl
        if (t >= 1) {
          rings.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(224,132,63,' + ((1 - t) * 0.45).toFixed(3) + ')'
        ctx.lineWidth = 1.2
        ctx.arc(rg.x, rg.y, t * 64, 0, Math.PI * 2)
        ctx.stroke()
      }

      energy *= 0.95 // ease the bloom back down
      raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      if (!pointer.has) {
        glow.x = pointer.x
        glow.y = pointer.y
        emitX = pointer.x
        emitY = pointer.y
      }
      pointer.has = true
    }
    const onEnter = () => { pointer.has = true }
    const onLeave = () => { pointer.has = false }
    const onDown = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      burst(e.clientX, e.clientY)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduce) {
      // Honor reduced motion: paint one static frame, no drift, no reactions.
      for (const p of ambient) {
        ctx.beginPath()
        ctx.fillStyle = tint(p.c) + p.a.toFixed(3) + ')'
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      return () => window.removeEventListener('resize', resize)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    document.documentElement.addEventListener('mouseenter', onEnter)
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}
