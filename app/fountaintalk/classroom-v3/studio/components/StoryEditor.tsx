import { useMemo, useState } from "react";
import type { StoryJourney } from "../../story/types";
import { validateStory } from "../../story/validateStory";
import { updateScene } from "../core/mutations";
import type { StudioStatus } from "../core/types";
import { Field } from "./Field";
import { SceneEditor } from "./SceneEditor";
import { StoryPreview } from "./StoryPreview";
import { ValidationPanel } from "./ValidationPanel";

export interface StoryEditorProps {
  story: StoryJourney;
  status: StudioStatus;
  onChange: (story: StoryJourney) => void;
  onSave: () => void;
  onSubmitReview: () => void;
}

export function StoryEditor({ story, status, onChange, onSave, onSubmitReview }: StoryEditorProps) {
  const [selectedSceneId, setSelectedSceneId] = useState(story.scenes[0]?.id ?? "");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const selectedScene = story.scenes.find((scene) => scene.id === selectedSceneId) ?? story.scenes[0];
  const validation = useMemo(() => validateStory(story), [story]);

  return <section className="fs-editor">
    <header className="fs-toolbar fs-editor__header"><div><p className="fs-eyebrow">{status}</p><h1>{story.title}</h1></div><div className="fs-actions"><button className="fs-button" onClick={onSave}>Save draft</button><button className="fs-button fs-button--primary" disabled={!validation.valid || status !== "draft"} onClick={onSubmitReview}>Submit for review</button></div></header>
    <div className="fs-tabs" role="tablist"><button role="tab" aria-selected={tab === "edit"} onClick={() => setTab("edit")}>Edit</button><button role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>Preview</button></div>
    {tab === "preview" ? <StoryPreview story={story} /> : <div className="fs-editor__grid">
      <nav className="fs-scene-tree" aria-label="Story scenes">{story.chapters.map((chapter) => <section key={chapter.id}><h2>{chapter.title}</h2>{chapter.sceneIds.map((sceneId) => { const scene = story.scenes.find((entry) => entry.id === sceneId); return scene ? <button key={scene.id} className={scene.id === selectedScene?.id ? "is-active" : ""} onClick={() => setSelectedSceneId(scene.id)}><span>{scene.title}</span><small>{scene.kind}</small></button> : null; })}</section>)}</nav>
      <main className="fs-editor__main">
        <div className="fs-panel"><h2>Story details</h2><div className="fs-form-grid"><Field label="Title"><input value={story.title} onChange={(event) => onChange({ ...story, title: event.target.value })} /></Field><Field label="Summary"><textarea rows={3} value={story.summary} onChange={(event) => onChange({ ...story, summary: event.target.value })} /></Field><Field label="Takeaway"><textarea rows={2} value={story.takeaway} onChange={(event) => onChange({ ...story, takeaway: event.target.value })} /></Field></div></div>
        {selectedScene ? <div className="fs-panel"><h2>{selectedScene.title}</h2><SceneEditor scene={selectedScene} onChange={(patch) => onChange(updateScene(story, selectedScene.id, patch))} /></div> : <p>No scene selected.</p>}
      </main>
      <ValidationPanel result={validation} />
    </div>}
  </section>;
}
