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

## 2026-11-09 — seam in a glass card when a neighbouring glass element repaints (Chromium, macOS)

- Symptom: hovering (or clicking, selecting text in) one glass card drew a vertical line inside a card two places over. Only visible on the real screen: Playwright screenshots force a full redraw and never show it. Measured by capturing the browser window with `screencapture -l` in Helium (Chromium 156).
- Cause: Chromium redraws one damage rectangle per frame. Damage on card 3 touches card 2, so the rectangle grows to card 2 plus its blur reach (3 × blur = 42px), and its left edge lands inside card 1. Card 1's backdrop is then re-blurred only inside that rectangle, without the pixels left of the edge, so that strip differs from the rest. The seam sat 39px left of card 2 in the screenshots.
- Did not help: `will-change`, removing `overflow-hidden`, blur on a child layer, `contain: paint`, layer-promoting the stage, dropping `background-attachment: fixed`, removing the hover effect (any repaint triggers it).
- Fix: `glass-stage` on the container that holds the glass elements. It gives the container a 0.1px backdrop blur, which makes Chromium grow the damage rectangle to the whole container, so no glass inside is ever redrawn in part. 0/16 captured frames show a change in a non-hovered card (6/16 without it, worst column diff 18.8 → 1.0).
- Cost and limits: the whole stage redraws when anything inside it changes, and (like any `backdrop-filter`) it becomes the containing block for `position: fixed` descendants, so it goes on a local container, not on the page root. Give the stage an opaque background.

## 2026-11-10 — docs audit (13/20): dark primary text, touch, landmarks, bundle

- Dark `--primary` (L 0.56) is a fill colour, not a text colour: as text it measures 3.98:1 on the page ground (L 0.17) and 3.69:1 on `--card` (L 0.21) — fails AA. Text that used it now switches to `--accent-foreground` (L 0.78) in dark: 9.39:1 on the page, 8.71:1 on card. Applied to `button` `link`, link hover in `empty` / `field` / `item`, and the `sidebar` menu badge on the active row (Avatar did this in the earlier audit). Light keeps `--primary` (5.16:1 for the link button on the page).
- Docs sidebar: the current page keeps `--foreground` text (9.65:1 on the dark active pill, was 2.41:1 in primary) and marks itself with the pill, the primary line segment and a primary icon — the same pattern as the kit's `Sidebar`.
- `tabs` `line` variant had no height, so triggers were 20px tall (below WCAG 2.5.8's 24px). Now 32px, 44px under `pointer-coarse`.
- Docs: nav links, icon buttons and index capsules grow to 44px under `pointer-coarse`; skip link to `#content`; one `nav` landmark instead of a region per group; search result count announced through `role="status"`.
- Demos load per page (`React.lazy` over the section files): entry chunk 508KB → 167KB gzip. A chunk that fails (offline, stale hash after a redeploy) shows a reload prompt inside the page instead of unmounting the app, and is dropped from the cache so the next visit retries.
- Not verified: `pointer-coarse` sizes on a real touch device (Chromium on macOS reports a fine pointer even under mobile emulation).

## 2026-11-10 — audit round 2 (16/20): code colours, menubar, table, labels, dots

- Code highlighting keeps shiki's GitHub themes with `colorReplacements` for the colours that failed AA on the card and on the added / removed / highlighted line tints (each moved in OKLCH lightness at the same hue until ≥ 4.6:1 on every ground). Light: comment `#6a737d→#606973` (4.04→4.69), green `#22863a→#09782d` (3.88→4.70), red `#d73a49→#c7283c` (3.84→4.65), orange `#e36209→#bb3c00` (2.93→4.69). Dark: comment `#6a737d→#8d97a1` (2.85→4.61). Every other token colour already passed. Ignored: the near-white / near-black colours both themes use only for tokens that paint their own background (invalid / markup).
- Menubar triggers had no `role="menuitem"` and no arrow-key roving **in the dev server only**: the lazy demos made Vite's dep optimizer discover `@base-ui/react/menu` and `/menubar` in separate passes, and it bundled `MenubarContext` twice, so the trigger never saw its menubar. The production build was correct. `optimizeDeps.entries` now scans every source file up front. Consumers who lazy-load menubars in a Vite app can hit the same thing.
- `table` container is focusable (`tabIndex=0` + focus ring) so a keyboard can scroll a table wider than its container (axe `scrollable-region-focusable`).
- `calendar` day names lead with the visible number ("10, Today, Tuesday, November 10th, 2026, selected") — WCAG 2.5.3 label in name. The rest is still the locale pack's own label (react-day-picker 10 ships translated ones, e.g. pt "10, Hoje, terça-feira, …, selecionado"), or the library default.
- `command` separator: cmdk's is `role="separator"`, which a listbox may not contain. Replaced with an `aria-hidden` rule that still hides while searching (`alwaysRender` keeps it).
- `carousel` dots: 8px dots 6px apart put target centres 14px apart, failing WCAG 2.5.8 even with the enlarged hit area. Each dot is now a 24px button with the dot drawn inside; the row is a little wider.
- Docs: an sr-only "Example" h2 above each preview, so demo headings (h3) follow an h2.

## 2026-11-10 — per-pane tuning props on LiquidGlass (v0.5.0)

- `strength`, `bezel`, `dispersion`, `blur`, `saturate`, `brightness`, `tint`, `shine`, `lightAngle` on `<LiquidGlass>` / `useLiquidGlass`. Unset = the old constants and theme tokens, so existing installs render the same. Values are clamped (`TUNING_LIMITS` in `glass-optics`) so a typo cannot blow the lens up or blank the pane.
- The frost props write the theme's own custom properties inline (`--glass-blur`, `--glass-saturate`, `--glass-brightness`, `--glass-sheen`, `--glass-<material>`) instead of new CSS. The `glass*` utilities, the lens and the reduced-transparency fallback (`--glass-solid`) keep working unchanged, and these props work in every engine.
- `dispersion` runs the displacement three times (red at scale × (1 − d), green at scale, blue at scale × (1 + d)), keeps one channel of each and adds them back with `feBlend screen` (exact here, since each layer is zero in the other two channels). Three passes, so it is opt-in. Chromium only, like the lens.
- `lightAngle` sets the light vars once; the pointer still moves the light while `specular` is on. 315° equals the old top-left default.
- Docs: a Glass Tuner page puts every prop on a slider over the stripe backdrop and prints the JSX with only the changed props. Tint presets mix the hue into `--glass-solid` (72%) at 0.65 alpha so text keeps the theme's contrast in both themes (dark: L 0.36, light: L ≈ 0.9 before the backdrop shows through).
- Not done: dispersion and refraction for `LiquidGlassGroup` (the merged sheet has no lens at all); per-pane rim colours.

## 2026-11-10 — what other glass kits do that we did not (research round)

Compared: React Bits GlassSurface, liquid-glass-react, liquid-glass-web-react, Aave's "Building Glass for the Web", Glasscn, Liquefy UI, Apple HIG (materials, WWDC25 356).

- **`LiquidLens` (new item): refraction in every engine.** It applies `filter: url()` to the content it wraps instead of `backdrop-filter`, the approach liquid-glass-web-react and Aave use. Measured in Playwright Chromium (Helium), WebKit and Firefox: about 4,400 of the 16,128 lens pixels change in each engine, and the three screenshots match.
  - WebKit reads `userSpaceOnUse` primitive coordinates (`feImage` / `feDisplacementMap` `x`/`y`) from the page origin, not the element. Any element not at the page's top-left then loses its whole filter (renders blank). Fix: no primitive subregions at all. The map is the size of the content, neutral grey except under the lens, and the filter region is the default object bounding box. The lens's own pixels are computed once per shape and copied into that canvas on each move.
  - Safari caches filter output by id (Aave), so the id encodes position, content size and shape. Measured: no blank or stale frame after moves in WebKit or Firefox.
  - Default strength 0.9, not LiquidGlass's 2.4: this bends sharp text, not a blurred backdrop. The rim shift is `0.5 × scale × t²` over the bezel, so it grows at `strength × t` px per px; past 1 the sample point runs backwards and the rim folds text back on itself. 1.2 (the first default) turned the words at the capsule ends into scribbles in Chromium, WebKit, Firefox and real Safari 27.2 alike (2026-11-11). With dispersion the default divides by `1 + dispersion`, so the blue pass stays under 1 too. An explicit `strength` is used as given. GlassScope uses the same 0.9. What remains is the step at the very edge, where the shifted rim meets unshifted content; any lens that magnifies at its rim has it.
  - Corners: the map is neutral outside the rounded shape (`displacementPixels(..., clip)`), antialiased over half a pixel.
- **Scroll edge effect** (`scroll-edge-top` / `-bottom`, `scroll-edge-hard`), from the HIG. A `::before` on the sticky bar reaches `--scroll-edge-fade` (1.5rem soft, 1px hard) past it with a background-tinted gradient, a small backdrop blur and a mask that fades it out. The knobs are `var()` fallbacks, so `scroll-edge-hard` overrides them regardless of utility order. Opaque `--background` under reduced transparency, through an unlayered top-level `@media` rule: inside `@utility`, Tailwind 4.3 either broke the build (`prefers-reduced-transparency: :before: reduce`) or hoisted the media rule off `::before` onto the bar. Checked with `contrast: more` emulation: `::before` turns into a solid `--background` with no blur. The docs' mobile header uses it.
  - Playwright's WebKit and Firefox do not render `backdrop-filter` at all (the plain `glass` header shows unblurred content there too), so the blur part was only checked in Chromium. The gradient fade renders in all three.
- **`elasticity`** (liquid-glass-react, Liquefy): the pane drifts toward a pointer within 160px of its edge and stretches along that axis, then eases back. It uses the individual `translate` / `scale` properties because `glass-press` owns `transform`. Off by default, off under reduced motion, and the inline style is removed at rest.
- **`pointerArea`** (liquid-glass-react's `mouseContainer`), **`rim`**, **`glow`** (Aave's edge highlight / glow).
- **Map generation ~3× faster**: the field is mirror-symmetric, so one quadrant is computed and copied with the shift negated (Aave). 900×600: 12.8 → 4.1 ms; 400×120: 1.5 → 0.55 ms. A test checks the output is identical to the per-pixel version.
- Not done: a lens on `Slider` / `Switch` thumbs. Their tracks are flat fills, and a lens over a flat colour shows nothing, so it would cost a filter per control for no visible change.
- Not verified on real Safari / Firefox apps or a real touch device. Playwright's WebKit and Firefox are close to them but are not the shipping browsers.

## 2026-11-11 — second research round: GlassScope, Dock, lens thumb, spring, llms.txt

Compared: liquikit (`GlassScope`), opaline, liquefy-ui, website-glass, glasscn, crenspire glass-ui, liquid-components, @glinui/ui. The shadcn registry index (`ui.shadcn.com/r/registries.json`) already lists `@glass-ui` for crenspire's kit, so a listing there needs another namespace and hosted `/r/{name}.json` files. Not done; it is the owner's call.

- **`GlassScope` / `GlassScopeContent`** (liquikit's idea): `LiquidGlass` panes inside a scope register with it. Where the backdrop lens is unsupported (not Chromium) the scope bends `GlassScopeContent` under every pane with one `filter: url()`, the same WebKit-safe full-size map as `LiquidLens`. Chromium keeps the backdrop lens and the scope stays idle. While scoped, a pane's `--glass-blur` drops to 0.45× like the Chromium lens, or the frost blurs the bend away.
  - Measured in Playwright WebKit / Firefox: 910 / 766 pixels change under the bar and none outside it, and the map follows the scroll (lens `y` = `scrollTop` + 12).
  - Per-frame cost: re-encoding a full canvas PNG on every scroll took 5.9 ms (680×1134) and 33.7 ms (1200×4000) in WebKit, 3.2 / 15.0 ms in Firefox. Now each lens shape becomes a PNG once, and the map is an SVG that places those PNGs on neutral grey, so a scroll only rebuilds a string. Pixel counts are identical to the canvas version, so the grey is exactly neutral. Scroll steps then land at about 2 frames per step.
  - Panes with different bezels share one `scale` (the widest bezel × strength); each pane's shifts are scaled by `bezel / maxBezel` (`scaleDisplacement`).
  - Panes are re-measured on scroll, resize, and a style/class change on the pane (drag, elasticity). A pane moved by an ancestor's style waits for the next of those (`shortcut:` in the code).
- **`Dock`** (website-glass, liquefy, opaline all ship one): Base UI Toolbar for roving focus and arrow keys. Items grow by `dockScale`, a cosine falloff over 2.5 item widths. Measured: 77 px under the pointer (48 × 1.6), 64 px next to it, 48 px at rest, identical in all three engines. Off for touch (no hover to aim with) and reduced motion.
- **Slider thumb lens while dragged** (opaline, website-glass, liquid-components): Base UI's thumb `render` gets `state.dragging`. The thumb swaps the white fill for `glass-clear` plus a backdrop lens (bezel 8) only while dragged, quiet at rest. Chromium bends the fill edge under it; Safari / Firefox show clear glass. The earlier "flat track shows nothing" verdict was wrong for the thumb: the fill edge under it is what bends. `Switch` was left as is, because its press state is CSS-only (`group-active`) and would need JS state.
- **Elasticity on a spring** (liquefy, liquid-components): `springStep` (stiffness 0.14, damping 0.74 per frame) replaces the plain ease and overshoots once or twice. Pointer velocity (low-passed) stretches the pane along its motion (`motionStretch`, full at 40 px/frame), and a press kicks a squash that wobbles back (`pressImpulse`). It is still off by default and under reduced motion.
- **`llms.txt`**: generated at build from `registry.json` and `src/docs/catalog.ts` (`scripts/gen-llms.mjs`, gitignored output), with each page's install command and the kit's rules. No MCP server of our own: the shadcn MCP server already reads public GitHub registries as `owner/repo` (shadcn docs, checked via Context7). The Installation guide documents `mcp init`.
- `glass-dom.ts` split out of `glass-optics.ts`: the tests compile under `tsconfig.node.json`, which has no DOM lib, so the optics math stays DOM-free.
