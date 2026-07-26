import type { StoryValidationResult } from "../../story/types";

export function ValidationPanel({ result }: { result: StoryValidationResult }) {
  return <aside className="fs-validation" aria-live="polite">
    <header><h2>Validation</h2><span>{result.valid ? "Ready" : `${result.issues.filter((item) => item.severity === "error").length} errors`}</span></header>
    {result.issues.length === 0 ? <p>This story is ready for review.</p> : <ul>{result.issues.map((item, index) => <li key={`${item.code}-${index}`} className={`fs-issue fs-issue--${item.severity}`}><strong>{item.message}</strong><code>{item.path}</code></li>)}</ul>}
  </aside>;
}
