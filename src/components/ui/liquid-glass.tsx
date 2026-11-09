import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

import {
  displacementPixels,
  gooeyMasks,
  luminance,
  nextTone,
  type GlassRect,
  type GlassTone,
} from "@/lib/glass-optics";

const REDUCED_TRANSPARENCY =
  "(prefers-reduced-transparency: reduce), (prefers-contrast: more)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const BLUR_SCALE = { clear: 0.5, regular: 1, thick: 2 } as const;
// the lens needs a clearer pane than plain frost or the bent backdrop blurs away
const LENS_BLUR = 0.45;
const DEFAULT_BLUR = 14;
const MAX_BEZEL = 28;
const MIN_BEZEL = 8;
// rim shift = scale / 2 = 1.2 × bezel; measured on the playground stripes, text stays legible
const LENS_STRENGTH = 2.4;
const GROUP_PAD = 16;

type Material = keyof typeof BLUR_SCALE;

// Only Chromium renders url() filters inside backdrop-filter; Safari parses them and drops the whole backdrop.
const supportsLens = () =>
  typeof navigator !== "undefined" &&
  ((
    navigator as { userAgentData?: { brands?: { brand: string }[] } }
  ).userAgentData?.brands?.some(b => b.brand === "Chromium") ??
    false);

const matches = (query: string) =>
  typeof matchMedia !== "undefined" && matchMedia(query).matches;

type Lens = {
  map: string;
  width: number;
  height: number;
  blur: number;
  scale: number;
};

function buildLens(el: HTMLElement, material: Material): Lens | null {
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!width || !height || !ctx) return null;
  const style = getComputedStyle(el);
  const radius = parseFloat(style.borderTopLeftRadius) || 0;
  const bezel = Math.min(
    MAX_BEZEL,
    Math.max(MIN_BEZEL, radius * 0.8),
    Math.min(width, height) / 2
  );
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.putImageData(
    new ImageData(
      displacementPixels(width, height, radius, bezel),
      width,
      height
    ),
    0,
    0
  );
  const blur =
    (parseFloat(style.getPropertyValue("--glass-blur")) || DEFAULT_BLUR) *
    BLUR_SCALE[material] *
    LENS_BLUR;
  return {
    map: ctx.canvas.toDataURL(),
    width,
    height,
    blur,
    scale: bezel * LENS_STRENGTH,
  };
}

function useLens(el: HTMLElement | null, enabled: boolean, material: Material) {
  const [lens, setLens] = React.useState<Lens | null>(null);
  React.useEffect(() => {
    if (!enabled || !el || !supportsLens()) return;
    let frame = 0;
    const build = () => {
      frame = 0;
      setLens(matches(REDUCED_TRANSPARENCY) ? null : buildLens(el, material));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(build);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    const query = matchMedia(REDUCED_TRANSPARENCY);
    query.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      query.removeEventListener("change", schedule);
      setLens(null);
    };
  }, [el, enabled, material]);
  return lens;
}

function useSpecular(el: HTMLElement | null, enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || !el || matches(REDUCED_MOTION)) return;
    let frame = 0;
    let light: [number, number] | null = null;
    const apply = () => {
      frame = 0;
      if (!light) return;
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const fx = (light[0] - box.left) / box.width;
      const fy = (light[1] - box.top) / box.height;
      const dx = fx - 0.5;
      const dy = fy - 0.5;
      const length = Math.hypot(dx, dy);
      const [rx, ry] = length < 0.05 ? [1, 1] : [-dx / length, -dy / length];
      const clampPct = (f: number) =>
        `${Math.round(Math.min(1.25, Math.max(-0.25, f)) * 100)}%`;
      el.style.setProperty("--glass-light-x", clampPct(fx));
      el.style.setProperty("--glass-light-y", clampPct(fy));
      el.style.setProperty("--glass-rim-x", rx.toFixed(2));
      el.style.setProperty("--glass-rim-y", ry.toFixed(2));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      light = [event.clientX, event.clientY];
      schedule();
    };
    // shortcut: iOS needs DeviceOrientationEvent.requestPermission() from a tap; there the light stays top-left
    const onTilt = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      const box = el.getBoundingClientRect();
      light = [
        box.left + box.width * (0.5 - event.gamma / 90),
        box.top + box.height * (0.5 - (event.beta - 45) / 90),
      ];
      schedule();
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
      for (const name of ["x", "y"]) {
        el.style.removeProperty(`--glass-light-${name}`);
        el.style.removeProperty(`--glass-rim-${name}`);
      }
    };
  }, [el, enabled]);
}

const colorCache = new Map<string, number[]>();

function rgbaOf(color: string, ctx: CanvasRenderingContext2D): number[] {
  const cached = colorCache.get(color);
  if (cached) return cached;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const rgba = [...ctx.getImageData(0, 0, 1, 1).data];
  colorCache.set(color, rgba);
  return rgba;
}

// shortcut: images and gradients have no readable colour; mark them with data-glass-backdrop="dark|light"
function backdropLuminance(
  el: HTMLElement,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D
): number | null {
  for (const node of document.elementsFromPoint(x, y)) {
    if (el.contains(node) || !(node instanceof HTMLElement)) continue;
    const declared = node.dataset.glassBackdrop;
    if (declared === "dark") return 0;
    if (declared === "light") return 1;
    const [r, g, b, a] = rgbaOf(getComputedStyle(node).backgroundColor, ctx);
    if (a > 127) return luminance(r, g, b);
  }
  return null;
}

const SAMPLE_POINTS = [0.2, 0.5, 0.8];

function useAdaptiveTone(el: HTMLElement | null, enabled: boolean) {
  React.useEffect(() => {
    const ctx = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true });
    if (!enabled || !el || !ctx) return;
    let frame = 0;
    let tone: GlassTone | null = null;
    const sample = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const values = SAMPLE_POINTS.map(f =>
        backdropLuminance(
          el,
          box.left + box.width * f,
          box.top + box.height / 2,
          ctx
        )
      ).filter((v): v is number => v !== null);
      if (!values.length) return;
      const next = nextTone(
        tone,
        values.reduce((sum, v) => sum + v, 0) / values.length
      );
      if (next === tone) return;
      tone = next;
      el.dataset.glassTone = next;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sample);
    };
    schedule();
    const resize = new ResizeObserver(schedule);
    resize.observe(el);
    const theme = new MutationObserver(schedule);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });
    window.addEventListener("scroll", schedule, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      delete el.dataset.glassTone;
    };
  }, [el, enabled]);
}

type LiquidGlassOptions = {
  material?: Material;
  refraction?: boolean;
  specular?: boolean;
  adaptive?: boolean;
};

/** Attach lensing, moving light and adaptive tint to any element that already has a glass* class. */
function useLiquidGlass<T extends HTMLElement>({
  material = "regular",
  refraction = true,
  specular = true,
  adaptive = false,
}: LiquidGlassOptions = {}) {
  // state, not useRef: a `render` prop that swaps the element must re-run the effects on the new node
  const [node, ref] = React.useState<T | null>(null);
  const id = `liquid-lens-${React.useId().replace(/[^\w-]/g, "")}`;
  const lens = useLens(node, refraction, material);
  useSpecular(node, specular);
  useAdaptiveTone(node, adaptive);
  const backdrop = `url(#${id}) saturate(var(--glass-saturate)) brightness(var(--glass-brightness))`;
  return {
    ref,
    style: lens
      ? { backdropFilter: backdrop, WebkitBackdropFilter: backdrop }
      : undefined,
    filter: lens ? (
      <svg
        aria-hidden
        width="0"
        height="0"
        className="pointer-events-none absolute"
      >
        <filter
          id={id}
          x="0"
          y="0"
          width={lens.width}
          height={lens.height}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={lens.blur}
            result="blur"
          />
          <feImage
            href={lens.map}
            x="0"
            y="0"
            width={lens.width}
            height={lens.height}
            preserveAspectRatio="none"
            result="map"
          />
          <feDisplacementMap
            in="blur"
            in2="map"
            scale={lens.scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    ) : null,
  };
}

const liquidGlassVariants = cva(
  "transition-[background-color,color] duration-300",
  {
    variants: {
      material: {
        clear: "glass-clear",
        regular: "glass",
        thick: "glass-thick",
      },
    },
    defaultVariants: { material: "regular" },
  }
);

type LiquidGlassProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof liquidGlassVariants> &
  Omit<LiquidGlassOptions, "material">;

function LiquidGlass({
  className,
  material,
  refraction,
  specular,
  adaptive,
  render,
  children,
  style,
  ...props
}: LiquidGlassProps) {
  const glass = useLiquidGlass<HTMLDivElement>({
    material: material ?? "regular",
    refraction,
    specular,
    adaptive,
  });
  return useRender({
    defaultTagName: "div",
    // setState setter: stable identity, so React does not detach and re-attach it every render
    ref: glass.ref as React.Ref<Element>,
    render,
    props: mergeProps<"div">(
      {
        className: cn(liquidGlassVariants({ material }), className),
        style: { ...glass.style, ...style },
        children: (
          <>
            {glass.filter}
            {children}
          </>
        ),
      },
      props
    ),
    state: { slot: "liquid-glass" },
  });
}

type LiquidGlassGroupProps = React.ComponentProps<"div"> & {
  /** Blur radius of the merge: shapes closer than about twice this fuse. */
  merge?: number;
};

const setMask = (el: HTMLElement | null, mask: string) => {
  if (!el) return;
  el.style.maskImage = mask;
  el.style.setProperty("-webkit-mask-image", mask);
};

/** Apple's glass container: every LiquidGlassItem inside shares one sheet of glass that fuses when they touch. */
function LiquidGlassGroup({
  className,
  merge = 10,
  children,
  ...props
}: LiquidGlassGroupProps) {
  const groupRef = React.useRef<HTMLDivElement>(null);
  const shapeRef = React.useRef<HTMLDivElement>(null);
  const rimRef = React.useRef<HTMLDivElement>(null);
  const shadowRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    let frame = 0;
    let last = "";
    const items = () =>
      group.querySelectorAll<HTMLElement>("[data-slot=liquid-glass-item]");
    const draw = () => {
      const box = group.getBoundingClientRect();
      const rects: GlassRect[] = [...items()].map(item => {
        const r = item.getBoundingClientRect();
        const radius =
          parseFloat(getComputedStyle(item).borderTopLeftRadius) || 0;
        return {
          x: Math.round(r.left - box.left + GROUP_PAD),
          y: Math.round(r.top - box.top + GROUP_PAD),
          width: Math.round(r.width),
          height: Math.round(r.height),
          radius: Math.min(radius, r.width / 2, r.height / 2),
        };
      });
      const width = Math.round(box.width + GROUP_PAD * 2);
      const height = Math.round(box.height + GROUP_PAD * 2);
      const key = JSON.stringify([rects, width, height]);
      if (key !== last) {
        last = key;
        const masks = gooeyMasks(rects, width, height, merge);
        setMask(shapeRef.current, masks.shape);
        setMask(rimRef.current, masks.rim);
        setMask(shadowRef.current, masks.shadow);
      }
      // keep redrawing while any item is mid-transition so the glass follows it
      frame = group.getAnimations({ subtree: true }).length
        ? requestAnimationFrame(draw)
        : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(kick);
    const observeAll = () => {
      resize.disconnect();
      resize.observe(group);
      items().forEach(item => resize.observe(item));
      kick();
    };
    observeAll();
    const mutations = new MutationObserver(observeAll);
    mutations.observe(group, { childList: true, subtree: true });
    const events = ["transitionrun", "animationstart"] as const;
    events.forEach(name => group.addEventListener(name, kick));
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      events.forEach(name => group.removeEventListener(name, kick));
    };
  }, [merge]);

  const layer =
    "pointer-events-none absolute -z-10 [mask-repeat:no-repeat] [mask-size:100%_100%]";
  return (
    <div
      ref={groupRef}
      data-slot="liquid-glass-group"
      className={cn("relative isolate", className)}
      {...props}
    >
      <div
        aria-hidden
        ref={shadowRef}
        style={{ inset: -GROUP_PAD }}
        className={cn(layer, "bg-[oklch(0.25_0.04_260/0.2)] dark:bg-black/45")}
      />
      <div
        aria-hidden
        ref={shapeRef}
        className={cn(layer, "glass")}
        style={{ inset: -GROUP_PAD, boxShadow: "none" }}
      />
      <div
        aria-hidden
        ref={rimRef}
        style={{ inset: -GROUP_PAD }}
        className={cn(
          layer,
          "bg-[linear-gradient(135deg,var(--glass-rim-hi),var(--glass-rim-lo)_55%,var(--glass-rim-hi))]"
        )}
      />
      {children}
    </div>
  );
}

function LiquidGlassItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cn("rounded-full", className) },
      props
    ),
    state: { slot: "liquid-glass-item" },
  });
}

export {
  LiquidGlass,
  LiquidGlassGroup,
  LiquidGlassItem,
  liquidGlassVariants,
  useLiquidGlass,
};
