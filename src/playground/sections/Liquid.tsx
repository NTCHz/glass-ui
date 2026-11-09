import { BoldIcon, ItalicIcon, ShareIcon, UnderlineIcon } from "lucide-react";
import { useState, type FC } from "react";

import { Button } from "@/components/ui/button";
import {
  LiquidGlass,
  LiquidGlassGroup,
  LiquidGlassItem,
} from "@/components/ui/liquid-glass";

import { Section } from "../Section";

const STRIPES =
  "bg-[repeating-linear-gradient(115deg,oklch(0.62_0.19_262)_0_18px,oklch(0.86_0.12_200)_18px_36px,oklch(0.72_0.2_340)_36px_54px,oklch(0.9_0.14_90)_54px_72px)]";

const BANDS = [
  { tone: "light", className: "bg-white", label: "White page" },
  { tone: "dark", className: "bg-[oklch(0.2_0.02_260)]", label: "Dark panel" },
  { tone: "light", className: "bg-[oklch(0.93_0.06_90)]", label: "Pale card" },
  {
    tone: "dark",
    className: STRIPES + " brightness-50",
    label: "Photo (marked dark)",
  },
] as const;

const Lens: FC = () => (
  <div
    className={`relative isolate grid h-64 w-full place-items-center overflow-hidden rounded-[28px] glass-stage ${STRIPES}`}
  >
    <div className="flex flex-wrap justify-center gap-4 p-4">
      <div className="grid h-28 w-48 content-end rounded-3xl glass p-4">
        <code className="text-[0.8125rem] font-semibold">.glass</code>
        <span className="text-xs text-foreground/75">Frost only</span>
      </div>
      <LiquidGlass className="grid h-28 w-48 content-end rounded-3xl p-4">
        <code className="text-[0.8125rem] font-semibold">
          &lt;LiquidGlass&gt;
        </code>
        <span className="text-xs text-foreground/75">
          Lens rim + moving light
        </span>
      </LiquidGlass>
    </div>
  </div>
);

const Adaptive: FC = () => (
  <div
    tabIndex={0}
    aria-label="Scroll to change what sits behind the glass"
    className="relative h-64 w-full overflow-y-auto rounded-[28px] border"
  >
    <div className="sticky top-4 z-10 flex h-0 items-start justify-center">
      <LiquidGlass
        adaptive
        refraction={false}
        className="rounded-full px-5 py-2.5 text-sm font-medium"
      >
        Scroll — my tint follows the backdrop
      </LiquidGlass>
    </div>
    {BANDS.map(band => (
      <div
        key={band.label}
        data-glass-backdrop={band.tone}
        className={`grid h-64 place-items-end p-4 ${band.className}`}
      >
        <span
          className={`text-xs ${band.tone === "dark" ? "text-white/70" : "text-black/60"}`}
        >
          {band.label}
        </span>
      </div>
    ))}
  </div>
);

const TOOLS = [
  { icon: BoldIcon, label: "Bold" },
  { icon: ItalicIcon, label: "Italic" },
  { icon: UnderlineIcon, label: "Underline" },
];

const Merge: FC = () => {
  const [apart, setApart] = useState(false);
  return (
    <div
      className={`relative grid h-40 w-full place-items-center overflow-hidden rounded-[28px] glass-stage ${STRIPES}`}
    >
      <LiquidGlassGroup>
        <div
          className={`flex items-center transition-[gap] duration-500 ease-(--ease-spring) ${apart ? "gap-6" : "gap-0"}`}
        >
          {TOOLS.map(tool => (
            <LiquidGlassItem key={tool.label}>
              <Button variant="ghost" size="icon" aria-label={tool.label}>
                <tool.icon />
              </Button>
            </LiquidGlassItem>
          ))}
          <LiquidGlassItem className={apart ? "ml-6" : "ml-3"}>
            <Button variant="ghost" size="icon" aria-label="Share">
              <ShareIcon />
            </Button>
          </LiquidGlassItem>
        </div>
      </LiquidGlassGroup>
      <Button
        variant="glass"
        size="sm"
        className="absolute right-4 bottom-4"
        onClick={() => setApart(a => !a)}
      >
        {apart ? "Merge" : "Separate"}
      </Button>
    </div>
  );
};

export const LiquidSection: FC = () => (
  <Section
    id="liquid-glass"
    title="Liquid Glass"
    note="Lensing rim (Chromium), light that follows the pointer, tint that adapts to the backdrop, and shapes that fuse."
  >
    <Lens />
    <Adaptive />
    <Merge />
  </Section>
);
