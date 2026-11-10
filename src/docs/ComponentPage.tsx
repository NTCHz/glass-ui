import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import type { FC, ReactNode } from "react";
import {
  Component,
  createContext,
  createElement,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SectionLayout, type SectionProps } from "../playground/Section";
import {
  COMPONENTS,
  demoOf,
  itemsOf,
  loadDemoSource,
  loadUiSource,
  type ComponentEntry,
} from "./catalog";
import { Code, CommandTabs } from "./Code";
import { A, C, H2, LINK, P, PageTitle } from "./Prose";
import { Link } from "./router";
import {
  apiLinks,
  exportedNames,
  sliceExport,
  unwrapSection,
  usageImport,
} from "./source";

type ItemSource = { item: string; source: string };

type Loaded = {
  id: string;
  example: string;
  sources: readonly ItemSource[];
};

const useEntrySources = (entry: ComponentEntry) => {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    const items = itemsOf(entry);
    Promise.all([loadDemoSource(entry), Promise.all(items.map(loadUiSource))])
      .then(([demo, ui]) => {
        if (cancelled) return;
        const sliced = sliceExport(demo, entry.demo);
        setLoaded({
          id: entry.id,
          example: sliced ? unwrapSection(sliced) : "",
          sources: items.flatMap((item, i) => {
            const source = ui[i];
            return source ? [{ item, source }] : [];
          }),
        });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ id: entry.id, example: "", sources: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [entry]);

  return loaded?.id === entry.id ? loaded : null;
};

const PageContext = createContext<{
  entry: ComponentEntry;
  loaded: Loaded | null;
} | null>(null);

const installArgs = (entry: ComponentEntry) =>
  `add ${itemsOf(entry)
    .map(item => `NTCHz/glass-ui/${item}`)
    .join(" ")}`;

const DocSection: FC<SectionProps> = ({ title, note, children }) => {
  const page = useContext(PageContext);
  if (!page) return null;
  const { entry, loaded } = page;
  const links = loaded?.sources.flatMap(({ source }) => apiLinks(source)) ?? [];

  return (
    <article>
      <PageTitle title={title} lead={note} />

      <Tabs defaultValue="preview" className="gap-3">
        <TabsList variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="flex min-h-72 min-w-0 flex-wrap content-center items-center justify-center gap-3 rounded-[28px] border bg-background/40 p-4 sm:p-8">
            {children}
          </div>
        </TabsContent>
        <TabsContent value="code">
          {loaded?.example ? (
            <Code code={loaded.example} title="Example" />
          ) : (
            <P className="text-muted-foreground">Loading…</P>
          )}
        </TabsContent>
      </Tabs>

      <H2 id="installation">Installation</H2>
      <CommandTabs args={installArgs(entry)} />
      <P className="text-[0.875rem] text-muted-foreground">
        First glass-ui install in this project? Add <C>NTCHz/glass-ui/theme</C>{" "}
        to the same command, or colours and fonts stay shadcn&apos;s. See{" "}
        <Link href="/docs/installation" className={LINK}>
          Installation
        </Link>
        .
      </P>

      {loaded && loaded.sources.length > 0 && (
        <>
          <H2 id="usage">Usage</H2>
          <div className="grid gap-3">
            {loaded.sources.map(({ item, source }) => (
              <Code
                key={item}
                code={usageImport(item, exportedNames(source))}
              />
            ))}
          </div>
          <P className="text-[0.875rem] text-muted-foreground">
            The Code tab above shows these parts composed.
          </P>
        </>
      )}

      {links.length > 0 && (
        <>
          <H2 id="api">API Reference</H2>
          <P>
            Props and behaviour come from the underlying primitives; glass-ui
            adds the styling and the variants you see in the source.
          </P>
          <ul className="flex flex-wrap gap-2">
            {links.map(link => (
              <li key={link.href}>
                <A
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-[0.8125rem] no-underline"
                >
                  {link.label}
                  <ExternalLinkIcon className="size-3.5" />
                </A>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
};

const PrevNext: FC<{ entry: ComponentEntry }> = ({ entry }) => {
  const index = COMPONENTS.indexOf(entry);
  const prev = COMPONENTS[index - 1];
  const next = COMPONENTS[index + 1];
  const cls =
    "group grid gap-0.5 rounded-2xl border bg-card px-4 py-3 text-[0.875rem] outline-none hover:border-ring/40 focus-visible:ring-3 focus-visible:ring-ring";
  return (
    <nav
      aria-label="Previous and next component"
      className="mt-16 grid gap-3 border-t pt-6 sm:grid-cols-2"
    >
      {prev ? (
        <Link href={`/docs/components/${prev.id}`} className={cls}>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeftIcon className="size-3.5" /> Previous
          </span>
          <span className="font-medium">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={`/docs/components/${next.id}`}
          className={`${cls} text-right`}
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            Next <ArrowRightIcon className="size-3.5" />
          </span>
          <span className="font-medium">{next.label}</span>
        </Link>
      )}
    </nav>
  );
};

type BoundaryProps = { entry: ComponentEntry; children: ReactNode };

// a demo that fails to load takes down its page, not the shell
class DemoBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert">
        <PageTitle
          title={this.props.entry.label}
          lead="This demo failed to load. The site may have been updated since you opened it."
        />
        <Button onClick={() => window.location.reload()}>Reload page</Button>
      </div>
    );
  }
}

const DemoLoading: FC<{ entry: ComponentEntry }> = ({ entry }) => (
  <div aria-busy="true">
    <PageTitle title={entry.label} lead="Loading the demo…" />
    <div className="min-h-72 rounded-[28px] border bg-background/40" />
  </div>
);

export const ComponentPage: FC<{ entry: ComponentEntry }> = ({ entry }) => {
  const loaded = useEntrySources(entry);
  // demos are module exports looked up by name, not components made during render
  const Demo = demoOf(entry);
  if (!Demo) return <P>This demo is missing.</P>;
  return (
    <PageContext.Provider value={{ entry, loaded }}>
      <SectionLayout.Provider value={DocSection}>
        <DemoBoundary entry={entry}>
          <Suspense fallback={<DemoLoading entry={entry} />}>
            {createElement(Demo)}
          </Suspense>
        </DemoBoundary>
      </SectionLayout.Provider>
      <PrevNext entry={entry} />
    </PageContext.Provider>
  );
};
