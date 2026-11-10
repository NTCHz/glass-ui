import type { FC } from "react";

import { COMPONENTS } from "./catalog";
import { Code, CommandTabs } from "./Code";
import { A, C, H2, LINK, P, PageTitle, Table, UL } from "./Prose";
import { Link } from "./router";

const REPO = "https://github.com/NTCHz/glass-ui";

const groupsOf = () =>
  [...new Set(COMPONENTS.map(entry => entry.group))].map(group => ({
    group,
    entries: COMPONENTS.filter(entry => entry.group === group),
  }));

export const Introduction: FC = () => (
  <article>
    <PageTitle
      title="Introduction"
      lead="Every shadcn component, restyled as Apple Liquid Glass and shipped as a shadcn registry. The CLI copies the source into your project, so the code is yours to change."
    />
    <CommandTabs args="add NTCHz/glass-ui/theme NTCHz/glass-ui/button" />

    <H2>Two layers</H2>
    <P>Liquid Glass separates what you read from what you act with.</P>
    <UL>
      <li>
        <strong>Content</strong> stays opaque: cards, tables and fields use
        solid fills and hairline borders.
      </li>
      <li>
        <strong>Controls</strong> are glass: sidebar, toolbar, tab bar, menus,
        dialogs, tooltips and toasts float above the content.
      </li>
    </UL>
    <P>
      Glass needs something behind it to bend. Put <C>glass-backdrop</C> on the
      page for soft colour fields.
    </P>
    <Code code={`<body className="glass-backdrop">`} />

    <H2>Built on</H2>
    <UL>
      <li>
        <A href="https://base-ui.com">Base UI</A> for behaviour and
        accessibility
      </li>
      <li>Tailwind CSS v4 for the tokens and glass utilities</li>
      <li>
        <C>cva</C>, <C>cn</C> and lucide icons, as in shadcn
      </li>
    </UL>

    <H2>Browser support</H2>
    <P>
      Frosted glass works wherever <C>backdrop-filter</C> does. Edge refraction
      in{" "}
      <Link href="/docs/components/liquid-glass" className={LINK}>
        Liquid Glass
      </Link>{" "}
      renders in Chromium only; Safari and Firefox keep the frosted look. With{" "}
      <C>prefers-reduced-transparency</C> or <C>prefers-contrast: more</C>, all
      glass turns solid.
    </P>

    <H2>Components</H2>
    <P>{COMPONENTS.length} pages, grouped the way you reach for them.</P>
    <div className="mt-4 divide-y divide-border overflow-hidden rounded-[28px] border bg-card">
      {groupsOf().map(({ group, entries }) => (
        <div
          key={group}
          className="grid gap-3 px-5 py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6"
        >
          <p className="flex items-baseline gap-2 sm:flex-col sm:gap-0.5 sm:pt-1.5">
            <span
              id={`index-${group.toLowerCase().replace(/\W+/g, "-")}`}
              className="text-[0.875rem] font-semibold tracking-[-0.01em]"
            >
              {group}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {entries.length} {entries.length === 1 ? "page" : "pages"}
            </span>
          </p>
          <ul
            aria-labelledby={`index-${group.toLowerCase().replace(/\W+/g, "-")}`}
            className="flex flex-wrap gap-2"
          >
            {entries.map(entry => (
              <li key={entry.id}>
                <Link
                  href={`/docs/components/${entry.id}`}
                  className="flex h-8 items-center rounded-full bg-secondary px-3.5 text-[0.8125rem] font-medium text-foreground/85 transition-[background-color,color,transform] duration-200 outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.97] pointer-coarse:h-11"
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <P className="mt-10 text-[0.875rem] text-muted-foreground">
      Source and issues on <A href={REPO}>GitHub</A>.
    </P>
  </article>
);

export const Installation: FC = () => (
  <article>
    <PageTitle
      title="Installation"
      lead="glass-ui is a shadcn GitHub registry, not an npm package. The shadcn CLI reads registry.json from the repo and writes the files into your project."
    />

    <H2>1. Set up shadcn</H2>
    <P>
      You need a React project with Tailwind CSS v4 and a <C>components.json</C>
      . If you don&apos;t have one yet:
    </P>
    <CommandTabs args="init" />

    <H2>2. Add the theme with your first components</H2>
    <CommandTabs args="add NTCHz/glass-ui/theme NTCHz/glass-ui/button NTCHz/glass-ui/dialog" />
    <P>
      Name <C>theme</C> in the command at least once. Every component depends on
      it, but a theme pulled in only as a dependency adds the new tokens without
      overwriting the ones <C>shadcn init</C> wrote, so <C>--background</C>,{" "}
      <C>--primary</C>, <C>--radius</C> and <C>--font-sans</C> silently stay
      shadcn&apos;s. Before or after the components both work.
    </P>
    <P>After that, add components on their own:</P>
    <CommandTabs args="add NTCHz/glass-ui/sidebar" />

    <H2>3. Clean up</H2>
    <P>
      Remove the font import <C>shadcn init</C> added (for example{" "}
      <C>@import &quot;@fontsource-variable/geist&quot;;</C>). The theme
      switches <C>--font-sans</C> to SF Pro, Inter and Sarabun, but the CLI
      never deletes CSS, so the old font would still be bundled.
    </P>

    <H2>What the CLI does</H2>
    <UL>
      <li>
        Follows <C>registryDependencies</C>: <C>dialog</C> also brings{" "}
        <C>theme</C> and <C>button</C>.
      </li>
      <li>
        Merges the theme into the CSS file <C>components.json</C> points at:
        tokens in <C>:root</C> and <C>.dark</C>, the <C>glass*</C> utilities,
        and imports for <C>tw-animate-css</C>, Inter and Sarabun.
      </li>
      <li>Installs npm dependencies with your package manager.</li>
      <li>
        Writes <C>components/ui/*.tsx</C> and rewrites imports to your aliases.
      </li>
    </UL>
    <P>
      Re-running <C>add</C> appends the nested <C>@media</C> blocks inside the
      utilities again. The values are identical and nothing breaks; tidy the
      file if it bothers you.
    </P>

    <H2>Updating and pinning</H2>
    <UL>
      <li>
        Fixes don&apos;t flow in by themselves. Run <C>add</C> again (the CLI
        asks before overwriting) or pass <C>--overwrite</C>; diff your edits
        first.
      </li>
      <li>
        Pin to a release with a tag: <C>NTCHz/glass-ui/button#v0.5.0</C>. The
        tag is not passed on to dependencies, so pin <C>theme</C> too.
      </li>
    </UL>
    <CommandTabs args="add NTCHz/glass-ui/theme#v0.5.0 NTCHz/glass-ui/button#v0.5.0" />
  </article>
);

const UTILITIES = [
  ["glass-clear", "Controls over photos and video"],
  ["glass", "Sidebar, toolbar, tab bar, glass buttons"],
  ["glass-thick", "Menus, popovers, dialogs, tooltips: text-heavy overlays"],
  ["glass-press", "Spring swell on hover and press; pair with a glass"],
  ["glass-backdrop", "Soft colour fields for the page background"],
  ["glass-morph", "Anchored popups grow out of their trigger"],
  [
    "glass-stage",
    "Container for two or more neighbouring glass elements (see below)",
  ],
] as const;

const TOKENS = [
  [
    "--glass-blur",
    "14px",
    "Base blur; glass-clear halves it, glass-thick doubles it",
  ],
  ["--glass-saturate", "190% / 160%", "Backdrop saturation, light / dark"],
  ["--glass-regular", "white 55%", "Fill of glass; also -clear and -thick"],
  ["--glass-solid", "opaque", "Fallback fill for reduced transparency"],
  ["--radius", "0.75rem", "Corner radius scale"],
  ["--primary", "blue", "Accent fills and focus"],
] as const;

export const Theming: FC = () => (
  <article>
    <PageTitle
      title="Theming"
      lead="The theme item puts tokens and glass utilities into your CSS. Change a value in :root or .dark and every component follows."
    />

    <H2>Glass utilities</H2>
    <Table
      head={["Utility", "Use for"]}
      rows={UTILITIES.map(([name, use]) => [<C key={name}>{name}</C>, use])}
    />
    <P>
      Don&apos;t add <C>bg-*</C>, <C>shadow-*</C> or <C>ring-1</C> next to a{" "}
      <C>glass*</C> class on the same element: they override the material.
    </P>

    <H2>Tokens</H2>
    <Table
      head={["Token", "Default", "Controls"]}
      rows={TOKENS.map(([token, value, note]) => [
        <C key={token}>{token}</C>,
        value,
        note,
      ])}
    />
    <Code
      title="globals.css"
      language="css"
      code={`:root {
  --glass-blur: 18px;
  --primary: oklch(0.6 0.18 160);
}

.dark {
  --glass-regular: oklch(0.24 0.012 260 / 0.6);
}`}
    />

    <H2>Dark mode</H2>
    <P>
      Put <C>dark</C> on <C>&lt;html&gt;</C>, as shadcn does. Glass on a surface
      that doesn&apos;t match the page theme can follow its own backdrop: see{" "}
      <C>adaptive</C> on{" "}
      <Link href="/docs/components/liquid-glass" className={LINK}>
        Liquid Glass
      </Link>
      .
    </P>

    <H2>Neighbouring glass</H2>
    <P>
      Chromium on macOS can redraw only part of a blurred backdrop when a
      neighbouring glass element repaints on hover or click, which leaves a
      visible seam. Wrap groups of glass elements in <C>glass-stage</C>, on a
      container with an opaque background (not the page root):
    </P>
    <Code
      code={`<div className="glass-stage rounded-3xl bg-card p-6">
  <div className="glass glass-press rounded-2xl p-4">…</div>
  <div className="glass glass-press rounded-2xl p-4">…</div>
</div>`}
    />

    <H2>Accessibility</H2>
    <UL>
      <li>
        All glass falls back to opaque <C>--glass-solid</C> under{" "}
        <C>prefers-reduced-transparency: reduce</C> or{" "}
        <C>prefers-contrast: more</C>.
      </li>
      <li>
        Under <C>prefers-reduced-motion</C>, overlays only fade.
      </li>
      <li>Buttons and fields grow to 44px on touch screens.</li>
    </UL>
  </article>
);
