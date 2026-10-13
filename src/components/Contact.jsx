import { profile, socials } from '../data/portfolio'

export default function Contact() {
  return (
    <section className="contact">
      <div className="wrap">
        <div className="eyebrow reveal">Let's build something</div>
        <h2 className="reveal">
          Have a project
          <br />
          worth <em>shipping?</em>
        </h2>
        <a className="mail reveal" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="socials reveal">
          {socials.map((s) => (
            <a href={s.url} target="_blank" rel="noopener noreferrer" key={s.label}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
