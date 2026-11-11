import { RotateCcwIcon } from "lucide-react";
import { useState, type FC } from "react";

import { Button } from "@/components/ui/button";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { Label } from "@/components/ui/label";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Section } from "../Section";
import {
  STRIPES,
  TINTS,
  TUNER_CONTROLS,
  TUNER_DEFAULTS,
  tunerSnippet,
  type Material,
  type TunerControl,
  type TunerState,
} from "../tuner";

const MATERIALS: readonly Material[] = ["clear", "regular", "thick"];

const shown = (control: TunerControl, value: number | undefined) =>
  value === undefined
    ? control.baseLabel
    : `${Number(value.toFixed(2))}${control.unit ?? ""}`;

const ControlSlider: FC<{
  control: TunerControl;
  value: number | undefined;
  onChange: (value: number) => void;
}> = ({ control, value, onChange }) => (
  <div className="grid gap-1.5">
    <div className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
      <span className="font-medium">{control.label}</span>
      <output
        className={`tabular-nums ${value === undefined ? "text-muted-foreground" : ""}`}
      >
        {shown(control, value)}
      </output>
    </div>
    <Slider
      aria-label={control.label}
      min={control.min}
      max={control.max}
      step={control.step}
      value={[value ?? control.base ?? control.min]}
      onValueChange={next => onChange(Array.isArray(next) ? next[0] : next)}
    />
  </div>
);

const Choice: FC<{
  label: string;
  value: string;
  options: readonly { label: string; value: string }[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div className="grid gap-1.5">
    <span className="text-[0.8125rem] font-medium">{label}</span>
    <ToggleGroup
      spacing={0}
      size="sm"
      aria-label={label}
      value={[value]}
      // a pressed item toggles itself off; keep one chosen
      onValueChange={next => next[0] && onChange(next[0])}
    >
      {options.map(option => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  </div>
);

const Toggle: FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => (
  <div className="flex items-center justify-between gap-3">
    <Label htmlFor={id}>{label}</Label>
    <Switch id={id} size="sm" checked={checked} onCheckedChange={onChange} />
  </div>
);

const NO_TINT = "theme";

const Tuner: FC = () => {
  const [state, setState] = useState<TunerState>(TUNER_DEFAULTS);
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const patch = (next: Partial<TunerState>) =>
    setState(current => ({ ...current, ...next }));
  const code = tunerSnippet(state);
  return (
    <div className="grid w-full gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div
          ref={setStage}
          className={`relative isolate grid min-h-72 place-items-center overflow-hidden rounded-[28px] p-6 glass-stage ${STRIPES}`}
        >
          <LiquidGlass
            material={state.material}
            refraction={state.refraction}
            specular={state.specular}
            pointerArea={stage}
            tint={state.tint ?? undefined}
            {...state.values}
            className="grid w-full max-w-72 gap-1 rounded-3xl p-6"
          >
            <span className="text-lg font-semibold tracking-[-0.01em]">
              Liquid Glass
            </span>
            <span className="text-sm text-foreground/75">
              Drag the sliders, then move the pointer near me. Refraction and
              dispersion need Chrome or Edge.
            </span>
          </LiquidGlass>
        </div>
        <div className="grid content-start gap-4 rounded-[28px] border bg-card p-4">
          <Choice
            label="Material"
            value={state.material}
            options={MATERIALS.map(m => ({ label: m, value: m }))}
            onChange={m => patch({ material: m as Material })}
          />
          {TUNER_CONTROLS.map(control => (
            <ControlSlider
              key={control.key}
              control={control}
              value={state.values[control.key]}
              onChange={value =>
                setState(current => ({
                  ...current,
                  values: { ...current.values, [control.key]: value },
                }))
              }
            />
          ))}
          <Choice
            label="Tint"
            value={state.tint ?? NO_TINT}
            options={TINTS.map(t => ({
              label: t.label,
              value: t.value ?? NO_TINT,
            }))}
            onChange={t => patch({ tint: t === NO_TINT ? null : t })}
          />
          <Toggle
            id="tuner-refraction"
            label="Refraction"
            checked={state.refraction}
            onChange={refraction => patch({ refraction })}
          />
          <Toggle
            id="tuner-specular"
            label="Light follows pointer"
            checked={state.specular}
            onChange={specular => patch({ specular })}
          />
        </div>
      </div>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Your settings</CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setState(TUNER_DEFAULTS)}
            >
              <RotateCcwIcon />
              Reset
            </Button>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{code}</CodeBlockContent>
      </CodeBlock>
    </div>
  );
};

export const LiquidTuner: FC = () => (
  <Section
    id="glass-tuner"
    title="Glass Tuner"
    note="Every LiquidGlass prop on a slider. Copy the result when it looks right."
  >
    <Tuner />
  </Section>
);
