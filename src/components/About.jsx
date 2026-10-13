import SectionHead from './SectionHead'
import { about, facts } from '../data/portfolio'

export default function About() {
  return (
    <section>
      <div className="wrap">
        <SectionHead num="01" title="About" />
        <div className="about-grid">
          <div className="about-body reveal">
            {about.map((para, i) => (
              <p
                key={i}
                className={i === 0 ? 'first' : ''}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>
          <div className="facts reveal">
            {facts.map((f) => (
              <div className="fact" key={f.k}>
                <div className="k">{f.k}</div>
                <div className="v">
                  {f.v}
                  <small>{f.sub}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
