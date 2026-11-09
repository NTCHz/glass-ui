# Structure

```
registry.json              source of truth: theme item (tokens + @utility glass*) + one item per component
src/
├── components/ui/*.tsx    registry component sources (shipped to consumers as-is)
├── lib/utils.ts           re-exports cn (playground only; components import "cn" directly)
├── index.css              playground CSS — glass parts are generated from registry.json, do not hand-edit
├── App.tsx                playground / demo page
└── registry.test.ts       drift checks between registry.json, src/components/ui, src/index.css
public/r/                  `shadcn build` output (gitignored; only used for local dogfooding)
```

## Flow

1. Edit a component in `src/components/ui/` → it ships on next push/tag.
2. Edit tokens/utilities in `registry.json` `theme` → `pnpm registry:build && npx shadcn add ./public/r/theme.json -y` → playground CSS updated.
3. Release: `git tag v0.x.y && git push --tags`. Consumers pin with `#v0.x.y`.

## Versions (checked 2026-11-09 via `npm view`)

| Package                         | Version                                                              |
| ------------------------------- | -------------------------------------------------------------------- |
| shadcn                          | 4.23.0                                                               |
| @base-ui/react                  | 1.9.0                                                                |
| tailwindcss / @tailwindcss/vite | 4.3.5                                                                |
| react / react-dom               | 19.3.1                                                               |
| vite                            | 8.3.6                                                                |
| @vitejs/plugin-react            | 6.3.0                                                                |
| typescript                      | 6.0.3 (latest is 7.0.2 — blocked by typescript-eslint peer `<6.1.0`) |
| eslint                          | 10.14.0                                                              |
| typescript-eslint               | 8.72.1                                                               |
| vitest                          | 5.1.0                                                                |
| cn                              | 0.5.2                                                                |
