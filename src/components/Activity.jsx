import Reveal from './Reveal'
import activity from '../data/activity.json'
import { profile } from '../data/portfolio'
import { formatDate } from '../lib/github'

const base = import.meta.env.BASE_URL

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LinkedIn = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M3.2 5.8h2.2V14H3.2V5.8ZM4.3 2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM7 5.8h2.1v1.1h.03c.3-.55 1.02-1.13 2.1-1.13 2.25 0 2.67 1.42 2.67 3.28V14h-2.2V9.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.37V14H7V5.8Z" />
  </svg>
)

const Eye = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1.6 8S4 3.8 8 3.8 14.4 8 14.4 8 12 12.2 8 12.2 1.6 8 1.6 8Z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

const Heart = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 13.3S2.4 10 2.4 6.2A2.9 2.9 0 0 1 8 4.9a2.9 2.9 0 0 1 5.6 1.3C13.6 10 8 13.3 8 13.3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
)

const Badge = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m8 1.6 1.6 3.2 3.5.5-2.5 2.5.6 3.5L8 9.7l-3.2 1.6.6-3.5-2.5-2.5 3.5-.5L8 1.6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M6.4 12.4 5.6 15l2.4-1.2L10.4 15l-.8-2.6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)

const Info = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 7.4V11M8 5.2v.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export default function Activity() {
  const { followers, posts = [], certifications = [], profileUrl, activityUrl, syncedAt } = activity

  return (
    <section className="section" id="activity" aria-labelledby="activity-title">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__copy">
            <span className="eyebrow">LinkedIn</span>
            <h2 id="activity-title">Recent activity.</h2>
            <p>
              Posts and credentials from my LinkedIn. LinkedIn has no public activity API, so this feed is
              synced by hand — the date below is the honest one.
            </p>
          </div>
          <div className="section-head__aside">
            <span className="live-dot" />
            last sync {formatDate(syncedAt)}
          </div>
        </div>

        <div className="activity-layout">
          <Reveal as="aside" className="panel linkedin-card">
            <div className="linkedin-card__head">
              <img
                className="linkedin-card__avatar"
                src={`${base}apple-touch-icon.png`}
                alt={`${profile.name} profile`}
                width="48"
                height="48"
                loading="lazy"
              />
              <div>
                <div className="linkedin-card__name">{profile.name}</div>
                <div className="linkedin-card__headline">
                  {profile.headline} · {profile.company}
                </div>
              </div>
            </div>

            <div className="linkedin-card__stats">
              <div>
                <b>{followers}</b>
                <span>Followers</span>
              </div>
              <div>
                <b>{posts.length}</b>
                <span>Posts</span>
              </div>
              <div>
                <b>{certifications.length}</b>
                <span>Credential</span>
              </div>
            </div>

            <p className="linkedin-card__bio">
              Building CRMs, billing engines and business systems for SMEs, clubs and professional firms —
              in Faisalabad, working worldwide.
            </p>

            <div className="linkedin-card__links">
              <a
                className="btn btn--primary btn--sm"
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <LinkedIn />
                Follow
                <Arrow />
              </a>
              <a className="btn btn--ghost btn--sm" href={activityUrl} target="_blank" rel="noreferrer">
                All activity
              </a>
            </div>

            <div className="linkedin-card__sync">
              <span className="live-dot" />
              Synced {formatDate(syncedAt)}
            </div>
          </Reveal>

          <div className="activity-feed">
            {posts.map((post) => (
              <Reveal as="article" className="post" key={post.id} delay={1}>
                <div className="post__head">
                  <span className="post__who">
                    <LinkedIn />
                    LinkedIn · {post.type}
                  </span>
                  <span className="post__date">{formatDate(post.date)}</span>
                </div>

                <h3 className="post__title">{post.title}</h3>
                <p className="post__body">{post.body}</p>

                <div className="post__tags">
                  {post.tags.map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="post__foot">
                  <div className="post__metrics">
                    {post.metrics?.impressions ? (
                      <span>
                        <Eye />
                        {post.metrics.impressions} impressions
                      </span>
                    ) : null}
                    {post.metrics?.reactions ? (
                      <span>
                        <Heart />
                        {post.metrics.reactions}
                      </span>
                    ) : null}
                  </div>
                  <a className="link-arrow" href={activityUrl} target="_blank" rel="noreferrer">
                    View on LinkedIn
                    <Arrow />
                  </a>
                </div>
              </Reveal>
            ))}

            {certifications.map((cert) => (
              <Reveal
                as="article"
                className="post post--cert"
                key={cert.name}
                delay={2}
                style={{ '--post-accent': '#ffab00' }}
              >
                <div className="post__head">
                  <span className="post__who">
                    <Badge />
                    Verified credential
                  </span>
                  <span className="post__date">{cert.issued}</span>
                </div>

                <h3 className="post__title">{cert.name}</h3>

                <div className="cert__grid">
                  <div>
                    <span>Issued</span>
                    <b>{cert.issued}</b>
                  </div>
                  <div>
                    <span>Valid until</span>
                    <b>{cert.validUntil}</b>
                  </div>
                </div>

                <p className="cert__code">ID {cert.credential}</p>

                <div className="post__foot">
                  <div className="post__metrics">
                    <span>
                      <Badge />
                      RevOps · CRM · SLA
                    </span>
                  </div>
                  <a className="link-arrow" href={cert.url} target="_blank" rel="noreferrer">
                    HubSpot Academy
                    <Arrow />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="note">
          <Info />
          <span>
            <b>Why not a live LinkedIn feed?</b> LinkedIn closed its public activity API; scraping it would
            break and misrepresent the data. This section is curated and dated, and every card links back to
            the real post. The GitHub section above is the genuinely live one.
          </span>
        </div>
      </div>
    </section>
  )
}
