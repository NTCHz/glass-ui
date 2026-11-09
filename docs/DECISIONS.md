# Decisions

## 2026-11-09 — initial scaffold

**Distribution: shadcn GitHub registry, not an npm package.**
Consumers own the code and can tweak per project. The CLI reads `registry.json` from the repo directly, so no hosting and no build step for consumers; private access goes through `gh auth` / `GH_TOKEN`; versions are git tags (`#v0.1.0`). Trade-off: fixes don't propagate — consumers re-run `add`.
GitHub registries only work on github.com, which is why this lives under NTCHz and not company GitLab.

**Repo owner: personal (NTCHz), `~/Projects/glass-ui`.** Started under `~/TCC`, moved before first commit.

**Primitives: Base UI** — shadcn 4.x default since 2026-07. Radix not used.

**Vite playground instead of the official Next.js `registry-template`.** The template pins Next 15 / Radix / shadcn 3; a registry is just `registry.json` + source files, so the playground framework is irrelevant to consumers. Vite matches the rest of our stack.

**Theme lives in `registry.json`, playground dogfoods it.** One source for tokens and utilities; the playground gets them through the same `shadcn add` path consumers use, so install problems show up here first. `registry.test.ts` catches drift.

**Glass = CSS only (blur + saturate + tint + sheen gradient + inset rim).** No SVG displacement/refraction: `backdrop-filter: url()` is Chromium-only and costly. Revisit if we want true refraction on hero surfaces.

**Glass box-shadow is written through `--tw-inset-shadow` / `--tw-shadow`** so `ring-*` focus styles and `shadow-*` overrides compose with the rim instead of replacing it. Depends on Tailwind v4 internals — recheck on Tailwind major bumps.

**Three materials (thin / regular / thick)** mirror Apple's material thickness: thin for controls, regular for containers, thick for text-heavy overlays (readability).

**Not in scope for v0.1:** select, combobox, toast, sheet, table, form wiring, SVG refraction, Storybook/docs site, npm package build.

## Known quirks

- Non-color vars (`--glass-blur`, `--glass-saturate`, `--glass-shadow`) live in the theme's `css` `:root`/`.dark` blocks, not `cssVars`: the CLI writes `cssVars` entries into `@theme inline` as `--x: var(--x)`, which is a self-reference and breaks inside shadow DOM `:host`.
- Theme declares `shadcn` + `tw-animate-css` and imports `shadcn/tailwind.css`: components use its custom variants (`data-checked`, `data-horizontal`, …). Without it Switch/Tabs/Separator render unstyled with no error.
- `cn` has no class group for `glass*`, so `<DialogContent className="glass">` keeps `glass-thick` too and CSS order wins. Change materials through the `--glass-*` vars, not by stacking classes.
- Fallback to `--glass-solid` triggers on `prefers-reduced-transparency: reduce` **or** `prefers-contrast: more` (the first isn't supported in every browser).
- Contrast (computed from oklch, 2026-11-09): light `--primary` L 0.52 vs white text = 5.39:1; light `--muted-foreground` L 0.45 = 4.84:1 even over the brightest aurora stop. L 0.6 primary was 3.9:1 — failed AA.
- `registryDependencies` refs aren't inherited: installing `button#v0.1.0` pulls `theme` from the default branch.
- `background-attachment: fixed` in `glass-backdrop` is ignored on iOS Safari (gradient scrolls with page).
