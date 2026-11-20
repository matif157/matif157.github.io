import Reveal from './Reveal'
import { profile } from '../data/portfolio'
import { formatDate, languageColor, relativeTime } from '../lib/github'

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Github = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 .8a7.2 7.2 0 0 0-2.3 14c.36.07.5-.15.5-.34v-1.2c-2 .43-2.42-.96-2.42-.96-.33-.83-.8-1.05-.8-1.05-.66-.45.05-.44.05-.44.72.05 1.1.74 1.1.74.65 1.1 1.7.79 2.1.6.07-.47.25-.79.46-.97-1.6-.18-3.28-.8-3.28-3.56 0-.79.28-1.43.74-1.93-.07-.18-.32-.91.07-1.9 0 0 .6-.2 1.98.74a6.9 6.9 0 0 1 3.6 0c1.37-.94 1.97-.74 1.97-.74.4.99.15 1.72.07 1.9.46.5.74 1.14.74 1.93 0 2.77-1.68 3.38-3.29 3.55.26.23.49.67.49 1.35v2c0 .19.13.42.5.34A7.2 7.2 0 0 0 8 .8Z" />
  </svg>
)

const Star = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="m8 1.8 1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.8Z" />
  </svg>
)

const Fork = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="4" cy="3.2" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="12" cy="3.2" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="12.8" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4 4.9v1.3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4.9M8 8.2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

const Push = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 12V3m0 0L4.5 6.5M8 3l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Dot = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const RepoIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 2.5h7a2 2 0 0 1 2 2v9h-7a2 2 0 0 1-2-2v-9Z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5.5 5h4.5M5.5 7.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

export default function GitHubLive({ github }) {
  if (!github) return null

  const { user, totals, languages = [], repos = [], activity = [], syncedAt } = github
  const login = user?.login || profile.handle
  const joined = user?.createdAt ? new Date(user.createdAt).getFullYear() : profile.joined
  const topShare = languages[0]?.share ?? 0

  return (
    <section className="section" id="github" aria-labelledby="github-title">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__copy">
            <span className="eyebrow">Live data</span>
            <h2 id="github-title">Straight from the API.</h2>
            <p>
              Repositories, languages and recent pushes pulled from GitHub at build time — then refreshed
              again in your browser. The snapshot below is never more than one visit old.
            </p>
          </div>
          <div className="section-head__aside">
            <span className="live-dot" />
            synced {formatDate(syncedAt)}
          </div>
        </div>

        <div className="gh">
          <Reveal className="panel panel--profile">
            <div className="panel__head">
              <span>github.com/{login}</span>
              <Github />
            </div>
            <div className="gh__profile">
              <div className="gh__ident">
                <span className="gh__avatar">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="4.2" fill="#c8ff00" />
                    <g stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8" />
                    </g>
                  </svg>
                </span>
                <div>
                  <div className="gh__login">{user?.name || profile.name}</div>
                  <div className="gh__handle">
                    @{login} · joined {joined}
                  </div>
                </div>
              </div>

              <p className="gh__bio">
                {user?.bio || 'CRM and business software, built in the open — PHP, Python and Odoo.'}
              </p>

              <div className="gh__mini">
                <div>
                  <b>{totals?.publicRepos ?? repos.length}</b>
                  <span>Public repos</span>
                </div>
                <div>
                  <b>{totals?.stars ?? 0}</b>
                  <span>Stars</span>
                </div>
                <div>
                  <b>{user?.followers ?? 0}</b>
                  <span>Followers</span>
                </div>
                <div>
                  <b>{profile.totalRepos}+</b>
                  <span>Total repos</span>
                </div>
              </div>

              <div>
                <div className="lang-bars" aria-hidden="true">
                  {languages.map((language) => (
                    <i
                      key={language.name}
                      style={{
                        width: `${Math.max(language.share, 2)}%`,
                        background: languageColor(language.name),
                      }}
                    />
                  ))}
                </div>
                <div className="lang-list">
                  {languages.slice(0, 4).map((language) => (
                    <div className="lang-row" key={language.name}>
                      <i style={{ background: languageColor(language.name) }} />
                      <b>{language.name}</b>
                      <span>{language.share}%</span>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: '10px', fontSize: '11px', color: 'var(--muted-2)' }}>
                  {topShare}% of public repos are {languages[0]?.name || 'PHP'}.
                </p>
              </div>

              <a
                className="btn btn--ghost btn--sm"
                href={`https://github.com/${login}`}
                target="_blank"
                rel="noreferrer"
              >
                <Github />
                View profile
                <Arrow />
              </a>
            </div>
          </Reveal>

          <Reveal className="panel panel--feed" delay={1}>
            <div className="panel__head">
              <span>Recently pushed</span>
              <span>{activity.length} repos</span>
            </div>
            <div className="feed">
              {activity.length === 0 && (
                <div className="feed__item">
                  <span className="feed__icon">
                    <Dot />
                  </span>
                  <div>
                    <div className="feed__repo">No public pushes right now</div>
                    <div className="feed__msg">The next push will show up here.</div>
                  </div>
                  <span className="feed__time">—</span>
                </div>
              )}
              {activity.map((event) => (
                <a
                  className="feed__item"
                  key={event.id}
                  href={`https://github.com/${login}/${event.repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="feed__icon feed__icon--push">
                    <Push />
                  </span>
                  <div>
                    <div className="feed__repo">{event.repo}</div>
                    <div className="feed__msg">{event.message}</div>
                  </div>
                  <span className="feed__time">{relativeTime(event.at)}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="repo-grid">
          {repos.map((repo) => (
            <a className="repo" key={repo.name} href={repo.url} target="_blank" rel="noreferrer">
              <div className="repo__top">
                <span className="repo__name">
                  <RepoIcon />
                  <span>{repo.name}</span>
                </span>
                {repo.language && (
                  <i
                    className="repo__dot"
                    style={{ background: languageColor(repo.language) }}
                    title={repo.language}
                  />
                )}
              </div>
              <p className="repo__desc">{repo.description || 'No description yet — the code speaks.'}</p>
              <div className="repo__meta">
                {repo.language && <span>{repo.language}</span>}
                <span>
                  <Star />
                  {repo.stars}
                </span>
                <span>
                  <Fork />
                  {repo.forks}
                </span>
                <span>{relativeTime(repo.pushedAt)}</span>
              </div>
            </a>
          ))}
          <a
            className="repo repo--cta"
            style={{ '--cta-span': repos.length % 3 === 0 ? 3 : 3 - (repos.length % 3) }}
            href={`https://github.com/${login}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="repo__ctaTitle">
              All {repos.length} repositories
              <Arrow />
            </span>
            <span className="repo__ctaSub">
              Full commit history, branches and issues — straight from the source.
            </span>
          </a>
        </div>

        <div className="note">
          <Dot />
          <span>
            <b>How this stays live:</b> the build fetches GitHub into a snapshot, then this page re-fetches
            the public repository API on load. No token, no cache, no invented numbers — if the API is
            rate-limited, the last snapshot stays on screen.
          </span>
        </div>
      </div>
    </section>
  )
}
