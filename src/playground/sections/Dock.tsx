import {
  CalendarIcon,
  CameraIcon,
  CompassIcon,
  FolderIcon,
  MailIcon,
  MessageCircleIcon,
  MusicIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";
import type { FC } from "react";

import { Dock, DockItem, DockSeparator } from "@/components/ui/dock";
import { useIsMobile } from "@/hooks/use-mobile";

import { Section } from "../Section";
import { STRIPES } from "../tuner";

const APPS = [
  { label: "Finder", icon: FolderIcon, active: true },
  { label: "Safari", icon: CompassIcon, active: true },
  { label: "Mail", icon: MailIcon },
  { label: "Messages", icon: MessageCircleIcon, active: true },
  { label: "Music", icon: MusicIcon },
  { label: "Calendar", icon: CalendarIcon },
  { label: "Photo Booth", icon: CameraIcon },
  { label: "Settings", icon: SettingsIcon },
];

// a phone fits five 40px items; the full set needs about 520px
const PHONE_APPS = 5;

const DockDemo: FC = () => {
  const phone = useIsMobile();
  return (
    <div
      className={`grid h-64 w-full place-items-end justify-center overflow-hidden rounded-[28px] pb-4 glass-stage ${STRIPES}`}
    >
      <Dock aria-label="Apps" size={phone ? 40 : 48}>
        {(phone ? APPS.slice(0, PHONE_APPS) : APPS).map(
          ({ label, icon: Icon, active }) => (
            <DockItem key={label} label={label} active={active}>
              <Icon />
            </DockItem>
          )
        )}
        <DockSeparator />
        <DockItem label="Trash">
          <TrashIcon />
        </DockItem>
      </Dock>
    </div>
  );
};

export const DockSection: FC = () => (
  <Section
    id="dock"
    title="Dock"
    note="Items grow toward the pointer, like the macOS dock. Arrow keys move between items; magnification is off for touch and reduced motion."
  >
    <DockDemo />
  </Section>
);
