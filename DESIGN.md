---
name: glass-ui
description: Apple Liquid Glass component kit for shadcn, opaque paper content under a floating glass control layer, tuned for Thai + English.
colors:
  background: "oklch(0.975 0.004 250)"
  foreground: "oklch(0.21 0.015 260)"
  card: "oklch(1 0 0)"
  popover: "oklch(0.99 0.002 250)"
  primary: "oklch(0.53 0.21 262)"
  primary-foreground: "oklch(1 0 0)"
  secondary: "oklch(0.21 0.015 260 / 0.055)"
  muted: "oklch(0.21 0.015 260 / 0.04)"
  muted-foreground: "oklch(0.47 0.015 260)"
  accent: "oklch(0.53 0.21 262 / 0.1)"
  accent-foreground: "oklch(0.45 0.2 262)"
  destructive: "oklch(0.58 0.22 25)"
  success: "oklch(0.68 0.17 150)"
  success-text: "oklch(0.5 0.14 150)"
  warning: "oklch(0.78 0.16 70)"
  warning-text: "oklch(0.52 0.13 65)"
  border: "oklch(0.21 0.015 260 / 0.09)"
  input: "oklch(0.21 0.015 260 / 0.12)"
  ring: "oklch(0.53 0.21 262 / 0.5)"
  chart-1: "oklch(0.6 0.2 262)"
  chart-2: "oklch(0.72 0.13 195)"
  chart-3: "oklch(0.6 0.2 300)"
  chart-4: "oklch(0.75 0.16 60)"
  chart-5: "oklch(0.66 0.2 350)"
  glass-solid: "oklch(0.985 0.003 250)"
  glass-clear: "oklch(1 0 0 / 0.2)"
  glass-regular: "oklch(1 0 0 / 0.55)"
  glass-thick: "oklch(0.99 0.002 250 / 0.8)"
  glass-sheen: "oklch(1 0 0 / 0.6)"
  glass-rim-hi: "oklch(1 0 0 / 0.95)"
  glass-rim-lo: "oklch(1 0 0 / 0.35)"
  glass-edge: "oklch(0.2 0.02 260 / 0.08)"
  glass-glow: "oklch(1 0 0 / 0.35)"
  glass-field-1: "oklch(0.85 0.09 255)"
  glass-field-2: "oklch(0.9 0.07 200)"
  glass-field-3: "oklch(0.88 0.07 300)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Inter Variable, Sarabun, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Inter Variable, Sarabun, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Inter Variable, Sarabun, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Inter Variable, Sarabun, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: '"cv11", "ss01"'
  body-small:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Inter Variable, Sarabun, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Inter Variable, Sarabun, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
rounded:
  lg: "12px"
  xl: "16.8px"
  2xl: "21.6px"
  3xl: "26.4px"
  panel: "28px"
  full: "9999px"
spacing:
  unit: "4px"
  control-gap: "12px"
  chrome-inset: "12px"
  card-sm: "16px"
  card: "20px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "36px"
  button-glass:
    backgroundColor: "{colors.glass-regular}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "36px"
  button-destructive:
    textColor: "{colors.destructive}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "36px"
  input:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "4px 12px"
    height: "36px"
  input-focus:
    backgroundColor: "{colors.card}"
  badge-success:
    textColor: "{colors.success-text}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 10px"
    height: "24px"
  badge-warning:
    textColor: "{colors.warning-text}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 10px"
    height: "24px"
  badge-info:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 10px"
    height: "24px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card}"
  menu:
    backgroundColor: "{colors.glass-thick}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.2xl}"
    padding: "6px"
  menu-item-highlighted:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "6px 10px"
  tooltip:
    backgroundColor: "{colors.glass-thick}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  dialog:
    backgroundColor: "{colors.glass-thick}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
    padding: "24px"
  nav-sidebar:
    backgroundColor: "{colors.glass-regular}"
    rounded: "{rounded.panel}"
    padding: "12px"
    width: "240px"
  nav-sidebar-item:
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "0 12px"
    height: "36px"
  nav-header-capsule:
    backgroundColor: "{colors.glass-regular}"
    rounded: "{rounded.full}"
    height: "56px"
  tabs-list:
    backgroundColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: "2px"
    height: "36px"
  tabs-list-glass:
    backgroundColor: "{colors.glass-regular}"
    rounded: "{rounded.full}"
    padding: "4px"
    height: "44px"
  switch-on:
    backgroundColor: "{colors.success}"
    rounded: "{rounded.full}"
    width: "48px"
    height: "28px"
---

# Design System: glass-ui

## Overview

**Creative North Star: "Paper Under Glass"**

Two layers, never mixed. Content is calm, opaque, hairline-bordered paper: cards, tables, fields and empty states sit flat on a near-white cool ground. Everything that navigates or acts floats above that paper as Apple Liquid Glass: capsules and rounded slabs that blur, saturate and brighten what is behind them, with a specular rim that catches light from the top-left. The visual reference is binding (iOS 26 / macOS 26), and the kit refuses the category default of glass smeared on every card.

Density is dense-but-calm: a 4px grid, 36px default controls, 13-15px working text, and type that has to carry Thai tone marks and lower vowels without clipping. Soft colour fields sit behind the chrome so the glass has something to bend. Action is system blue; state is iOS-style green, amber and red, always tinted rather than filled.

Glass is CSS only (blur + saturate + brightness + tint + sheen gradient + inset rim). Every material falls back to an opaque solid under `prefers-reduced-transparency: reduce` or `prefers-contrast: more`.

**Key Characteristics:**

- Opaque content layer, glass control layer; the boundary is the system.
- Three glass thicknesses: clear (controls over media), regular (sidebar, toolbar, tab bar), thick (menus, dialogs, tooltips, popovers).
- Capsule controls; concentric radii stepping down from 28px panels.
- Liquid press: glass and primary controls swell and brighten on a spring.
- Light and dark are both first-class; every material has a dark counterpart.

## Colors

A cool near-neutral ground and ink (hue 250-260), one saturated system blue for action, and three iOS status hues that appear as tints with darker text partners.

### Primary

- **System Blue** (`primary`): filled primary buttons, the highlighted menu/select row, avatar badges, the active underline of line tabs, caret colour. Computed 5.52:1 against white text in light, about 4.8:1 in dark.
- **Blue Wash** (`accent`, `accent-foreground`): info badges, empty-state media tile, avatar fallback, text selection, selected table rows. The text partner is a deeper blue so tinted chips stay readable.

### Secondary

- **Status Green** (`success`, `success-text`): switch "on" track and success badges/toasts. The fill is the bright hue; text uses the darker partner (at least 5.4:1 in both themes).
- **Status Amber** (`warning`, `warning-text`): warning badges and toasts, same fill/text split.
- **Status Red** (`destructive`): destructive buttons and badges as a 12% tint with red text; menu destructive rows fill solid red only on highlight.

### Tertiary

- **Chart Spectrum** (`chart-1` to `chart-5`): blue, teal, violet, amber, rose. Data series only.
- **Backdrop Fields** (`glass-field-1` to `glass-field-3`): pale blue, aqua and lilac radial fields painted behind the page (`glass-backdrop`) so chrome glass has colour to refract. Never used as fills on components.

### Neutral

- **Cool Paper** (`background`): the page ground.
- **Card White** (`card`): opaque content surfaces and the focused field background.
- **Ink** (`foreground`): all primary text.
- **Graphite Muted** (`muted-foreground`): descriptions, notes, table headers, placeholders. 6.35:1 on the ground.
- **Ink Veils** (`secondary`, `muted`, `border`, `input`): ink at 5.5%, 4%, 9% and 12% alpha. Filled fields and secondary buttons, footer and hover wash, hairlines, field strokes.
- **Glass Tints** (`glass-clear`, `glass-regular`, `glass-thick`, `glass-solid`): white at 20% / 55% / 80% over the backdrop; `glass-solid` is the opaque fallback.
- **Rim Lights** (`glass-sheen`, `glass-rim-hi`, `glass-rim-lo`, `glass-edge`, `glass-glow`): the specular kit: top-left sheen gradient, bright top-left rim, dim bottom-right counter-rim, half-pixel ink edge, inner glow.

Dark values live in the `.dark` block of the registry theme and are listed per token in the sidecar.

### Named Rules

**The Tint, Not Fill, Rule.** Status colour reaches the screen as a 12-20% tint with its darker `-text` partner. The only solid status fills are the switch "on" track and a highlighted destructive menu row.

**The One Blue Rule.** System blue is the only action colour. A second accent is not part of this system.

## Typography

**Display Font:** Apple system (SF Pro Display) on Apple platforms, Inter Variable everywhere else
**Body Font:** Apple system (SF Pro Text), then Inter Variable
**Thai:** Sarabun (400 / 500 / 600), placed after Inter in both stacks

**Character:** Apple's own system voice where it exists, Inter as the bundled, designed equivalent, and Sarabun so Thai sits on the same baseline without clipped marks. Body text turns on Inter's `cv11` and `ss01` alternates.

### Hierarchy

- **Display** (700, 2rem, 1.25, -0.03em): the page title only.
- **Headline** (600, 1.125rem, 1.25, -0.015em): dialog titles.
- **Title** (600, 0.9375rem, 1.375, -0.01em): section headings, card titles; empty-state titles step up to 1rem.
- **Body** (400, 0.875rem, 1.43): default UI text, table cells, menu items, buttons (500).
- **Body Small** (400, 0.8125rem): descriptions, section notes, tab and small-button labels.
- **Label** (500, 0.75rem): badges, tooltips, table headers, menu group labels.

### Named Rules

**The Tight Heading Rule.** Headings track negative in steps (-0.01em, -0.015em, -0.03em) as size grows; body text keeps normal tracking.

**The Sixteen On Touch Rule.** Text inputs are 16px below 768px and 14px above, so iOS Safari does not zoom on focus.

## Layout

A dense 4px grid. Desktop (from 768px): a floating glass sidebar 240px wide, inset 12px from the top, bottom and left edges, holding brand, component index and theme toggle; content is offset past it (280px, 304px from 1024px) and capped at 56rem. Under 768px the sidebar is replaced by a sticky glass header capsule (56px tall, 12px inset) with a horizontally scrolling row of glass-clear chips for the index, and a scroll-edge blur band masked from 55% to transparent beneath it.

Catalog sections are separated by hairline top borders with 40px vertical padding; from 1024px each section is a two-column grid (13rem label column, flexible demo column). Controls in a row sit 12px apart. Cards pad 20px (16px in the small size). Section anchors scroll with an 8rem offset so the mobile header never covers a heading.

## Elevation & Depth

Hybrid, split by layer. The content layer is flat: cards use a 1px hairline ring and no shadow, tables use hairline rows, empty states use a dashed border. Depth belongs to the glass layer, which is lifted by a two-part ambient shadow plus an inset specular rim, and visually separated from content by backdrop blur (7px clear, 14px regular, 28px thick), 190% saturation (160% dark) and 1.04 brightness (0.96 dark).

### Shadow Vocabulary

- **Glass Lift** (`--glass-shadow`, light `0 8px 24px -6px oklch(0.25 0.04 260 / 0.16), 0 2px 6px -2px oklch(0.25 0.04 260 / 0.1)`): regular and thick glass. Clear glass has no lift.
- **Specular Rim** (`inset 1px 1px 0 0 rim-hi, inset -1px -1px 0 0 rim-lo, inset 0 0 0 0.5px edge, inset 0 0 14px 0 glow`): every glass material, composed through Tailwind's inset-shadow slot so focus rings stack on top.
- **Primary Glow** (`inset 1px 1px 0 0 rgb(255 255 255 / 0.4), inset -1px -1px 0 0 rgb(255 255 255 / 0.12), 0 6px 16px -6px primary`): the filled primary button, so it shares the rim language.
- **Indicator Lift** (`0 1px 3px oklch(0.2 0.02 260 / 0.14), 0 0 0 0.5px oklch(0.2 0.02 260 / 0.06)`): the sliding segmented-control thumb and the switch knob.

### Named Rules

**The Two Layers Rule.** Glass only on the control layer: nav, toolbars, tab bars, menus, selects, popovers, dialogs, tooltips, toasts. Cards, tables and fields stay opaque.

**The Material Is Whole Rule.** A glass surface carries no extra `bg-*`, `ring-1` or `shadow-*`; change a material through its `--glass-*` variables, not by stacking classes.

**The Solid Fallback Rule.** Every glass material drops blur and sheen and becomes `glass-solid` under reduced transparency or increased contrast.

## Shapes

Concentric radii derived from a 12px base: panels 28px (sidebar, dialog, demo stages), large tiles 26.4px, cards, menus, popovers and empty states 21.6px, nav rows 16.8px, fields, menu rows and skeletons 12px. Every control that can be a capsule is one: buttons, badges, tooltips, tab lists and tab thumbs, switches, avatars, the mobile header. Inner radius always steps down from its container, so a row inside a menu reads as nested, not pasted. Borders are hairlines (ink at 9%) or the half-pixel glass edge; never heavier.

## Components

### Buttons

Tactile capsules; the two lifted variants physically respond.

- **Shape:** full capsule; heights 24 / 32 / 36 / 44px (xs / sm / default / lg), square icon sizes to match.
- **Primary:** System Blue fill, white 14px/500 text, 16px side padding, primary glow shadow.
- **Glass:** regular glass with foreground text, for actions on chrome or over media.
- **Hover / Press:** primary and glass use liquid press (scale 1.02 + brightness 1.06 on hover, scale 1.05 + brightness 1.12 on press, 380ms spring, 140ms on press). Secondary, outline, ghost and destructive shift their wash and scale to 0.97 on press. Focus is a 3px ring in `ring`. Disabled is 45% opacity.
- **Secondary / Outline / Ghost / Destructive:** ink veil fill; card fill with hairline; transparent with veil on hover; red tint with red text.

### Chips (Badges)

- **Style:** 24px capsule, 12px/500 label, 10px side padding, no border except the outline variant.
- **State:** default (blue fill), secondary (veil), info (blue wash), success / warning / destructive (tints with text partners), outline, glass (clear glass, only over media or chrome).

### Cards / Containers

- **Corner Style:** 21.6px.
- **Background:** Card White on Cool Paper.
- **Shadow Strategy:** none; flat content layer.
- **Border:** 1px hairline ring in `border`; footers add a top hairline over the muted wash.
- **Internal Padding:** 20px (16px small), same value as the vertical gap between parts.

### Inputs / Fields

- **Style:** filled, borderless at rest: ink veil fill, transparent 1px border, 12px radius, 36px tall. Select triggers match.
- **Focus:** the fill turns to Card White, the border takes the ring colour, plus a 3px ring at 40%.
- **Error / Disabled:** destructive border and 3px destructive ring at 20%; disabled at 50% opacity.

### Navigation

- **Sidebar:** regular glass slab, 28px radius, 12px padding. Rows are 36px, 16.8px radius, 14px/500 at 80% ink, veil on hover, ring on focus.
- **Mobile header:** 56px regular glass capsule with brand and theme toggle; below it, 32px glass-clear capsule chips scroll sideways with the index.

### Overlays (Menus, Select, Popover, Tooltip, Dialog, Toast)

All on thick glass for readable text. Menus and selects: 21.6px radius, 6px padding (4px select), 12px-radius rows that highlight solid System Blue with white text, the Apple menu behaviour. Popovers: 288px wide, 16px padding. Tooltips: label-size text in a thick-glass capsule. Dialogs: 28px radius, 24px padding, max 28rem, a cool 18% scrim (40% black in dark), and a spring zoom-in from 90%. Toasts: 20px radius on the thick tint with the rim and glass lift.

### Segmented Control (Tabs)

A capsule track (veil, 36px; or glass, 44px) with a sliding thumb that moves on a 500ms spring. The thumb is Card White with the indicator lift (a 15%-translucent card with a rim on the glass track). A line variant swaps the thumb for a 2px blue underline.

### Switch

iOS proportions: 48 x 28px capsule, ink-veil track off, Status Green on. The white knob stretches from 24px to 28px wide while pressed and slides on a 400ms spring.

## Do's and Don'ts

### Do:

- **Do** put glass only on what floats and acts: nav, toolbars, tab bars, menus, selects, popovers, dialogs, tooltips, toasts.
- **Do** pick the material by job: `glass-clear` over photos and media, `glass` for sidebars, toolbars and tab bars, `glass-thick` for anything with text to read.
- **Do** keep content opaque and flat: Card White, 1px hairline, no shadow.
- **Do** step radii down concentrically (28px, 21.6px, 16.8px, 12px) and make standalone controls capsules.
- **Do** give glass something to refract: place chrome over the `glass-backdrop` fields or real media.
- **Do** write status as a tint plus its darker `-text` partner.
- **Do** recompute WCAG ratios in both themes for any colour change; AA on every glass material is a product requirement.
- **Do** respect `prefers-reduced-motion` (press and spring transitions drop to 0ms) and keep the solid glass fallback.

### Don't:

- **Don't** use glass on cards, tables, fields or other content-layer surfaces.
- **Don't** add `bg-*`, `ring-1` or `shadow-*` to a glass surface, or stack two glass classes; tune the `--glass-*` variables instead.
- **Don't** add a second accent colour or fill status colours solid on large areas.
- **Don't** use SVG displacement or `backdrop-filter: url()` refraction; it is Chromium-only and costly.
- **Don't** use type styles that clip Thai tone marks or lower vowels: no line-height below 1.25 on text that can be Thai.
