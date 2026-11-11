import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  channelScales,
  displacementPixels,
  elasticPose,
  gooeyMasks,
  lensBezel,
  lightFromAngle,
  luminance,
  nextTone,
  REST_POSE,
  settlePose,
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

// the per-pixel version displacementPixels replaced; the quadrant copy must match it exactly
const referencePixels = (
  w: number,
  h: number,
  radius: number,
  bezel: number
) => {
  const pixels = new Uint8ClampedArray(w * h * 4);
  const r = Math.min(Math.max(radius, 0), Math.min(w, h) / 2);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - w / 2;
      const py = y + 0.5 - h / 2;
      const qx = Math.abs(px) - (w / 2 - r);
      const qy = Math.abs(py) - (h / 2 - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const out = Math.hypot(ox, oy);
      const d = out + Math.min(Math.max(qx, qy), 0) - r;
      const [nx, ny] =
        out > 0 ? [ox / out, oy / out] : qx > qy ? [1, 0] : [0, 1];
      const t = Math.min(Math.max(1 + d / bezel, 0), 1);
      const i = (y * w + x) * 4;
      pixels[i] = 128 - nx * Math.sign(px || 1) * t * t * 127;
      pixels[i + 1] = 128 - ny * Math.sign(py || 1) * t * t * 127;
      pixels[i + 2] = 128;
      pixels[i + 3] = 255;
    }
  return pixels;
};

describe("displacementPixels quadrant copy", () => {
  it.each([
    [100, 60, 20, 16],
    [101, 61, 30, 12],
    [7, 9, 3, 3],
    [240, 44, 22, 18],
  ])("matches the per-pixel field at %ix%i", (w, h, radius, bezel) => {
    expect(displacementPixels(w, h, radius, bezel)).toEqual(
      referencePixels(w, h, radius, bezel)
    );
  });
});

describe("rim and glow", () => {
  it("set the theme's rim and glow alpha", () => {
    expect(tuningVars("regular", { rim: 0.5, glow: 2 })).toEqual({
      "--glass-rim-hi": "oklch(1 0 0 / 0.5)",
      "--glass-glow": "oklch(1 0 0 / 1)",
    });
  });
});

describe("elasticPose", () => {
  const box = { cx: 100, cy: 100, width: 100, height: 40 };

  it("rests when elasticity is 0 or the pointer is out of reach", () => {
    expect(elasticPose(180, 100, box, 0)).toEqual(REST_POSE);
    expect(elasticPose(1000, 100, box, 1)).toEqual(REST_POSE);
  });

  it("leans toward the pointer and stretches along that axis", () => {
    const pose = elasticPose(180, 100, box, 1);
    expect(pose.tx).toBeGreaterThan(0);
    expect(pose.ty).toBe(0);
    expect(pose.sx).toBeGreaterThan(1);
    expect(pose.sy).toBeLessThan(1);
  });

  it("fades to rest at the edge of its reach", () => {
    expect(elasticPose(309, 100, box, 1).sx - 1).toBeLessThan(0.01);
    expect(elasticPose(310, 100, box, 1)).toEqual(REST_POSE);
  });
});

describe("settlePose", () => {
  it("eases toward the goal and snaps when close", () => {
    const goal = { tx: 10, ty: 0, sx: 1.1, sy: 0.95 };
    const step = settlePose(REST_POSE, goal);
    expect(step.tx).toBeCloseTo(1.8);
    let pose = REST_POSE;
    for (let i = 0; i < 100; i++) pose = settlePose(pose, goal);
    expect(pose).toBe(goal);
  });
});

describe("displacementPixels clip", () => {
  const W = 60;
  const shift = (map: Uint8ClampedArray, x: number, y: number) => {
    const i = (y * W + x) * 4;
    return [map[i], map[i + 1]];
  };

  it("is neutral in the cut-off corners and still bends along the edges", () => {
    const map = displacementPixels(W, 40, 20, 12, true);
    expect(shift(map, 0, 0)).toEqual([128, 128]);
    expect(shift(map, W - 1, 39)).toEqual([128, 128]);
    expect(shift(map, 30, 0)[1]).toBeGreaterThan(200);
  });

  it("shifts the corners without clip", () => {
    const map = displacementPixels(W, 40, 20, 12);
    expect(shift(map, 0, 0)).not.toEqual([128, 128]);
  });
});
