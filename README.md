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

Put glass on something colorful — the material is only visible over a varied background:

```tsx
<body className="glass-backdrop">
```

## Materials

| Utility          | Use for                               |
| ---------------- | ------------------------------------- |
| `glass-thin`     | inputs, chips, tab rails              |
| `glass`          | cards, nav bars, glass buttons        |
| `glass-thick`    | dialogs, menus, tooltips (text-heavy) |
| `glass-backdrop` | page background (aurora gradient)     |

All three fall back to an opaque `--glass-solid` under `prefers-reduced-transparency: reduce`.

## Components (v0.1)

`theme` · `button` (+ `glass` variant) · `badge` (+ `glass`) · `card` · `input` · `textarea` · `label` · `separator` · `switch` · `tabs` · `tooltip` · `dialog` · `dropdown-menu`

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
