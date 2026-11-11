import { SearchIcon } from "lucide-react";
import type { FC } from "react";

import { GlassScope, GlassScopeContent } from "@/components/ui/glass-scope";
import { LiquidGlass } from "@/components/ui/liquid-glass";

import { Section } from "../Section";
import { STRIPES } from "../tuner";

const ROWS = Array.from({ length: 10 }, (_, i) => i + 1);

const Scope: FC = () => (
  <GlassScope
    tabIndex={0}
    role="region"
    aria-label="Scroll the list under the glass bar"
    className="h-80 w-full overflow-y-auto rounded-[28px] border bg-background glass-stage outline-none focus-visible:ring-3 focus-visible:ring-ring"
  >
    <div className="sticky top-0 z-10 px-3 pt-3">
      <LiquidGlass className="flex h-12 items-center gap-2 rounded-full px-5 text-[0.9375rem] font-semibold">
        <SearchIcon className="size-4 opacity-70" aria-hidden />
        Library
      </LiquidGlass>
    </div>
    <GlassScopeContent className="-mt-15 grid gap-3 px-4 pt-18 pb-4">
      {ROWS.map(row => (
        <div key={row} className="grid gap-1 rounded-2xl bg-card p-4">
          {row % 3 === 1 ? (
            <div className={`mb-1 h-10 rounded-2xl ${STRIPES}`} />
          ) : null}
          <span className="text-sm font-medium">Album {row}</span>
          <span className="text-[0.8125rem] text-muted-foreground">
            Scroll: the bar bends the rows under it in Safari and Firefox too.
          </span>
        </div>
      ))}
    </GlassScopeContent>
  </GlassScope>
);

export const GlassScopeSection: FC = () => (
  <Section
    id="glass-scope"
    title="Glass Scope"
    note="Wrap a region in GlassScope and its LiquidGlass panes refract in every browser. Chromium bends the real backdrop; Safari and Firefox bend the GlassScopeContent under each pane."
  >
    <Scope />
  </Section>
);
