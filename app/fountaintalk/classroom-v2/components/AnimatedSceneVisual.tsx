"use client";

import type {
  ClassroomScene,
} from "../types";

type Props = {
  scene: ClassroomScene;
};

export default function AnimatedSceneVisual({
  scene,
}: Props) {
  const visual = scene.visual;
  if (!visual) {
    return (
      <div className="v2-abstract-visual">
        <span />
        <span />
        <span />
        <strong>{scene.displayText}</strong>
      </div>
    );
  }

  const items = visual.items ?? [];
  const type = visual.type ?? "cards";

  if (type === "process" || type === "timeline") {
    return (
      <div className="v2-process">
        {items.map((item, index) => (
          <div key={`${item}-${index}`}>
            <span>{item}</span>
            {index < items.length - 1 && <b>→</b>}
          </div>
        ))}
      </div>
    );
  }

  if (type === "diagram") {
    return (
      <div className="v2-orbit">
        <div className="v2-orbit-core">
          {visual.emoji ?? "✦"}
        </div>
        {items.slice(0, 6).map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`orbit-node orbit-node-${index + 1}`}
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  if (type === "comparison") {
    return (
      <div className="v2-comparison">
        {items.map((item, index) => (
          <article key={`${item}-${index}`}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <strong>{item}</strong>
          </article>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="v2-chart">
        {items.map((item, index) => (
          <div key={`${item}-${index}`}>
            <i
              style={{
                height: `${38 + ((index * 19) % 56)}%`,
              }}
            />
            <small>{item}</small>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="v2-card-grid">
      {items.map((item, index) => (
        <article
          key={`${item}-${index}`}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <small>{String(index + 1).padStart(2, "0")}</small>
          <strong>{item}</strong>
        </article>
      ))}
    </div>
  );
}
