import type { FC, LazyExoticComponent } from "react";
import { lazy } from "react";

export type DemoFile =
  | "Assistant"
  | "Basics"
  | "DataDisplay"
  | "Forms"
  | "Layout"
  | "Liquid"
  | "Navigation"
  | "Overlays"
  | "Tuner";

export type ComponentEntry = {
  group: string;
  id: string;
  label: string;
  file: DemoFile;
  demo: string;
  /** registry items the page installs; defaults to [id] */
  items?: readonly string[];
};

export type GuideEntry = { id: string; label: string };

export const GUIDES: readonly GuideEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "theming", label: "Theming" },
];

export const COMPONENTS: readonly ComponentEntry[] = [
  {
    group: "Foundations",
    id: "materials",
    label: "Materials",
    file: "Basics",
    demo: "Materials",
    items: ["theme"],
  },
  {
    group: "Foundations",
    id: "liquid-glass",
    label: "Liquid Glass",
    file: "Liquid",
    demo: "LiquidSection",
  },
  {
    group: "Foundations",
    id: "glass-tuner",
    label: "Glass Tuner",
    file: "Tuner",
    demo: "LiquidTuner",
    items: ["liquid-glass"],
  },
  {
    group: "Actions",
    id: "button",
    label: "Button",
    file: "Basics",
    demo: "Buttons",
  },
  {
    group: "Actions",
    id: "button-group",
    label: "Button Group",
    file: "Layout",
    demo: "ButtonGroups",
  },
  {
    group: "Actions",
    id: "toggle",
    label: "Toggle",
    file: "Forms",
    demo: "ToggleDemo",
  },
  {
    group: "Actions",
    id: "toggle-group",
    label: "Toggle Group",
    file: "Forms",
    demo: "ToggleGroupDemo",
  },
  { group: "Actions", id: "kbd", label: "Kbd", file: "Forms", demo: "KbdDemo" },
  {
    group: "Forms",
    id: "fields",
    label: "Input · Select",
    file: "Basics",
    demo: "Fields",
    items: ["input", "select", "textarea", "label"],
  },
  {
    group: "Forms",
    id: "field",
    label: "Field",
    file: "Forms",
    demo: "FieldDemo",
  },
  {
    group: "Forms",
    id: "input-group",
    label: "Input Group",
    file: "Forms",
    demo: "InputGroupDemo",
  },
  {
    group: "Forms",
    id: "input-otp",
    label: "Input OTP",
    file: "Forms",
    demo: "InputOTPDemo",
  },
  {
    group: "Forms",
    id: "native-select",
    label: "Native Select",
    file: "Forms",
    demo: "NativeSelectDemo",
  },
  {
    group: "Forms",
    id: "combobox",
    label: "Combobox",
    file: "Forms",
    demo: "ComboboxDemo",
  },
  {
    group: "Forms",
    id: "checkbox",
    label: "Checkbox",
    file: "Forms",
    demo: "CheckboxDemo",
  },
  {
    group: "Forms",
    id: "radio-group",
    label: "Radio Group",
    file: "Forms",
    demo: "RadioGroupDemo",
  },
  {
    group: "Forms",
    id: "switch-tabs",
    label: "Switch · Tabs",
    file: "Basics",
    demo: "Toggles",
    items: ["switch", "tabs"],
  },
  {
    group: "Forms",
    id: "slider",
    label: "Slider",
    file: "Forms",
    demo: "SliderDemo",
  },
  {
    group: "Forms",
    id: "calendar",
    label: "Calendar",
    file: "Forms",
    demo: "CalendarDemo",
  },
  {
    group: "Overlays",
    id: "overlays",
    label: "Menu · Dialog · Tooltip",
    file: "Overlays",
    demo: "Overlays",
    items: ["dropdown-menu", "popover", "dialog", "tooltip"],
  },
  {
    group: "Overlays",
    id: "alert-dialog",
    label: "Alert Dialog",
    file: "Navigation",
    demo: "AlertDialogSection",
  },
  {
    group: "Overlays",
    id: "sheet",
    label: "Sheet",
    file: "Navigation",
    demo: "SheetSection",
  },
  {
    group: "Overlays",
    id: "drawer",
    label: "Drawer",
    file: "Navigation",
    demo: "DrawerSection",
  },
  {
    group: "Overlays",
    id: "hover-card",
    label: "Hover Card",
    file: "Navigation",
    demo: "HoverCardSection",
  },
  {
    group: "Overlays",
    id: "context-menu",
    label: "Context Menu",
    file: "Navigation",
    demo: "ContextMenuSection",
  },
  {
    group: "Overlays",
    id: "command",
    label: "Command",
    file: "Navigation",
    demo: "CommandSection",
  },
  {
    group: "Overlays",
    id: "toast",
    label: "Toast",
    file: "Navigation",
    demo: "ToastSection",
  },
  {
    group: "Navigation",
    id: "sidebar",
    label: "Sidebar",
    file: "Assistant",
    demo: "Sidebars",
  },
  {
    group: "Navigation",
    id: "menubar",
    label: "Menubar",
    file: "Navigation",
    demo: "MenubarSection",
  },
  {
    group: "Navigation",
    id: "navigation-menu",
    label: "Navigation Menu",
    file: "Navigation",
    demo: "NavigationMenuSection",
  },
  {
    group: "Navigation",
    id: "breadcrumb",
    label: "Breadcrumb",
    file: "Navigation",
    demo: "BreadcrumbSection",
  },
  {
    group: "Navigation",
    id: "pagination",
    label: "Pagination",
    file: "Navigation",
    demo: "PaginationSection",
  },
  {
    group: "Data display",
    id: "card",
    label: "Card",
    file: "DataDisplay",
    demo: "Cards",
  },
  {
    group: "Data display",
    id: "table",
    label: "Table",
    file: "DataDisplay",
    demo: "Tables",
  },
  {
    group: "Data display",
    id: "chart",
    label: "Chart",
    file: "DataDisplay",
    demo: "Charts",
  },
  {
    group: "Data display",
    id: "badge",
    label: "Badge",
    file: "Basics",
    demo: "Badges",
  },
  {
    group: "Data display",
    id: "avatar",
    label: "Avatar · Skeleton",
    file: "DataDisplay",
    demo: "People",
    items: ["avatar", "skeleton"],
  },
  {
    group: "Data display",
    id: "item",
    label: "Item",
    file: "Layout",
    demo: "Items",
  },
  {
    group: "Data display",
    id: "carousel",
    label: "Carousel",
    file: "Layout",
    demo: "Carousels",
  },
  {
    group: "Feedback",
    id: "alert",
    label: "Alert",
    file: "Layout",
    demo: "Alerts",
  },
  {
    group: "Feedback",
    id: "progress",
    label: "Progress · Spinner",
    file: "Layout",
    demo: "Progresses",
    items: ["progress", "spinner"],
  },
  {
    group: "Feedback",
    id: "empty",
    label: "Empty",
    file: "DataDisplay",
    demo: "Empties",
  },
  {
    group: "Layout",
    id: "accordion",
    label: "Accordion",
    file: "Layout",
    demo: "Accordions",
  },
  {
    group: "Layout",
    id: "scroll-area",
    label: "Scroll Area",
    file: "Layout",
    demo: "ScrollAreas",
  },
  {
    group: "Layout",
    id: "resizable",
    label: "Resizable",
    file: "Layout",
    demo: "Resizables",
  },
  {
    group: "AI",
    id: "bubble",
    label: "Bubble",
    file: "Assistant",
    demo: "Bubbles",
  },
  {
    group: "AI",
    id: "message",
    label: "Message",
    file: "Assistant",
    demo: "Messages",
  },
  {
    group: "AI",
    id: "attachment",
    label: "Attachment",
    file: "Assistant",
    demo: "Attachments",
  },
  {
    group: "AI",
    id: "code-block",
    label: "Code Block",
    file: "Assistant",
    demo: "CodeBlocks",
  },
  {
    group: "AI",
    id: "trace",
    label: "Trace",
    file: "Assistant",
    demo: "Traces",
  },
  {
    group: "AI",
    id: "marker",
    label: "Marker",
    file: "Assistant",
    demo: "Markers",
  },
  {
    group: "AI",
    id: "questionnaire",
    label: "Questionnaire",
    file: "Assistant",
    demo: "Questionnaires",
  },
];

export const itemsOf = (entry: ComponentEntry) => entry.items ?? [entry.id];

// lazy: a page loads only the section file its demo lives in
const demoModules = import.meta.glob<Record<string, unknown>>(
  "../playground/sections/*.tsx"
);

// one lazy component per demo, so its identity survives re-renders
const lazyDemos = new Map<string, LazyExoticComponent<FC>>();

const demoSources = import.meta.glob<string>("../playground/sections/*.tsx", {
  query: "?raw",
  import: "default",
});

const uiSources = import.meta.glob<string>("../components/ui/*.tsx", {
  query: "?raw",
  import: "default",
});

const sectionPath = (file: DemoFile) => `../playground/sections/${file}.tsx`;

export const demoOf = (entry: ComponentEntry) => {
  const key = `${entry.file}#${entry.demo}`;
  const cached = lazyDemos.get(key);
  if (cached) return cached;
  const load = demoModules[sectionPath(entry.file)];
  if (!load) return undefined;
  const Demo = lazy(async () => {
    // a failed chunk (offline, or a stale hash after a redeploy) must not stay cached
    const module = await load().catch((error: unknown) => {
      lazyDemos.delete(key);
      throw error;
    });
    const Component = module[entry.demo];
    if (typeof Component !== "function")
      throw new Error(`${entry.file}.tsx has no export ${entry.demo}`);
    return { default: Component as FC };
  });
  lazyDemos.set(key, Demo);
  return Demo;
};

export const loadDemoSource = (entry: ComponentEntry) =>
  demoSources[sectionPath(entry.file)]?.() ?? Promise.resolve("");

export const loadUiSource = (item: string) =>
  uiSources[`../components/ui/${item}.tsx`]?.() ?? Promise.resolve(null);
