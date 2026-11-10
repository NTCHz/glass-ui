# glass-ui

Liquid-glass component kit distributed as a **shadcn GitHub registry** — components are copied into your repo, not installed as a package.

Stack: Base UI · Tailwind CSS v4 · `cva` · `cn` · lucide-react

## Use in a project

Requires a project already set up with `shadcn init` (Tailwind v4, `@/` alias).

```bash
npx shadcn@latest add NTCHz/glass-ui/theme NTCHz/glass-ui/button NTCHz/glass-ui/card
npx shadcn@latest add NTCHz/glass-ui/dialog              # later adds: component only
npx shadcn@latest add NTCHz/glass-ui/button#v0.4.0       # pin to a tag
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

| Utility          | Use for                                           |
| ---------------- | ------------------------------------------------- |
| `glass-clear`    | controls over photos / media                      |
| `glass`          | sidebar, toolbar, tab bar, glass buttons          |
| `glass-thick`    | menus, popovers, dialogs, tooltips (text-heavy)   |
| `glass-press`    | spring "swell" on hover/press (pair with a glass) |
| `glass-backdrop` | page background colour fields                     |
| `glass-morph`    | popups grow out of their trigger on the spring    |

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

Lensing renders in Chromium only; Safari and Firefox keep the frosted glass. Details and limits: `docs/DECISIONS.md`.

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
