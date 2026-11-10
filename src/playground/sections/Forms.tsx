import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowUpIcon,
  BoldIcon,
  CopyIcon,
  ItalicIcon,
  SearchIcon,
  UnderlineIcon,
} from "lucide-react";
import { useState, type FC } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Section } from "../Section";

const CITIES = [
  "Amsterdam",
  "Bangkok",
  "Chiang Mai",
  "Lisbon",
  "Oslo",
  "Seoul",
  "Tokyo",
  "Vancouver",
];

const TOPICS = ["Design", "Engineering", "Research", "Writing", "การตลาด"];

const DAY_MS = 86_400_000;

export const CheckboxDemo: FC = () => (
  <Section id="checkbox" title="Checkbox" note="Filled tint when checked.">
    <div className="grid gap-3">
      <Label>
        <Checkbox defaultChecked /> Email me a weekly summary
      </Label>
      <Label>
        <Checkbox /> แจ้งเตือนเมื่อมีความคิดเห็นใหม่
      </Label>
      <Label>
        <Checkbox aria-invalid /> Accept the terms
      </Label>
      <Label>
        <Checkbox disabled defaultChecked /> Locked by admin
      </Label>
    </div>
  </Section>
);

export const RadioGroupDemo: FC = () => (
  <Section id="radio-group" title="Radio group" note="One choice from a set.">
    <RadioGroup defaultValue="week" className="w-fit">
      <Label>
        <RadioGroupItem value="day" /> Daily
      </Label>
      <Label>
        <RadioGroupItem value="week" /> Weekly
      </Label>
      <Label>
        <RadioGroupItem value="month" /> รายเดือน
      </Label>
      <Label>
        <RadioGroupItem value="never" disabled /> Never (unavailable)
      </Label>
    </RadioGroup>
  </Section>
);

export const SliderDemo: FC = () => (
  <Section id="slider" title="Slider" note="White capsule thumb, tinted fill.">
    <div className="grid w-full max-w-sm gap-6">
      <Slider defaultValue={[60]} aria-label="Volume" />
      <Slider defaultValue={[20, 75]} aria-label="Price range" />
      <Slider defaultValue={[40]} disabled aria-label="Brightness" />
    </div>
  </Section>
);

export const ToggleDemo: FC = () => (
  <Section id="toggle" title="Toggle" note="Pressed lifts like a segment.">
    <Toggle aria-label="Bold" defaultPressed>
      <BoldIcon />
    </Toggle>
    <Toggle aria-label="Italic">
      <ItalicIcon />
    </Toggle>
    <Toggle variant="outline" defaultPressed>
      <UnderlineIcon data-icon="inline-start" /> Underline
    </Toggle>
    <Toggle size="sm">Small</Toggle>
    <Toggle disabled>Disabled</Toggle>
  </Section>
);

export const ToggleGroupDemo: FC = () => (
  <Section
    id="toggle-group"
    title="Toggle group"
    note="spacing 0 joins items into a segmented track."
  >
    <ToggleGroup spacing={0} defaultValue={["left"]} aria-label="Alignment">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup multiple defaultValue={["bold"]} aria-label="Text style">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  </Section>
);

export const InputGroupDemo: FC = () => (
  <Section
    id="input-group"
    title="Input group"
    note="One filled field holding addons and buttons."
  >
    <div className="grid w-full max-w-sm gap-3">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search files" aria-label="Search files" />
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          defaultValue="example.com/share"
          aria-label="Share link"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy link">
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          aria-invalid
          defaultValue="not-an-email"
          aria-label="Email"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@mail</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="เขียนข้อความ… / Write a message…" />
        <InputGroupAddon align="block-end">
          <InputGroupText>0 / 280</InputGroupText>
          <InputGroupButton
            variant="default"
            size="icon-xs"
            className="ml-auto"
            aria-label="Send"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          disabled
          placeholder="Disabled"
          aria-label="Disabled field"
        />
      </InputGroup>
    </div>
  </Section>
);

export const InputOTPDemo: FC = () => {
  // input-otp keeps its own value; a defaultValue reaches the <input> as well and React warns
  const [code, setCode] = useState("314");
  return (
    <Section id="input-otp" title="Input OTP" note="Separate filled cells.">
      <div className="grid justify-items-center gap-4">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
          aria-label="Verification code"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <InputOTP maxLength={4} disabled aria-label="PIN (disabled)">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </Section>
  );
};

export const FieldDemo: FC = () => (
  <Section
    id="field"
    title="Field"
    note="Label, control, help and error in one rhythm."
  >
    <div className="grid w-full max-w-md gap-8">
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="field-name">Display name</FieldLabel>
            <Input id="field-name" placeholder="ชื่อที่แสดง" />
            <FieldDescription>
              Shown on comments and shared files.
            </FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="field-email">Email</FieldLabel>
            <Input id="field-email" aria-invalid defaultValue="hello@" />
            <FieldError>Enter a complete email address.</FieldError>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Plan</FieldLegend>
        <RadioGroup defaultValue="team">
          <FieldLabel>
            <Field orientation="horizontal">
              <RadioGroupItem value="personal" />
              <FieldContent>
                <FieldTitle>Personal</FieldTitle>
                <FieldDescription>
                  For one person and a few projects.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel>
            <Field orientation="horizontal">
              <RadioGroupItem value="team" />
              <FieldContent>
                <FieldTitle>Team</FieldTitle>
                <FieldDescription>
                  แชร์พื้นที่ทำงานกับทีม พร้อมสิทธิ์แยกตามบทบาท
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </RadioGroup>
      </FieldSet>
    </div>
  </Section>
);

export const NativeSelectDemo: FC = () => (
  <Section
    id="native-select"
    title="Native select"
    note="The platform picker in a filled field."
  >
    <NativeSelect defaultValue="th" aria-label="Language">
      <NativeSelectOption value="en">English</NativeSelectOption>
      <NativeSelectOption value="th">ภาษาไทย</NativeSelectOption>
      <NativeSelectOption value="ja">日本語</NativeSelectOption>
    </NativeSelect>
    <NativeSelect size="sm" aria-label="Size" aria-invalid>
      <NativeSelectOption value="">Choose a size</NativeSelectOption>
      <NativeSelectOption value="s">Small</NativeSelectOption>
    </NativeSelect>
    <NativeSelect disabled aria-label="Region">
      <NativeSelectOption>Disabled</NativeSelectOption>
    </NativeSelect>
  </Section>
);

const ChipsCombobox: FC = () => {
  const anchor = useComboboxAnchor();
  return (
    <Combobox
      multiple
      autoHighlight
      items={TOPICS}
      defaultValue={["Design", "Research"]}
    >
      <ComboboxChips ref={anchor} className="w-full max-w-sm">
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map(value => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Add topic" />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No topics found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export const ComboboxDemo: FC = () => (
  <Section
    id="combobox"
    title="Combobox"
    note="Type to filter; the list floats on thick glass."
  >
    <Combobox autoHighlight items={CITIES}>
      <ComboboxInput placeholder="Pick a city" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No cities match.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <ChipsCombobox />
    <Combobox items={CITIES} disabled>
      <ComboboxInput placeholder="Disabled" disabled />
    </Combobox>
  </Section>
);

export const CalendarDemo: FC = () => {
  const [day, setDay] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const now = Date.now();
    return { from: new Date(now + 2 * DAY_MS), to: new Date(now + 6 * DAY_MS) };
  });
  return (
    <Section
      id="calendar"
      title="Calendar"
      note="Today in accent, selection in solid tint."
    >
      <Calendar mode="single" selected={day} onSelect={setDay} />
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        labels={{ labelNav: () => "Range calendar navigation" }}
      />
    </Section>
  );
};

export const KbdDemo: FC = () => (
  <Section id="kbd" title="Kbd" note="Small chips for shortcuts.">
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span className="text-[0.8125rem] text-muted-foreground">+</span>
      <Kbd>Shift</Kbd>
      <span className="text-[0.8125rem] text-muted-foreground">+</span>
      <Kbd>P</Kbd>
    </KbdGroup>
    <Kbd>Esc</Kbd>
  </Section>
);
