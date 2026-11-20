import { CATEGORIES, STATUSES } from '../data/ecosystem'
import { profile, socials, skills, work } from '../../data/portfolio'
import activity from '../../data/activity.json'
import github from '../../data/github.json'

const Section = ({ id, eyebrow, title, sub, children }) => (
  <section className="c-section" id={id}>
    <div className="c-section__head">
      <span className="c-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
    {children}
  </section>
)

const StatusChip = ({ status }) => (
  <span className="c-status-chip" style={{ '--badge': STATUSES[status].color }}>
    <i />{STATUSES[status].label}
  </span>
)

export function FeaturedProjects() {
  const featured = work.filter((item) => item.featured).concat(work.filter((item) => !item.featured).slice(0, 3))
  return (
    <Section id="projects" eyebrow="Selected work" title="Featured projects"
      sub="Shipped systems and open-source modules. Private builds are labelled as such.">
      <div className="c-project-grid">
        {featured.map((item) => (
          <article key={item.title} className="c-project-card">
            <div className="c-project-card__top">
              <span>{item.subtitle}</span>
              {item.status.includes('demo') && <StatusChip status="deployed" />}
              {item.status.includes('open') && <StatusChip status="production" />}
              {item.status.includes('private') && <StatusChip status="production" />}
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <div className="c-tags">
              {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="c-project-card__links">
              {item.live && <a href={item.live} target="_blank" rel="noreferrer">Live demo ↗</a>}
              {item.repo && <a href={item.repo} target="_blank" rel="noreferrer">Source ↗</a>}
              {!item.live && !item.repo && <span>Private build · request access</span>}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function EngineeringCapabilities() {
  return (
    <Section id="capabilities" eyebrow="How I work" title="Engineering capabilities"
      sub="The recurring models behind the projects — each one a real, repeatable way of working.">
      <div className="c-capability-grid">
        {skills.map((skill) => (
          <article key={skill.id} className="c-capability">
            <span className="c-capability__category" style={{ color: skill.accent }}>{skill.category}</span>
            <h3>{skill.name}</h3>
            <code>{skill.model}</code>
            <p>{skill.desc}</p>
            <div className="c-tags">{skill.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function TechnologyStack({ nodes, onSelect }) {
  const groups = Object.entries(CATEGORIES).filter(([key]) => key !== 'identity')
  return (
    <Section id="technologies" eyebrow="The graph, as a list" title="Technology stack"
      sub="Every technology in the constellation. Select one to focus it in the graph above.">
      <div className="c-stack-grid">
        {groups.map(([key, category]) => {
          const items = nodes.filter((node) => node.type === key)
          if (!items.length) return null
          return (
            <div key={key} className="c-stack-group">
              <h3><i style={{ background: category.color }} />{category.label}</h3>
              <div>
                {items.map((node) => (
                  <button type="button" key={node.id} onClick={() => onSelect(node.id)} title={node.description}>
                    {node.name}
                    <i style={{ background: STATUSES[node.status].color }} />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export function ResearchAndExperiments({ nodes, onSelect }) {
  const items = nodes.filter((node) => ['planned', 'prototype', 'exploring'].includes(node.status)
    && ['project', 'model', 'tool'].includes(node.type)).slice(0, 12)
  return (
    <Section id="research" eyebrow="Research & experiments" title="Explored, not claimed"
      sub="Concepts and prototypes are marked clearly. Nothing here is presented as a live integration.">
      <div className="c-research-grid">
        {items.map((node) => (
          <button type="button" key={node.id} className="c-research" onClick={() => onSelect(node.id)}>
            <div><StatusChip status={node.status} /><span>{CATEGORIES[node.type].label}</span></div>
            <h3>{node.name}</h3>
            <p>{node.description}</p>
          </button>
        ))}
      </div>
    </Section>
  )
}

export function ProfessionalBackground() {
  const posts = activity.posts.slice(0, 2)
  return (
    <Section id="about" eyebrow="Professional background" title={profile.role}
      sub={`${profile.location} · ${profile.timezone} · Atif Systems`}>
      <div className="c-about-grid">
        <div className="c-about-card">
          <h3>At a glance</h3>
          <dl>
            <div><dt>Focus</dt><dd>CRM, billing and business automation</dd></div>
            <div><dt>Repositories</dt><dd>{profile.totalRepos}+ across public and private builds</dd></div>
            <div><dt>Public repos</dt><dd>{github.totals.publicRepos} on GitHub today</dd></div>
            <div><dt>CRM codebases</dt><dd>{profile.crmCodebases} in the portfolio corpus</dd></div>
            <div><dt>Status</dt><dd>{profile.availability}</dd></div>
          </dl>
        </div>
        <div className="c-about-card">
          <div className="c-about-card__head">
            <h3>Recent activity</h3>
            <span>LinkedIn · synced {activity.syncedAt}</span>
          </div>
          {posts.map((post) => (
            <article key={post.id} className="c-post">
              <span>{post.date} · {post.type}</span>
              <h4>{post.title}</h4>
              <p>{post.body.slice(0, 190)}…</p>
              <a href={activity.activityUrl} target="_blank" rel="noreferrer">View on LinkedIn ↗</a>
            </article>
          ))}
          {activity.certifications?.slice(0, 1).map((cert) => (
            <article key={cert.credential || cert.name} className="c-post">
              <span>Certification · {cert.issued}</span>
              <h4>{cert.name}</h4>
              <p>{cert.issuer}</p>
              {cert.url && <a href={cert.url} target="_blank" rel="noreferrer">Verify ↗</a>}
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="Let's map the system."
      sub="Tell me the process that eats your week. I will tell you honestly whether software fixes it.">
      <div className="c-contact-grid">
        <a className="c-contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
        <div className="c-contact-links">
          {socials.map((social) => (
            <a key={social.label} href={social.url} target="_blank" rel="noreferrer">{social.label} ↗</a>
          ))}
        </div>
        <div className="c-contact-links">
          <a href={profile.resume.pdf} target="_blank" rel="noreferrer">Résumé (PDF) ↗</a>
          <a href={profile.resume.docx} target="_blank" rel="noreferrer">Résumé (DOCX) ↗</a>
        </div>
      </div>
    </Section>
  )
}
