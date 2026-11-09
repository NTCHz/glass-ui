"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring aria-invalid:ring-3 aria-invalid:ring-destructive/30 data-[size=default]:h-7 data-[size=default]:w-12 data-[size=sm]:h-5 data-[size=sm]:w-8 data-checked:bg-success data-unchecked:bg-[oklch(0.21_0.015_260/0.13)] dark:data-unchecked:bg-[oklch(1_0_0/0.16)] data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.18),0_0_0_0.5px_rgb(0_0_0/0.04)] transition-[translate,width] duration-400 ease-(--ease-spring) group-data-[size=default]/switch:h-6 group-data-[size=default]/switch:w-6 group-data-[size=default]/switch:group-active/switch:w-7 group-data-[size=sm]/switch:size-4 motion-reduce:transition-none group-data-[size=default]/switch:data-checked:translate-x-5 group-data-[size=default]/switch:group-active/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
