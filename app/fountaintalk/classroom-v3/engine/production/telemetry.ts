export type RuntimeTelemetryName =
  | "classroom_started"
  | "scene_entered"
  | "scene_completed"
  | "interaction_resolved"
  | "asset_prefetch_started"
  | "asset_prefetch_failed"
  | "runtime_error"
  | "journey_resumed";

export interface RuntimeTelemetryEvent {
  name: RuntimeTelemetryName;
  occurredAt: string;
  lessonId?: string;
  sceneId?: string;
  learnerId?: string;
  durationMs?: number;
  attributes?: Record<string, string | number | boolean | null>;
}

export interface RuntimeTelemetrySink {
  emit(event: RuntimeTelemetryEvent): void | Promise<void>;
}

export class BufferedTelemetrySink implements RuntimeTelemetrySink {
  private readonly buffer: RuntimeTelemetryEvent[] = [];
  constructor(private readonly flushHandler: (events: RuntimeTelemetryEvent[]) => void | Promise<void>, private readonly maxSize = 20) {}
  emit(event: RuntimeTelemetryEvent): void {
    this.buffer.push(event);
    if (this.buffer.length >= this.maxSize) void this.flush();
  }
  async flush(): Promise<void> {
    if (!this.buffer.length) return;
    const batch = this.buffer.splice(0, this.buffer.length);
    await this.flushHandler(batch);
  }
  snapshot(): readonly RuntimeTelemetryEvent[] { return [...this.buffer]; }
}

export function createTelemetryEvent(name: RuntimeTelemetryName, input: Omit<RuntimeTelemetryEvent, "name" | "occurredAt"> = {}): RuntimeTelemetryEvent {
  return { name, occurredAt: new Date().toISOString(), ...input };
}
