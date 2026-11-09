// `shadcn add theme` appends nested blocks again on every run instead of merging them; drop exact duplicates.
import fs from "node:fs";
import postcss from "postcss";

const file = process.argv[2] ?? "src/index.css";
const root = postcss.parse(fs.readFileSync(file, "utf8"));
const key = node => node.toString().replace(/\s+/g, " ");
let removed = 0;
root.walk(node => {
  if (!node.nodes) return;
  const seen = new Set();
  for (const child of [...node.nodes]) {
    if (seen.has(key(child))) {
      child.remove();
      removed++;
    } else seen.add(key(child));
  }
});
fs.writeFileSync(file, root.toString());
console.log(`dedupe-css: removed ${removed} duplicate block(s) from ${file}`);
