import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  );
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary:
          "*:data-[slot=bubble-content]:bg-field *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklab,var(--field),var(--foreground)_4%)]",
        muted:
          "*:data-[slot=bubble-content]:bg-[color-mix(in_oklab,var(--card),var(--foreground)_3%)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklab,var(--card),var(--foreground)_7%)]",
        tinted:
          "*:data-[slot=bubble-content]:bg-[color-mix(in_oklab,var(--card),var(--primary)_10%)] *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklab,var(--card),var(--primary)_16%)]",
        outline:
          "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-card [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklab,var(--card),var(--foreground)_4%)] [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-secondary [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground",
        destructive:
          "*:data-[slot=bubble-content]:bg-[color-mix(in_oklab,var(--card),var(--destructive)_10%)] *:data-[slot=bubble-content]:text-destructive [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklab,var(--card),var(--destructive)_16%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end";
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  );
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 overflow-hidden rounded-3xl border border-transparent px-4 py-2.5 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end group-data-[align=end]/bubble:rounded-ee-lg group-data-[align=start]/bubble:rounded-es-lg [button]:text-left [button,a]:transition-[background-color,scale] [button,a]:outline-none [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring [button,a]:active:scale-[0.97]",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  });
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-card px-2 py-0.5 text-sm tabular-nums ring-1 ring-border has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
);

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end";
  side?: "top" | "bottom";
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  );
}

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions };
