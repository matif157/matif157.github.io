import { useEffect, useRef } from 'react'

/** Fade/slide an element in the first time it enters the viewport. */
export default function Reveal({
  as: Tag = 'div',
  delay,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} data-delay={delay} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
