export const sliceExport = (source: string, name: string) => {
  const start = source.indexOf(`export const ${name}`);
  if (start < 0) return null;
  const next = source.indexOf("\nexport const ", start + 1);
  return source.slice(start, next < 0 ? undefined : next).trimEnd();
};

// The playground's <Section> only lays the demo out; readers copy what is inside it.
export const unwrapSection = (code: string) => {
  const open = code.match(/\n([ \t]*)<Section\b[^>]*>\n/);
  const close = code.lastIndexOf("</Section>");
  if (!open || open.index === undefined || close < 0) return code;
  const indent = open[1];
  const head = code.slice(0, open.index);
  const body = code.slice(open.index + open[0].length, close).trimEnd();
  const tail = code.slice(close + "</Section>".length);
  return `${head}\n${indent}<>\n${body}\n${indent}</>${tail}`;
};

export const exportedNames = (source: string) => {
  const block = source.match(/export\s*\{([^}]*)\}/);
  if (!block) return [];
  return block[1]
    .split(",")
    .map(name => name.trim())
    .filter(name => /^[A-Z]/.test(name));
};

export const usageImport = (item: string, names: readonly string[]) =>
  names.length > 3
    ? `import {\n${names.map(name => `  ${name},`).join("\n")}\n} from "@/components/ui/${item}";`
    : `import { ${names.join(", ")} } from "@/components/ui/${item}";`;

const LIBRARY_DOCS: Record<string, { label: string; href: string }> = {
  cmdk: { label: "cmdk", href: "https://github.com/pacocoursey/cmdk" },
  vaul: { label: "Vaul", href: "https://github.com/emilkowalski/vaul" },
  "embla-carousel-react": {
    label: "Embla Carousel",
    href: "https://www.embla-carousel.com",
  },
  recharts: { label: "Recharts", href: "https://recharts.github.io" },
  sonner: { label: "Sonner", href: "https://sonner.emilkowal.ski" },
  "react-day-picker": {
    label: "React DayPicker",
    href: "https://daypicker.dev",
  },
  "input-otp": {
    label: "input-otp",
    href: "https://github.com/guilhermerodz/input-otp",
  },
  "react-resizable-panels": {
    label: "react-resizable-panels",
    href: "https://github.com/bvaughn/react-resizable-panels",
  },
};

const BASE_UI_UTILITIES = new Set(["merge-props", "use-render"]);
const BASE_UI_UTILS_PAGES = new Set(["direction-provider"]);

const titleCase = (slug: string) =>
  slug.replace(
    /(^|-)([a-z])/g,
    (_, dash: string, c: string) => `${dash ? " " : ""}${c.toUpperCase()}`
  );

export const apiLinks = (source: string) => {
  const links = new Map<string, { label: string; href: string }>();
  for (const [, pkg] of source.matchAll(/from "([^"]+)"/g)) {
    const baseUi = pkg.match(/^@base-ui\/react\/([a-z-]+)$/);
    if (baseUi && !BASE_UI_UTILITIES.has(baseUi[1])) {
      links.set(pkg, {
        label: `Base UI ${titleCase(baseUi[1])}`,
        href: `https://base-ui.com/react/${BASE_UI_UTILS_PAGES.has(baseUi[1]) ? "utils" : "components"}/${baseUi[1]}`,
      });
    } else if (LIBRARY_DOCS[pkg]) {
      links.set(pkg, LIBRARY_DOCS[pkg]);
    }
  }
  return [...links.values()];
};
