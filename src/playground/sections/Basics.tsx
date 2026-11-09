import { BellIcon, PlusIcon } from "lucide-react";
import type { FC } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { Section } from "../Section";

const MATERIALS = [
  { cls: "glass-clear", use: "Over photos and media" },
  { cls: "glass", use: "Sidebar, toolbar, tab bar" },
  { cls: "glass-thick", use: "Menus, dialogs, tooltips" },
] as const;

const SIZES = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large" },
];

export const Materials: FC = () => (
  <Section
    id="materials"
    title="Materials"
    note="Glass is for the layer that floats above content."
  >
    <div className="relative isolate w-full overflow-hidden rounded-[28px] bg-[oklch(0.62_0.19_262)] p-4 sm:p-6">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(40%_60%_at_15%_30%,oklch(0.8_0.15_200),transparent),radial-gradient(35%_55%_at_80%_70%,oklch(0.72_0.2_340),transparent),radial-gradient(30%_40%_at_55%_10%,oklch(0.88_0.14_90),transparent)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute top-[18%] left-[22%] size-24 rounded-full bg-white/90" />
        <span className="absolute top-[40%] left-[52%] h-10 w-40 rounded-full bg-[oklch(0.3_0.1_265)]" />
        <span className="absolute right-[10%] bottom-[14%] size-20 rounded-[22px] bg-[oklch(0.85_0.17_90)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {MATERIALS.map(m => (
          <div
            key={m.cls}
            className={`${m.cls} grid h-36 glass-press content-end rounded-3xl p-4`}
          >
            <code className="text-[0.8125rem] font-semibold">.{m.cls}</code>
            <span className="text-xs text-foreground/75">{m.use}</span>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

export const Buttons: FC = () => (
  <Section
    id="button"
    title="Button"
    note="Capsules. Primary and glass swell on press."
  >
    <Button>Save</Button>
    <Button variant="glass">Glass</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Delete</Button>
    <Button variant="link">Link</Button>
    <Button size="sm">
      <PlusIcon data-icon="inline-start" />
      Small
    </Button>
    <Button variant="glass" size="icon" aria-label="Notifications">
      <BellIcon />
    </Button>
    <Button disabled>Disabled</Button>
  </Section>
);

export const Badges: FC = () => (
  <Section id="badge" title="Badge" note="Status first: tinted, readable.">
    <Badge>New</Badge>
    <Badge variant="success">Active</Badge>
    <Badge variant="warning">Pending</Badge>
    <Badge variant="destructive">Failed</Badge>
    <Badge variant="info">In review</Badge>
    <Badge variant="secondary">Draft</Badge>
    <Badge variant="outline">v0.2</Badge>
    <Badge variant="glass">Glass</Badge>
  </Section>
);

export const Fields: FC = () => (
  <Section
    id="fields"
    title="Input · Textarea · Select"
    note="Filled fields, no outline until focus."
  >
    <div className="grid w-full max-w-md gap-4">
      <div className="grid gap-2">
        <Label htmlFor="f-email">Email</Label>
        <Input id="f-email" type="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="f-size">Size</Label>
        <Select defaultValue="m" items={SIZES}>
          <SelectTrigger id="f-size" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SIZES.map(s => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="f-note">Note · ข้อความภาษาไทย</Label>
        <Textarea id="f-note" placeholder="พิมพ์ข้อความได้ทั้งไทยและ English" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="f-invalid">Invalid</Label>
        <Input id="f-invalid" aria-invalid defaultValue="not-an-email" />
      </div>
    </div>
  </Section>
);

export const Toggles: FC = () => (
  <Section
    id="switch-tabs"
    title="Switch · Tabs"
    note="Segmented indicator slides on a spring."
  >
    <div className="flex w-full flex-wrap items-center gap-6">
      <div className="flex items-center gap-3">
        <Switch id="t-on" defaultChecked />
        <Label htmlFor="t-on">Notifications</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="t-sm" size="sm" />
        <Label htmlFor="t-sm">Small</Label>
      </div>
    </div>
    <div className="flex w-full flex-wrap items-center gap-4">
      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="list">
        <TabsList variant="glass">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </Section>
);
