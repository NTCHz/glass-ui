import type { LucideIcon } from "lucide-react";
import { BookOpenIcon, DownloadIcon, PaletteIcon } from "lucide-react";
import type { FC } from "react";
import { useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { COMPONENTS, GUIDES, type ComponentEntry } from "./docs/catalog";
import { ComponentPage } from "./docs/ComponentPage";
import { Installation, Introduction, Theming } from "./docs/Guides";
import { LINK, P, PageTitle } from "./docs/Prose";
import { Link, usePath } from "./docs/router";
import { AppShell, type NavEntry } from "./playground/AppShell";

const GUIDE_ICONS: Record<string, LucideIcon> = {
  introduction: BookOpenIcon,
  installation: DownloadIcon,
  theming: PaletteIcon,
};

const NAV: readonly NavEntry[] = [
  ...GUIDES.map(guide => ({
    ...guide,
    group: "Getting started",
    icon: GUIDE_ICONS[guide.id],
    href: guide.id === "introduction" ? "/" : `/docs/${guide.id}`,
  })),
  ...COMPONENTS.map(({ id, label, group }) => ({
    id,
    label,
    group,
    href: `/docs/components/${id}`,
  })),
];

const GUIDE_PAGES: Record<string, FC> = {
  introduction: Introduction,
  installation: Installation,
  theming: Theming,
};

type Route =
  | { kind: "component"; active: string; title: string; entry: ComponentEntry }
  | { kind: "guide"; active: string; title: string; Guide: FC }
  | { kind: "missing"; active: ""; title: string };

const resolve = (path: string): Route => {
  const component = path.match(/^\/docs\/components\/([\w-]+)\/?$/);
  const entry = component && COMPONENTS.find(c => c.id === component[1]);
  if (entry)
    return { kind: "component", active: entry.id, title: entry.label, entry };
  const guideId =
    path === "/" ? "introduction" : path.match(/^\/docs\/([\w-]+)\/?$/)?.[1];
  const guide = GUIDES.find(g => g.id === guideId);
  if (guide)
    return {
      kind: "guide",
      active: guide.id,
      title: guide.label,
      Guide: GUIDE_PAGES[guide.id],
    };
  return { kind: "missing", active: "", title: "Page not found" };
};

// links from the old one-page catalog were /#<component>
const redirectLegacyHash = () => {
  if (window.location.pathname !== "/") return;
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!COMPONENTS.some(c => c.id === id)) return;
  window.history.replaceState(null, "", `/docs/components/${id}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const useLegacyHashRedirect = () =>
  useEffect(() => {
    redirectLegacyHash();
    window.addEventListener("hashchange", redirectLegacyHash);
    return () => window.removeEventListener("hashchange", redirectLegacyHash);
  }, []);

const NotFound: FC = () => (
  <article>
    <PageTitle
      title="Page not found"
      lead="There is no docs page at this address."
    />
    <P>
      <Link href="/" className={LINK}>
        Back to the introduction
      </Link>
    </P>
  </article>
);

const App: FC = () => {
  useLegacyHashRedirect();
  const route = resolve(usePath());

  useEffect(() => {
    document.title = `${route.title} · glass-ui`;
  }, [route.title]);

  return (
    <TooltipProvider>
      <AppShell nav={NAV} active={route.active}>
        {route.kind === "component" && (
          <ComponentPage key={route.entry.id} entry={route.entry} />
        )}
        {route.kind === "guide" && <route.Guide />}
        {route.kind === "missing" && <NotFound />}
      </AppShell>
      <Toaster position="top-center" />
    </TooltipProvider>
  );
};

export default App;
