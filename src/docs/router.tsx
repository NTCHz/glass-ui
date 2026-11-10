import type { ComponentProps, FC, MouseEvent } from "react";
import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

export const usePath = () =>
  useSyncExternalStore(subscribe, () => window.location.pathname);

export const navigate = (to: string) => {
  window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
};

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

export const Link: FC<ComponentProps<"a"> & { href: string }> = ({
  href,
  onClick,
  ...props
}) => (
  <a
    href={href}
    onClick={event => {
      onClick?.(event);
      if (event.defaultPrevented || !isPlainClick(event)) return;
      event.preventDefault();
      navigate(href);
    }}
    {...props}
  />
);
