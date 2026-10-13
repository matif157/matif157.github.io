import { useEffect, useRef, useState } from 'react'

// "Download CV" button that opens a small menu to pick PDF or Word.
export default function DownloadCV({ files }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`cv-menu${open ? ' open' : ''}`} ref={ref}>
      <button
        type="button"
        className="btn btn-ghost cv-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Download CV
        <span className="cv-caret" aria-hidden="true">▾</span>
      </button>

      <div className="cv-pop" role="menu" aria-label="Choose CV format">
        {files.pdf && (
          <a
            className="cv-item"
            role="menuitem"
            href={files.pdf}
            download
            onClick={() => setOpen(false)}
          >
            <span className="cv-ext">PDF</span>
            <span className="cv-label">Resume <small>.pdf — best for viewing</small></span>
          </a>
        )}
        {files.docx && (
          <a
            className="cv-item"
            role="menuitem"
            href={files.docx}
            download
            onClick={() => setOpen(false)}
          >
            <span className="cv-ext">DOC</span>
            <span className="cv-label">Resume <small>.docx — editable</small></span>
          </a>
        )}
      </div>
    </div>
  )
}
