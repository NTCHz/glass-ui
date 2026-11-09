import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type CssTree = { [key: string]: string | CssTree };

type RegistryItem = {
  name: string;
  css?: CssTree;
  cssVars?: Record<string, Record<string, string>>;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: { path: string }[];
};

const OWN_PREFIX = "NTCHz/glass-ui/";
const SHIPPED_DIRS = ["src/components/ui", "src/hooks", "src/lib"];
// re-exports the `cn` package for the playground; consumers have their own
const NOT_SHIPPED = new Set(["src/lib/utils.ts"]);
// resolved by the consumer's own setup, not by registry `dependencies`
const PROVIDED_IMPORTS = new Set(["react", "react-dom"]);

const registry: { items: RegistryItem[] } = JSON.parse(
  readFileSync("registry.json", "utf8")
);
const theme = registry.items.find(item => item.name === "theme");
const components = registry.items.filter(item => item.name !== "theme");
const itemNames = new Set(registry.items.map(item => item.name));
// prettier wraps long values across lines, e.g. linear-gradient( ... )
const normalize = (s: string) =>
  s.replace(/\s+/g, " ").replace(/\( /g, "(").replace(/ \)/g, ")");
const playgroundCss = normalize(readFileSync("src/index.css", "utf8"));

const declarations = (tree: CssTree): string[] =>
  Object.entries(tree).flatMap(([key, value]) => {
    if (typeof value === "string") return [`${key}: ${value};`];
    if (key.startsWith("@import")) return [`${key};`];
    return declarations(value);
  });

const packageOf = (specifier: string) =>
  specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];

const externalImports = (path: string) =>
  [...readFileSync(path, "utf8").matchAll(/from "([^"]+)"/g)]
    .map(m => m[1])
    .filter(s => !s.startsWith(".") && !s.startsWith("@/"))
    .map(packageOf)
    .filter(p => !PROVIDED_IMPORTS.has(p));

describe("registry.json", () => {
  it("has a theme item that defines glass utilities", () => {
    expect(Object.keys(theme?.css ?? {})).toEqual(
      expect.arrayContaining([
        "@utility glass-clear",
        "@utility glass",
        "@utility glass-thick",
        "@utility glass-press",
      ])
    );
  });

  it("gives every item a unique name", () => {
    const names = registry.items.map(item => item.name);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it("points every item at a file that exists", () => {
    const paths = components.flatMap(item => item.files ?? []);
    expect(paths.filter(f => !existsSync(f.path))).toEqual([]);
  });

  it("lists every shipped file in ui, hooks and lib", () => {
    const listed = new Set(
      components.flatMap(item => item.files ?? []).map(f => f.path)
    );
    const onDisk = SHIPPED_DIRS.filter(dir => existsSync(dir))
      .flatMap(dir => readdirSync(dir).map(f => `${dir}/${f}`))
      .filter(p => !NOT_SHIPPED.has(p));
    expect(onDisk.filter(p => !listed.has(p))).toEqual([]);
  });

  it("makes every component depend on the theme", () => {
    const missing = components
      .filter(
        item => !item.registryDependencies?.includes(`${OWN_PREFIX}theme`)
      )
      .map(item => item.name);
    expect(missing).toEqual([]);
  });

  it("only references registry items that exist", () => {
    const dangling = registry.items
      .flatMap(item => item.registryDependencies ?? [])
      .filter(dep => dep.startsWith(OWN_PREFIX))
      .filter(dep => !itemNames.has(dep.slice(OWN_PREFIX.length)));
    expect(dangling).toEqual([]);
  });

  it("never depends on a bare shadcn name that would pull upstream styles", () => {
    const bare = components
      .flatMap(item => item.registryDependencies ?? [])
      .filter(dep => itemNames.has(dep));
    expect(bare).toEqual([]);
  });

  it("declares every package a component imports", () => {
    const undeclared = components.flatMap(item => {
      const declared = new Set(item.dependencies ?? []);
      return (item.files ?? [])
        .flatMap(f => externalImports(f.path))
        .filter(p => !declared.has(p))
        .map(p => `${item.name}: ${p}`);
    });
    expect(undeclared).toEqual([]);
  });
});

describe("playground css", () => {
  it("contains every theme declaration (re-run shadcn add after editing registry.json)", () => {
    const vars = Object.values(theme?.cssVars ?? {}).flatMap(scope =>
      Object.entries(scope).map(([k, v]) => `--${k}: ${v};`)
    );
    const expected = [...vars, ...declarations(theme?.css ?? {})].map(
      normalize
    );
    expect(expected.length).toBeGreaterThan(0);
    expect(expected.filter(d => !playgroundCss.includes(d))).toEqual([]);
  });
});
