export interface AccessibilityPreferences {
  reducedMotion: boolean;
  captions: boolean;
  highContrast: boolean;
  fontScale: number;
}

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  reducedMotion: false,
  captions: true,
  highContrast: false,
  fontScale: 1,
};

export function normalizeAccessibilityPreferences(input?: Partial<AccessibilityPreferences>): AccessibilityPreferences {
  const fontScale = Math.min(1.5, Math.max(0.85, input?.fontScale ?? 1));
  return { ...DEFAULT_ACCESSIBILITY_PREFERENCES, ...input, fontScale };
}

export function accessibilityClassNames(input?: Partial<AccessibilityPreferences>): string[] {
  const value = normalizeAccessibilityPreferences(input);
  return [
    value.reducedMotion ? "lc-reduced-motion" : "",
    value.highContrast ? "lc-high-contrast" : "",
    value.captions ? "lc-captions" : "lc-captions-off",
  ].filter(Boolean);
}
