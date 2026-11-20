import { useState } from 'react'
import Reveal from './Reveal'
import { skills } from '../data/portfolio'

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const GLYPHS = {
  Backend: (
    <path d="m6 5-3 4 3 4M12 5l3 4-3 4M9.5 4l-2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Frontend: (
    <>
      <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 7h14M5.5 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  Automation: (
    <path d="M10 2 4 10h4l-1 6 6-8h-4l1-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Security: (
    <>
      <path d="M9 2.2 4 4.4v4.2c0 3.2 2.1 5.6 5 6.6 2.9-1 5-3.4 5-6.6V4.4L9 2.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m6.9 8.6 1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  Integrations: (
    <>
      <path d="M7.4 10.6 5.6 12.4a2.8 2.8 0 0 1-4-4l1.8-1.8M10.6 7.4l1.8-1.8a2.8 2.8 0 0 1 4 4l-1.8 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.6 11.4 11.4 6.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  'AI & Data': (
    <path d="M9 2.3 10.7 7l4.6 1.7-4.6 1.7L9 15l-1.7-4.6L2.7 8.7 7.3 7 9 2.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  ),
  Product: (
    <>
      <path d="m9 2 6 3.4v7.2L9 16l-6-3.4V5.4L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3.3 5.6 9 9l5.7-3.4M9 9v6.7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
}

const categories = ['All', ...Array.from(new Set(skills.map((skill) => skill.category)))]

export default function Models() {
  const [active, setActive] = useState('All')
  const visible = active === 'All' ? skills : skills.filter((skill) => skill.category === active)

  return (
    <section className="section" id="models" aria-labelledby="models-title">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__copy">
            <span className="eyebrow">Model directory</span>
            <h2 id="models-title">Skills, served as models.</h2>
            <p>
              Each card is a discipline I run in production — the stack, the depth, and where it has already
              shipped. Filter the directory the way you would on a model router.
            </p>
          </div>
          <div className="section-head__aside">
            <span className="live-dot" />
            {skills.length} models · {categories.length - 1} disciplines
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Filter models">
          {categories.map((category) => {
            const count =
              category === 'All' ? skills.length : skills.filter((skill) => skill.category === category).length
            return (
              <button
                type="button"
                role="tab"
                aria-selected={active === category}
                className={`tab${active === category ? ' is-active' : ''}`}
                key={category}
                onClick={() => setActive(category)}
              >
                {category}
                <span className="tab__count">{String(count).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>

        <div className="model-grid">
          {visible.map((skill, index) => (
            <Reveal
              as="article"
              className="model-card"
              key={skill.id}
              delay={index % 3}
              style={{ '--accent': skill.accent }}
            >
              <div className="model-card__top">
                <div className="model-card__id">
                  <span className="model-card__glyph">
                    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      {GLYPHS[skill.category] || GLYPHS.Product}
                    </svg>
                  </span>
                  <div className="model-card__names">
                    <div className="model-card__name">{skill.name}</div>
                    <div className="model-card__author">{skill.model}</div>
                  </div>
                </div>
                <span className="tag">{skill.category}</span>
              </div>

              <p className="model-card__desc">{skill.desc}</p>

              <div className="chips">
                {skill.chips.map((chip) => (
                  <span className="chip" key={chip}>
                    {chip}
                  </span>
                ))}
              </div>

              <div className="model-card__meta">
                {skill.meta.map(([label, value]) => (
                  <div className="model-card__stat" key={label}>
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                ))}
                <a className="model-card__go" href="#work" aria-label={`See ${skill.name} work`}>
                  <Arrow />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
