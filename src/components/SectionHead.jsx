export default function SectionHead({ num, title }) {
  return (
    <div className="sec-head reveal">
      <span className="sec-num">{num}</span>
      <h2 className="sec-title">{title}</h2>
      <span className="sec-line" />
    </div>
  )
}
