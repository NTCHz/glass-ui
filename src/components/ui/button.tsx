import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45 aria-invalid:ring-3 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "glass-press bg-primary text-primary-foreground shadow-[inset_1px_1px_0_0_rgb(255_255_255/0.4),inset_-1px_-1px_0_0_rgb(255_255_255/0.12),0_6px_16px_-6px_var(--primary)]",
        glass: "glass-press glass text-foreground",
        clear: "glass-press glass-clear text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--secondary),var(--foreground)_6%)] active:scale-[0.97]",
        outline:
          "border-border bg-card text-foreground transition-colors hover:bg-secondary active:scale-[0.97]",
        ghost:
          "text-foreground transition-colors hover:bg-secondary active:scale-[0.97] aria-expanded:bg-secondary",
        destructive:
          "bg-destructive/12 text-destructive transition-colors hover:bg-destructive/18 focus-visible:ring-destructive/30 active:scale-[0.97]",
        "destructive-solid":
          "glass-press bg-destructive-solid text-white shadow-[inset_1px_1px_0_0_rgb(255_255_255/0.35),inset_-1px_-1px_0_0_rgb(255_255_255/0.1),0_6px_16px_-6px_var(--destructive-solid)] focus-visible:ring-destructive/40",
        link: "rounded-md px-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 pointer-coarse:h-11",
        xs: "h-6 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 text-[0.9375rem]",
        icon: "size-9 pointer-coarse:size-11",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
