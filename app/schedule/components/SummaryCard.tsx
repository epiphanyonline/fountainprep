export function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="summary">
      <span>{label}</span>
      <strong>{value}</strong>
      {sub ? <small>{sub}</small> : null}
    </div>
  )
}

