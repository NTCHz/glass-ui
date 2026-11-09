import type { FC } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppShell, type NavEntry } from "./playground/AppShell";
import {
  Attachments,
  Bubbles,
  CodeBlocks,
  Markers,
  Messages,
  Questionnaires,
  Sidebars,
  Traces,
} from "./playground/sections/Assistant";
import {
  Badges,
  Buttons,
  Fields,
  Materials,
  Toggles,
} from "./playground/sections/Basics";
import {
  Cards,
  Charts,
  Empties,
  People,
  Tables,
} from "./playground/sections/DataDisplay";
import {
  CalendarDemo,
  CheckboxDemo,
  ComboboxDemo,
  FieldDemo,
  InputGroupDemo,
  InputOTPDemo,
  KbdDemo,
  NativeSelectDemo,
  RadioGroupDemo,
  SliderDemo,
  ToggleDemo,
  ToggleGroupDemo,
} from "./playground/sections/Forms";
import {
  Accordions,
  Alerts,
  ButtonGroups,
  Carousels,
  Items,
  Progresses,
  Resizables,
  ScrollAreas,
} from "./playground/sections/Layout";
import { LiquidSection } from "./playground/sections/Liquid";
import {
  AlertDialogSection,
  BreadcrumbSection,
  CommandSection,
  ContextMenuSection,
  DrawerSection,
  HoverCardSection,
  MenubarSection,
  NavigationMenuSection,
  PaginationSection,
  SheetSection,
  ToastSection,
} from "./playground/sections/Navigation";
import { Overlays } from "./playground/sections/Overlays";

type CatalogEntry = NavEntry & { Demo: FC };

const CATALOG: readonly CatalogEntry[] = [
  {
    group: "Foundations",
    id: "materials",
    label: "Materials",
    Demo: Materials,
  },
  {
    group: "Foundations",
    id: "liquid-glass",
    label: "Liquid Glass",
    Demo: LiquidSection,
  },
  { group: "Actions", id: "button", label: "Button", Demo: Buttons },
  {
    group: "Actions",
    id: "button-group",
    label: "Button Group",
    Demo: ButtonGroups,
  },
  { group: "Actions", id: "toggle", label: "Toggle", Demo: ToggleDemo },
  {
    group: "Actions",
    id: "toggle-group",
    label: "Toggle Group",
    Demo: ToggleGroupDemo,
  },
  { group: "Actions", id: "kbd", label: "Kbd", Demo: KbdDemo },
  { group: "Forms", id: "fields", label: "Input · Select", Demo: Fields },
  { group: "Forms", id: "field", label: "Field", Demo: FieldDemo },
  {
    group: "Forms",
    id: "input-group",
    label: "Input Group",
    Demo: InputGroupDemo,
  },
  { group: "Forms", id: "input-otp", label: "Input OTP", Demo: InputOTPDemo },
  {
    group: "Forms",
    id: "native-select",
    label: "Native Select",
    Demo: NativeSelectDemo,
  },
  { group: "Forms", id: "combobox", label: "Combobox", Demo: ComboboxDemo },
  { group: "Forms", id: "checkbox", label: "Checkbox", Demo: CheckboxDemo },
  {
    group: "Forms",
    id: "radio-group",
    label: "Radio Group",
    Demo: RadioGroupDemo,
  },
  { group: "Forms", id: "switch-tabs", label: "Switch · Tabs", Demo: Toggles },
  { group: "Forms", id: "slider", label: "Slider", Demo: SliderDemo },
  { group: "Forms", id: "calendar", label: "Calendar", Demo: CalendarDemo },
  {
    group: "Overlays",
    id: "overlays",
    label: "Menu · Dialog · Toast",
    Demo: Overlays,
  },
  {
    group: "Overlays",
    id: "alert-dialog",
    label: "Alert Dialog",
    Demo: AlertDialogSection,
  },
  { group: "Overlays", id: "sheet", label: "Sheet", Demo: SheetSection },
  { group: "Overlays", id: "drawer", label: "Drawer", Demo: DrawerSection },
  {
    group: "Overlays",
    id: "hover-card",
    label: "Hover Card",
    Demo: HoverCardSection,
  },
  {
    group: "Overlays",
    id: "context-menu",
    label: "Context Menu",
    Demo: ContextMenuSection,
  },
  { group: "Overlays", id: "command", label: "Command", Demo: CommandSection },
  { group: "Overlays", id: "toast", label: "Toast", Demo: ToastSection },
  { group: "Navigation", id: "sidebar", label: "Sidebar", Demo: Sidebars },
  {
    group: "Navigation",
    id: "menubar",
    label: "Menubar",
    Demo: MenubarSection,
  },
  {
    group: "Navigation",
    id: "navigation-menu",
    label: "Navigation Menu",
    Demo: NavigationMenuSection,
  },
  {
    group: "Navigation",
    id: "breadcrumb",
    label: "Breadcrumb",
    Demo: BreadcrumbSection,
  },
  {
    group: "Navigation",
    id: "pagination",
    label: "Pagination",
    Demo: PaginationSection,
  },
  { group: "Data display", id: "card", label: "Card", Demo: Cards },
  { group: "Data display", id: "table", label: "Table", Demo: Tables },
  { group: "Data display", id: "chart", label: "Chart", Demo: Charts },
  { group: "Data display", id: "badge", label: "Badge", Demo: Badges },
  {
    group: "Data display",
    id: "avatar",
    label: "Avatar · Skeleton",
    Demo: People,
  },
  { group: "Data display", id: "item", label: "Item", Demo: Items },
  { group: "Data display", id: "carousel", label: "Carousel", Demo: Carousels },
  { group: "Feedback", id: "alert", label: "Alert", Demo: Alerts },
  {
    group: "Feedback",
    id: "progress",
    label: "Progress · Spinner",
    Demo: Progresses,
  },
  { group: "Feedback", id: "empty", label: "Empty", Demo: Empties },
  { group: "Layout", id: "accordion", label: "Accordion", Demo: Accordions },
  {
    group: "Layout",
    id: "scroll-area",
    label: "Scroll Area",
    Demo: ScrollAreas,
  },
  { group: "Layout", id: "resizable", label: "Resizable", Demo: Resizables },
  { group: "AI", id: "bubble", label: "Bubble", Demo: Bubbles },
  { group: "AI", id: "message", label: "Message", Demo: Messages },
  { group: "AI", id: "attachment", label: "Attachment", Demo: Attachments },
  { group: "AI", id: "code-block", label: "Code Block", Demo: CodeBlocks },
  { group: "AI", id: "trace", label: "Trace", Demo: Traces },
  { group: "AI", id: "marker", label: "Marker", Demo: Markers },
  {
    group: "AI",
    id: "questionnaire",
    label: "Questionnaire",
    Demo: Questionnaires,
  },
];

const App: FC = () => (
  <TooltipProvider>
    <AppShell nav={CATALOG}>
      <div className="pt-6 pb-8 md:pt-10">
        <h1 className="font-heading text-[2rem] leading-tight font-bold tracking-[-0.03em]">
          Components
        </h1>
        <p className="mt-1 text-[0.9375rem] text-muted-foreground">
          Every shadcn component, in Liquid Glass. Each installs with
        </p>
        <code className="mt-2 inline-block max-w-full rounded-lg bg-secondary px-2.5 py-1 text-[0.8125rem] break-all text-foreground">
          npx shadcn add NTCHz/glass-ui/&lt;name&gt;
        </code>
      </div>
      {CATALOG.map(({ id, Demo }) => (
        <Demo key={id} />
      ))}
    </AppShell>
    <Toaster position="top-center" />
  </TooltipProvider>
);

export default App;
