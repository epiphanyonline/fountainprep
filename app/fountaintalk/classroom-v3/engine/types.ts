import type { DiscoveryTheme } from "./discovery/DiscoveryDirector";
import type { CinematicDirection } from "./cinematic/CinematicDirector";
import type { JourneyPhase } from "./journey-state/JourneyPhase";

export type SubscriptionTier = "explorer" | "scholar" | "professional" | "institution";

export type SceneKind =
  | "arrival" | "story" | "documentary" | "conversation" | "discovery" | "explanation"
  | "diagram" | "whiteboard" | "comparison" | "reflection" | "assessment"
  | "simulation" | "recap" | "celebration";

export type ScenePhase =
  | "initialize" | "preload" | "arrival" | "intro" | "story" | "discovery"
  | "interaction" | "reflection" | "assessment" | "celebration"
  | "transition" | "complete";

export type CameraPreset =
  | "wide" | "medium" | "close" | "story" | "diagram" | "split"
  | "reflection" | "celebration" | "tracking" | "interview" | "whiteboard";

export type TransitionPreset = "fade" | "slide" | "zoom" | "wipe" | "dissolve" | "light";
export type ActorPosition = "far-left" | "left" | "center" | "right" | "far-right";
export type ActorAction = "enter" | "idle" | "speak" | "gesture" | "react" | "exit";

export type TimelineEventType =
  | "set-phase" | "show-background" | "show-artwork" | "hide-artwork"
  | "show-actor" | "hide-actor" | "set-actor-action" | "play-animation"
  | "start-narration" | "stop-narration" | "show-overlay" | "hide-overlay"
  | "show-interaction" | "hide-interaction" | "set-camera" | "set-ambience"
  | "memory-hook" | "recommendation-hook" | "celebrate" | "complete-scene";

export interface AccessRule {
  tier: SubscriptionTier;
  requiresModuleIds?: string[];
  requiresLessonIds?: string[];
  previewAllowed?: boolean;
}

export interface CharacterActor {
  id: string;
  assetId: string;
  displayName: string;
  role?: string;
  pose?: string;
  emotion?: "neutral" | "happy" | "curious" | "worried" | "confident" | "celebrating";
  animation?: "none" | "fade" | "walk" | "float" | "pulse" | "shake" | "glow";
  position: ActorPosition;
  scale?: number;
  depth?: number;
  visible?: boolean;
}

export interface SceneArtwork {
  id: string;
  src: string;
  alt: string;
  position?: "background" | "left" | "center" | "right";
  fit?: "cover" | "contain";
  depth?: number;
}

export interface SceneOverlay {
  id: string;
  kind: "title" | "caption" | "definition" | "verse" | "timeline" | "chart" | "vocabulary" | "key-takeaway";
  title?: string;
  body?: string;
  data?: unknown;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

export interface SceneInteraction {
  id: string;
  mode: "none" | "continue" | "choice" | "text" | "voice" | "reflection" | "discovery";
  prompt?: string;
  choices?: Array<{ id: string; label: string }>;
  acceptedAnswers?: string[];
  hint?: string;
  explanation?: string;
  skippable?: boolean;
  pauseTimeline?: boolean;
  themes?: DiscoveryTheme[];
  fallbackResponse?: string;
  challengePrompt?: string;
}

export interface MemoryHook {
  id: string;
  topic: string;
  importance: "low" | "medium" | "high";
  conceptIds?: string[];
  sceneId?: string;
}

export interface RecommendationHook {
  id: string;
  trigger: "scene_completed" | "lesson_completed" | "mastery" | "interest";
  reason: string;
  academyId: string;
  moduleId?: string;
  lessonId?: string;
  priority?: number;
}

export interface TimelineEvent {
  id: string;
  atMs: number;
  type: TimelineEventType;
  targetId?: string;
  payload?: Record<string, unknown>;
}

export interface LivingScene {
  id: string;
  kind: SceneKind;
  title: string;
  eyebrow?: string;
  displayText?: string;
  narration?: string;
  durationMs?: number;
  camera: CameraPreset;
  transition?: TransitionPreset;
  background?: { id: string; src?: string; gradient?: string; alt?: string };
  ambience?: { id: string; src?: string; volume?: number; loop?: boolean };
  artwork?: SceneArtwork[];
  actors?: CharacterActor[];
  overlays?: SceneOverlay[];
  interaction?: SceneInteraction;
  timeline?: TimelineEvent[];
  memoryHooks?: MemoryHook[];
  recommendationHooks?: RecommendationHook[];
  cinematic?: CinematicDirection;
  /** Optional author-declared emotional journey phase. Inferred from scene kind when omitted. */
  journeyPhase?: JourneyPhase;
  /** @deprecated Use memoryHooks. */
  memoryTags?: string[];
  /** @deprecated Use recommendationHooks. */
  recommendationIds?: string[];
}

export interface LivingLesson {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  scenes: LivingScene[];
  access: AccessRule;
}

export interface JourneyModule {
  id: string;
  academyId: string;
  order: number;
  title: string;
  description: string;
  storyHook?: string;
  estimatedMinutes: number;
  skills: string[];
  lessonIds: string[];
  access: AccessRule;
}

export interface LearnerProgress {
  learnerId: string;
  completedLessonIds: string[];
  completedModuleIds: string[];
  currentLessonId?: string;
  subscriptionTier: SubscriptionTier;
}
