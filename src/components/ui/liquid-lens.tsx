import { cn } from "cn";
import * as React from "react";

import { displacementMapUrl } from "@/lib/glass-dom";
import {
  CHANNEL_MATRICES,
  channelScales,
  displacementPixels,
  lensBezel,
  tuned,
  type GlassTuning,
} from "@/lib/glass-optics";

// the rim shift grows at strength × t px per px, so past 1 the rim folds sharp text back on itself (1.2 scribbled the capsule ends)
const LENS_STRENGTH = 0.9;

type LensRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Corner radius in px; a capsule (half the short side) when unset. */
  radius?: number;
};

type LiquidLensProps = React.ComponentProps<"div"> &
  Pick<GlassTuning, "strength" | "bezel" | "dispersion"> & {
    /** Where the lens sits, in px from the top-left of the content. */
    lens: LensRect;
    lensClassName?: string;
  };

const noop = () => () => {};

// size of the content plus its offset inside the wrapper, which is where the glass is positioned from
function useBox(el: HTMLElement | null) {
  const [box, setBox] = React.useState<[number, number, number, number] | null>(
    null
  );
  React.useEffect(() => {
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setBox([el.offsetWidth, el.offsetHeight, el.offsetLeft, el.offsetTop])
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [el]);
  return box;
}

/**
 * A lens that bends the content under it. Unlike LiquidGlass it filters the
 * content itself, not the backdrop, so it refracts in Chromium, Safari and
 * Firefox; the price is that it can only bend what it wraps.
 */
function LiquidLens({
  lens,
  strength,
  bezel,
  dispersion,
  className,
  lensClassName,
  children,
  ...props
}: LiquidLensProps) {
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);
  const box = useBox(content);
  const size: [number, number] | null = box ? [box[0], box[1]] : null;
  const width = Math.max(1, Math.round(lens.width));
  const height = Math.max(1, Math.round(lens.height));
  const radius = Math.min(lens.radius ?? Infinity, width / 2, height / 2);
  const rim = lensBezel(radius, width, height, bezel);
  // false on the server and during hydration, so the canvas only runs in the browser
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
  // the lens pixels depend on its shape only, so dragging copies them instead of recomputing
  const pixels = React.useMemo(
    () =>
      mounted
        ? new ImageData(
            displacementPixels(width, height, radius, rim, true),
            width,
            height
          )
        : null,
    [mounted, width, height, radius, rim]
  );
  const x = Math.round(lens.x);
  const y = Math.round(lens.y);
  const map = React.useMemo(
    () =>
      pixels && box
        ? displacementMapUrl(box[0], box[1], [{ pixels, x, y }])
        : null,
    [pixels, box, x, y]
  );
  const base = React.useId().replace(/[^\w-]/g, "");
  // Safari caches a filter's output by id and keeps painting the old result, so every new map gets a new id
  const id = [base, x, y, size?.join("x"), width, height, radius, rim]
    .join("-")
    .replace(/[^\w-]/g, "_");
  const spread = tuned("dispersion", dispersion) ?? 0;
  // blue bends (1 + spread)× more, so the default backs off to keep that pass from folding too
  const scale =
    rim * (tuned("strength", strength) ?? LENS_STRENGTH / (1 + spread));

  return (
    <div
      data-slot="liquid-lens"
      className={cn("relative isolate", className)}
      {...props}
    >
      <div
        ref={setContent}
        style={map && size ? { filter: `url(#${id})` } : undefined}
      >
        {children}
      </div>
      {map && size ? (
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
            width="1"
            height="1"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={map} preserveAspectRatio="none" result="map" />
            {spread > 0 ? (
              <>
                {CHANNEL_MATRICES.map(({ name, matrix }, i) => (
                  <React.Fragment key={name}>
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="map"
                      scale={channelScales(scale, spread)[i]}
                      xChannelSelector="R"
                      yChannelSelector="G"
                      result={`${name}-shift`}
                    />
                    <feColorMatrix
                      in={`${name}-shift`}
                      values={matrix}
                      result={name}
                    />
                  </React.Fragment>
                ))}
                <feBlend in="r" in2="g" mode="screen" result="rg" />
                <feBlend in="rg" in2="b" mode="screen" />
              </>
            ) : (
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={scale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            )}
          </filter>
        </svg>
      ) : null}
      <div
        aria-hidden
        data-slot="liquid-lens-glass"
        style={{
          left: x + (box?.[2] ?? 0),
          top: y + (box?.[3] ?? 0),
          width,
          height,
          borderRadius: radius,
        }}
        className={cn(
          "pointer-events-none absolute bg-[radial-gradient(120%_90%_at_0%_0%,color-mix(in_oklab,var(--glass-sheen)_45%,transparent)_0%,transparent_55%)] shadow-[inset_1px_1px_0_0_var(--glass-rim-hi),inset_-1px_-1px_0_0_var(--glass-rim-lo),inset_0_0_0_0.5px_var(--glass-edge),inset_0_0_14px_0_var(--glass-glow),var(--glass-shadow)]",
          lensClassName
        )}
      />
    </div>
  );
}

export { LiquidLens };
