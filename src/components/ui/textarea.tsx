import { cn } from "cn";
import * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-lg border border-transparent bg-secondary px-3 py-2 text-base leading-relaxed transition-[background-color,border-color,box-shadow] outline-none placeholder:text-muted-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_4%)] focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
