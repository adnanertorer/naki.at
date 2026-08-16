export function FlowerLayer() {
  return (
    <div className="flower-field" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, index) => (
        <span className="flower-bloom" key={index} />
      ))}
    </div>
  )
}
