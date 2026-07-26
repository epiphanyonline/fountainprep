"use client";

import type { CSSProperties, ReactNode } from "react";
import type { CameraPreset } from "../engine/types";
import { cameraTransform } from "../engine/controllers";

export default function CameraViewport({ camera, children }: { camera: CameraPreset; children: ReactNode }) {
  const style = { "--camera-transform": cameraTransform(camera) } as CSSProperties;
  return (
    <div className={`camera-viewport camera-${camera}`} style={style}>
      <div className="camera-world">{children}</div>
      <style jsx>{`
        .camera-viewport{position:absolute;inset:0;overflow:hidden}
        .camera-world{position:absolute;inset:0;transform:var(--camera-transform);transition:transform 1400ms cubic-bezier(.2,.75,.25,1);transform-origin:center}
        .camera-reflection .camera-world{filter:saturate(.72) brightness(.78)}
        .camera-celebration .camera-world{filter:saturate(1.18) brightness(1.08)}
      `}</style>
    </div>
  );
}
