export const STRIPES =
  "bg-[repeating-linear-gradient(115deg,oklch(0.62_0.19_262)_0_18px,oklch(0.86_0.12_200)_18px_36px,oklch(0.72_0.2_340)_36px_54px,oklch(0.9_0.14_90)_54px_72px)]";

// mixed into the theme's solid fill so text keeps its contrast in both themes
const tint = (hue: number) =>
  `oklch(from color-mix(in oklab, var(--glass-solid) 72%, oklch(0.68 0.15 ${hue})) l c h / 0.65)`;

export const TINTS = [
  { label: "Theme", value: null },
  { label: "Blue", value: tint(250) },
  { label: "Rose", value: tint(10) },
  { label: "Mint", value: tint(170) },
] as const;

export type TunerKey =
  | "strength"
  | "bezel"
  | "dispersion"
  | "blur"
  | "saturate"
  | "brightness"
  | "shine"
  | "lightAngle";

export type TunerControl = {
  key: TunerKey;
  label: string;
  min: number;
  max: number;
  step: number;
  /** Slider position while the prop is unset; null means the value is derived. */
  base: number | null;
  baseLabel: string;
  unit?: string;
};

// base values are the light theme's; dark uses saturate 160%, brightness 0.96, sheen 0.07
export const TUNER_CONTROLS: readonly TunerControl[] = [
  {
    key: "strength",
    label: "Strength",
    min: 0,
    max: 4,
    step: 0.1,
    base: 2.4,
    baseLabel: "2.4",
  },
  {
    key: "bezel",
    label: "Bezel",
    min: 0,
    max: 64,
    step: 1,
    base: null,
    baseLabel: "from radius",
    unit: "px",
  },
  {
    key: "dispersion",
    label: "Dispersion",
    min: 0,
    max: 0.6,
    step: 0.02,
    base: 0,
    baseLabel: "off",
  },
  {
    key: "blur",
    label: "Blur",
    min: 0,
    max: 40,
    step: 1,
    base: 14,
    baseLabel: "theme",
    unit: "px",
  },
  {
    key: "saturate",
    label: "Saturate",
    min: 0,
    max: 300,
    step: 5,
    base: 190,
    baseLabel: "theme",
    unit: "%",
  },
  {
    key: "brightness",
    label: "Brightness",
    min: 0.5,
    max: 1.5,
    step: 0.01,
    base: 1.04,
    baseLabel: "theme",
  },
  {
    key: "shine",
    label: "Shine",
    min: 0,
    max: 1,
    step: 0.05,
    base: 0.6,
    baseLabel: "theme",
  },
  {
    key: "lightAngle",
    label: "Light angle",
    min: 0,
    max: 355,
    step: 5,
    base: 315,
    baseLabel: "pointer",
    unit: "°",
  },
];

export type Material = "clear" | "regular" | "thick";

export type TunerState = {
  values: Partial<Record<TunerKey, number>>;
  material: Material;
  tint: string | null;
  specular: boolean;
  refraction: boolean;
};

export const TUNER_DEFAULTS: TunerState = {
  values: {},
  material: "regular",
  tint: null,
  specular: true,
  refraction: true,
};

const round = (n: number) => Math.round(n * 1000) / 1000;

/** JSX for a <LiquidGlass> with only the props that differ from the defaults. */
export function tunerSnippet(state: TunerState): string {
  const props = [
    state.material !== "regular" && `material="${state.material}"`,
    !state.refraction && "refraction={false}",
    !state.specular && "specular={false}",
    ...TUNER_CONTROLS.flatMap(({ key }) => {
      const value = state.values[key];
      return value === undefined ? [] : [`${key}={${round(value)}}`];
    }),
    state.tint && `tint="${state.tint}"`,
    `className="rounded-3xl p-6"`,
  ].filter((p): p is string => Boolean(p));
  const open =
    props.length > 2
      ? `<LiquidGlass\n${props.map(p => `  ${p}`).join("\n")}\n>`
      : `<LiquidGlass ${props.join(" ")}>`;
  return `${open}\n  Your content\n</LiquidGlass>`;
}
