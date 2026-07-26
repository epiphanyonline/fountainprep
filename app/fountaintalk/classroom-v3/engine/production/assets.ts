import type { LivingScene } from "../types";

export interface SceneAsset {
  url: string;
  kind: "image" | "audio";
  sceneId: string;
}

export function collectSceneAssets(scene: LivingScene): SceneAsset[] {
  const assets: SceneAsset[] = [];
  if (scene.background?.src) assets.push({ url: scene.background.src, kind: "image", sceneId: scene.id });
  if (scene.ambience?.src) assets.push({ url: scene.ambience.src, kind: "audio", sceneId: scene.id });
  for (const artwork of scene.artwork ?? []) if (artwork.src) assets.push({ url: artwork.src, kind: "image", sceneId: scene.id });
  return assets;
}

export interface AssetLoader {
  load(asset: SceneAsset): Promise<void>;
}

export class BrowserAssetLoader implements AssetLoader {
  async load(asset: SceneAsset): Promise<void> {
    if (typeof window === "undefined") return;
    await new Promise<void>((resolve, reject) => {
      const element = asset.kind === "image" ? new Image() : new Audio();
      element.onload = () => resolve();
      element.oncanplaythrough = () => resolve();
      element.onerror = () => reject(new Error(`Unable to preload ${asset.url}`));
      element.src = asset.url;
      if (asset.kind === "audio") (element as HTMLAudioElement).load();
    });
  }
}

export class SceneAssetPrefetcher {
  private readonly completed = new Set<string>();
  constructor(private readonly loader: AssetLoader = new BrowserAssetLoader()) {}
  async prefetch(scenes: LivingScene[], currentIndex: number, lookahead = 1): Promise<{ loaded: number; failed: string[] }> {
    const selected = scenes.slice(currentIndex + 1, currentIndex + 1 + Math.max(0, lookahead));
    const assets = selected.flatMap(collectSceneAssets).filter((asset) => !this.completed.has(asset.url));
    const failed: string[] = [];
    await Promise.all(assets.map(async (asset) => {
      try { await this.loader.load(asset); this.completed.add(asset.url); }
      catch { failed.push(asset.url); }
    }));
    return { loaded: assets.length - failed.length, failed };
  }
}
