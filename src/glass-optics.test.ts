import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  displacementPixels,
  gooeyMasks,
  luminance,
  nextTone,
} from "./lib/glass-optics";

const pixelAt = (
  pixels: Uint8ClampedArray,
  width: number,
  x: number,
  y: number
) => {
  const i = (y * width + x) * 4;
  return [pixels[i], pixels[i + 1]];
};

describe("displacementPixels", () => {
  const W = 100;
  const H = 60;
  const map = displacementPixels(W, H, 20, 16);

  it("leaves the centre unshifted", () => {
    expect(pixelAt(map, W, 50, 30)).toEqual([128, 128]);
  });

  it("samples inward at each edge so the rim magnifies", () => {
    expect(pixelAt(map, W, 0, 30)[0]).toBeGreaterThan(200);
    expect(pixelAt(map, W, W - 1, 30)[0]).toBeLessThan(56);
    expect(pixelAt(map, W, 50, 0)[1]).toBeGreaterThan(200);
    expect(pixelAt(map, W, 50, H - 1)[1]).toBeLessThan(56);
  });

  it("has no shift just inside the bezel", () => {
    expect(pixelAt(map, W, 20, 30)).toEqual([128, 128]);
  });
});

describe("gooeyMasks", () => {
  it("draws every rect into each layer", () => {
    const rects = [
      { x: 0, y: 0, width: 40, height: 40, radius: 20 },
      { x: 50, y: 0, width: 40, height: 40, radius: 20 },
    ];
    const masks = gooeyMasks(rects, 90, 40, 10);
    for (const mask of Object.values(masks)) {
      expect(decodeURIComponent(mask).match(/<rect /g)).toHaveLength(2);
    }
  });
});

describe("adaptive tone", () => {
  it("measures white and black", () => {
    expect(luminance(255, 255, 255)).toBeCloseTo(1);
    expect(luminance(0, 0, 0)).toBe(0);
  });

  it("holds its tone inside the hysteresis band", () => {
    expect(nextTone(null, 0.05)).toBe("dark");
    expect(nextTone(null, 0.8)).toBe("light");
    expect(nextTone("dark", 0.25)).toBe("dark");
    expect(nextTone("light", 0.2)).toBe("light");
  });
});

describe("theme tone overrides", () => {
  const theme = JSON.parse(readFileSync("registry.json", "utf8")).items.find(
    (item: { name: string }) => item.name === "theme"
  );

  it.each([
    ["light", "light"],
    ["dark", "dark"],
  ])("data-glass-tone=%s copies the %s theme values", (tone, scope) => {
    const block: Record<string, string> =
      theme.css["@layer base"][`[data-glass-tone="${tone}"]`];
    const vars: Record<string, string> = theme.cssVars[scope];
    const drift = Object.entries(block)
      .filter(
        ([key]) => key.startsWith("--") && vars[key.slice(2)] !== undefined
      )
      .filter(([key, value]) => vars[key.slice(2)] !== value);
    expect(drift).toEqual([]);
  });
});
