import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/portfolio'

const MIN_MS = 1200       // keep the intro on screen long enough to read as intentional
const FAILSAFE_MS = 4500  // never trap the visitor behind the splash if a resource hangs

// A branded intro screen: a counter eases up while fonts + the window settle,
// then the panel fades and the whole curtain lifts to reveal the page.
export default function Preloader({ onReveal, onDone }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  // Keep the latest callbacks without re-running the effect (it owns one rAF loop).
  const onRevealRef = useRef(onReveal)
  const onDoneRef = useRef(onDone)
  onRevealRef.current = onReveal
  onDoneRef.current = onDone

  const [first, ...rest] = profile.name.split(' ')
  const last = rest.join(' ')

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const minMs = reduce ? 350 : MIN_MS
    const curtainMs = reduce ? 0 : 720

    let raf = 0
    let start = 0
    let ready = false
    let finished = false
    let value = 0

    const markReady = () => { ready = true }
    const failsafe = window.setTimeout(markReady, FAILSAFE_MS)

    // We're "ready" once web fonts are in (button/heading widths stop shifting)
    // and the window has fully loaded.
    const windowLoaded = new Promise((res) => {
      if (document.readyState === 'complete') res()
      else window.addEventListener('load', res, { once: true })
    })
    Promise.all([document.fonts?.ready ?? Promise.resolve(), windowLoaded]).then(markReady)

    document.body.style.overflow = 'hidden'

    const finish = () => {
      if (finished) return
      finished = true
      clearTimeout(failsafe)
      document.body.style.overflow = ''
      setProgress(100)
      setLeaving(true)
      onRevealRef.current?.()                                   // curtain begins — let the page animate in
      window.setTimeout(() => onDoneRef.current?.(), curtainMs) // then unmount once it has lifted
    }

    const tick = (now) => {
      if (!start) start = now
      const cleared = ready && now - start >= minMs
      const target = cleared ? 100 : 92
      // Ease toward the ceiling, plus a tiny constant nudge so the bar never stalls.
      value += (target - value) * 0.07 + 0.35
      if (value >= 100) value = 100
      setProgress(value)
      if (cleared && value > 99.5) finish()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
      document.body.style.overflow = ''
    }
  }, [])

  const pct = Math.min(100, Math.round(progress))

  return (
    <div
      className={`preloader${leaving ? ' done' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="pre-inner">
        <div className="pre-mark">
          <span className="pre-name">
            {first} <em>{last}</em>
          </span>
          <span className="pre-role">{profile.role}</span>
        </div>

        <div className="pre-bar" aria-hidden="true">
          <span className="pre-bar-fill" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>

        <div className="pre-meta">
          <span className="pre-status">Loading workspace</span>
          <span className="pre-pct">{String(pct).padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  )
}
