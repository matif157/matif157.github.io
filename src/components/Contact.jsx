import { contact, profile, socials } from '../data/portfolio'

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Mail = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" stroke="currentColor" strokeWidth="1.7" />
    <path d="m3.5 6.5 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Contact() {
  const links = socials.filter((social) => ['GitHub', 'LinkedIn'].includes(social.label))

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="shell contact__inner">
        <span className="eyebrow">Contact</span>

        <h2 id="contact-title">
          {contact.title[0]} <span>{contact.title[1]}</span>
        </h2>

        <p className="contact__sub">{contact.sub}</p>

        <a className="contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
          <Mail />
        </a>

        <div className="contact__actions">
          <a
            className="btn btn--primary"
            href="https://wa.me/923467560172"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp me
            <Arrow />
          </a>
          <a className="btn btn--ghost" href={profile.resume.pdf} download>
            Download CV
          </a>
          {links.map((link) => (
            <a className="btn btn--ghost" href={link.url} key={link.label} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>

        <div className="contact__grid">
          {contact.facts.map(([label, value]) => (
            <div className="contact__cell" key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
