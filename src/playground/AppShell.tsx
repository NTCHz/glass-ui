import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import {
  LayersIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import type { FC, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Link, navigate } from "../docs/router";

export type NavEntry = {
  id: string;
  label: string;
  group: string;
  href: string;
  icon?: LucideIcon;
};

const REPO = "https://github.com/NTCHz/glass-ui";

const groupsOf = (nav: readonly NavEntry[]) =>
  [...new Set(nav.map(item => item.group))].map(group => ({
    group,
    items: nav.filter(item => item.group === group),
  }));

const matches = (item: NavEntry, query: string) =>
  `${item.label} ${item.id}`.toLowerCase().includes(query.trim().toLowerCase());

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

const GitHubMark: FC = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-current">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const Brand: FC = () => (
  <Link
    href="/"
    className="flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring"
  >
    <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[inset_1px_1px_0_rgb(255_255_255/0.35)]">
      <LayersIcon className="size-4" />
    </span>
    <span className="grid leading-tight">
      <span className="text-sm font-semibold tracking-[-0.01em]">glass-ui</span>
      <span className="text-xs text-muted-foreground">
        Liquid Glass registry
      </span>
    </span>
  </Link>
);

const ACTIVE = "bg-card text-primary shadow-lift dark:bg-[oklch(1_0_0/0.14)]";

// scroll only the nav list, never the page behind the fixed sidebar
const keepInView = (list: HTMLElement | null, active: string) => {
  const item = list?.querySelector<HTMLElement>(`[data-nav-id="${active}"]`);
  if (!list || !item) return;
  const box = list.getBoundingClientRect();
  const rect = item.getBoundingClientRect();
  if (rect.top >= box.top && rect.bottom <= box.bottom - 24) return;
  list.scrollTop += rect.top - box.top - box.height / 2 + rect.height / 2;
};

type NavProps = {
  nav: readonly NavEntry[];
  active: string;
  searchRef?: RefObject<HTMLInputElement | null>;
  onNavigate?: () => void;
};

const Nav: FC<NavProps> = ({ nav, active, searchRef, onNavigate }) => {
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const shown = nav.filter(item => matches(item, query));
  const guides = shown.filter(item => item.icon);
  const components = shown.filter(item => !item.icon);
  const total = nav.filter(item => !item.icon).length;

  useEffect(() => keepInView(listRef.current, active), [active]);

  const go = (href: string) => {
    navigate(href);
    setQuery("");
    onNavigate?.();
  };

  const linkClass = (id: string) =>
    cn(
      "relative flex h-8 items-center gap-2.5 rounded-[10px] px-2.5 text-[0.8125rem] font-medium text-foreground/75 transition-colors outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring",
      id === active && `${ACTIVE} hover:bg-card hover:text-primary`
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-1 pb-3">
        <InputGroup className="h-9 bg-secondary">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            ref={searchRef}
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Escape") setQuery("");
              if (event.key === "Enter" && shown[0]) go(shown[0].href);
            }}
            placeholder="Search docs"
            aria-label="Search docs"
          />
          {searchRef && !query && (
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      <div
        ref={listRef}
        className="-mx-1 min-h-0 flex-1 [scrollbar-width:thin] overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-24px),transparent)] px-1 pb-4"
      >
        {guides.length > 0 && (
          <ul className="grid gap-0.5 pt-1">
            {guides.map(({ id, href, label, icon: Icon }) => (
              <li key={id}>
                <Link
                  href={href}
                  data-nav-id={id}
                  onClick={() => onNavigate?.()}
                  aria-current={id === active ? "page" : undefined}
                  className={linkClass(id)}
                >
                  {Icon && <Icon className="size-4 shrink-0 opacity-80" />}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {components.length > 0 && (
          <div className="mt-5">
            <p className="flex items-baseline justify-between px-2.5 pb-2 text-[0.8125rem] font-semibold tracking-[-0.01em]">
              Components
              <span className="text-xs font-normal text-muted-foreground tabular-nums">
                {query ? `${components.length} of ${total}` : total}
              </span>
            </p>
            <div className="grid gap-4">
              {groupsOf(components).map(({ group, items }) => (
                <section key={group} aria-label={group}>
                  <p className="px-2.5 pb-1 text-xs font-medium text-muted-foreground">
                    {group}
                  </p>
                  <ul className="ml-3.5 grid gap-0.5 border-l border-border pl-2">
                    {items.map(({ id, href, label }) => (
                      <li key={id}>
                        <Link
                          href={href}
                          data-nav-id={id}
                          onClick={() => onNavigate?.()}
                          aria-current={id === active ? "page" : undefined}
                          className={cn(
                            linkClass(id),
                            id === active &&
                              "before:absolute before:top-2 before:bottom-2 before:-left-[9px] before:w-px before:bg-primary"
                          )}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}

        {shown.length === 0 && (
          <p className="px-2.5 pt-2 text-[0.8125rem] text-muted-foreground">
            Nothing matches “{query.trim()}”.
          </p>
        )}
      </div>
    </div>
  );
};

const Footer: FC = () => (
  <div className="flex items-center justify-between border-t border-border px-1 pt-3">
    <a
      href={REPO}
      className="flex h-8 items-center gap-2 rounded-[10px] px-2 text-[0.8125rem] font-medium text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
    >
      <GitHubMark />
      GitHub
    </a>
    <ThemeToggle />
  </div>
);

const useSlashToSearch = (searchRef: RefObject<HTMLInputElement | null>) =>
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.key !== "/" ||
        target?.closest("input, textarea, [contenteditable]")
      )
        return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchRef]);

type ShellProps = {
  nav: readonly NavEntry[];
  active: string;
  children: ReactNode;
};

export const AppShell: FC<ShellProps> = ({ nav, active, children }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const current = nav.find(item => item.id === active);
  useSlashToSearch(searchRef);

  return (
    <div className="min-h-svh glass-backdrop text-foreground">
      <aside
        aria-label="Docs"
        className="fixed inset-y-3 left-3 z-40 hidden w-64 flex-col rounded-[28px] glass p-3 md:flex"
      >
        <div className="px-1.5 pt-1 pb-4">
          <Brand />
        </div>
        <Nav nav={nav} active={active} searchRef={searchRef} />
        <Footer />
      </aside>

      <header className="sticky top-0 z-30 px-3 pt-3 pb-4 md:hidden">
        <div className="flex h-14 items-center gap-1 rounded-full glass pr-2 pl-4">
          <Brand />
          <span className="ml-auto max-w-[9rem] truncate text-[0.8125rem] font-medium text-muted-foreground">
            {current?.label}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Open docs menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(20rem,calc(100%-1.5rem))] gap-0 p-3"
        >
          <SheetTitle className="sr-only">Docs menu</SheetTitle>
          <SheetDescription className="sr-only">
            Guides and components
          </SheetDescription>
          <div className="px-1.5 pt-1 pb-4">
            <Brand />
          </div>
          <Nav
            nav={nav}
            active={active}
            onNavigate={() => setMenuOpen(false)}
          />
          <Footer />
        </SheetContent>
      </Sheet>

      <main className="px-4 pb-16 md:pr-8 md:pl-[18.5rem] lg:pl-[20rem]">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
};
