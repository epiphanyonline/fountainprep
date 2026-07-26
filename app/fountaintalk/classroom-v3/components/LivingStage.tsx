"use client";

import type { CSSProperties } from "react";
import type { LivingScene } from "../engine/types";
import type { OrchestratedScene } from "../engine/SceneOrchestrator";
import AmbientAudio from "./AmbientAudio";
import CameraViewport from "./CameraViewport";
import CharacterLayer from "./CharacterLayer";
import InteractionPanel from "./InteractionPanel";
import OverlayLayer from "./OverlayLayer";

export default function LivingStage({
  scene,
  orchestrated,
  onInteractionResolved,
  ambientEnabled = true,
  interactionResolved = false,
}: {
  scene: LivingScene;
  orchestrated: OrchestratedScene;
  onInteractionResolved: (answer?: string) => void;
  ambientEnabled?: boolean;
  interactionResolved?: boolean;
}) {
  const { snapshot, director } = orchestrated;
  const style = {
    "--scene-gradient": scene.background?.gradient ?? "linear-gradient(135deg,#111827,#020617)",
  } as CSSProperties;

  const visibleArtwork = (scene.artwork ?? []).filter((art) => snapshot.visibleArtworkIds.includes(art.id));
  const visibleOverlays = (scene.overlays ?? []).filter((overlay) => snapshot.visibleOverlayIds.includes(overlay.id));

  return (
    <section
      className={`living-stage phase-${snapshot.phase} transition-${scene.transition ?? "fade"}`}
      style={style}
      data-phase={snapshot.phase}
    >
      <AmbientAudio
        src={snapshot.ambienceId ? scene.ambience?.src : undefined}
        volume={scene.ambience?.volume}
        loop={scene.ambience?.loop}
        enabled={ambientEnabled}
      />

      <CameraViewport camera={director.camera}>
        <div className={`background-layer ${snapshot.backgroundVisible ? "visible" : ""}`} aria-label={scene.background?.alt}>
          {scene.background?.src && <img src={scene.background.src} alt={scene.background.alt ?? ""} />}
        </div>

        <div className="artwork-layer">
          {visibleArtwork.map((art) => (
            <img
              key={art.id}
              src={art.src}
              alt={art.alt}
              className={`art art-${art.position ?? "center"}`}
              style={{ objectFit: art.fit ?? "cover", zIndex: art.depth ?? 2 }}
            />
          ))}
        </div>

        <CharacterLayer actors={director.actors} />
      </CameraViewport>

      <div className="vignette" />
      <div className="content-layer">
        <span>{scene.eyebrow ?? scene.kind}</span>
        <h1>{scene.title}</h1>
        {scene.displayText && <p>{scene.displayText}</p>}
      </div>

      <OverlayLayer overlays={visibleOverlays} />

      {snapshot.narrationStarted && scene.narration && !snapshot.interactionVisible && (
        <div className="narration-layer">
          <strong>Ayo</strong>
          <p>{scene.narration}</p>
        </div>
      )}

      {snapshot.interactionVisible && !interactionResolved && scene.interaction && scene.interaction.mode !== "none" && (
        <InteractionPanel interaction={scene.interaction} onResolved={onInteractionResolved} />
      )}

      {snapshot.celebrating && <div className="celebration-layer" aria-hidden>✦</div>}

      <div className="phase-chip">{snapshot.phase}</div>

      <style jsx>{`
        .living-stage{min-height:72vh;position:relative;isolation:isolate;overflow:hidden;border-radius:28px;background:var(--scene-gradient);color:white;box-shadow:0 30px 100px rgba(0,0,0,.36)}
        .background-layer,.artwork-layer,.content-layer{position:absolute;inset:0}.background-layer{z-index:0;opacity:0;transition:opacity .8s ease}.background-layer.visible{opacity:1}.background-layer img,.artwork-layer img{width:100%;height:100%;object-fit:cover}.artwork-layer{z-index:2}.art{position:absolute;inset:0;animation:artReveal 1.1s ease both}.art-left{width:64%;right:auto}.art-right{width:64%;left:auto}.art-center{inset:0}.vignette{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(90deg,rgba(2,6,23,.74),rgba(2,6,23,.12) 60%,rgba(2,6,23,.28)),linear-gradient(0deg,rgba(2,6,23,.5),transparent 50%)}
        .content-layer{z-index:6;padding:clamp(28px,6vw,80px);display:flex;flex-direction:column;justify-content:center;max-width:62%;pointer-events:none}.content-layer span{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.14em;color:#ddd6fe}.content-layer h1{margin:10px 0 0;font-size:clamp(42px,7vw,92px);line-height:.94;text-wrap:balance}.content-layer p{font-size:clamp(18px,2vw,26px);line-height:1.5;color:#e2e8f0}
        .narration-layer{position:absolute;z-index:10;left:3%;right:3%;bottom:20px;padding:15px 18px;display:grid;grid-template-columns:auto 1fr;gap:14px;background:rgba(255,255,255,.95);color:#221c27;border-radius:17px;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:narrationIn .5s ease both}.narration-layer p{margin:0;line-height:1.5}.phase-chip{position:absolute;z-index:15;top:16px;left:16px;padding:6px 9px;border-radius:999px;background:rgba(7,12,24,.58);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#cbd5e1}.celebration-layer{position:absolute;z-index:14;inset:0;display:grid;place-items:center;font-size:180px;color:#fde68a;animation:celebrate 1.2s ease both;pointer-events:none}
        .phase-reflection .vignette{background:linear-gradient(135deg,rgba(30,41,59,.84),rgba(49,46,129,.35))}.phase-discovery .content-layer{opacity:.62}.phase-interaction .content-layer{opacity:.24;transition:opacity .4s ease}
        @keyframes artReveal{from{opacity:0;scale:1.04}to{opacity:.88;scale:1}}@keyframes narrationIn{from{opacity:0;translate:0 16px}to{opacity:1;translate:0 0}}@keyframes celebrate{0%{opacity:0;scale:.3}50%{opacity:1;scale:1.05}100%{opacity:0;scale:1.4}}
        @media(max-width:760px){.living-stage{min-height:78vh;border-radius:22px}.content-layer{max-width:100%;justify-content:flex-start;padding:54px 24px 24px}.content-layer h1{font-size:44px}.content-layer p{font-size:18px}.narration-layer{grid-template-columns:1fr;bottom:10px}.vignette{background:linear-gradient(180deg,rgba(2,6,23,.72),rgba(2,6,23,.08) 52%,rgba(2,6,23,.72))}}
      `}</style>
    </section>
  );
}
