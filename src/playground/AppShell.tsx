import { cn } from "cn";
import { LayersIcon, MoonIcon, SunIcon } from "lucide-react";
import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { Link } from "../docs/router";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type NavEntry = {
  id: string;
  label: string;
  group: string;
  href: string;
};

const groupsOf = (nav: readonly NavEntry[]) =>
  [...new Set(nav.map(item => item.group))].map(group => ({
    group,
    items: nav.filter(item => item.group === group),
  }));

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
  <Link
    href="/"
    className="flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring"
  >
    <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[inset_1px_1px_0_rgb(255_255_255/0.35)]">
      <LayersIcon className="size-4" />
    </span>
    <div className="leading-tight">
      <p className="text-sm font-semibold tracking-[-0.01em]">glass-ui</p>
      <p className="text-xs text-muted-foreground">Liquid Glass registry</p>
    </div>
  </Link>
);

const LIFT = "bg-card text-primary shadow-lift dark:bg-[oklch(1_0_0/0.16)]";

type ShellProps = {
  nav: readonly NavEntry[];
  active: string;
  children: ReactNode;
};

export const AppShell: FC<ShellProps> = ({ nav, active, children }) => {
  const chipsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - 12 });
  }, [active]);

  return (
    <div className="min-h-svh glass-backdrop text-foreground">
      <aside
        aria-label="Docs index"
        className="fixed inset-y-3 left-3 z-40 hidden w-60 flex-col rounded-[28px] glass p-3 md:flex"
      >
        <div className="px-2 pt-1 pb-5">
          <Brand />
        </div>
        <nav
          aria-label="Docs"
          className="-mx-1 grid [scrollbar-width:thin] gap-4 overflow-y-auto px-1 pb-2"
        >
          {groupsOf(nav).map(({ group, items }) => (
            <div key={group} className="grid gap-0.5">
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">
                {group}
              </p>
              {items.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={item.id === active ? "page" : undefined}
                  className={cn(
                    "flex h-8 items-center rounded-xl px-3 text-[0.8125rem] font-medium text-foreground/80 transition-colors outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring",
                    item.id === active &&
                      `${LIFT} hover:bg-card hover:text-primary`
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between px-2 pt-3">
          <a
            href="https://github.com/NTCHz/glass-ui"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </aside>

      <header className="sticky top-0 z-30 px-3 pt-3 pb-5 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-background/60 before:[mask-image:linear-gradient(to_bottom,black_65%,transparent)] before:backdrop-blur-xl md:hidden">
        <div className="flex h-14 items-center justify-between rounded-full glass pr-2 pl-4">
          <Brand />
          <ThemeToggle />
        </div>
        <nav
          ref={chipsRef}
          aria-label="Docs pages"
          className="-mx-3 mt-2 flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-3 pb-1"
        >
          {nav.map(item => (
            <Link
              key={item.id}
              href={item.href}
              data-id={item.id}
              aria-current={item.id === active ? "page" : undefined}
              className={cn(
                "h-9 shrink-0 rounded-full px-3.5 text-[0.8125rem] leading-9 font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring",
                item.id === active ? LIFT : "glass-clear"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="px-4 pb-16 md:pr-8 md:pl-[17.5rem] lg:pl-[19rem]">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
};
