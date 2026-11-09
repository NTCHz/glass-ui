import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-2xl px-4 py-3 text-left text-sm ring-1 has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-20 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground ring-border",
        destructive:
          "bg-[color-mix(in_oklab,var(--card),var(--destructive)_8%)] text-destructive ring-destructive/20 *:data-[slot=alert-description]:text-destructive/90",
        success:
          "bg-[color-mix(in_oklab,var(--card),var(--success)_10%)] text-success-text ring-success/25",
        warning:
          "bg-[color-mix(in_oklab,var(--card),var(--warning)_12%)] text-warning-text ring-warning/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-heading leading-snug font-semibold tracking-[-0.01em] group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-[0.8125rem] leading-snug text-balance text-muted-foreground md:text-pretty [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-3", className)}
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
