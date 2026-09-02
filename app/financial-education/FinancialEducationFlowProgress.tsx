"use client";

export type FinancialEducationFlowStepState = "done" | "current" | "upcoming";

export type FinancialEducationFlowStep = {
  label: string;
  state: FinancialEducationFlowStepState;
};

type Props = {
  steps: FinancialEducationFlowStep[];
  nextLabel?: string;
};

export default function FinancialEducationFlowProgress({
  steps,
  nextLabel,
}: Props) {
  return (
    <div className="flowProgress" aria-label="Financial Education journey progress">
      <div
        className="flowTrack"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))`,
        }}
      >
        {steps.map((step, index) => (
          <div key={`${step.label}-${index}`} className={`flowStep ${step.state}`}>
            <div className="stepMarker">
              {step.state === "done" ? "✓" : index + 1}
            </div>
            <span>{step.label}</span>
            {index < steps.length - 1 ? (
              <i className={step.state === "done" ? "connector complete" : "connector"} />
            ) : null}
          </div>
        ))}
      </div>

      {nextLabel ? (
        <div className="nextAction">
          <span>UP NEXT</span>
          <strong>{nextLabel}</strong>
        </div>
      ) : null}

      <style jsx>{`
        .flowProgress{width:100%;padding:17px 20px 14px;border:1px solid rgba(109,40,217,.13);border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(250,247,253,.94));box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 14px 34px rgba(50,26,67,.07);box-sizing:border-box}
        .flowTrack{display:grid;align-items:start}
        .flowStep{position:relative;min-width:0;display:grid;justify-items:center;gap:8px;color:#a094a7;text-align:center}
        .stepMarker{position:relative;z-index:2;width:34px;height:34px;display:grid;place-items:center;border:2px solid #e0d8e5;border-radius:50%;color:#9b8ca3;background:#fff;font-size:11px;font-weight:950}
        .flowStep.done .stepMarker{border-color:#6d28d9;color:#fff;background:linear-gradient(135deg,#7c3aed,#5b21b6);box-shadow:0 7px 18px rgba(109,40,217,.2)}
        .flowStep.current{color:#2a1832}
        .flowStep.current .stepMarker{border-color:#7c3aed;color:#6d28d9;box-shadow:0 0 0 6px rgba(124,58,237,.08),0 8px 20px rgba(109,40,217,.12)}
        .flowStep>span{font-size:9px;font-weight:900;line-height:1.2}
        .connector{position:absolute;z-index:1;top:16px;left:calc(50% + 23px);width:calc(100% - 46px);height:2px;border-radius:999px;background:#e7dfea}
        .connector.complete{background:linear-gradient(90deg,#7c3aed,#b99af0)}
        .nextAction{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #eee7f2}
        .nextAction span{color:#7c3aed;font-size:8px;font-weight:950;letter-spacing:.11em}
        .nextAction strong{color:#3c2b45;font-size:10px}
        @media(max-width:560px){.flowProgress{padding:14px 10px 12px;border-radius:18px}.stepMarker{width:30px;height:30px}.connector{top:14px;left:calc(50% + 19px);width:calc(100% - 38px)}.flowStep>span{font-size:8px}}
      `}</style>
    </div>
  );
}
