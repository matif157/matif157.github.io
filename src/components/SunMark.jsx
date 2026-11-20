import { useId } from 'react'

/**
 * The sun mark: twelve rounded rays around a filled core.
 * Sized by CSS; the gradient id is unique per instance.
 */
export default function SunMark({ className = '', size = 40, title = 'Atif sun mark' }) {
  const id = useId().replace(/:/g, '')
  const gradientId = `sun-${id}`

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      fill="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffd24a" />
          <stop offset="52%" stopColor="#e9ff3d" />
          <stop offset="100%" stopColor="#c8ff00" />
        </linearGradient>
      </defs>

      <g stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const long = i % 3 === 0
          const inner = 12.4
          const outer = long ? 20.6 : 17.7
          return (
            <line
              key={i}
              x1={24 + Math.cos(angle) * inner}
              y1={24 + Math.sin(angle) * inner}
              x2={24 + Math.cos(angle) * outer}
              y2={24 + Math.sin(angle) * outer}
            />
          )
        })}
      </g>

      <circle cx="24" cy="24" r="6.2" fill={`url(#${gradientId})`} />
      <circle
        cx="24"
        cy="24"
        r="9.6"
        stroke={`url(#${gradientId})`}
        strokeOpacity="0.28"
        strokeWidth="1"
      />
    </svg>
  )
}
