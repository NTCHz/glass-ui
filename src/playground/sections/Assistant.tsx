import {
  AlertCircleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  FileTextIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import type { FC } from "react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";

import { Section } from "../Section";

const NAV_ITEMS = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Inbox", icon: InboxIcon, badge: 12 },
  { label: "Calendar", icon: CalendarIcon },
  { label: "ค้นหา", icon: SearchIcon },
  { label: "Settings", icon: SettingsIcon },
] as const;

const PROJECTS = ["Weekend trip", "Reading list", "งานบ้าน"] as const;

export const Sidebars: FC = () => (
  <Section
    id="sidebar"
    title="Sidebar"
    note="A floating glass panel inset from the edge. Below 768px it opens as a sheet."
  >
    <div className="relative isolate h-[420px] w-full transform-gpu overflow-hidden rounded-[28px] bg-[oklch(0.62_0.19_262)]">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(40%_60%_at_15%_30%,oklch(0.8_0.15_200),transparent),radial-gradient(35%_55%_at_80%_70%,oklch(0.72_0.2_340),transparent),radial-gradient(30%_40%_at_55%_10%,oklch(0.88_0.14_90),transparent)]"
      />
      <SidebarProvider className="h-full min-h-0">
        <Sidebar className="absolute h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <SparklesIcon className="text-primary-foreground!" />
                  </span>
                  <span className="grid leading-snug">
                    <span className="font-semibold">Workspace</span>
                    <span className="text-xs text-muted-foreground">
                      Personal
                    </span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map(item => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={"active" in item && item.active}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {"badge" in item && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add project">
                <PlusIcon />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PROJECTS.map(name => (
                    <SidebarMenuItem key={name}>
                      <SidebarMenuButton>
                        <FileTextIcon />
                        <span>{name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <SettingsIcon />
                  <span>Preferences (disabled)</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="relative flex min-w-0 flex-1 flex-col bg-transparent p-3">
          <div className="flex h-full flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-heading text-[0.9375rem] font-semibold tracking-[-0.01em]">
                Home
              </span>
            </div>
            <p className="text-[0.8125rem] text-muted-foreground">
              Press the toggle or ⌘B to collapse the sidebar.
            </p>
          </div>
        </div>
      </SidebarProvider>
    </div>
  </Section>
);

export const Bubbles: FC = () => (
  <Section
    id="bubble"
    title="Bubble"
    note="One sender fill; a failed send keeps its bubble and flags it outside."
  >
    <BubbleGroup className="w-full max-w-md">
      <Bubble variant="secondary">
        <BubbleContent>Are we still on for Saturday?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Yes! เจอกันสิบโมงนะ</BubbleContent>
        <BubbleReactions>👍 2</BubbleReactions>
      </Bubble>
      <Bubble align="end" className="mt-3">
        <BubbleContent>I&apos;ll bring the snacks.</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent render={<button type="button" />}>
          Tap to see the plan
        </BubbleContent>
      </Bubble>
      <div className="flex max-w-[80%] flex-col items-end gap-1 self-end">
        <div className="flex items-center gap-2">
          <Bubble align="end" className="max-w-full">
            <BubbleContent>ถึงแล้วโทรหานะ</BubbleContent>
          </Bubble>
          <AlertCircleIcon
            aria-hidden
            className="size-5 shrink-0 text-destructive"
          />
        </div>
        <span className="pe-7 text-xs text-destructive">
          Not delivered · Tap to retry
        </span>
      </div>
    </BubbleGroup>
  </Section>
);

export const Attachments: FC = () => (
  <Section
    id="attachment"
    title="Attachment"
    note="Opaque chips for files: done, uploading, error and empty."
  >
    <AttachmentGroup className="w-full">
      <Attachment>
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.pdf</AttachmentTitle>
          <AttachmentDescription>240 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="uploading">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>รูปทริป.jpg</AttachmentTitle>
          <AttachmentDescription>Uploading 64%</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="error">
        <AttachmentMedia>
          <AlertCircleIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>budget.xlsx</AttachmentTitle>
          <AttachmentDescription>Upload failed</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="idle" size="sm">
        <AttachmentMedia>
          <ImageIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Drop an image</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    </AttachmentGroup>
  </Section>
);

const CONVERSATION = [
  { id: "1", from: "user", text: "Can you suggest a quiet place to read?" },
  {
    id: "2",
    from: "assistant",
    text: "A library reading room or a café with a back corner works well. Mornings on weekdays are usually the calmest.",
  },
  { id: "3", from: "user", text: "แถวบ้านมีห้องสมุดไหม" },
  {
    id: "4",
    from: "assistant",
    text: "Search for “public library” on your map app and filter by opening hours. Most branches open at 9:00.",
  },
  { id: "5", from: "user", text: "Thanks, that helps!" },
] as const;

export const Messages: FC = () => (
  <Section
    id="message"
    title="Message · Message scroller"
    note="User bubbles in primary; assistant replies as plain text on the content layer."
  >
    <div className="h-80 w-full max-w-xl rounded-2xl bg-card ring-1 ring-border">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport className="px-4">
            <MessageScrollerContent className="py-4">
              {CONVERSATION.map(m => (
                <MessageScrollerItem key={m.id} messageId={m.id}>
                  {m.from === "user" ? (
                    <Message align="end">
                      <MessageContent>
                        <Bubble align="end">
                          <BubbleContent>{m.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  ) : (
                    <Message>
                      <MessageAvatar>
                        <Avatar>
                          <AvatarFallback>
                            <SparklesIcon className="size-4" />
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                      <MessageContent>
                        <MessageHeader className="px-0">
                          Assistant
                        </MessageHeader>
                        <p className="leading-relaxed">{m.text}</p>
                        <MessageFooter className="px-0">Just now</MessageFooter>
                      </MessageContent>
                    </Message>
                  )}
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  </Section>
);

const SAMPLE_CODE = `export function greet(name: string) {
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : "Hello";
  return \`\${hello}, \${name}\`;
}
`;

const HighlightedCode: FC = () => {
  const lines = useHighlightedCode(SAMPLE_CODE, "ts");
  return (
    <CodeBlock className="max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <FileTextIcon />
          greet.ts
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={SAMPLE_CODE} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={index === 2 ? "added" : "default"}
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  );
};

const BUILD_LOG = `$ pnpm build
Reading config.json…`;

export const CodeBlocks: FC = () => (
  <Section
    id="code-block"
    title="Code block"
    note="An opaque card with a monospace body and lazy syntax highlighting."
  >
    <div className="grid w-full gap-3">
      <HighlightedCode />
      <CodeBlock variant="destructive" size="sm" className="max-w-xl">
        <CodeBlockActions>
          <CodeBlockCopyButton value={BUILD_LOG} />
        </CodeBlockActions>
        <CodeBlockContent>{BUILD_LOG}</CodeBlockContent>
        <CodeBlockFooter>
          <AlertCircleIcon />
          <span className="font-medium">Build failed</span>
          <code className="min-w-0 truncate font-mono text-muted-foreground">
            ENOENT: config.json
          </code>
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  </Section>
);

export const Traces: FC = () => (
  <Section
    id="trace"
    title="Trace"
    note="Step-by-step activity: done, running, pending and error."
  >
    <Trace className="max-w-md">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CheckCircle2Icon />
            </TraceIcon>
            <TraceTitle>Searched 3 sources</TraceTitle>
            <TraceDescription>1.2s</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          Looked through opening hours, maps and reviews. พบข้อมูลครบทั้ง 3
          แหล่ง
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceLine status="running">
        <TraceIcon>
          <Spinner />
        </TraceIcon>
        <TraceTitle>Comparing options</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <FileTextIcon />
        </TraceIcon>
        <TraceTitle>Write summary</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceIcon>
          <AlertCircleIcon />
        </TraceIcon>
        <TraceTitle>Could not reach calendar</TraceTitle>
      </TraceLine>
    </Trace>
  </Section>
);

export const Markers: FC = () => (
  <Section
    id="marker"
    title="Marker"
    note="Quiet inline notes that divide a conversation."
  >
    <div className="grid w-full max-w-md gap-4">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <SparklesIcon />
        </MarkerIcon>
        <MarkerContent>Conversation started · เริ่มสนทนาแล้ว</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>
          Older messages are hidden. <a href="#marker">Show all</a>
        </MarkerContent>
      </Marker>
    </div>
  </Section>
);

const QUESTIONS = [
  { name: "time", choices: [{ value: "morning" }, { value: "evening" }] },
  {
    name: "topics",
    choices: [{ value: "news" }, { value: "tips" }, { value: "events" }],
  },
  { name: "email" },
] as const;

export const Questionnaires: FC = () => (
  <Section
    id="questionnaire"
    title="Questionnaire"
    note="One question at a time; choices are content-layer cards."
  >
    <div className="w-full max-w-md rounded-2xl bg-card p-5 ring-1 ring-border">
      <Questionnaire items={QUESTIONS} shortcuts="letters">
        <QuestionnaireProgress />
        <QuestionnaireItem name="time" required>
          <QuestionnaireTitle>When do you like to read?</QuestionnaireTitle>
          <QuestionnaireDescription>
            เลือกได้หนึ่งข้อ · Pick one.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="morning" defaultChecked>
              Morning
              <QuestionnaireChoiceDescription>
                Before 10:00
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="evening">Evening</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem name="topics" multiple>
          <QuestionnaireTitle>Which topics interest you?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="news">News</QuestionnaireChoice>
            <QuestionnaireChoice value="tips">Tips</QuestionnaireChoice>
            <QuestionnaireChoice value="events" disabled>
              Events (soon)
            </QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem name="email">
          <QuestionnaireTitle>Where should we send updates?</QuestionnaireTitle>
          <QuestionnaireInput type="email" placeholder="you@example.com" />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  </Section>
);
