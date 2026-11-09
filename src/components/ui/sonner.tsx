import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ theme = "system", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success-text" />,
        info: <InfoIcon className="size-4 text-accent-foreground" />,
        warning: <TriangleAlertIcon className="size-4 text-warning-text" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--glass-thick)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--glass-edge)",
          "--border-radius": "1.25rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast backdrop-blur-2xl backdrop-saturate-[1.9] shadow-[inset_1px_1px_0_0_var(--glass-rim-hi),var(--glass-shadow)]! [@media(prefers-reduced-transparency:reduce)]:bg-(--glass-solid)! [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none [@media(prefers-contrast:more)]:bg-(--glass-solid)! [@media(prefers-contrast:more)]:backdrop-blur-none",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
