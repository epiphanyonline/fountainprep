import type { LivingScene, SceneKind } from "../../engine/types";
import { Field } from "./Field";

export interface SceneEditorProps { scene: LivingScene; onChange: (patch: Partial<LivingScene>) => void; }
const kinds: SceneKind[] = ["story", "documentary", "conversation", "discovery", "explanation", "reflection", "assessment", "recap", "celebration"];

export function SceneEditor({ scene, onChange }: SceneEditorProps) {
  return <div className="fs-form-grid">
    <Field label="Scene title"><input value={scene.title} onChange={(event) => onChange({ title: event.target.value })} /></Field>
    <Field label="Scene type"><select value={scene.kind} onChange={(event) => onChange({ kind: event.target.value as SceneKind })}>{kinds.map((kind) => <option key={kind}>{kind}</option>)}</select></Field>
    <Field label="Display text"><textarea rows={3} value={scene.displayText ?? ""} onChange={(event) => onChange({ displayText: event.target.value })} /></Field>
    <Field label="Ayo narration"><textarea rows={5} value={scene.narration ?? ""} onChange={(event) => onChange({ narration: event.target.value })} /></Field>
    <Field label="Background accessibility description" hint="Describe what a learner who cannot see the artwork needs to know."><textarea rows={3} value={scene.background?.alt ?? ""} onChange={(event) => onChange({ background: { ...(scene.background ?? { id: `${scene.id}-background` }), alt: event.target.value } })} /></Field>
    <Field label="Duration (seconds)"><input type="number" min={1} value={Math.round((scene.durationMs ?? 0) / 1000)} onChange={(event) => { const durationMs = Number(event.target.value) * 1000; onChange({ durationMs, timeline: (scene.timeline ?? []).map((item) => item.type === "complete-scene" ? { ...item, atMs: durationMs } : item) }); }} /></Field>
    <Field label="Interaction prompt"><textarea rows={3} value={scene.interaction?.prompt ?? ""} onChange={(event) => onChange({ interaction: { ...(scene.interaction ?? { id: `${scene.id}-interaction`, mode: "reflection" }), mode: scene.interaction?.mode === "none" ? "reflection" : (scene.interaction?.mode ?? "reflection"), prompt: event.target.value } })} /></Field>
  </div>;
}
