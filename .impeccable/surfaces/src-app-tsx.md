---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface brief — glass-ui playground (src/App.tsx)

Scope: the kit's component catalog. One page, a section per registry component, neutral sample data. Mobile web is first-class.

Audience/job: the owner deciding whether `shadcn add` output looks finished, and finding a component to copy.

Constraints: Base UI, Tailwind v4, registry.json is the theme source; no app-specific content, names, or branding.

## Direction contract

THESIS: Two layers, never mixed. Content is calm, opaque, hairline-bordered paper; everything that navigates or acts floats above it as Apple Liquid Glass — capsules and rounded slabs with a specular rim. Refuses the category default of glass smeared on every card.

OWN-WORLD: Near-white cool ground with soft colour fields behind the chrome so the glass has something to bend; system blue for action, iOS-style status hues for state. Faces: Apple system stack → Inter Variable, Sarabun for Thai. Radii are concentric: 28px panels → 20px cards → capsule controls. Dense 4px grid.

STORY: The visitor scans a glass sidebar of components, sees each one live on the page, notices the chrome is glass that brightens and swells under the pointer, and switches light/dark.

FIRST VIEWPORT: Floating glass sidebar inset 12px on the left (brand, component index, theme toggle). Content: page title "Components" with the install command, then the Materials panel — three glass tiles over a saturated colour field with large type behind, so the three thicknesses read at a glance. On <768px the sidebar is replaced by a sticky glass header capsule with a scroll-edge blur band.

FORM: Pinned by brief (Apple Liquid Glass) — no concept-seed roll; mode operate. Signature move: liquid press — glass controls swell and brighten on hover/press with a spring, and the rim catches light from the top-left.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
