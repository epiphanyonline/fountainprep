"use client";

import { useMemo, useState } from "react";
import type { SceneInteraction } from "../engine/types";
import { resolveDiscoveryResponse, type DiscoveryResolution } from "../engine/discovery/DiscoveryDirector";

export default function InteractionPanel({ interaction, onResolved }: { interaction: SceneInteraction; onResolved: (answer?: string) => void }) {
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<string>();
  const [resolution, setResolution] = useState<DiscoveryResolution>();
  const isContinue = interaction.mode === "continue";
  const selectedLabel = useMemo(
    () => interaction.choices?.find((choice) => choice.id === selected)?.label,
    [interaction.choices, selected],
  );

  const submit = () => {
    const response = selectedLabel ?? answer.trim();
    if (!isContinue && !response && !interaction.skippable) return;
    if (isContinue) {
      onResolved();
      return;
    }
    if (!resolution) {
      setResolution(resolveDiscoveryResponse(interaction, response));
      return;
    }
    onResolved(resolution.response || undefined);
  };

  return (
    <section className={`interaction-panel mode-${interaction.mode}`} aria-live="polite">
      {!isContinue && <small>{interaction.mode === "discovery" ? "Discovery moment" : interaction.mode === "reflection" ? "Memory moment" : "Your turn"}</small>}
      <h2>{resolution ? "Ayo responds" : interaction.prompt ?? (isContinue ? "Ready?" : "What do you notice?")}</h2>

      {resolution ? (
        <div className="mentor-response">
          <strong>Ayo</strong>
          <p>{resolution.mentorResponse}</p>
          {resolution.followUp && <p className="follow-up">{resolution.followUp}</p>}
        </div>
      ) : !isContinue && interaction.choices?.length ? (
        <div className="choices">
          {interaction.choices.map((choice) => (
            <button key={choice.id} className={selected === choice.id ? "selected" : ""} onClick={() => setSelected(choice.id)}>{choice.label}</button>
          ))}
        </div>
      ) : !isContinue && interaction.mode !== "voice" ? (
        <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Share your thought…" rows={3} />
      ) : !isContinue ? <p className="voice-note">Use the classroom microphone to answer aloud.</p> : null}

      <div className={`actions ${isContinue ? "continue-actions" : ""}`}>
        {!resolution && interaction.hint && <span>Hint: {interaction.hint}</span>}
        <button onClick={submit}>{isContinue ? "Let’s begin →" : resolution ? "Continue the story →" : "Share with Ayo"}</button>
      </div>
      <style jsx>{`
        .interaction-panel{position:absolute;z-index:12;left:50%;bottom:22px;transform:translateX(-50%);width:min(760px,calc(100% - 36px));padding:20px;border:1px solid rgba(255,255,255,.24);border-radius:24px;background:rgba(7,13,27,.94);backdrop-filter:blur(24px);box-shadow:0 30px 80px rgba(0,0,0,.48);animation:rise .55s ease both}
        .mode-continue{width:min(560px,calc(100% - 36px));text-align:center}.mode-continue h2{margin-bottom:18px}
        small{font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:#c4b5fd}h2{margin:7px 0 14px;font-size:clamp(22px,3vw,34px)}textarea{width:100%;box-sizing:border-box;padding:13px;border:1px solid #475569;border-radius:14px;background:#0f172a;color:white;font:inherit;resize:vertical}
        .choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.choices button,.actions button{padding:12px 15px;border:1px solid #475569;border-radius:13px;background:#111827;color:white;font-weight:800}.choices button.selected{border-color:#a78bfa;background:#4c1d95}.actions{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:14px}.continue-actions{justify-content:center}.continue-actions button{min-width:180px}.actions span{font-size:13px;color:#cbd5e1}.actions button{border:0;background:white;color:#111827}.voice-note{color:#cbd5e1}
        .mentor-response{padding:16px;border:1px solid rgba(196,181,253,.25);border-radius:16px;background:rgba(76,29,149,.18)}.mentor-response strong{color:#c4b5fd}.mentor-response p{margin:8px 0 0;line-height:1.55}.mentor-response .follow-up{color:#ddd6fe;font-weight:700}
        @keyframes rise{from{opacity:0;translate:0 24px}to{opacity:1;translate:0 0}}@media(max-width:650px){.choices{grid-template-columns:1fr}.actions{align-items:stretch;flex-direction:column}.actions button{width:100%}}
      `}</style>
    </section>
  );
}
