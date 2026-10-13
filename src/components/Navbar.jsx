import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/portfolio'

export default function Navbar({ tabs, active, onChange }) {
  const [scrolled, setScrolled] = useState(false)
  const btnRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  // The pill is placed instantly on first paint, then slides on later changes —
  // without this it would visibly grow from the top-left corner on load.
  const [slidable, setSlidable] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Slide the pill indicator under the active tab. Re-measure on tab change,
  // resize, and once web fonts have loaded (button widths shift then).
  useEffect(() => {
    const move = () => {
      const el = btnRefs.current[active]
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
    move()
    // Enable the slide transition only after the first position has painted.
    const raf = requestAnimationFrame(() => setSlidable(true))
    window.addEventListener('resize', move)
    if (document.fonts?.ready) document.fonts.ready.then(move)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', move)
    }
  }, [active, tabs])

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === active)
    if (e.key === 'ArrowRight') onChange(tabs[(i + 1) % tabs.length].id)
    if (e.key === 'ArrowLeft') onChange(tabs[(i - 1 + tabs.length) % tabs.length].id)
  }

  const handle = profile.name.toLowerCase().replace(/\s+/g, '.')

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <button type="button" className="brand" onClick={() => onChange(tabs[0].id)}>
        <b>$</b> {handle}
      </button>

      <div className="tabs" role="tablist" aria-label="Sections" onKeyDown={onKeyDown}>
        <span
          className={`tab-indicator${slidable ? ' slidable' : ''}`}
          style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
        />
        {tabs.map((t, i) => (
          <button
            type="button"
            key={t.id}
            id={`tab-${t.id}`}
            ref={(el) => (btnRefs.current[t.id] = el)}
            className={`tab${active === t.id ? ' active' : ''}`}
            role="tab"
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => onChange(t.id)}
          >
            <span className="tab-num">{String(i + 1).padStart(2, '0')}</span>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
