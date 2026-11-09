import type { FC } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppShell, type NavEntry } from "./playground/AppShell";
import {
  Badges,
  Buttons,
  Fields,
  Materials,
  Toggles,
} from "./playground/sections/Basics";
import {
  Cards,
  Charts,
  Empties,
  People,
  Tables,
} from "./playground/sections/DataDisplay";
import { Overlays } from "./playground/sections/Overlays";

const NAV: readonly NavEntry[] = [
  { id: "materials", label: "Materials" },
  { id: "button", label: "Button" },
  { id: "badge", label: "Badge" },
  { id: "fields", label: "Input · Select" },
  { id: "switch-tabs", label: "Switch · Tabs" },
  { id: "overlays", label: "Overlays" },
  { id: "card", label: "Card" },
  { id: "table", label: "Table" },
  { id: "chart", label: "Chart" },
  { id: "avatar", label: "Avatar · Skeleton" },
  { id: "empty", label: "Empty" },
];

const App: FC = () => (
  <TooltipProvider>
    <AppShell nav={NAV}>
      <div className="pt-6 pb-8 md:pt-10">
        <h1 className="font-heading text-[2rem] leading-tight font-bold tracking-[-0.03em]">
          Components
        </h1>
        <p className="mt-1 text-[0.9375rem] text-muted-foreground">
          Every item installs with
        </p>
        <code className="mt-2 inline-block max-w-full rounded-lg bg-secondary px-2.5 py-1 text-[0.8125rem] break-all text-foreground">
          npx shadcn add NTCHz/glass-ui/&lt;name&gt;
        </code>
      </div>
      <Materials />
      <Buttons />
      <Badges />
      <Fields />
      <Toggles />
      <Overlays />
      <Cards />
      <Tables />
      <Charts />
      <People />
      <Empties />
    </AppShell>
    <Toaster position="top-center" />
  </TooltipProvider>
);

export default App;
