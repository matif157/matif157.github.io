import NetworkGraph from './NetworkGraph'
import { hero, marquee, profile } from '../data/portfolio'

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 12 12 4M5.5 4H12v6.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function Hero({ github }) {
  const publicRepos = github?.totals?.publicRepos ?? 10

  const stats = [
    { value: profile.totalRepos, suffix: '+', label: 'Repositories' },
    { value: publicRepos, suffix: '', label: 'Public repos' },
    { value: profile.productionSystems, suffix: '', label: 'Production systems' },
    { value: profile.crmCodebases, suffix: '', label: 'CRM codebases' },
  ]

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="shell hero__inner">
          <span className="hero__badge">
            <b>
              <span className="live-dot" />
              {hero.badge}
            </b>
            {profile.location}
          </span>

          <h1 id="hero-title">
            {hero.title.map((line, index) => (
              <span className="hero__line" key={line}>
                {index === hero.accentLine ? <span className="accent">{line}</span> : line}
              </span>
            ))}
          </h1>

          <p className="hero__sub">{hero.sub}</p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#models">
              Browse the models
              <Arrow />
            </a>
            <a className="btn btn--ghost" href="#network">
              Explore the network
            </a>
          </div>

          <div className="hero__meta">
            {hero.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <NetworkGraph github={github} />

        <div className="stats">
          <div className="shell stats__grid">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="stat__value">
                  {stat.value}
                  {stat.suffix && <em>{stat.suffix}</em>}
                </div>
                <div className="stat__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...marquee, ...marquee].map((item, index) => (
            <span className="marquee__item" key={`${item}-${index}`}>
              <b>{item}</b>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
