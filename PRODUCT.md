# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers (primarily the owner) building their own apps. They install components with `npx shadcn add NTCHz/glass-ui/<item>` and then edit the copied code. End users read mixed Thai + English UI.

## Product Purpose

One shared component kit in Apple Liquid Glass (iOS 26 / macOS 26). The component list was chosen from what the owner's past apps actually use (status badge, tooltip, empty state, button, dialog, chart, skeleton, popover, menu, avatar, table, …); those apps are an inventory reference only — the kit carries no content, branding, or data from them. Success: a new project looks finished after `shadcn add`, without restyling.

## Positioning

Not a generic shadcn theme: its component inventory and density come from the owner's real internal apps, and its material language is Apple Liquid Glass, tuned for Thai + English text.

## Operating Context

Apps built with it span four surface types, all in scope:

- internal dashboards / admin (tables, filters, forms, charts)
- AI / chat / knowledge tools (chat threads, search, document lists)
- landing / showcase pages
- mobile web (LIFF, PWA)

## Capabilities and Constraints

- Distributed as a shadcn GitHub registry; `registry.json` is the source of truth (see AGENTS.md).
- Stack is fixed: React, Tailwind CSS v4, Base UI primitives, `cva`, `cn`, lucide-react.
- Must work in light and dark.
- Every glass surface needs a readable fallback (`prefers-reduced-transparency`, `prefers-contrast: more`).

## Brand Commitments

- Visual reference is binding: Apple Liquid Glass (iOS 26 / macOS 26) — floating capsule controls, glass layered over content, specular rims.
- Content is mixed Thai + English; type must render Thai well (no clipped tone marks or lower vowels).

## Product Principles

1. Glass is for the layer that floats over content (nav, toolbars, menus, sheets), not for every surface. Content stays legible first.
2. Mirror the owner's real app patterns before inventing new components.
3. One kit, four surface types: density and components must hold up in a data table as well as on a landing hero.
4. Copy-and-own: components stay plain shadcn-style code that a project can edit.

## Accessibility & Inclusion

WCAG AA text contrast on every glass material in both themes; visible focus; motion respects `prefers-reduced-motion`.
