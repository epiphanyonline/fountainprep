"use client";

import type {
  LessonStep,
} from "../types/academy";

type SceneVisualProps = {
  step: LessonStep;
};

function moneyFlowItems(items: string[]) {
  return items.map((item, index) => (
    <div className="scene-flow-item" key={`${item}-${index}`}>
      <span>{item}</span>
      {index < items.length - 1 && <b aria-hidden="true">→</b>}
    </div>
  ));
}

export default function SceneVisual({
  step,
}: SceneVisualProps) {
  const visual = step.visual;

  if (!visual) return null;

  const items = visual.items ?? [];
  const visualType = visual.type ?? "cards";

  if (visualType === "process" || visualType === "timeline") {
    return (
      <div className="scene-visual scene-process">
        <header>
          <span className="scene-symbol">{visual.emoji ?? "✦"}</span>
          <div>
            <small>{visualType === "timeline" ? "TIMELINE" : "PROCESS"}</small>
            <strong>{visual.title}</strong>
          </div>
        </header>

        <div className="scene-flow">
          {moneyFlowItems(items)}
        </div>

        {visual.caption && <p>{visual.caption}</p>}
      </div>
    );
  }

  if (visualType === "comparison") {
    return (
      <div className="scene-visual scene-comparison">
        <header>
          <span className="scene-symbol">{visual.emoji ?? "⚖️"}</span>
          <div>
            <small>COMPARE</small>
            <strong>{visual.title}</strong>
          </div>
        </header>

        <div className="comparison-grid">
          {items.map((item, index) => (
            <div key={`${item}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visualType === "diagram") {
    return (
      <div className="scene-visual scene-diagram">
        <header>
          <span className="scene-symbol">{visual.emoji ?? "◎"}</span>
          <div>
            <small>DIAGRAM</small>
            <strong>{visual.title}</strong>
          </div>
        </header>

        <div className="diagram-orbit">
          <div className="diagram-core">{visual.emoji ?? "💡"}</div>
          {items.slice(0, 6).map((item, index) => (
            <div
              className={`diagram-node node-${index + 1}`}
              key={`${item}-${index}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visualType === "chart") {
    return (
      <div className="scene-visual scene-chart">
        <header>
          <span className="scene-symbol">{visual.emoji ?? "📊"}</span>
          <div>
            <small>VISUAL MODEL</small>
            <strong>{visual.title}</strong>
          </div>
        </header>

        <div className="chart-bars">
          {items.map((item, index) => (
            <div key={`${item}-${index}`}>
              <span
                style={{
                  height: `${36 + ((index * 17) % 58)}%`,
                }}
              />
              <small>{item}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="scene-visual scene-cards">
      <header>
        <span className="scene-symbol">{visual.emoji ?? "✦"}</span>
        <div>
          <small>{step.kind.replaceAll("-", " ").toUpperCase()}</small>
          <strong>{visual.title}</strong>
        </div>
      </header>

      <div className="animated-card-grid">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            style={{
              animationDelay: `${index * 110}ms`,
            }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>

      {visual.caption && <p>{visual.caption}</p>}
    </div>
  );
}
