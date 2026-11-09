import { cn } from "cn";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-[6px] bg-card px-1 font-sans text-xs font-medium text-foreground/75 tabular-nums shadow-[inset_0_-1px_0_var(--border)] ring-1 ring-border select-none in-data-[slot=tooltip-content]:bg-foreground/10 in-data-[slot=tooltip-content]:text-foreground in-data-[slot=tooltip-content]:shadow-none in-data-[slot=tooltip-content]:ring-foreground/15 [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
