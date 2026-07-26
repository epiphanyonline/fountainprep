import { useMemo, useState } from "react";
import type { StudioStoryRecord, StudioStatus } from "../core/types";

export interface StoryLibraryProps {
  stories: StudioStoryRecord[];
  onOpen: (id: string) => void;
  onCreate: () => void;
}

export function StoryLibrary({ stories, onOpen, onCreate }: StoryLibraryProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StudioStatus | "all">("all");
  const filtered = useMemo(() => stories.filter((record) => {
    const matchesQuery = `${record.draft.title} ${record.draft.academyId}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "all" || record.status === status);
  }), [query, status, stories]);

  return (
    <section className="fs-library" aria-labelledby="story-library-title">
      <header className="fs-toolbar">
        <div><p className="fs-eyebrow">Fountain Studio</p><h1 id="story-library-title">Story library</h1></div>
        <button className="fs-button fs-button--primary" onClick={onCreate}>New story</button>
      </header>
      <div className="fs-filters">
        <input aria-label="Search stories" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories" />
        <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value as StudioStatus | "all")}>
          <option value="all">All statuses</option><option value="draft">Draft</option><option value="review">Review</option><option value="approved">Approved</option><option value="published">Published</option>
        </select>
      </div>
      <div className="fs-table-wrap"><table className="fs-table"><thead><tr><th>Story</th><th>Academy</th><th>Status</th><th>Version</th><th>Updated</th></tr></thead>
        <tbody>{filtered.map((record) => <tr key={record.id} tabIndex={0} onClick={() => onOpen(record.id)} onKeyDown={(event) => { if (event.key === "Enter") onOpen(record.id); }}>
          <td><strong>{record.draft.title}</strong><span>{record.draft.summary}</span></td><td>{record.draft.academyId}</td><td><span className={`fs-status fs-status--${record.status}`}>{record.status}</span></td><td>{record.currentVersion}</td><td>{new Date(record.updatedAt).toLocaleDateString()}</td>
        </tr>)}</tbody></table></div>
      {filtered.length === 0 ? <p className="fs-empty">No stories match these filters.</p> : null}
    </section>
  );
}
