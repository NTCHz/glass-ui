# Decisions

## 2026-11-09 — initial scaffold

**Distribution: shadcn GitHub registry, not an npm package.**
Consumers own the code and can tweak per project. The CLI reads `registry.json` from the repo directly, so no hosting and no build step for consumers; private access goes through `gh auth` / `GH_TOKEN`; versions are git tags (`#v0.1.0`). Trade-off: fixes don't propagate — consumers re-run `add`.
GitHub registries only work on github.com (not GitLab or GitHub Enterprise).

**Primitives: Base UI** — shadcn 4.x default since 2026-07. Radix not used.

**Vite playground instead of the official Next.js `registry-template`.** The template pins Next 15 / Radix / shadcn 3; a registry is just `registry.json` + source files, so the playground framework is irrelevant to consumers. Vite matches the rest of our stack.

**Theme lives in `registry.json`, playground dogfoods it.** One source for tokens and utilities; the playground gets them through the same `shadcn add` path consumers use, so install problems show up here first. `registry.test.ts` catches drift.

**Glass = CSS only (blur + saturate + tint + sheen gradient + inset rim).** No SVG displacement/refraction: `backdrop-filter: url()` is Chromium-only and costly. Revisit if we want true refraction on hero surfaces.

**Glass box-shadow is written through `--tw-inset-shadow` / `--tw-shadow`** so `ring-*` focus styles and `shadow-*` overrides compose with the rim instead of replacing it. Depends on Tailwind v4 internals — recheck on Tailwind major bumps.

**Three materials (thin / regular / thick)** mirror Apple's material thickness: thin for controls, regular for containers, thick for text-heavy overlays (readability).

**Not in scope for v0.1:** select, combobox, toast, sheet, table, form wiring, SVG refraction, Storybook/docs site, npm package build.

## 2026-11-09 — v0.2 redesign: Apple Liquid Glass

v0.1 put glass on every surface (cards, inputs) and read as washed-out. Rebuilt around a component inventory of the owner’s past apps (which components get used, not their content) and Apple's HIG rule "don't use Liquid Glass in the content layer":

- **Two layers.** Content is opaque paper (flat cards, hairline borders, no shadow). Navigation and overlays are glass. `glass-thin` renamed `glass-clear` (Apple's term); materials now carry a top-left specular rim + bottom-right counter-rim + inner glow.
- **Component inventory** (what to build, ranked by use): status badge, tooltip, empty state, button, dialog, chart, skeleton, popover, menu, avatar, table, card. Blue primary, Inter + Sarabun, dense controls.
- **Playground is a neutral component catalog** with generic sample data — no app content, names, or branding from the inventory source.
- **From Apple:** capsule controls, filled (borderless) fields, green switch, segmented control with a sliding indicator (Base UI `Tabs.Indicator`), blue-highlight menus, system SF font first.
- **Signature: `glass-press`** — spring swell (scale 1.05 + brightness) on press. The spring overshoot (`--ease-spring`) is deliberate; detector flags it as advisory.
- **Added:** select, popover, sonner, avatar, skeleton, empty, table, chart. `next-themes` dropped from sonner (Vite has no provider); pass `theme` explicitly.
- **Contrast (computed):** light primary L 0.53 = 5.52:1 vs white; dark primary L 0.56 ≈ 4.8:1; muted-fg light L 0.47 = 6.35:1 on bg; status text ≥ 5.4:1 both themes.
- **Still no SVG refraction** — Chromium-only; revisit for hero chrome only.

## Known quirks

- Non-color vars (`--glass-blur`, `--glass-saturate`, `--glass-shadow`) live in the theme's `css` `:root`/`.dark` blocks, not `cssVars`: the CLI writes `cssVars` entries into `@theme inline` as `--x: var(--x)`, which is a self-reference and breaks inside shadow DOM `:host`.
- Theme declares `shadcn` + `tw-animate-css` and imports `shadcn/tailwind.css`: components use its custom variants (`data-checked`, `data-horizontal`, …). Without it Switch/Tabs/Separator render unstyled with no error.
- `cn` has no class group for `glass*`, so `<DialogContent className="glass">` keeps `glass-thick` too and CSS order wins. Change materials through the `--glass-*` vars, not by stacking classes.
- Fallback to `--glass-solid` triggers on `prefers-reduced-transparency: reduce` **or** `prefers-contrast: more` (the first isn't supported in every browser).
- v0.1 contrast history: L 0.6 primary was 3.9:1 vs white — failed AA; see v0.2 numbers above.
- `registryDependencies` refs aren't inherited: installing `button#v0.1.0` pulls `theme` from the default branch.
- `background-attachment: fixed` in `glass-backdrop` is ignored on iOS Safari (gradient scrolls with page).

## 2026-11-09 — full shadcn coverage

- All 64 `registry:ui` items from shadcn's `base-nova` registry are in the kit (`form` skipped: upstream ships it with zero files). Restyled to the same contract by four parallel passes, then reviewed together.
- `registry.json` component items are generated (`pnpm registry:gen`) from imports, including `src/hooks` (`registry:hook`) and `src/lib` (`registry:lib`, minus the playground-only `utils.ts`).
- `color-mix` switched from `in oklch` to `in oklab` everywhere: mixing the achromatic `--card` (hue 0) with green/blue tokens in oklch swung through red and tinted success/warning alerts pink.
- Button gained a `clear` variant (`glass-clear`) for controls over media; carousel uses it.
- `use-mobile` rewritten on `useSyncExternalStore` (the upstream setState-in-effect failed lint).
- Upstream `scrollbar-*` classes (thin, none, gutter-stable, thumb/track-transparent) have no definition in Tailwind or `shadcn/tailwind.css`; they are no-ops upstream too and are left as-is.
- Message scroller items use `content-visibility: auto`, so full-page screenshots show them blank off-screen; they render normally in the viewport.
- Destructive menu rows use `focus:text-white` on `bg-destructive` (dropdown-menu, context-menu, menubar) — a deliberate raw colour: white on the red fill in both themes, which no foreground token guarantees.
- Command drops its own glass inside dialogs and popovers (`not-in-[…]:glass-thick`) so the combobox recipe `<PopoverContent><Command>` never stacks two glass layers.

## 2026-11-09 — critique + polish (27/40 → fixes)

- New `--field` token (opaque): light oklch(0.955 0.004 255), dark oklch(0.25 0.012 260). Fields no longer use the translucent `--secondary` veil, which picked up the backdrop. Placeholder (muted-fg) on field = 5.99:1 both themes; foreground ≥ 14:1.
- Light `--destructive` darkened 0.58 → 0.53: 5.89:1 vs white (solid confirm), 4.95:1 on its 12% tint, 5.48:1 on the page ground. v0.2's 0.58 measured 4.08:1 on tint — failed AA.
- Button `destructive-solid` for final confirms; `destructive` (tint) for initiating actions.
- Selected state unified to two languages: Lift (nav, segmented, pagination, toggles) and Blue (choices, menus, checks).
- Base UI disabled state is `data-disabled`, not `:disabled` — checkbox, radio, accordion now dim.
- Menus use Apple's leading gutter (check/radio indicator at the start, `inset` aligns plain rows).
- Combobox list uses shadcn's scroll-aware `scroll-fade-b` (fades only while more content is below).
- Carousel gains `CarouselDots`; mobile catalog header tracks the section in view.
- Detector after polish: 0 findings (was 2 CLI advisories + 33 in-browser).

## 2026-11-09 — audit fixes (15/20 → re-verified with axe)

- Split red into two tokens: `--destructive` for text and tints, `--destructive-solid` for white-on-red fills (destructive-solid button, focused destructive menu rows). Dark `--destructive` 0.68 → 0.72 (text on card 6.62:1); dark `--destructive-solid` 0.55 (white 5.38:1). Before, white on dark 0.68 red was 3.15:1.
- Avatar fallback text in dark uses `accent-foreground` (≈8:1; was `primary` at 3.36:1).
- Reduced motion: theme `@layer base` forces tw-animate's enter/exit scale, translate, rotate and blur to neutral under `prefers-reduced-motion: reduce` (`!important`, so it beats utilities across layers). Overlays keep a fade only.
- Touch: default buttons, icon buttons and every field family grow to 44px under `pointer-coarse`. Checkbox and switch already extend their hit area with `after:-inset-*`, so their small visible size is not a target-size failure.
- `shadow-lift` theme token replaces six copies of the Lift shadow.
- Combobox trigger/clear/chip-remove ship default `aria-label`s; Slider forwards `aria-label` to every thumb; ItemGroup no longer claims `role="list"` over non-listitem children.
- Remaining axe items are upstream: cmdk puts a separator inside its listbox, react-day-picker day buttons use full-date names (more informative than the visible number), shiki github-light token colours in code-block.

## 2026-11-09 — Liquid Glass optics (v0.4)

What separates Apple's Liquid Glass from frosted glass, and how much of it the web can do:

| Apple                               | glass-ui                                                                                                                                                                                                                                                                                    | Reach                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lensing at the rim                  | `<LiquidGlass>` builds a displacement map (rounded-rect SDF, bezel ≈ 0.8 × radius, 8–28px) on a canvas and runs it through an SVG `feDisplacementMap` inside `backdrop-filter: url(#…)`                                                                                                     | Chromium only. Safari parses `url()` in backdrop-filter and drops the whole backdrop, so it is gated on `navigator.userAgentData` brands, not `CSS.supports` |
| Light that moves                    | every `glass*` utility reads `--glass-light-x/y` (sheen centre) and `--glass-rim-x/y` (rim direction); `useLiquidGlass` sets them from the mouse, or device tilt on Android                                                                                                                 | iOS tilt needs `DeviceOrientationEvent.requestPermission()` from a tap, so the light stays top-left there                                                    |
| Tint adapts to what is behind       | `adaptive` samples `elementsFromPoint` at three points, reads the first opaque background (canvas-normalised, so oklch works) and sets `data-glass-tone`. Theme blocks `[data-glass-tone=light                                                                                              | dark]` copy the theme's own glass + foreground values (test guards drift). Hysteresis: dark below luminance 0.18, light above 0.30                           | Images and gradients have no readable colour: mark them `data-glass-backdrop="dark | light"` |
| Shapes fuse (GlassEffectContainer)  | `LiquidGlassGroup` paints one sheet of glass masked by an SVG "gooey" filter (blur + alpha threshold, crisp shapes laid back on top) of its `LiquidGlassItem` rects, plus rim and shadow layers from the same shape; redraws every frame while `getAnimations({subtree:true})` is non-empty | All engines (SVG as mask-image). No lensing on the merged sheet                                                                                              |
| Controls morph out of their trigger | `glass-morph` on the nine anchored popups: enter from scale 0.4 + 8px blur on the spring, from `--transform-origin`                                                                                                                                                                         | Approximation: the popup grows from the trigger; the trigger itself does not become the menu                                                                 |
| Liquid selection                    | tabs indicator moves its leading edge in 260ms and trailing edge in 500ms (`data-activation-direction`), so the pill stretches then settles                                                                                                                                                 | All engines                                                                                                                                                  |

- The lens uses 0.45 × the material blur: at full blur the bent stripes in the playground test pattern were invisible.
- Reduced transparency / increased contrast: no lens (the utility's solid fallback applies). Reduced motion: light stays put; morph and stretch collapse through the existing reduced-motion rule.
- `shadcn add theme` re-appends nested `@media` / `@variant` blocks on every run (the playground had three copies of each). `pnpm theme:sync` runs `scripts/dedupe-css.mjs` after the CLI and is idempotent.
- The lib is `glass-optics`, not `liquid-glass`: two items with one name made the ui item depend on itself. `registry.test.ts` now rejects duplicate names.
- Upgrade note: popover, select, dropdown/context menu, menubar, tooltip, hover-card and combobox now use `glass-morph` instead of `zoom-in-95`. Re-adding one of them over an older install needs `theme` re-added too, or the popup only fades.
- Tone blocks live in `@layer base` so a `text-*` utility on the glass still wins over the tone's `color`.
