import SunMark from './SunMark'
import { profile, socials } from '../data/portfolio'

const ArrowUp = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="12" height="12">
    <path d="M8 13V3m0 0L4 7m4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <SunMark size={20} title="Atif sun mark" />
          <span>
            <b>{profile.name}</b> · built in Faisalabad, shipped worldwide
          </span>
        </div>

        <nav className="footer__links" aria-label="Elsewhere">
          {socials.map((social) => (
            <a
              href={social.url}
              key={social.label}
              target={social.url.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              {social.label}
            </a>
          ))}
          <a href={`mailto:${profile.email}`}>Email</a>
        </nav>

        <button
          type="button"
          className="footer__top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
          <ArrowUp />
        </button>
      </div>
    </footer>
  )
}
