import { describe, expect, it } from "vitest";
import { accessibilityClassNames, collectSceneAssets, normalizeAccessibilityPreferences, SceneAssetPrefetcher } from "../engine/production";
import type { LivingScene } from "../engine/types";

const scene: LivingScene = {
  id: "s1", kind: "story", title: "Scene", camera: "wide",
  background: { id: "bg", src: "/bg.jpg", alt: "A valley" },
  ambience: { id: "wind", src: "/wind.mp3" },
  artwork: [{ id: "art", src: "/art.png", alt: "David" }],
};

describe("production runtime", () => {
  it("normalizes accessibility preferences", () => {
    expect(normalizeAccessibilityPreferences({ fontScale: 3 }).fontScale).toBe(1.5);
    expect(accessibilityClassNames({ reducedMotion: true })).toContain("lc-reduced-motion");
  });
  it("collects scene assets", () => expect(collectSceneAssets(scene)).toHaveLength(3));
  it("prefetches only lookahead scenes", async () => {
    const loaded: string[] = [];
    const prefetcher = new SceneAssetPrefetcher({ load: async (asset) => { loaded.push(asset.url); } });
    const result = await prefetcher.prefetch([scene, { ...scene, id: "s2", background: { id: "bg2", src: "/next.jpg", alt: "Next" }, ambience: undefined, artwork: [] }], 0, 1);
    expect(result.loaded).toBe(1);
    expect(loaded).toEqual(["/next.jpg"]);
  });
});
