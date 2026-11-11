"use client";

import { cn } from "cn";
import * as React from "react";

import {
  displacementSvgUrl,
  lensImageUrl,
  matches,
  REDUCED_TRANSPARENCY,
  supportsBackdropLens,
  type PlacedImage,
} from "@/lib/glass-dom";
import {
  displacementPixels,
  lensBezel,
  scaleDisplacement,
  tuned,
} from "@/lib/glass-optics";

// same as LiquidLens: past 1 the rim folds the content back on itself
const SCOPE_STRENGTH = 0.9;
const PIXEL_CACHE = 32;

type Pane = { bezel?: number };

type Scope = {
  /** Panes call this; returns the unregister. */
  register: (el: HTMLElement, pane: Pane) => () => void;
  setContent: (el: HTMLElement | null) => void;
  /** True when this scope bends the content in place of a backdrop lens. */
  active: boolean;
  lens: { id: string; map: string; scale: number } | null;
};

const ScopeContext = React.createContext<Scope | null>(null);

// reduced transparency switched on at runtime turns the scope off, like the backdrop lens
const subscribeTransparency = (onChange: () => void) => {
  const query = matchMedia(REDUCED_TRANSPARENCY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/** The scope a LiquidGlass sits in, and whether it should register with it. */
function useGlassScope(
  el: HTMLElement | null,
  enabled: boolean,
  bezel: number | undefined
): boolean {
  const scope = React.useContext(ScopeContext);
  const register = scope?.register;
  const active = Boolean(scope?.active && enabled);
  React.useEffect(() => {
    if (!active || !el || !register) return;
    return register(el, { bezel });
  }, [active, el, register, bezel]);
  return active;
}

type Placed = { key: string; lens: PlacedImage };

function placePanes(
  content: HTMLElement,
  panes: Map<HTMLElement, Pane>,
  cache: Map<string, string | null>
): { placed: Placed[]; maxBezel: number } {
  const box = content.getBoundingClientRect();
  const shapes = [...panes].flatMap(([el, pane]) => {
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    if (!width || !height) return [];
    const r = el.getBoundingClientRect();
    const radius = Math.min(
      parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0,
      width / 2,
      height / 2
    );
    // the rect includes any translate/scale (elasticity); the map uses the layout size at that spot
    const x = Math.round(r.left - box.left + (r.width - width) / 2);
    const y = Math.round(r.top - box.top + (r.height - height) / 2);
    return [
      {
        x,
        y,
        width,
        height,
        radius,
        bezel: lensBezel(radius, width, height, pane.bezel),
      },
    ];
  });
  const maxBezel = Math.max(0, ...shapes.map(s => s.bezel));
  const placed = shapes.flatMap(s => {
    const factor = s.bezel / maxBezel;
    const key = [s.width, s.height, s.radius, s.bezel, factor].join(":");
    if (!cache.has(key)) {
      if (cache.size >= PIXEL_CACHE) cache.clear();
      const pixels = displacementPixels(
        s.width,
        s.height,
        s.radius,
        s.bezel,
        true
      );
      cache.set(
        key,
        lensImageUrl(
          new ImageData(scaleDisplacement(pixels, factor), s.width, s.height)
        )
      );
    }
    const url = cache.get(key);
    if (!url) return [];
    return [
      {
        key: `${key}@${s.x},${s.y}`,
        lens: { url, x: s.x, y: s.y, width: s.width, height: s.height },
      },
    ];
  });
  return { placed, maxBezel };
}

type GlassScopeProps = React.ComponentProps<"div"> & {
  /** Rim shift as a multiple of the widest bezel. */
  strength?: number;
};

/**
 * Lets every LiquidGlass inside refract in Safari and Firefox. Those engines
 * cannot filter what is behind an element, so the scope bends its
 * GlassScopeContent under each pane instead. Chromium keeps the backdrop lens
 * and the scope does nothing.
 */
function GlassScope({ strength, className, ...props }: GlassScopeProps) {
  const supported = React.useSyncExternalStore(
    subscribeTransparency,
    () => !supportsBackdropLens() && !matches(REDUCED_TRANSPARENCY),
    () => false
  );
  const [content, setContent] = React.useState<HTMLElement | null>(null);
  const [panes, setPanes] = React.useState<Map<HTMLElement, Pane>>(
    () => new Map()
  );
  const [lens, setLens] = React.useState<Scope["lens"]>(null);
  // outlives effect re-runs: a reset counter would reuse an id Safari has cached
  const version = React.useRef(0);
  const base = React.useId().replace(/[^\w-]/g, "");
  const factor = tuned("strength", strength) ?? SCOPE_STRENGTH;

  const register = React.useCallback((el: HTMLElement, pane: Pane) => {
    setPanes(current => new Map(current).set(el, pane));
    return () =>
      setPanes(current => {
        const next = new Map(current);
        next.delete(el);
        return next;
      });
  }, []);

  React.useEffect(() => {
    if (!supported || !content || !panes.size) return;
    const cache = new Map<string, string | null>();
    let frame = 0;
    let last = "";
    const build = () => {
      frame = 0;
      const width = content.offsetWidth;
      const height = content.offsetHeight;
      const { placed, maxBezel } = placePanes(content, panes, cache);
      const key = [width, height, ...placed.map(p => p.key)].join("|");
      if (key === last) return;
      last = key;
      const map =
        width && height && maxBezel
          ? displacementSvgUrl(
              width,
              height,
              placed.map(p => p.lens)
            )
          : null;
      version.current += 1;
      // Safari caches a filter's output by id and keeps painting the old result, so every new map gets a new id
      setLens(
        map
          ? { id: `${base}-${version.current}`, map, scale: maxBezel * factor }
          : null
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(build);
    };
    schedule();
    const resize = new ResizeObserver(schedule);
    resize.observe(content);
    panes.forEach((_, el) => resize.observe(el));
    // shortcut: catches panes moved by their own style or class (drag, elasticity) or by scrolling; a pane moved by an ancestor's style waits for the next of those
    const moves = new MutationObserver(schedule);
    panes.forEach((_, el) =>
      moves.observe(el, {
        attributes: true,
        attributeFilter: ["style", "class"],
      })
    );
    window.addEventListener("scroll", schedule, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      moves.disconnect();
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
    };
  }, [supported, content, panes, base, factor]);

  const live = supported && content && panes.size ? lens : null;
  const scope = React.useMemo<Scope>(
    () => ({ register, setContent, active: supported, lens: live }),
    [register, supported, live]
  );
  return (
    <ScopeContext.Provider value={scope}>
      <div
        data-slot="glass-scope"
        className={cn("relative isolate", className)}
        {...props}
      />
    </ScopeContext.Provider>
  );
}

/** What the panes of a GlassScope bend. Keep the panes outside it: anything inside is bent too. */
function GlassScopeContent({ style, ...props }: React.ComponentProps<"div">) {
  const scope = React.useContext(ScopeContext);
  const setContent = scope?.setContent;
  const lens = scope?.lens;
  return (
    <>
      <div
        ref={setContent}
        data-slot="glass-scope-content"
        style={lens ? { ...style, filter: `url(#${lens.id})` } : style}
        {...props}
      />
      {lens ? (
        <svg
          aria-hidden
          width="0"
          height="0"
          className="pointer-events-none absolute"
        >
          <filter
            id={lens.id}
            x="0"
            y="0"
            width="1"
            height="1"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={lens.map} preserveAspectRatio="none" result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={lens.scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      ) : null}
    </>
  );
}

export { GlassScope, GlassScopeContent, useGlassScope };
