import { useEffect, useState } from 'react'
import SunMark from './SunMark'
import { profile } from '../data/portfolio'

const LINKS = [
  ['Models', '#models'],
  ['Work', '#work'],
  ['GitHub', '#github'],
  ['Activity', '#activity'],
  ['Contact', '#contact'],
]

export default function Navbar() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`nav${stuck ? ' is-stuck' : ''}`}>
      <div className="shell nav__inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <SunMark className="brand__mark" size={28} />
          <span className="brand__name">
            {profile.name}
            <small>{profile.role}</small>
          </span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map(([label, href]) => (
            <a className="nav__link" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav__cta">
          <span className="nav__status">
            <span className="live-dot" />
            {profile.availability}
          </span>
          <a className="btn btn--primary btn--sm" href="#contact">
            Let&rsquo;s talk
          </a>
          <button
            type="button"
            className={`nav__toggle${open ? ' is-open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
          </button>
        </div>
      </div>

      {open && (
        <nav className="nav__mobile" aria-label="Sections">
          {LINKS.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
