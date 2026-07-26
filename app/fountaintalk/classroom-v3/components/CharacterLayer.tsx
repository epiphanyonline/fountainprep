"use client";

import type { CSSProperties } from "react";
import type { CharacterActor } from "../engine/types";

export interface DirectedActor extends CharacterActor {
  runtimeAction: string;
  runtimeAnimation?: string;
}

export default function CharacterLayer({ actors }: { actors: DirectedActor[] }) {
  return (
    <div className="character-layer" aria-label="Scene characters">
      {actors.map((actor) => {
        const style = {
          zIndex: actor.depth ?? 3,
          "--actor-scale": actor.scale ?? 1,
        } as CSSProperties;
        return (
          <figure
            key={actor.id}
            className={`actor actor-${actor.position} action-${actor.runtimeAction} anim-${actor.runtimeAnimation ?? actor.animation ?? "fade"}`}
            style={style}
          >
            <img src={actor.assetId} alt={actor.displayName} />
            <figcaption>{actor.displayName}</figcaption>
          </figure>
        );
      })}
      <style jsx>{`
        .character-layer{position:absolute;inset:0;z-index:4;pointer-events:none}
        .actor{position:absolute;bottom:0;margin:0;transform:scale(var(--actor-scale));transform-origin:bottom center;transition:opacity .55s ease,filter .45s ease}
        .actor img{display:block;max-height:68vh;max-width:36vw;object-fit:contain;filter:drop-shadow(0 28px 24px rgba(0,0,0,.34))}
        .actor figcaption{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);padding:6px 10px;border-radius:999px;background:rgba(9,15,30,.68);font-size:12px;font-weight:800;white-space:nowrap}
        .actor-left{left:3%}.actor-center{left:50%;transform:translateX(-50%) scale(var(--actor-scale))}.actor-right{right:3%}.actor-far-left{left:-6%}.actor-far-right{right:-6%}
        .action-enter{animation:actorEnter .85s cubic-bezier(.2,.8,.2,1) both}.action-exit{animation:actorExit .5s ease both}.action-speak{filter:brightness(1.08)}
        .anim-walk{animation:actorEnter .9s ease both,walkBob 1.6s ease-in-out .9s infinite}.anim-float{animation:float 3s ease-in-out infinite}.anim-pulse{animation:pulse 1.8s ease-in-out infinite}.anim-shake{animation:shake .45s ease-in-out 2}.anim-glow img{filter:drop-shadow(0 0 28px rgba(255,216,110,.82))}
        @keyframes actorEnter{from{opacity:0;transform:translateY(42px) scale(calc(var(--actor-scale) * .96))}to{opacity:1;transform:translateY(0) scale(var(--actor-scale))}}
        @keyframes actorExit{to{opacity:0;transform:translateY(28px) scale(calc(var(--actor-scale) * .96))}}
        @keyframes walkBob{50%{translate:0 -5px}}@keyframes float{50%{translate:0 -10px}}@keyframes pulse{50%{filter:brightness(1.18)}}@keyframes shake{25%{translate:-7px 0}75%{translate:7px 0}}
        @media(max-width:760px){.actor img{max-width:72vw;max-height:46vh}.actor-left{left:-8%}.actor-right{right:-8%}.actor figcaption{display:none}}
      `}</style>
    </div>
  );
}
