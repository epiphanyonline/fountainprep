import type { LivingScene } from "../engine/types";

export interface LegacyScene {
  id: string; kind: string; title: string; eyebrow?: string; displayText: string; narration: string;
  camera?: string; transition?: string; ayoPose?: string; interactionMode?: string;
  question?: string; choices?: Array<{ id: string; label: string }>; acceptedAnswers?: string[]; hint?: string; explanation?: string;
}

export function fromV2Scene(scene: LegacyScene): LivingScene {
  return {
    id: scene.id,
    kind: legacyKind(scene.kind),
    title: scene.title,
    eyebrow: scene.eyebrow,
    displayText: scene.displayText,
    narration: scene.narration,
    camera: legacyCamera(scene.camera),
    transition: legacyTransition(scene.transition),
    durationMs: 9000,
    actors: [{ id: "ayo", assetId: `/images/fountaintalk/ayo-${scene.ayoPose ?? "teach"}.png`, displayName: "Ayo", position: "right", animation: "fade" }],
    interaction: scene.interactionMode && scene.interactionMode !== "none" ? {
      id: `${scene.id}:interaction`,
      mode: scene.interactionMode === "reflection" ? "reflection" : scene.interactionMode === "choice" ? "choice" : "text",
      prompt: scene.question,
      choices: scene.choices,
      acceptedAnswers: scene.acceptedAnswers,
      hint: scene.hint,
      explanation: scene.explanation,
    } : undefined,
  };
}

function legacyKind(kind: string): LivingScene["kind"] {
  const allowed: LivingScene["kind"][] = ["story","documentary","conversation","discovery","explanation","diagram","whiteboard","comparison","reflection","assessment","simulation","recap","celebration"];
  return allowed.includes(kind as LivingScene["kind"]) ? kind as LivingScene["kind"] : "explanation";
}
function legacyCamera(camera?: string): LivingScene["camera"] { return (["wide","medium","close","story","diagram","split","reflection","celebration"] as string[]).includes(camera ?? "") ? camera as LivingScene["camera"] : "story"; }
function legacyTransition(transition?: string): LivingScene["transition"] { return (["fade","slide","zoom","wipe","dissolve"] as string[]).includes(transition ?? "") ? transition as LivingScene["transition"] : "fade"; }
