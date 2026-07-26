"use client";

import type { SceneOverlay } from "../engine/types";

export default function OverlayLayer({ overlays }: { overlays: SceneOverlay[] }) {
  return (
    <div className="overlay-layer">
      {overlays.map((overlay) => (
        <aside key={overlay.id} className={`overlay overlay-${overlay.position ?? "top-right"} kind-${overlay.kind}`}>
          {overlay.title && <strong>{overlay.title}</strong>}
          {overlay.body && <p>{overlay.body}</p>}
        </aside>
      ))}
      <style jsx>{`
        .overlay-layer{position:absolute;inset:0;z-index:7;pointer-events:none}
        .overlay{position:absolute;max-width:min(360px,80vw);padding:14px 16px;border:1px solid rgba(255,255,255,.22);border-radius:18px;background:rgba(8,14,29,.76);backdrop-filter:blur(18px);box-shadow:0 18px 50px rgba(0,0,0,.26);animation:overlayIn .55s ease both}
        .overlay strong{display:block;font-size:13px;text-transform:uppercase;letter-spacing:.08em}.overlay p{margin:7px 0 0;line-height:1.45}
        .overlay-top-left{top:22px;left:22px}.overlay-top-right{top:22px;right:22px}.overlay-bottom-left{bottom:116px;left:22px}.overlay-bottom-right{bottom:116px;right:22px}.overlay-center{top:50%;left:50%;transform:translate(-50%,-50%)}
        .kind-key-takeaway,.kind-definition{border-color:rgba(250,204,21,.45)}
        @keyframes overlayIn{from{opacity:0;translate:0 12px}to{opacity:1;translate:0 0}}
        @media(max-width:760px){.overlay{max-width:calc(100vw - 48px)}.overlay-top-right,.overlay-top-left{top:16px;left:16px;right:auto}.overlay-bottom-left,.overlay-bottom-right{left:16px;right:auto;bottom:154px}}
      `}</style>
    </div>
  );
}
