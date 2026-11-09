"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-3 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list relative isolate inline-flex w-fit items-center justify-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-secondary p-0.5 group-data-horizontal/tabs:h-9",
        glass: "rounded-full glass p-1 group-data-horizontal/tabs:h-11",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {children}
      {variant !== "line" && (
        <TabsPrimitive.Indicator
          data-slot="tabs-indicator"
          className={cn(
            "absolute top-(--active-tab-top) left-(--active-tab-left) -z-10 h-(--active-tab-height) w-(--active-tab-width) rounded-full transition-[left,width] duration-500 ease-(--ease-spring) motion-reduce:transition-none",
            variant === "glass"
              ? "bg-[color-mix(in_oklab,var(--card),transparent_15%)] shadow-[0_2px_8px_-2px_oklch(0.2_0.02_260/0.2),inset_1px_1px_0_0_var(--glass-rim-hi)] dark:bg-[oklch(1_0_0/0.16)]"
              : "bg-card shadow-[0_1px_3px_oklch(0.2_0.02_260/0.14),0_0_0_0.5px_oklch(0.2_0.02_260/0.06)] dark:bg-[oklch(1_0_0/0.16)]"
          )}
        />
      )}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:rounded-md group-data-[variant=line]/tabs-list:px-2",
        "after:absolute after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-2 group-data-horizontal/tabs:after:-bottom-1 group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-1 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };
