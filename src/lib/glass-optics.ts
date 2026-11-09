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
