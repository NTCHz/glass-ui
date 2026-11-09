# glass-ui

Liquid-glass component kit distributed as a **shadcn GitHub registry** — components are copied into your repo, not installed as a package.

Stack: Base UI · Tailwind CSS v4 · `cva` · `cn` · lucide-react

## Use in a project

Requires a project already set up with `shadcn init` (Tailwind v4, `@/` alias).

```bash
gh auth login                                   # private repo — CLI reads through gh
npx shadcn@latest add NTCHz/glass-ui/theme      # tokens + glass utilities into your CSS
npx shadcn@latest add NTCHz/glass-ui/button NTCHz/glass-ui/card
npx shadcn@latest add NTCHz/glass-ui/button#v0.1.0   # pin to a tag
```

CI: set `GH_TOKEN` (fine-grained PAT, Contents: read-only).

## Two layers (Apple Liquid Glass)

- **Content layer** — opaque: `Card`, `Table`, fields (`bg-secondary` fills). Hairline borders, no glass.
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

`theme` · `button` · `badge` (success / warning / info / destructive) · `card` · `input` · `textarea` · `label` · `select` · `switch` · `tabs` (segmented, sliding indicator; `glass` variant) · `tooltip` · `popover` · `dropdown-menu` · `dialog` · `sonner` (toasts) · `avatar` · `skeleton` · `empty` · `table` · `chart` (recharts) · `separator`

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
