import {
  AlertCircleIcon,
  BoldIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  FolderIcon,
  InfoIcon,
  ItalicIcon,
  TriangleAlertIcon,
  UnderlineIcon,
} from "lucide-react";
import { useEffect, useState, type FC } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DirectionProvider } from "@/components/ui/direction";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

import { Section } from "../Section";

const FAQ = [
  {
    q: "How do I change my password?",
    a: "Open Settings, choose Security, then follow the steps to set a new password.",
  },
  {
    q: "เปลี่ยนภาษาของแอปได้ที่ไหน",
    a: "ไปที่ Settings แล้วเลือก Language ระบบจะเปลี่ยนภาษาทันทีโดยไม่ต้องรีสตาร์ต",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Exports are generated as a ZIP file and emailed to you within a few minutes.",
  },
];

const SLIDES = [
  {
    label: "Morning",
    tone: "bg-[radial-gradient(55%_45%_at_72%_22%,oklch(1_0_0/0.35),transparent),linear-gradient(to_bottom,oklch(0.7_0.1_220),oklch(0.4_0.09_245))]",
  },
  {
    label: "Afternoon",
    tone: "bg-[radial-gradient(50%_45%_at_30%_25%,oklch(1_0_0/0.3),transparent),linear-gradient(to_bottom,oklch(0.72_0.13_70),oklch(0.42_0.12_40))]",
  },
  {
    label: "Evening",
    tone: "bg-[radial-gradient(60%_40%_at_50%_80%,oklch(0.75_0.15_40/0.45),transparent),linear-gradient(to_bottom,oklch(0.55_0.15_320),oklch(0.33_0.12_285))]",
  },
  {
    label: "กลางคืน",
    tone: "bg-[radial-gradient(30%_25%_at_75%_25%,oklch(0.95_0.03_90/0.5),transparent),linear-gradient(to_bottom,oklch(0.36_0.08_265),oklch(0.18_0.05_270))]",
  },
];

const FILES = Array.from({ length: 24 }, (_, i) => `Document ${i + 1}.pdf`);

const UPLOAD_STEP = 7;
const UPLOAD_TICK_MS = 600;

export const Accordions: FC = () => (
  <Section
    id="accordion"
    title="Accordion"
    note="Content layer. Chevron turns on a spring."
  >
    <Accordion defaultValue={[FAQ[0].q]} className="max-w-lg">
      {FAQ.map(item => (
        <AccordionItem key={item.q} value={item.q}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
      <AccordionItem value="disabled" disabled>
        <AccordionTrigger>Billing history (unavailable)</AccordionTrigger>
        <AccordionContent>Not available on this plan.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </Section>
);

export const Alerts: FC = () => (
  <Section
    id="alert"
    title="Alert"
    note="Opaque panels, tinted by status tokens."
  >
    <div className="grid w-full max-w-lg gap-3">
      <Alert>
        <InfoIcon />
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>
          A new version is ready. มีเวอร์ชันใหม่พร้อมติดตั้งแล้ว
        </AlertDescription>
        <AlertAction>
          <Button size="xs" variant="secondary">
            Install
          </Button>
        </AlertAction>
      </Alert>
      <Alert variant="success">
        <CheckCircle2Icon />
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>Your profile is up to date.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Storage almost full</AlertTitle>
        <AlertDescription>You have used 92% of your space.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Check your card details and try again.
        </AlertDescription>
      </Alert>
    </div>
  </Section>
);

export const Carousels: FC = () => (
  <Section
    id="carousel"
    title="Carousel · Aspect Ratio"
    note="Glass arrows and page dots float over the media."
  >
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {SLIDES.map(slide => (
          <CarouselItem key={slide.label}>
            <AspectRatio
              ratio={16 / 10}
              className={`relative rounded-2xl ${slide.tone}`}
            >
              <span className="absolute bottom-3.5 left-4 text-lg font-semibold tracking-[-0.015em] text-white">
                {slide.label}
              </span>
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  </Section>
);

const UploadProgress: FC = () => {
  const [value, setValue] = useState(12);

  useEffect(() => {
    const id = setInterval(
      () => setValue(v => (v >= 100 ? 0 : Math.min(100, v + UPLOAD_STEP))),
      UPLOAD_TICK_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <Progress value={value} className="w-full">
      <ProgressLabel>Uploading</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
};

export const Progresses: FC = () => (
  <Section
    id="progress"
    title="Progress · Spinner"
    note="Primary fill on a secondary capsule track."
  >
    <div className="grid w-full max-w-sm gap-5">
      <UploadProgress />
      <Progress value={100}>
        <ProgressLabel>Backup complete</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={null}>
        <ProgressLabel>กำลังเตรียมไฟล์</ProgressLabel>
      </Progress>
    </div>
    <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2">
      <p className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
        <Spinner />
        Loading messages…
      </p>
      <Button disabled className="w-fit">
        <Spinner data-icon="inline-start" />
        Saving
      </Button>
    </div>
  </Section>
);

export const ScrollAreas: FC = () => (
  <Section
    id="scroll-area"
    title="Scroll Area"
    note="Thin capsule thumb, darkens on hover."
  >
    <ScrollArea className="h-56 w-64 rounded-2xl bg-card ring-1 ring-border">
      <ul className="p-2">
        {FILES.map(name => (
          <li
            key={name}
            className="rounded-lg px-2.5 py-1.5 text-[0.8125rem] tabular-nums"
          >
            {name}
          </li>
        ))}
      </ul>
    </ScrollArea>
  </Section>
);

export const Resizables: FC = () => (
  <Section
    id="resizable"
    title="Resizable"
    note="Hairline divider with a capsule grip."
  >
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-48 max-w-lg rounded-2xl bg-card ring-1 ring-border"
    >
      <ResizablePanel defaultSize="35%">
        <div className="grid h-full place-items-center p-4 text-[0.8125rem] text-muted-foreground">
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="65%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="60%">
            <div className="grid h-full place-items-center p-4 text-[0.8125rem] text-muted-foreground">
              Editor
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="40%">
            <div className="grid h-full place-items-center p-4 text-[0.8125rem] text-muted-foreground">
              Console · คอนโซล
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Section>
);

export const Items: FC = () => (
  <Section
    id="item"
    title="Item · Collapsible"
    note="List rows on the content layer."
  >
    <ItemGroup className="max-w-md gap-1 rounded-2xl bg-card p-1.5 ring-1 ring-border">
      <Item render={<a href="#item" />}>
        <ItemMedia variant="icon">
          <FolderIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Projects</ItemTitle>
          <ItemDescription>12 folders · updated today</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </ItemActions>
      </Item>
      <Item render={<a href="#item" />}>
        <ItemMedia variant="icon">
          <FileTextIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>รายงานประจำเดือน</ItemTitle>
          <ItemDescription>Monthly report · 2.4 MB</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="xs" variant="secondary">
            Open
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
    <Item variant="outline" className="max-w-md">
      <ItemContent>
        <ItemTitle>Two-factor authentication</ItemTitle>
        <ItemDescription>
          Add a second step when signing in on a new device.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm">Enable</Button>
      </ItemActions>
    </Item>
    <Collapsible className="grid w-full max-w-md gap-2">
      <CollapsibleTrigger
        render={<Button variant="ghost" size="sm" className="w-fit" />}
      >
        Advanced options
        <ChevronsUpDownIcon data-icon="inline-end" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-2xl bg-card px-4 py-3 text-[0.8125rem] text-muted-foreground ring-1 ring-border">
        Proxy, cache size and debug logging live here.
      </CollapsibleContent>
    </Collapsible>
  </Section>
);

export const ButtonGroups: FC = () => (
  <Section
    id="button-group"
    title="Button Group · Direction"
    note="Segments join into one capsule. DirectionProvider flips Base UI parts for RTL."
  >
    <ButtonGroup aria-label="Text style">
      <Button variant="secondary" size="icon" aria-label="Bold">
        <BoldIcon />
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="icon" aria-label="Italic">
        <ItalicIcon />
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="icon" aria-label="Underline">
        <UnderlineIcon />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline">Previous</Button>
      <Button variant="outline">Today</Button>
      <Button variant="outline">Next</Button>
    </ButtonGroup>
    <ButtonGroup>
      <ButtonGroupText>Page</ButtonGroupText>
      <Button variant="outline">1</Button>
      <Button variant="outline" disabled>
        2
      </Button>
    </ButtonGroup>
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="grid w-full max-w-sm gap-2">
        <Progress value={64}>
          <ProgressLabel>تحميل</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
    </DirectionProvider>
  </Section>
);
