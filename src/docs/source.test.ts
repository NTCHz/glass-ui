import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import registry from "../../registry.json";
import { COMPONENTS, itemsOf } from "./catalog";
import {
  apiLinks,
  exportedNames,
  sliceExport,
  unwrapSection,
  usageImport,
} from "./source";

const FILE = `import { Section } from "../Section";

export const First: FC = () => (
  <Section id="a" title="A" note="n">
    <Button>Hi</Button>
  </Section>
);

export const Second: FC = () => <p />;
`;

describe("sliceExport", () => {
  it("returns one export up to the next one", () => {
    expect(sliceExport(FILE, "First")).toBe(`export const First: FC = () => (
  <Section id="a" title="A" note="n">
    <Button>Hi</Button>
  </Section>
);`);
  });

  it("returns the last export up to the end of the file", () => {
    expect(sliceExport(FILE, "Second")).toBe(
      "export const Second: FC = () => <p />;"
    );
  });

  it("returns null for a missing export", () => {
    expect(sliceExport(FILE, "Third")).toBeNull();
  });
});

describe("unwrapSection", () => {
  it("swaps the playground Section for a fragment", () => {
    expect(unwrapSection(sliceExport(FILE, "First") ?? "")).toBe(
      `export const First: FC = () => (
  <>
    <Button>Hi</Button>
  </>
);`
    );
  });

  it("handles a multi-line Section opening tag", () => {
    const code = `x = (\n  <Section\n    id="a"\n    title="A"\n  >\n    <B />\n  </Section>\n);`;
    expect(unwrapSection(code)).toBe("x = (\n  <>\n    <B />\n  </>\n);");
  });

  it("leaves code without a Section alone", () => {
    expect(unwrapSection("const x = 1;")).toBe("const x = 1;");
  });
});

describe("usage helpers", () => {
  it("lists the exported components, not variants or hooks", () => {
    expect(
      exportedNames("export { Button, buttonVariants, useThing, Card };")
    ).toEqual(["Button", "Card"]);
  });

  it("breaks long import lists onto lines", () => {
    expect(
      usageImport("card", ["Card", "CardHeader", "CardTitle", "CardContent"])
    ).toBe(`import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";`);
  });

  it("links Base UI components and known libraries, not Base UI utilities", () => {
    expect(
      apiLinks(`import { Dialog } from "@base-ui/react/dialog";
import { mergeProps } from "@base-ui/react/merge-props";
import { Command } from "cmdk";
import { cn } from "cn";`)
    ).toEqual([
      {
        label: "Base UI Dialog",
        href: "https://base-ui.com/react/components/dialog",
      },
      { label: "cmdk", href: "https://github.com/pacocoursey/cmdk" },
    ]);
  });
});

describe("catalog", () => {
  const names = new Set(registry.items.map(item => item.name));

  it.each(COMPONENTS.map(entry => [entry.id, entry]))(
    "%s installs registry items that exist",
    (_, entry) => {
      for (const item of itemsOf(entry)) expect(names).toContain(item);
    }
  );

  it.each(COMPONENTS.map(entry => [entry.id, entry]))(
    "%s points at a demo export",
    (_, entry) => {
      const source = readFileSync(
        `src/playground/sections/${entry.file}.tsx`,
        "utf8"
      );
      expect(sliceExport(source, entry.demo)).not.toBeNull();
    }
  );

  it("gives every page a unique id", () => {
    const ids = COMPONENTS.map(entry => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
