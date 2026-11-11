import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

import {
  CHANNEL_MATRICES,
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
  type GlassRect,
  type GlassTone,
  type GlassTuning,
} from "@/lib/glass-optics";

const REDUCED_TRANSPARENCY =
  "(prefers-reduced-transparency: reduce), (prefers-contrast: more)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const BLUR_SCALE = { clear: 0.5, regular: 1, thick: 2 } as const;
// the lens needs a clearer pane than plain frost or the bent backdrop blurs away
const LENS_BLUR = 0.45;
const DEFAULT_BLUR = 14;
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
  dispersion: number;
};

type LensShape = Pick<GlassTuning, "bezel" | "strength" | "dispersion">;

function buildLens(
  el: HTMLElement,
  material: Material,
  shape: LensShape
): Lens | null {
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!width || !height || !ctx) return null;
  const style = getComputedStyle(el);
  const radius = parseFloat(style.borderTopLeftRadius) || 0;
  const bezel = lensBezel(radius, width, height, shape.bezel);
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
    scale: bezel * (tuned("strength", shape.strength) ?? LENS_STRENGTH),
    dispersion: tuned("dispersion", shape.dispersion) ?? 0,
  };
}

function useLens(
  el: HTMLElement | null,
  enabled: boolean,
  material: Material,
  { bezel, strength, dispersion, blur }: LensShape & Pick<GlassTuning, "blur">
) {
  const [lens, setLens] = React.useState<Lens | null>(null);
  React.useEffect(() => {
    if (!enabled || !el || !supportsLens()) return;
    let frame = 0;
    const build = () => {
      frame = 0;
      setLens(
        matches(REDUCED_TRANSPARENCY)
          ? null
          : buildLens(el, material, { bezel, strength, dispersion })
      );
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
    };
    // blur is read back from the computed --glass-blur, so a new value must rebuild
  }, [el, enabled, material, bezel, strength, dispersion, blur]);
  // the old lens stays up until the rebuild lands; nulling it would flash full frost for a frame on every prop change
  return enabled && el ? lens : null;
}

type PointerArea = HTMLElement | null | undefined;

const listenTarget = (area: PointerArea): EventTarget => area ?? window;

function useLight(
  el: HTMLElement | null,
  follow: boolean,
  angle: number | undefined,
  area: PointerArea
) {
  React.useEffect(() => {
    if (!el) return;
    const fixed =
      angle !== undefined && Number.isFinite(angle)
        ? lightFromAngle(angle)
        : null;
    const names = ["x", "y"].flatMap(n => [
      `--glass-light-${n}`,
      `--glass-rim-${n}`,
    ]);
    const clear = () => names.forEach(n => el.style.removeProperty(n));
    if (fixed)
      Object.entries(fixed).forEach(([k, v]) => el.style.setProperty(k, v));
    // only clear what this hook wrote: vars passed through `style` must survive
    if (!follow || matches(REDUCED_MOTION)) return fixed ? clear : undefined;
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
    const target = listenTarget(area);
    target.addEventListener("pointermove", onPointer as EventListener, {
      passive: true,
    });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("pointermove", onPointer as EventListener);
      window.removeEventListener("deviceorientation", onTilt);
      clear();
    };
  }, [el, follow, angle, area]);
}

function useElastic(
  el: HTMLElement | null,
  elasticity: number | undefined,
  area: PointerArea
) {
  React.useEffect(() => {
    const e = tuned("elasticity", elasticity) ?? 0;
    if (!el || !e || matches(REDUCED_MOTION)) return;
    let frame = 0;
    let pose = REST_POSE;
    let goal = REST_POSE;
    // individual translate/scale, not transform: glass-press owns transform for its hover scale.
    // shortcut: while leaning this overrides translate-*/scale-* classes and a style translate/scale; wrap the pane if it needs its own
    const clear = () => {
      el.style.removeProperty("translate");
      el.style.removeProperty("scale");
    };
    const step = () => {
      pose = settlePose(pose, goal);
      frame = pose === goal ? 0 : requestAnimationFrame(step);
      if (pose === REST_POSE) return clear();
      el.style.translate = `${pose.tx.toFixed(2)}px ${pose.ty.toFixed(2)}px`;
      el.style.scale = `${pose.sx.toFixed(4)} ${pose.sy.toFixed(4)}`;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = el.getBoundingClientRect();
      // the box already carries the current lean; take it back out so the pane does not chase itself
      const next = elasticPose(
        event.clientX,
        event.clientY,
        {
          cx: box.left + box.width / 2 - pose.tx,
          cy: box.top + box.height / 2 - pose.ty,
          width: el.offsetWidth,
          height: el.offsetHeight,
        },
        e
      );
      if (next === REST_POSE && pose === REST_POSE) return;
      goal = next;
      kick();
    };
    const onLeave = () => {
      goal = REST_POSE;
      kick();
    };
    const target = listenTarget(area);
    const exit = area ?? document.documentElement;
    target.addEventListener("pointermove", onMove as EventListener, {
      passive: true,
    });
    exit.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("pointermove", onMove as EventListener);
      exit.removeEventListener("pointerleave", onLeave);
      clear();
    };
  }, [el, elasticity, area]);
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

type LiquidGlassOptions = GlassTuning & {
  material?: Material;
  refraction?: boolean;
  specular?: boolean;
  adaptive?: boolean;
  /** Where the light comes from in degrees (0 = top, clockwise); the pointer still moves it while `specular` is on. */
  lightAngle?: number;
  /** Only pointer moves inside this element drive the light and the stretch; defaults to the whole window. Pass the element (e.g. from a state ref), not a ref object, so a remount rebinds. */
  pointerArea?: HTMLElement | null;
};

function LensFilter({ id, lens }: { id: string; lens: Lens }) {
  const displace = (scale: number, result?: string) => (
    <feDisplacementMap
      in="blur"
      in2="map"
      scale={scale}
      xChannelSelector="R"
      yChannelSelector="G"
      result={result}
    />
  );
  const scales = channelScales(lens.scale, lens.dispersion);
  return (
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
        {lens.dispersion > 0 ? (
          <>
            {CHANNEL_MATRICES.map(({ name, matrix }, i) => (
              <React.Fragment key={name}>
                {displace(scales[i], `${name}-shift`)}
                <feColorMatrix
                  in={`${name}-shift`}
                  values={matrix}
                  result={name}
                />
              </React.Fragment>
            ))}
            {/* screen adds the channels: each layer is zero in the other two. Exact on an opaque backdrop; a translucent one comes out slightly more opaque */}
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </>
        ) : (
          displace(lens.scale)
        )}
      </filter>
    </svg>
  );
}

/** Attach lensing, moving light and adaptive tint to any element that already has a glass* class. */
function useLiquidGlass<T extends HTMLElement>({
  material = "regular",
  refraction = true,
  specular = true,
  adaptive = false,
  lightAngle,
  pointerArea,
  strength,
  bezel,
  dispersion,
  elasticity,
  ...tuning
}: LiquidGlassOptions = {}) {
  // state, not useRef: a `render` prop that swaps the element must re-run the effects on the new node
  const [node, ref] = React.useState<T | null>(null);
  const id = `liquid-lens-${React.useId().replace(/[^\w-]/g, "")}`;
  const lens = useLens(node, refraction, material, {
    bezel,
    strength,
    dispersion,
    blur: tuning.blur,
  });
  useLight(node, specular, lightAngle, pointerArea);
  useElastic(node, elasticity, pointerArea);
  useAdaptiveTone(node, adaptive);
  const backdrop = `url(#${id}) saturate(var(--glass-saturate)) brightness(var(--glass-brightness))`;
  const vars = tuningVars(material, tuning) as React.CSSProperties;
  return {
    ref,
    style: lens
      ? { ...vars, backdropFilter: backdrop, WebkitBackdropFilter: backdrop }
      : vars,
    filter: lens ? <LensFilter id={id} lens={lens} /> : null,
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
  lightAngle,
  pointerArea,
  strength,
  bezel,
  dispersion,
  elasticity,
  blur,
  saturate,
  brightness,
  tint,
  shine,
  rim,
  glow,
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
    lightAngle,
    pointerArea,
    strength,
    bezel,
    dispersion,
    elasticity,
    blur,
    saturate,
    brightness,
    tint,
    shine,
    rim,
    glow,
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
