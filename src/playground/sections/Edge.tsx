import { ArchiveIcon, ReplyIcon, ShareIcon, TrashIcon } from "lucide-react";
import { useState, type FC } from "react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Section } from "../Section";
import { STRIPES } from "../tuner";

const ROWS = Array.from({ length: 14 }, (_, i) => i + 1);

const ScrollEdge: FC = () => {
  const [style, setStyle] = useState("soft");
  const hard = style === "hard" ? "scroll-edge-hard" : "";
  return (
    <div className="grid w-full gap-3">
      <ToggleGroup
        spacing={0}
        size="sm"
        aria-label="Edge style"
        value={[style]}
        onValueChange={next => next[0] && setStyle(next[0])}
      >
        <ToggleGroupItem value="soft">Soft</ToggleGroupItem>
        <ToggleGroupItem value="hard">Hard</ToggleGroupItem>
      </ToggleGroup>
      <div
        tabIndex={0}
        role="region"
        aria-label="Scroll to see content fade under the bars"
        className="relative h-80 w-full overflow-y-auto rounded-[28px] border bg-background glass-stage outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        <div
          className={`scroll-edge-top sticky top-0 z-10 px-3 pt-3 pb-2 ${hard}`}
        >
          <div className="flex h-12 items-center rounded-full glass px-5 text-[0.9375rem] font-semibold">
            Inbox
          </div>
        </div>
        <div className="grid gap-3 px-4 py-2">
          {ROWS.map(row => (
            <div key={row} className="grid gap-1 rounded-2xl bg-card p-4">
              {row % 4 === 1 ? (
                <div className={`mb-1 h-8 rounded-full ${STRIPES}`} />
              ) : null}
              <span className="text-sm font-medium">Message {row}</span>
              <span className="text-[0.8125rem] text-muted-foreground">
                Content keeps scrolling under the bars; the edge fades it so the
                bar stays readable.
              </span>
            </div>
          ))}
        </div>
        <div
          className={`scroll-edge-bottom sticky bottom-0 z-10 px-3 pt-2 pb-3 ${hard}`}
        >
          <div className="mx-auto flex w-fit gap-1 rounded-full glass p-1">
            <Button variant="ghost" size="icon" aria-label="Reply">
              <ReplyIcon />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Archive">
              <ArchiveIcon />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Share">
              <ShareIcon />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Delete">
              <TrashIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScrollEdgeSection: FC = () => (
  <Section
    id="scroll-edge"
    title="Scroll Edge"
    note="Apple's scroll edge effect: content fades and blurs as it slides under a floating bar. Soft by default, hard for dense content."
  >
    <ScrollEdge />
  </Section>
);
