export type GlassRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

export type GlassTone = "light" | "dark";

const NEUTRAL = 128;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// Signed distance to a rounded rect centred at the origin, plus the outward normal.
const roundedRectField = (
  px: number,
  py: number,
  halfW: number,
  halfH: number,
  radius: number
) => {
  const qx = Math.abs(px) - (halfW - radius);
  const qy = Math.abs(py) - (halfH - radius);
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  const outside = Math.hypot(ox, oy);
  const distance = outside + Math.min(Math.max(qx, qy), 0) - radius;
  const [nx, ny] =
    outside > 0 ? [ox / outside, oy / outside] : qx > qy ? [1, 0] : [0, 1];
  return { distance, nx: nx * Math.sign(px || 1), ny: ny * Math.sign(py || 1) };
};

/**
 * RGBA pixels for an feDisplacementMap: R/G = 128 is no shift. Inside the bezel
 * the backdrop is sampled from further in, so the rim magnifies like a lens.
 */
export function displacementPixels(
  width: number,
  height: number,
  radius: number,
  bezel: number
): Uint8ClampedArray<ArrayBuffer> {
  const pixels = new Uint8ClampedArray(width * height * 4);
  const r = clamp(radius, 0, Math.min(width, height) / 2);
  const halfW = width / 2;
  const halfH = height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const { distance, nx, ny } = roundedRectField(
        x + 0.5 - halfW,
        y + 0.5 - halfH,
        halfW,
        halfH,
        r
      );
      const t = clamp(1 + distance / bezel, 0, 1);
      const strength = t * t;
      const i = (y * width + x) * 4;
      pixels[i] = NEUTRAL - nx * strength * 127;
      pixels[i + 1] = NEUTRAL - ny * strength * 127;
      pixels[i + 2] = NEUTRAL;
      pixels[i + 3] = 255;
    }
  }
  return pixels;
}

const svgUrl = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const shapes = (rects: GlassRect[], dy = 0) =>
  rects
    .map(
      r =>
        `<rect x="${r.x}" y="${r.y + dy}" width="${r.width}" height="${r.height}" rx="${r.radius}"/>`
    )
    .join("");

// blur + hard alpha threshold grows a liquid neck between shapes closer than ~2×merge; the crisp shapes are laid back on top because the blur shrinks them
const gooey = (merge: number) =>
  `<feGaussianBlur in="SourceGraphic" stdDeviation="${merge}"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -15" result="neck"/><feComposite in="SourceGraphic" in2="neck" operator="over" result="goo"/>`;

/** CSS mask-image values for a merged glass group: the body, its rim and its shadow. */
export function gooeyMasks(
  rects: GlassRect[],
  width: number,
  height: number,
  merge: number
): { shape: string; rim: string; shadow: string } {
  const open = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  const region = `x="-50%" y="-50%" width="200%" height="200%"`;
  const layer = (filter: string, dy = 0) =>
    `${open}<filter id="f" ${region}>${filter}</filter><g filter="url(#f)">${shapes(rects, dy)}</g></svg>`;
  return {
    shape: svgUrl(layer(gooey(merge))),
    rim: svgUrl(
      layer(
        `${gooey(merge)}<feMorphology in="goo" operator="erode" radius="1" result="inner"/><feComposite in="goo" in2="inner" operator="out"/>`
      )
    ),
    shadow: svgUrl(
      layer(`${gooey(merge)}<feGaussianBlur in="goo" stdDeviation="10"/>`, 6)
    ),
  };
}

/** Relative luminance (WCAG) of 0–255 sRGB channels. */
export function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

const TO_DARK_BELOW = 0.18;
const TO_LIGHT_ABOVE = 0.3;

/** Hysteresis keeps the tint from flickering while a mid-grey backdrop scrolls past. */
export function nextTone(current: GlassTone | null, lum: number): GlassTone {
  if (lum < TO_DARK_BELOW) return "dark";
  if (lum > TO_LIGHT_ABOVE) return "light";
  return (
    current ?? (lum < (TO_DARK_BELOW + TO_LIGHT_ABOVE) / 2 ? "dark" : "light")
  );
}

export type GlassTuning = {
  /** Rim shift as a multiple of the bezel width. */
  strength?: number;
  /** Width of the refracting rim in px; derived from the corner radius when unset. */
  bezel?: number;
  /** Extra shift of blue over red at the rim, as a fraction of the rim shift. */
  dispersion?: number;
  /** Frost radius in px for the regular material (clear halves it, thick doubles it). */
  blur?: number;
  /** Backdrop saturation in percent. */
  saturate?: number;
  brightness?: number;
  /** Fill colour of the pane, any CSS colour. */
  tint?: string;
  /** Opacity of the specular sheen, 0–1. */
  shine?: number;
};

type Limited = Exclude<keyof GlassTuning, "tint">;

export const TUNING_LIMITS: Record<Limited, [number, number]> = {
  strength: [0, 4],
  bezel: [0, 64],
  dispersion: [0, 0.6],
  blur: [0, 40],
  saturate: [0, 300],
  brightness: [0.5, 1.5],
  shine: [0, 1],
};

/** The value clamped to its limits, or undefined when it is not a finite number. */
export function tuned(key: Limited, value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  const [min, max] = TUNING_LIMITS[key];
  return clamp(value, min, max);
}

const MIN_BEZEL = 8;
const MAX_BEZEL = 28;
const BEZEL_PER_RADIUS = 0.8;

/** Rim width in px: the override if given, else 0.8 × radius in 8–28px, never past half the short side. */
export function lensBezel(
  radius: number,
  width: number,
  height: number,
  override?: number
): number {
  const wanted =
    tuned("bezel", override) ??
    clamp(radius * BEZEL_PER_RADIUS, MIN_BEZEL, MAX_BEZEL);
  return Math.min(wanted, Math.min(width, height) / 2);
}

/** feDisplacementMap scales for the red, green and blue passes: blue bends most, like real glass. */
export function channelScales(
  scale: number,
  dispersion: number
): [number, number, number] {
  return [scale * (1 - dispersion), scale, scale * (1 + dispersion)];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Specular vars for light coming from `degrees` (0 = top, 90 = right, clockwise);
 * 315 reproduces the default top-left light.
 */
export function lightFromAngle(degrees: number): Record<string, string> {
  const rad = (degrees * Math.PI) / 180;
  // scaled so the larger component is 1, like the CSS fallback rim (1, 1)
  const norm = Math.max(Math.abs(Math.sin(rad)), Math.abs(Math.cos(rad)));
  const sx = Math.sin(rad) / norm;
  const cy = Math.cos(rad) / norm;
  const pct = (f: number) => `${Math.round(f * 100)}%`;
  return {
    "--glass-light-x": pct(0.5 + sx * 0.5),
    "--glass-light-y": pct(0.5 - cy * 0.5),
    "--glass-rim-x": String(round2(-sx) || 0),
    "--glass-rim-y": String(round2(cy) || 0),
  };
}

/** Inline custom properties that override the theme for one pane. */
export function tuningVars(
  material: "clear" | "regular" | "thick",
  { blur, saturate, brightness, tint, shine }: GlassTuning
): Record<string, string> {
  const b = tuned("blur", blur);
  const s = tuned("saturate", saturate);
  const l = tuned("brightness", brightness);
  const h = tuned("shine", shine);
  const entries: [string, string | undefined][] = [
    ["--glass-blur", b === undefined ? undefined : `${b}px`],
    ["--glass-saturate", s === undefined ? undefined : `${s}%`],
    ["--glass-brightness", l === undefined ? undefined : String(l)],
    ["--glass-sheen", h === undefined ? undefined : `oklch(1 0 0 / ${h})`],
    [`--glass-${material}`, tint || undefined],
  ];
  return Object.fromEntries(
    entries.filter((e): e is [string, string] => e[1] !== undefined)
  );
}
