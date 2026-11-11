# AGENTS.md

shadcn GitHub registry (liquid glass). Consumers run `npx shadcn add NTCHz/glass-ui/<item>`; the CLI reads root `registry.json` straight from GitHub.

## Rules

- `registry.json` `theme` item is the **single source** for tokens and `@utility glass*`. Never hand-edit glass rules in `src/index.css` — edit `registry.json`, then `pnpm theme:sync`. `pnpm test` fails on drift.
- After adding a file to `src/components/ui/`, `src/hooks/` or `src/lib/`, or changing its imports, run `pnpm registry:gen` — it rebuilds every non-theme item in `registry.json` from the imports (deps, intra-registry deps, theme dep). Never hand-edit those items; the test fails on drift.
- Intra-registry deps use `NTCHz/glass-ui/<name>`, never a bare name — bare `button` pulls upstream shadcn.
- Components keep shadcn's `function` style (not `FC`) so upstream diffs stay readable. `FC` applies to playground code only.
- Two layers: glass only on the control layer (nav, toolbars, tab bar, menus, dialogs, tooltips, toasts). Content (cards, tables, fields) stays opaque — see PRODUCT.md principles.
- Glass surfaces: no `bg-*`, `ring-1`, or `shadow-*` next to `glass*` — they override the material.
- `color-mix` must use `in_oklab`, never `in_oklch`: `--card` is `oklch(1 0 0)` (hue 0 = red), so an oklch mix with a green/blue token interpolates through pink.
- Every colour/contrast change: recompute WCAG ratios (oklch → sRGB) for both themes before committing; record the numbers in docs/DECISIONS.md.
- Tailwind `@utility` bodies: never nest `@media` inside `&:active` / `&:hover` / `&::before`, or `&::before` inside `@media` — Tailwind 4.3 mangles it into invalid CSS (`prefers-reduced-transparency: :before: reduce`) or hoists the media rule off the pseudo-element. Put such fallbacks in an unlayered top-level `@media` rule in the theme item (see `scroll-edge-*`).
- Two or more separately blurred glass elements near each other need a `glass-stage` container (opaque background, not the page root). Without it Chromium on macOS redraws a neighbour's backdrop in part and leaves a seam whenever one of them repaints (docs/DECISIONS.md). Playwright screenshots cannot show this bug.
- `src/lib/glass-optics.ts` stays DOM-free (tests compile without the DOM lib); browser helpers go in `src/lib/glass-dom.ts`.
- Base UI menus: `DropdownMenuLabel` must sit inside `DropdownMenuGroup` (Base UI error #31 otherwise).
- TypeScript stays on 6.x until typescript-eslint supports 7 (peer `<6.1.0` as of 2026-11-09).
- Don't commit `public/r/` — build output only.

## Gates

`pnpm typecheck && pnpm lint && pnpm test && pnpm format:check && pnpm build && pnpm registry:validate`
