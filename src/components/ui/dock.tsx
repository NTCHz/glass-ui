"use client";

import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { cn } from "cn";
import * as React from "react";

import { matches, REDUCED_MOTION } from "@/lib/glass-dom";
import { dockScale } from "@/lib/glass-optics";

type DockProps = ToolbarPrimitive.Root.Props & {
  /** Item size at rest in px. */
  size?: number;
  /** Scale of the item under the pointer; 1 turns magnification off. */
  magnify?: number;
};

const ITEM = "[data-slot=dock-item]";

function useMagnify(
  root: HTMLElement | null,
  size: number,
  magnify: number,
  vertical: boolean
) {
  React.useEffect(() => {
    if (!root || magnify <= 1 || matches(REDUCED_MOTION)) return;
    let frame = 0;
    let pointer: number | null = null;
    const apply = () => {
      frame = 0;
      root.querySelectorAll<HTMLElement>(ITEM).forEach(item => {
        if (pointer === null) return item.style.removeProperty("--dock-scale");
        const r = item.getBoundingClientRect();
        const centre = vertical ? r.top + r.height / 2 : r.left + r.width / 2;
        const scale = dockScale(Math.abs(pointer - centre), size, magnify);
        item.style.setProperty("--dock-scale", scale.toFixed(3));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onMove = (event: PointerEvent) => {
      // touch has no hover to aim with; magnifying under a finger only hides the target
      if (event.pointerType !== "mouse") return;
      pointer = vertical ? event.clientY : event.clientX;
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root
        .querySelectorAll<HTMLElement>(ITEM)
        .forEach(item => item.style.removeProperty("--dock-scale"));
    };
  }, [root, size, magnify, vertical]);
}

/** A macOS-style dock: a glass toolbar whose items grow toward the pointer. Arrow keys move between items. */
function Dock({
  className,
  size = 48,
  magnify = 1.6,
  orientation = "horizontal",
  style,
  ...props
}: DockProps) {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const vertical = orientation === "vertical";
  useMagnify(root, size, magnify, vertical);
  return (
    <ToolbarPrimitive.Root
      ref={setRoot}
      data-slot="dock"
      orientation={orientation}
      style={state =>
        ({
          "--dock-size": `${size}px`,
          ...(typeof style === "function" ? style(state) : style),
        }) as React.CSSProperties
      }
      className={cn(
        "group/dock inline-flex items-end gap-2 rounded-[calc(var(--dock-size)*0.5+0.5rem)] glass p-2",
        vertical && "flex-col items-start",
        className
      )}
      {...props}
    />
  );
}

type DockItemProps = ToolbarPrimitive.Button.Props & {
  /** Accessible name, also shown as a label while hovered or focused. */
  label: string;
  /** Shows a dot under the item, like a running app; screen readers hear ", running". */
  active?: boolean;
};

function DockItem({
  label,
  active,
  className,
  children,
  ...props
}: DockItemProps) {
  return (
    <ToolbarPrimitive.Button
      data-slot="dock-item"
      aria-label={active ? `${label}, running` : label}
      className={cn(
        "group/dock-item relative grid size-[calc(var(--dock-size)*var(--dock-scale,1))] shrink-0 place-items-center rounded-[28%] bg-card text-foreground shadow-[0_1px_3px_rgb(0_0_0/0.12)] transition-[width,height] duration-150 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring motion-reduce:transition-none [&_svg]:size-[46%] [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full mb-2 rounded-md bg-popover px-2 py-0.5 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/dock-item:opacity-100 group-focus-visible/dock-item:opacity-100 group-data-[orientation=vertical]/dock:top-1/2 group-data-[orientation=vertical]/dock:bottom-auto group-data-[orientation=vertical]/dock:left-full group-data-[orientation=vertical]/dock:mb-0 group-data-[orientation=vertical]/dock:ml-3 group-data-[orientation=vertical]/dock:-translate-y-1/2"
      >
        {label}
      </span>
      {active ? (
        <span
          aria-hidden
          className="absolute -bottom-1.5 size-1 rounded-full bg-foreground/70"
        />
      ) : null}
    </ToolbarPrimitive.Button>
  );
}

function DockSeparator({
  className,
  ...props
}: ToolbarPrimitive.Separator.Props) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="dock-separator"
      className={cn(
        "shrink-0 bg-foreground/15 data-[orientation=horizontal]:mx-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:self-stretch data-[orientation=vertical]:my-1 data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  );
}

export { Dock, DockItem, DockSeparator };
