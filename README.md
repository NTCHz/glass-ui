# glass-ui

Liquid-glass component kit distributed as a **shadcn GitHub registry** — components are copied into your repo, not installed as a package.

Stack: Base UI · Tailwind CSS v4 · `cva` · `cn` · lucide-react

## Use in a project

Requires a project already set up with `shadcn init` (Tailwind v4, `@/` alias).

```bash
npx shadcn@latest add NTCHz/glass-ui/theme NTCHz/glass-ui/button NTCHz/glass-ui/card
npx shadcn@latest add NTCHz/glass-ui/dialog              # later adds: component only
npx shadcn@latest add NTCHz/glass-ui/button#v0.5.0       # pin to a tag
```

Name `theme` in the command at least once. Pulled in only as a dependency, it adds the new tokens but does not overwrite the ones `shadcn init` wrote (`--background`, `--primary`, `--radius`, `--font-sans`), so colours and fonts stay shadcn's with no warning. Afterwards delete the `@import` of the font `shadcn init` added (e.g. `@fontsource-variable/geist`); the CLI leaves it in.

How the install works, updating, and version pinning: [`docs/INSTALL.md`](docs/INSTALL.md) (Thai).

## Two layers (Apple Liquid Glass)

- **Content layer** — opaque: `Card`, `Table`, fields (`bg-field` fills). Hairline borders, no glass.
- **Control layer** — glass: sidebar, toolbar, tab bar, menus, dialogs, tooltips, toasts. Floats above content.

Give the page soft colour fields so the glass has something to bend:

```tsx
<body className="glass-backdrop">
```

| Utility                                  | Use for                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `glass-clear`                            | controls over photos / media                                                                                                                      |
| `glass`                                  | sidebar, toolbar, tab bar, glass buttons                                                                                                          |
| `glass-thick`                            | menus, popovers, dialogs, tooltips (text-heavy)                                                                                                   |
| `glass-press`                            | spring "swell" on hover/press (pair with a glass)                                                                                                 |
| `glass-backdrop`                         | page background colour fields                                                                                                                     |
| `glass-morph`                            | popups grow out of their trigger on the spring                                                                                                    |
| `scroll-edge-top` / `scroll-edge-bottom` | on a sticky bar: content fades and blurs as it scrolls under it (Apple's scroll edge effect). Add `scroll-edge-hard` for a more opaque, hard edge |

### Liquid optics

`<LiquidGlass>` (or `useLiquidGlass()` on your own element) adds what frosted glass lacks:

```tsx
<LiquidGlass className="rounded-3xl p-4">…</LiquidGlass>            // lensing rim + light that follows the pointer
<LiquidGlass adaptive refraction={false}>…</LiquidGlass>           // tint flips with the backdrop
<section data-glass-backdrop="dark"><img … /></section>            // tell adaptive glass what an image is

<LiquidGlassGroup>                                                  // shapes fuse when they touch
  <LiquidGlassItem><Button variant="ghost" size="icon">…</Button></LiquidGlassItem>
  <LiquidGlassItem>…</LiquidGlassItem>
</LiquidGlassGroup>
```

Every pane can be tuned on its own. Unset props keep the theme, so the defaults look exactly as before:

| prop                               | range                       | what it changes                                                                                                                                         |
| ---------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strength`                         | 0–4                         | how far the rim bends the backdrop (× bezel; default 2.4)                                                                                               |
| `bezel`                            | 0–64 px                     | width of the bending rim (default 0.8 × corner radius, 8–28px)                                                                                          |
| `dispersion`                       | 0–0.6                       | rainbow fringe: blue bends this much more than red. Three passes, so keep it to hero surfaces                                                           |
| `blur` / `saturate` / `brightness` | 0–40 px / 0–300 % / 0.5–1.5 | the frost, per pane (`blur` is the regular value; clear halves it, thick doubles it)                                                                    |
| `tint`                             | any colour                  | fill of the pane                                                                                                                                        |
| `shine`                            | 0–1                         | opacity of the specular sheen                                                                                                                           |
| `lightAngle`                       | degrees                     | where the light comes from (0 = top, clockwise); the pointer still moves it unless `specular={false}`                                                   |
| `rim` / `glow`                     | 0–1                         | brightness of the lit rim / the inner glow                                                                                                              |
| `elasticity`                       | 0–1                         | the pane leans and stretches toward a nearby pointer (off by default; off under reduced motion)                                                         |
| `pointerArea`                      | element                     | only pointer moves inside this element drive the light and the stretch (default: the whole window). Pass the element from a state ref, not a ref object |

Values outside a range are clamped. Try them live on the [Glass Tuner](https://glass.shipfold.com/docs/components/glass-tuner) page and copy the result.

Lensing and dispersion render in Chromium only; Safari and Firefox keep the frosted glass (blur, saturate, brightness, tint and shine work everywhere). Details and limits: `docs/DECISIONS.md`.

`<LiquidLens>` refracts in **every engine**: it bends the content it wraps instead of the backdrop, so it suits a lens over content you own (an image, a card, a slider track), not a bar floating over the whole page. The text under it stays selectable.

```tsx
<LiquidLens lens={{ x: 40, y: 56, width: 168, height: 96 }} dispersion={0.25}>
  <Article />
</LiquidLens>
```

All glass falls back to opaque `--glass-solid` under `prefers-reduced-transparency: reduce` or `prefers-contrast: more`.

Type: system SF on Apple devices → Inter Variable → Sarabun for Thai glyphs.

## Components

Every component in shadcn’s base registry (64), plus `theme`. `form` is omitted — upstream ships it with no files; use `field`.

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `attachment` · `avatar` · `badge` · `breadcrumb` · `bubble` · `button` · `button-group` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `code-block` · `collapsible` · `combobox` · `command` · `context-menu` · `dialog` · `direction` · `drawer` · `dropdown-menu` · `empty` · `field` · `hover-card` · `input` · `input-group` · `input-otp` · `item` · `liquid-glass` · `kbd` · `label` · `marker` · `menubar` · `message` · `message-scroller` · `native-select` · `navigation-menu` · `pagination` · `popover` · `progress` · `questionnaire` · `radio-group` · `resizable` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `spinner` · `switch` · `table` · `tabs` · `textarea` · `toast` · `toggle` · `toggle-group` · `tooltip` · `trace`

Docs site: https://glass.shipfold.com — a page per entry in `src/docs/catalog.ts` (Preview / Code from the demo in `src/playground/sections/`, install command, imports, API links). Add a demo there and a catalog entry to get a page.

## Develop

```bash
pnpm install
pnpm dev                 # playground at src/App.tsx
pnpm test                # registry consistency checks
pnpm registry:validate
```

Changing the theme: edit the `theme` item in `registry.json`, then re-sync the playground:

```bash
pnpm theme:sync   # shadcn add theme, then drop the duplicate blocks the CLI appends
```

See `docs/STRUCTURE.md` and `docs/DECISIONS.md`.

## License

MIT. Components are derived from [shadcn/ui](https://github.com/shadcn-ui/ui) (MIT) — see [LICENSE](LICENSE).
