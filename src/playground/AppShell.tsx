import { LayersIcon, MoonIcon, SunIcon } from "lucide-react";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type NavEntry = { id: string; label: string };

const ThemeToggle: FC = () => {
  const [dark, setDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setDark(d => !d)}
          />
        }
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </TooltipTrigger>
      <TooltipContent>{dark ? "Light theme" : "Dark theme"}</TooltipContent>
    </Tooltip>
  );
};

const Brand: FC = () => (
  <div className="flex items-center gap-2.5">
    <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[inset_1px_1px_0_rgb(255_255_255/0.35)]">
      <LayersIcon className="size-4" />
    </span>
    <div className="leading-tight">
      <p className="text-sm font-semibold tracking-[-0.01em]">glass-ui</p>
      <p className="text-xs text-muted-foreground">Liquid Glass registry</p>
    </div>
  </div>
);

type ShellProps = { nav: readonly NavEntry[]; children: ReactNode };

export const AppShell: FC<ShellProps> = ({ nav, children }) => (
  <div className="min-h-svh glass-backdrop text-foreground">
    <aside
      aria-label="Components"
      className="fixed inset-y-3 left-3 z-40 hidden w-60 flex-col rounded-[28px] glass p-3 md:flex"
    >
      <div className="px-2 pt-1 pb-5">
        <Brand />
      </div>
      <nav className="grid gap-0.5 overflow-y-auto">
        {nav.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex h-9 items-center rounded-xl px-3 text-sm font-medium text-foreground/80 transition-colors outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="mt-auto flex items-center justify-between px-2 pt-3">
        <code className="text-xs text-muted-foreground">npx shadcn add</code>
        <ThemeToggle />
      </div>
    </aside>

    <header className="sticky top-0 z-30 px-3 pt-3 pb-4 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:[mask-image:linear-gradient(to_bottom,black_55%,transparent)] before:backdrop-blur-md md:hidden">
      <div className="flex h-14 items-center justify-between rounded-full glass pr-2 pl-4">
        <Brand />
        <ThemeToggle />
      </div>
      <nav
        aria-label="Components"
        className="-mx-3 mt-2 flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-3 pb-1"
      >
        {nav.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="h-8 shrink-0 rounded-full glass-clear px-3.5 text-[0.8125rem] leading-8 font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>

    <main className="px-4 pb-16 md:pr-8 md:pl-[17.5rem] lg:pl-[19rem]">
      <div className="mx-auto max-w-4xl">{children}</div>
    </main>
  </div>
);
