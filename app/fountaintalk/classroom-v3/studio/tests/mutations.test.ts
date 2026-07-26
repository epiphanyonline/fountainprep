import { describe, expect, it } from "vitest";
import { davidBeforeTheGiant } from "../../content/david-before-the-giant/journey";
import { updateScene } from "../core/mutations";

describe("story mutations", () => {
  it("updates a scene without mutating the source story", () => {
    const scene = davidBeforeTheGiant.scenes[0];
    const next = updateScene(davidBeforeTheGiant, scene.id, { title: "Changed" });
    expect(next.scenes[0].title).toBe("Changed");
    expect(davidBeforeTheGiant.scenes[0].title).not.toBe("Changed");
  });
});
