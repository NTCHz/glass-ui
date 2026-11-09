# glass-ui

Liquid-glass component kit distributed as a **shadcn GitHub registry** — components are copied into your repo, not installed as a package.

Stack: Base UI · Tailwind CSS v4 · `cva` · `cn` · lucide-react

## Use in a project

Requires a project already set up with `shadcn init` (Tailwind v4, `@/` alias).

```bash
npx shadcn@latest add NTCHz/glass-ui/theme      # tokens + glass utilities into your CSS
npx shadcn@latest add NTCHz/glass-ui/button NTCHz/glass-ui/card
npx shadcn@latest add NTCHz/glass-ui/button#v0.3.0   # pin to a tag
```

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

All glass falls back to opaque `--glass-solid` under `prefers-reduced-transparency: reduce` or `prefers-contrast: more`.

Type: system SF on Apple devices → Inter Variable → Sarabun for Thai glyphs.

## Components

Every component in shadcn’s base registry (64), plus `theme`. `form` is omitted — upstream ships it with no files; use `field`.

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `attachment` · `avatar` · `badge` · `breadcrumb` · `bubble` · `button` · `button-group` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `code-block` · `collapsible` · `combobox` · `command` · `context-menu` · `dialog` · `direction` · `drawer` · `dropdown-menu` · `empty` · `field` · `hover-card` · `input` · `input-group` · `input-otp` · `item` · `kbd` · `label` · `marker` · `menubar` · `message` · `message-scroller` · `native-select` · `navigation-menu` · `pagination` · `popover` · `progress` · `questionnaire` · `radio-group` · `resizable` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `spinner` · `switch` · `table` · `tabs` · `textarea` · `toast` · `toggle` · `toggle-group` · `tooltip` · `trace`

The playground (`src/playground/`) is a one-page catalog: a section per component, generic sample data.

## Develop

```bash
pnpm install
pnpm dev                 # playground at src/App.tsx
pnpm test                # registry consistency checks
pnpm registry:validate
```

Changing the theme: edit the `theme` item in `registry.json`, then re-sync the playground:

```bash
pnpm registry:build && npx shadcn add ./public/r/theme.json -y
```

See `docs/STRUCTURE.md` and `docs/DECISIONS.md`.

## License

MIT. Components are derived from [shadcn/ui](https://github.com/shadcn-ui/ui) (MIT) — see [LICENSE](LICENSE).
