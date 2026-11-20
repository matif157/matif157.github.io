import Reveal from './Reveal'
import { profile, work } from '../data/portfolio'
import { relativeTime } from '../lib/github'

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Clock = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 4.8V8l2.2 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const Github = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 .8a7.2 7.2 0 0 0-2.3 14c.36.07.5-.15.5-.34v-1.2c-2 .43-2.42-.96-2.42-.96-.33-.83-.8-1.05-.8-1.05-.66-.45.05-.44.05-.44.72.05 1.1.74 1.1.74.65 1.1 1.7.79 2.1.6.07-.47.25-.79.46-.97-1.6-.18-3.28-.8-3.28-3.56 0-.79.28-1.43.74-1.93-.07-.18-.32-.91.07-1.9 0 0 .6-.2 1.98.74a6.9 6.9 0 0 1 3.6 0c1.37-.94 1.97-.74 1.97-.74.4.99.15 1.72.07 1.9.46.5.74 1.14.74 1.93 0 2.77-1.68 3.38-3.29 3.55.26.23.49.67.49 1.35v2c0 .19.13.42.5.34A7.2 7.2 0 0 0 8 .8Z" />
  </svg>
)

export default function Work({ github }) {
  const repoStats = new Map((github?.repos || []).map((repo) => [repo.name, repo]))

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__copy">
            <span className="eyebrow">Deployments</span>
            <h2 id="work-title">Shipped, not templated.</h2>
            <p>
              Production systems, open-source modules and one honest live demo with sample data. Private
              builds get an access request instead of a dead link.
            </p>
          </div>
          <div className="section-head__aside">
            <span className="live-dot" />
            {work.length} deployments · {work.filter((item) => item.status.includes('open')).length} open source
          </div>
        </div>

        <div className="work-grid">
          {work.map((project, index) => {
            const repo = project.repoName ? repoStats.get(project.repoName) : null
            const isPrivate = project.status.includes('private')
            const isOpen = project.status.includes('open')
            const isLive = project.status.includes('live')
            const isDemo = project.status.includes('demo')

            return (
              <Reveal
                as="article"
                className={`work-card${project.featured ? ' is-featured' : ''}`}
                key={project.title}
                delay={index % 2}
              >
                <div className="work-card__head">
                  <div>
                    <div className="work-card__badges">
                      {isLive && <span className="badge badge--live">Live in production</span>}
                      {isDemo && <span className="badge badge--demo">Live demo · sample data</span>}
                      {isOpen && <span className="badge badge--open">Open source</span>}
                      {isPrivate && <span className="badge badge--private">Private build</span>}
                    </div>
                    <h3 className="work-card__title" style={{ marginTop: '10px' }}>
                      {project.title}
                    </h3>
                    <div className="work-card__sub">{project.subtitle}</div>
                  </div>
                </div>

                <p className="work-card__desc">{project.desc}</p>

                <div className="chips">
                  {project.tags.map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="work-card__footer">
                  <span className="work-card__stamp">
                    <Clock />
                    {repo
                      ? `pushed ${relativeTime(repo.pushedAt)}`
                      : isDemo
                        ? 'demo · sample data'
                        : isPrivate
                          ? 'source under NDA'
                          : 'repository'}
                  </span>

                  <div className="work-card__actions">
                    {project.live && (
                      <a
                        className="btn btn--primary btn--sm"
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {isDemo ? 'Open demo' : 'Live demo'}
                        <Arrow />
                      </a>
                    )}
                    {project.repo && (
                      <a
                        className="btn btn--ghost btn--sm"
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Github />
                        Source
                      </a>
                    )}
                    {isPrivate && (
                      <a
                        className="btn btn--ghost btn--sm"
                        href={`mailto:${profile.email}?subject=${encodeURIComponent(
                          `Access request — ${project.title}`,
                        )}`}
                      >
                        Request access
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
