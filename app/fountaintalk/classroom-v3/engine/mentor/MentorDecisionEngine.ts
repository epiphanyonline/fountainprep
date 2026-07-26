import type { MentorContext } from "./MentorContext";
import type { MentorDecision, MentorDecisionTelemetryEvent, MentorPriority } from "./MentorDecision";
import { defaultMentorPolicies, type MentorPolicy } from "./MentorPolicy";

export interface MentorDecisionEngineOptions {
  policies?: MentorPolicy[];
  now?: () => Date;
  onTelemetry?: (event: MentorDecisionTelemetryEvent) => void;
}

const priorityScore: Record<MentorPriority, number> = { low: 1, medium: 2, high: 3 };

function rank(decision: MentorDecision): number {
  return priorityScore[decision.priority] * 100 + decision.confidence;
}

export class MentorDecisionEngine {
  private readonly policies: MentorPolicy[];
  private readonly now: () => Date;
  private readonly onTelemetry?: (event: MentorDecisionTelemetryEvent) => void;

  constructor(options: MentorDecisionEngineOptions = {}) {
    this.policies = options.policies ?? defaultMentorPolicies;
    this.now = options.now ?? (() => new Date());
    this.onTelemetry = options.onTelemetry;
  }

  decide(context: MentorContext): MentorDecision {
    const candidates = this.policies
      .map((policy) => policy.evaluate(context))
      .filter((candidate): candidate is MentorDecision => Boolean(candidate))
      .sort((a, b) => rank(b) - rank(a));

    const winner: MentorDecision = candidates[0] ?? {
      action: "continue_story",
      confidence: 1,
      priority: "medium",
      reason: "No higher-value mentor intervention is needed in this moment.",
      policyIds: ["default-continue-story"],
    };

    this.onTelemetry?.({
      type: "mentor_decision",
      occurredAt: this.now().toISOString(),
      lessonId: context.lesson.id,
      sceneId: context.scene.id,
      action: winner.action,
      confidence: winner.confidence,
      priority: winner.priority,
      reason: winner.reason,
      policyIds: winner.policyIds,
    });

    return winner;
  }
}

export function decideMentorAction(
  context: MentorContext,
  options?: MentorDecisionEngineOptions,
): MentorDecision {
  return new MentorDecisionEngine(options).decide(context);
}
