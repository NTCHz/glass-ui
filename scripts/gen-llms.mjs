// Writes public/llms.txt (served at /llms.txt) from registry.json and the docs catalog.
import fs from "node:fs";

const SITE = "https://glass.shipfold.com";
const REPO = "NTCHz/glass-ui";

const { version } = JSON.parse(fs.readFileSync("package.json", "utf8"));
const registry = JSON.parse(fs.readFileSync("registry.json", "utf8"));
const catalog = fs.readFileSync("src/docs/catalog.ts", "utf8");

const pick = (block, key) => block.match(new RegExp(`${key}: "([^"]+)"`))?.[1];
const entries = name =>
  catalog
    .slice(catalog.indexOf(`export const ${name}`))
    .split("];")[0]
    .split("{")
    .slice(1)
    .map(block => ({
      id: pick(block, "id"),
      label: pick(block, "label"),
      group: pick(block, "group"),
      items: block.match(/items: \[([^\]]*)\]/)?.[1].match(/[\w-]+/g),
    }))
    .filter(e => e.id && e.label);

const guides = entries("GUIDES");
const pages = entries("COMPONENTS");
const itemsOf = p => p.items ?? [p.id];
const covered = new Set(pages.flatMap(itemsOf));
// a parse that finds nothing means catalog.ts changed shape; fail the build rather than ship an empty index
if (!guides.length || pages.length < 20)
  throw new Error("gen-llms: could not read src/docs/catalog.ts");

const add = item => `\`npx shadcn@latest add ${REPO}/${item}\``;
const groups = [...new Set(pages.map(p => p.group))];
const others = registry.items
  .map(i => i.name)
  .filter(n => !covered.has(n) && n !== "glass-ui");

const text = `# glass-ui

> Apple Liquid Glass components for React 19, shipped as a shadcn registry straight from GitHub (${REPO}, v${version}). Built on Base UI and Tailwind CSS v4. The source is copied into your project; there is no npm package.

## Rules for agents

- Install the theme first, then items: ${add("theme")}, then ${add("<item>")}. Never use a bare item name: \`button\` alone pulls upstream shadcn, not glass-ui.
- Pin a release with a tag on every item, the theme included: \`${REPO}/button#v${version}\`.
- Glass belongs to the control layer only (navigation, toolbars, tab bars, menus, dialogs, tooltips, toasts). Content (cards, tables, fields) stays opaque.
- Never put \`bg-*\`, \`ring-1\` or \`shadow-*\` on an element with a \`glass*\` class; they override the material.
- Two or more neighbouring glass elements need a \`glass-stage\` container with an opaque background.
- \`LiquidGlass\` refracts the backdrop in Chromium only. For Safari and Firefox wrap the region in \`GlassScope\` and put what the panes float over in \`GlassScopeContent\`, or use \`LiquidLens\` to bend wrapped content.
- Every glass surface falls back to an opaque fill under reduced transparency or increased contrast; do not add your own.
- MCP: \`npx shadcn@latest mcp init --client claude\` lets the shadcn MCP server browse and install from ${REPO} with no extra config.

## Guides

${guides.map(g => `- [${g.label}](${SITE}/docs/${g.id})`).join("\n")}

${groups
  .map(
    group =>
      `## ${group}\n\n${pages
        .filter(p => p.group === group)
        .map(
          p =>
            `- [${p.label}](${SITE}/docs/components/${p.id}): ${itemsOf(p).map(add).join(", ")}`
        )
        .join("\n")}`
  )
  .join("\n\n")}

## Optional

${others.map(n => `- ${n}: ${add(n)}`).join("\n")}
- [README](https://github.com/${REPO}/blob/main/README.md)
- [registry.json](https://github.com/${REPO}/blob/main/registry.json)
`;

fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/llms.txt", text);
console.log(`public/llms.txt: ${guides.length} guides, ${pages.length} pages`);
