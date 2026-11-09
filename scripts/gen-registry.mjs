// Regenerates every non-theme item in registry.json from the source files' imports.
import fs from "node:fs";
import path from "node:path";

const OWNER = "NTCHz/glass-ui/";
const PROVIDED = new Set(["react", "react-dom"]);
const SOURCES = [
  { dir: "src/components/ui", type: "registry:ui" },
  { dir: "src/hooks", type: "registry:hook" },
  { dir: "src/lib", type: "registry:lib", skip: ["utils.ts"] },
];
const TITLES = {
  "dropdown-menu": "Dropdown Menu",
  "use-mobile": "useIsMobile",
};

const packageOf = spec =>
  spec.startsWith("@")
    ? spec.split("/").slice(0, 2).join("/")
    : spec.split("/")[0];

const titleOf = name =>
  TITLES[name] ??
  name
    .split("-")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const toItem = (dir, type) => file => {
  const filePath = `${dir}/${file}`;
  const name = path.parse(file).name;
  const specs = [
    ...fs.readFileSync(filePath, "utf8").matchAll(/from "([^"]+)"/g),
  ].map(m => m[1]);
  const dependencies = [
    ...new Set(
      specs
        .filter(s => !s.startsWith(".") && !s.startsWith("@/"))
        .map(packageOf)
        .filter(p => !PROVIDED.has(p))
    ),
  ].sort();
  const local = [
    ...new Set(
      specs
        .filter(s => /^@\/(components\/ui|hooks|lib)\//.test(s))
        .filter(s => s !== "@/lib/utils")
        .map(s => OWNER + s.split("/").pop())
    ),
  ];
  return {
    name,
    type,
    title: titleOf(name),
    dependencies,
    registryDependencies: [`${OWNER}theme`, ...local],
    files: [{ path: filePath, type }],
  };
};

const registry = JSON.parse(fs.readFileSync("registry.json", "utf8"));
const theme = registry.items.find(i => i.name === "theme");
const items = SOURCES.flatMap(({ dir, type, skip = [] }) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter(f => /\.(tsx?|ts)$/.test(f) && !skip.includes(f))
        .sort()
        .map(toItem(dir, type))
    : []
);

fs.writeFileSync(
  "registry.json",
  JSON.stringify({ ...registry, items: [theme, ...items] }, null, 2) + "\n"
);
console.log(`registry.json: theme + ${items.length} items`);
