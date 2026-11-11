import { NEUTRAL } from "@/lib/glass-optics";

export const REDUCED_TRANSPARENCY =
  "(prefers-reduced-transparency: reduce), (prefers-contrast: more)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export const matches = (query: string): boolean =>
  typeof matchMedia !== "undefined" && matchMedia(query).matches;

// Only Chromium renders url() filters inside backdrop-filter; Safari parses them and drops the whole backdrop.
export const supportsBackdropLens = (): boolean =>
  typeof navigator !== "undefined" &&
  ((
    navigator as { userAgentData?: { brands?: { brand: string }[] } }
  ).userAgentData?.brands?.some(b => b.brand === "Chromium") ??
    false);

export type PlacedLens = { pixels: ImageData; x: number; y: number };

// One map the size of the content, neutral except under each lens. Positioning lenses with
// feImage x/y instead breaks in WebKit, which reads primitive coordinates from the page origin
// rather than the element and then drops the whole filter.
export function displacementMapUrl(
  width: number,
  height: number,
  lenses: readonly PlacedLens[]
): string | null {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.fillStyle = `rgb(${NEUTRAL} ${NEUTRAL} ${NEUTRAL})`;
  ctx.fillRect(0, 0, width, height);
  lenses.forEach(l => ctx.putImageData(l.pixels, l.x, l.y));
  return ctx.canvas.toDataURL();
}

/** PNG data URL of one lens's displacement pixels; build it once per shape. */
export function lensImageUrl(pixels: ImageData): string | null {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.canvas.width = pixels.width;
  ctx.canvas.height = pixels.height;
  ctx.putImageData(pixels, 0, 0);
  return ctx.canvas.toDataURL();
}

export type PlacedImage = {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Same map as displacementMapUrl, but an SVG that places prebuilt lens PNGs on neutral grey:
// re-placing lenses is string work, where re-encoding a 1200×4000 canvas took 34ms a frame in WebKit.
export function displacementSvgUrl(
  width: number,
  height: number,
  lenses: readonly PlacedImage[]
): string {
  const images = lenses
    .map(
      l =>
        `<image href="${l.url}" x="${l.x}" y="${l.y}" width="${l.width}" height="${l.height}" preserveAspectRatio="none" image-rendering="pixelated"/>`
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="rgb(${NEUTRAL},${NEUTRAL},${NEUTRAL})"/>${images}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
