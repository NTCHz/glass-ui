import {
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { Label } from "@/components/ui/label";
import { LiquidLens } from "@/components/ui/liquid-lens";
import { Switch } from "@/components/ui/switch";

import { Section } from "../Section";
import { STRIPES } from "../tuner";

const LENS = { width: 168, height: 96, radius: 48 };
const KEY_STEP = 12;

const clampTo = (value: number, max: number) =>
  Math.min(Math.max(value, 0), Math.max(max, 0));

const Lens: FC = () => {
  const area = useRef<HTMLDivElement>(null);
  const grab = useRef<[number, number] | null>(null);
  const [pos, setPos] = useState({ x: 40, y: 56 });
  const [rainbow, setRainbow] = useState(true);

  const moveTo = (x: number, y: number) => {
    const box = area.current;
    if (!box) return;
    setPos({
      x: clampTo(x, box.clientWidth - LENS.width),
      y: clampTo(y, box.clientHeight - LENS.height),
    });
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - box.left;
    const py = event.clientY - box.top;
    const inside =
      px >= pos.x &&
      px <= pos.x + LENS.width &&
      py >= pos.y &&
      py <= pos.y + LENS.height;
    if (!inside) return;
    // only a drag that starts on the lens is captured; elsewhere the text stays selectable
    event.preventDefault();
    grab.current = [px - pos.x, py - pos.y];
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!grab.current) return;
    const box = event.currentTarget.getBoundingClientRect();
    moveTo(
      event.clientX - box.left - grab.current[0],
      event.clientY - box.top - grab.current[1]
    );
  };
  const release = () => {
    grab.current = null;
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, -KEY_STEP],
      ArrowDown: [0, KEY_STEP],
    }[event.key];
    if (!step) return;
    event.preventDefault();
    moveTo(pos.x + step[0], pos.y + step[1]);
  };

  return (
    <div className="grid w-full gap-3">
      <div
        ref={area}
        tabIndex={0}
        role="group"
        aria-label="Lens playground: drag the lens, or use the arrow keys to move it"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onKeyDown={onKeyDown}
        className="relative w-full touch-none overflow-hidden rounded-[28px] border bg-card outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        <LiquidLens lens={{ ...pos, ...LENS }} dispersion={rainbow ? 0.25 : 0}>
          <div className="grid gap-4 p-6">
            <div className={`h-10 rounded-full ${STRIPES}`} />
            <p className="max-w-prose text-[0.9375rem] leading-relaxed">
              This lens bends the content it wraps instead of the backdrop, so
              it refracts in Safari and Firefox as well as Chrome. The words
              under it stay real text: you can still select them.
            </p>
            <div className="flex flex-wrap gap-2 text-sm font-medium">
              {["Refraction", "Dispersion", "Every engine"].map(word => (
                <span
                  key={word}
                  className="rounded-full bg-secondary px-3 py-1"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </LiquidLens>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="lens-rainbow"
          size="sm"
          checked={rainbow}
          onCheckedChange={setRainbow}
        />
        <Label htmlFor="lens-rainbow">Dispersion</Label>
      </div>
    </div>
  );
};

export const LensSection: FC = () => (
  <Section
    id="liquid-lens"
    title="Liquid Lens"
    note="A lens over content you own. Refracts in every engine, because it filters the content, not the backdrop."
  >
    <Lens />
  </Section>
);
