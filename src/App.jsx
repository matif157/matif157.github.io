import { useEffect, useRef, useState } from 'react'
import Preloader from './components/Preloader'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Expertise from './components/Expertise'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { profile } from './data/portfolio'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

const PANELS = { home: Hero, about: About, expertise: Expertise, work: Work, contact: Contact }

const TITLES = {
  home: `${profile.name} — ${profile.role}`,
  about: `About — ${profile.name}`,
  expertise: `Expertise — ${profile.name}`,
  work: `Selected Work — ${profile.name}`,
  contact: `Contact — ${profile.name}`,
}

const idx = (id) => TABS.findIndex((t) => t.id === id)
const fromHash = () => {
  const h = window.location.hash.replace('#', '')
  return TABS.some((t) => t.id === h) ? h : 'home'
}

export default function App() {
  const [active, setActive] = useState(fromHash)
  const [dir, setDir] = useState('forward')
  // 'loading' → splash up, page frozen · 'revealing' → curtain lifting, page animates in · 'ready'
  const [phase, setPhase] = useState('loading')
  const activeRef = useRef(active)
  activeRef.current = active

  // The URL hash is the source of truth — clicks set it, this keeps state in
  // sync (and makes the browser back/forward buttons switch tabs).
  useEffect(() => {
    const sync = () => {
      const next = fromHash()
      const prev = activeRef.current
      if (next === prev) return
      setDir(idx(next) > idx(prev) ? 'forward' : 'back')
      setActive(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    document.title = TITLES[active] || TITLES.home
  }, [active])

  const go = (id) => {
    if (id === activeRef.current) return
    window.location.hash = id === 'home' ? '' : id
  }

  const Panel = PANELS[active]

  return (
    <>
      {phase !== 'ready' && (
        <Preloader
          onReveal={() => setPhase('revealing')}
          onDone={() => setPhase('ready')}
        />
      )}
      <div className={`app-shell${phase === 'loading' ? ' booting' : ''}`}>
      <ParticleField />
      <Navbar tabs={TABS} active={active} onChange={go} />
      <main className="tab-stage">
        <div
          className={`tab-panel ${dir}`}
          key={active}
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
        >
          <Panel onNavigate={go} />
        </div>
      </main>
      <Footer />
      </div>
    </>
  )
}
