import SectionHead from './SectionHead'
import { work } from '../data/portfolio'

export default function Work() {
  return (
    <section>
      <div className="wrap">
        <SectionHead num="03" title="Selected Work" />
        <div className="work-grid">
          {work.map((p, i) => (
            <article className={`work-card reveal${p.featured ? ' featured' : ''}`} key={p.title}>
              <div className="work-card-top">
                <span className="work-idx">{String(i + 1).padStart(2, '0')}</span>
                {p.featured && <span className="work-badge">★ Featured</span>}
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="work-card-tags">
                {p.tags.map((t) => (
                  <span className="chip" key={t}>{t}</span>
                ))}
              </div>
              <div className="work-card-links">
                {p.live && (
                  <a className="work-link primary" href={p.live} target="_blank" rel="noopener noreferrer">
                    Live <span aria-hidden="true">↗</span>
                  </a>
                )}
                {p.repo && (
                  <a className="work-link" href={p.repo} target="_blank" rel="noopener noreferrer">
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
