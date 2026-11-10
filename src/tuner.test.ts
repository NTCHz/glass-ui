import { describe, expect, it } from "vitest";

import { TUNER_DEFAULTS, tunerSnippet } from "./playground/tuner";

describe("tunerSnippet", () => {
  it("emits only className when nothing is tuned", () => {
    expect(tunerSnippet(TUNER_DEFAULTS)).toBe(
      `<LiquidGlass className="rounded-3xl p-6">\n  Your content\n</LiquidGlass>`
    );
  });

  it("lists every changed prop on its own line, rounded", () => {
    expect(
      tunerSnippet({
        ...TUNER_DEFAULTS,
        material: "thick",
        specular: false,
        tint: "oklch(0.7 0.12 250 / 0.35)",
        values: { strength: 3.1000000004, dispersion: 0.2 },
      })
    ).toBe(
      [
        "<LiquidGlass",
        '  material="thick"',
        "  specular={false}",
        "  strength={3.1}",
        "  dispersion={0.2}",
        '  tint="oklch(0.7 0.12 250 / 0.35)"',
        '  className="rounded-3xl p-6"',
        ">",
        "  Your content",
        "</LiquidGlass>",
      ].join("\n")
    );
  });
});
