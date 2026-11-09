# AGENTS.md

shadcn GitHub registry (liquid glass). Consumers run `npx shadcn add NTCHz/glass-ui/<item>`; the CLI reads root `registry.json` straight from GitHub.

## Rules

- `registry.json` `theme` item is the **single source** for tokens and `@utility glass*`. Never hand-edit glass rules in `src/index.css` — edit `registry.json`, then `pnpm registry:build && npx shadcn add ./public/r/theme.json -y`. `pnpm test` fails on drift.
- Every new file in `src/components/ui/` needs a `registry.json` item with `dependencies` matching its imports and `registryDependencies` including `NTCHz/glass-ui/theme` (test enforces).
- Intra-registry deps use `NTCHz/glass-ui/<name>`, never a bare name — bare `button` pulls upstream shadcn.
- Components keep shadcn's `function` style (not `FC`) so upstream diffs stay readable. `FC` applies to playground code only.
- Two layers: glass only on the control layer (nav, toolbars, tab bar, menus, dialogs, tooltips, toasts). Content (cards, tables, fields) stays opaque — see PRODUCT.md principles.
- Glass surfaces: no `bg-*`, `ring-1`, or `shadow-*` next to `glass*` — they override the material.
- Every colour/contrast change: recompute WCAG ratios (oklch → sRGB) for both themes before committing; record the numbers in docs/DECISIONS.md.
- Tailwind `@utility` bodies: never nest `@media` inside `&:active` / `&:hover` — Tailwind 4.3 mangles it into invalid CSS (`prefers-reduced-motion:active`) and the build fails.
- Base UI menus: `DropdownMenuLabel` must sit inside `DropdownMenuGroup` (Base UI error #31 otherwise).
- TypeScript stays on 6.x until typescript-eslint supports 7 (peer `<6.1.0` as of 2026-11-09).
- Don't commit `public/r/` — build output only.

## Gates

`pnpm typecheck && pnpm lint && pnpm test && pnpm format:check && pnpm build && pnpm registry:validate`
