export function Progress({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="fp-progress" aria-label={label ?? `${safe}% complete`}>
      <div className="fp-progress__track"><span style={{ width: `${safe}%` }} /></div>
      {label ? <span className="fp-progress__label">{label}</span> : null}
    </div>
  );
}
