import { profile } from '../data/portfolio'

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <div>© {new Date().getFullYear()} {profile.name} — {profile.role}</div>
        <div>Crafted with code &amp; caffeine ⚡</div>
      </div>
    </footer>
  )
}
