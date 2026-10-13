import SectionHead from './SectionHead'
import { expertise, builds } from '../data/portfolio'

export default function Expertise() {
  return (
    <section>
      <div className="wrap">
        <SectionHead num="02" title="Expertise" />
        <div className="exp-grid">
          {expertise.map((card) => (
            <div className="exp-card reveal" key={card.title}>
              <div className="ic">// {card.tag}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <div className="chips">
                {card.chips.map((chip) => (
                  <span className="chip" key={chip}>{chip}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="builds reveal">
          <div className="builds-head">
            <span className="ic">// what I build</span>
            <span className="builds-count">{builds.length} product types shipped</span>
          </div>
          <div className="build-grid">
            {builds.map((b) => (
              <span className="build-tag" key={b}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
