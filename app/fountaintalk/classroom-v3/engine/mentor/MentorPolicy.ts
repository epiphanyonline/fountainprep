import type { MentorContext } from "./MentorContext";
import type { MentorDecision } from "./MentorDecision";

export interface MentorPolicy {
  id: string;
  evaluate(context: MentorContext): MentorDecision | undefined;
}

function decision(
  policyId: string,
  value: Omit<MentorDecision, "policyIds">,
): MentorDecision {
  return { ...value, policyIds: [policyId] };
}

export const curiosityBeforeExplanation: MentorPolicy = {
  id: "curiosity-before-explanation",
  evaluate(context) {
    const interaction = context.scene.interaction;
    if (!interaction || interaction.mode === "none" || context.interactionResolved) return undefined;
    return decision(this.id, {
      action: "ask_question",
      confidence: 0.96,
      priority: "high",
      reason: "The scene offers a learner-led discovery opportunity before explanation.",
      payload: { interactionId: interaction.id, prompt: interaction.prompt },
    });
  },
};

export const recallOnlyWhenHelpful: MentorPolicy = {
  id: "recall-only-when-helpful",
  evaluate(context) {
    if (!context.memoryRecall || context.progress.sceneIndex > 1) return undefined;
    return decision(this.id, {
      action: "recall_memory",
      confidence: Math.min(0.95, 0.6 + context.memoryRecall.relevance / 100),
      priority: context.memoryRecall.relevance >= 12 ? "high" : "medium",
      reason: "A relevant prior learner insight can deepen the opening of this journey.",
      payload: context.memoryRecall,
    });
  },
};

export const celebrateGrowth: MentorPolicy = {
  id: "celebrate-growth",
  evaluate(context) {
    if (context.scene.kind !== "celebration") return undefined;
    return decision(this.id, {
      action: "celebrate",
      confidence: 0.98,
      priority: "high",
      reason: "The learner has reached a designed growth or completion moment.",
    });
  },
};

export const leaveRoomForSilence: MentorPolicy = {
  id: "leave-room-for-silence",
  evaluate(context) {
    if (context.scene.kind !== "reflection" || context.scene.interaction) return undefined;
    return decision(this.id, {
      action: "pause",
      confidence: 0.82,
      priority: "medium",
      reason: "A reflective scene benefits from unhurried thinking time.",
      payload: { durationMs: 3000 },
    });
  },
};

export const recommendWithContext: MentorPolicy = {
  id: "recommend-with-context",
  evaluate(context) {
    const recommendations = context.recommendations ?? context.scene.recommendationHooks;
    if (!recommendations?.length || context.progress.sceneIndex < context.progress.sceneCount - 1) return undefined;
    return decision(this.id, {
      action: "recommend",
      confidence: 0.78,
      priority: "low",
      reason: "A relevant next journey is available at a natural transition point.",
      payload: recommendations[0],
    });
  },
};

export const reflectBeforeCompletion: MentorPolicy = {
  id: "reflect-before-completion",
  evaluate(context) {
    if (context.scene.kind !== "reflection") return undefined;
    return decision(this.id, {
      action: "reflect",
      confidence: 0.9,
      priority: "high",
      reason: "The scene is explicitly designed to consolidate meaning and growth.",
    });
  },
};

export const defaultMentorPolicies: MentorPolicy[] = [
  curiosityBeforeExplanation,
  celebrateGrowth,
  reflectBeforeCompletion,
  recallOnlyWhenHelpful,
  leaveRoomForSilence,
  recommendWithContext,
];
