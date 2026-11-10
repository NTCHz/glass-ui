import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  channelScales,
  displacementPixels,
  gooeyMasks,
  lensBezel,
  lightFromAngle,
  luminance,
  nextTone,
  tuned,
  tuningVars,
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

describe("tuned", () => {
  it("clamps to the limits", () => {
    expect(tuned("strength", 9)).toBe(4);
    expect(tuned("blur", -3)).toBe(0);
    expect(tuned("dispersion", 0.2)).toBe(0.2);
  });

  it("drops missing and non-finite values", () => {
    expect(tuned("strength", undefined)).toBeUndefined();
    expect(tuned("strength", Number.NaN)).toBeUndefined();
    expect(tuned("bezel", Infinity)).toBeUndefined();
  });
});

describe("lensBezel", () => {
  it("derives 0.8 × radius within 8–28px when unset", () => {
    expect(lensBezel(20, 200, 100)).toBe(16);
    expect(lensBezel(2, 200, 100)).toBe(8);
    expect(lensBezel(999, 200, 100)).toBe(28);
  });

  it("uses the override, clamped, but never past half the short side", () => {
    expect(lensBezel(20, 200, 100, 40)).toBe(40);
    expect(lensBezel(20, 200, 60, 40)).toBe(30);
    expect(lensBezel(20, 200, 100, 0)).toBe(0);
  });
});

describe("channelScales", () => {
  it("is one scale for all channels without dispersion", () => {
    expect(channelScales(30, 0)).toEqual([30, 30, 30]);
  });

  it("bends blue more than red", () => {
    const [r, g, b] = channelScales(30, 0.2);
    expect(r).toBeCloseTo(24);
    expect(g).toBe(30);
    expect(b).toBeCloseTo(36);
  });
});

describe("lightFromAngle", () => {
  it("reproduces the default top-left light at 315°", () => {
    expect(lightFromAngle(315)).toEqual({
      "--glass-light-x": "0%",
      "--glass-light-y": "0%",
      "--glass-rim-x": "1",
      "--glass-rim-y": "1",
    });
  });

  it("lights the top edge at 0°", () => {
    expect(lightFromAngle(0)).toEqual({
      "--glass-light-x": "50%",
      "--glass-light-y": "0%",
      "--glass-rim-x": "0",
      "--glass-rim-y": "1",
    });
  });
});

describe("tuningVars", () => {
  it("sets nothing by default so the theme wins", () => {
    expect(tuningVars("regular", {})).toEqual({});
  });

  it("maps each option to its theme variable, clamped", () => {
    expect(
      tuningVars("thick", {
        blur: 99,
        saturate: 150,
        brightness: 1.1,
        shine: 0.3,
        tint: "oklch(0.7 0.1 250 / 0.4)",
      })
    ).toEqual({
      "--glass-blur": "40px",
      "--glass-saturate": "150%",
      "--glass-brightness": "1.1",
      "--glass-sheen": "oklch(1 0 0 / 0.3)",
      "--glass-thick": "oklch(0.7 0.1 250 / 0.4)",
    });
  });
});
