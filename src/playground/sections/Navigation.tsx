import {
  CalendarIcon,
  FileTextIcon,
  FolderIcon,
  SettingsIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { type FC, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast, Toaster } from "@/components/ui/toast";

import { Section } from "../Section";

const SHEET_SIDES = ["right", "left", "top", "bottom"] as const;

const GUIDES = [
  {
    title: "Getting started",
    text: "Install the kit and add a first component.",
  },
  { title: "Theming", text: "ปรับสีและวัสดุให้เข้ากับแบรนด์" },
  { title: "Accessibility", text: "Contrast, focus and reduced motion." },
];

export const AlertDialogSection: FC = () => (
  <Section
    id="alert-dialog"
    title="Alert dialog"
    note="Asks before a destructive action. Same glass panel as Dialog."
  >
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/12 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            All files will be removed. ลบแล้วกู้คืนไม่ได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Small
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>
            Unsaved edits will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid">
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Section>
);

export const SheetSection: FC = () => (
  <Section
    id="sheet"
    title="Sheet"
    note="Floating panel inset from the screen edge."
  >
    {SHEET_SIDES.map(side => (
      <Sheet key={side}>
        <SheetTrigger render={<Button variant="outline" />}>
          <span className="capitalize">{side}</span>
        </SheetTrigger>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Changes apply when you press Save. บันทึกเมื่อกด Save
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-5">
            <div className="grid gap-1.5">
              <Label htmlFor={`sheet-name-${side}`}>Name</Label>
              <Input id={`sheet-name-${side}`} defaultValue="Alex Morgan" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`sheet-user-${side}`}>Username</Label>
              <Input id={`sheet-user-${side}`} defaultValue="@alex" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`sheet-city-${side}`}>เมือง</Label>
              <Input id={`sheet-city-${side}`} placeholder="กรุงเทพฯ" />
            </div>
          </div>
          <SheetFooter className="flex-row justify-end">
            <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
            <SheetClose render={<Button />}>Save</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ))}
  </Section>
);

export const DrawerSection: FC = () => (
  <Section
    id="drawer"
    title="Drawer"
    note="Swipe to dismiss. The capsule handle shows it can move."
  >
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>
        Bottom drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share file</DrawerTitle>
          <DrawerDescription>
            Anyone with the link can view. ทุกคนที่มีลิงก์ดูได้
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-4">
          <Button>Copy link</Button>
          <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    <Drawer swipeDirection="right" showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>
        Side drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Narrow the list by date or owner.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-4">
          <DrawerClose render={<Button />}>Apply</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </Section>
);

export const HoverCardSection: FC = () => (
  <Section
    id="hover-card"
    title="Hover card"
    note="Preview on hover or focus, without leaving the page."
  >
    <HoverCard>
      <HoverCardTrigger
        href="#hover-card"
        className="rounded-md text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
      >
        @design-team
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
            <UserIcon className="size-5 text-muted-foreground" />
          </span>
          <div className="grid gap-1">
            <p className="font-heading font-semibold tracking-[-0.01em]">
              Design team
            </p>
            <p className="text-[0.8125rem] leading-snug text-muted-foreground">
              Shared space for layouts and reviews. ทีมออกแบบ
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarIcon className="size-3.5" />
              Joined March 2024
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </Section>
);

export const ContextMenuSection: FC = () => (
  <Section
    id="context-menu"
    title="Context menu"
    note="Right-click (or long-press) the area."
  >
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-2xl border border-dashed text-[0.8125rem] text-muted-foreground">
        Right-click here · คลิกขวาที่นี่
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuLabel inset>File</ContextMenuLabel>
          <ContextMenuItem>
            <FileTextIcon />
            Open
            <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <FolderIcon />
              Move to
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Documents</ContextMenuItem>
              <ContextMenuItem>Archive</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem inset disabled>
            Rename
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem defaultChecked>
          Show preview
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2Icon />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </Section>
);

export const MenubarSection: FC = () => (
  <Section
    id="menubar"
    title="Menubar"
    note="A glass capsule bar of app menus."
  >
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New window
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>Recent</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Close all</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem defaultChecked>Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Status bar</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel inset>Density</MenubarLabel>
            <MenubarRadioGroup defaultValue="comfortable">
              <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
              <MenubarRadioItem value="comfortable">
                Comfortable
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>คู่มือการใช้งาน</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Section>
);

export const NavigationMenuSection: FC = () => (
  <Section
    id="navigation-menu"
    title="Navigation menu"
    note="Site navigation with rich dropdown panels."
  >
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Guides</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-0.5">
              {GUIDES.map(g => (
                <li key={g.title}>
                  <NavigationMenuLink href="#navigation-menu">
                    <span className="font-medium">{g.title}</span>
                    <span className="text-[0.8125rem] leading-snug text-muted-foreground">
                      {g.text}
                    </span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#navigation-menu" active>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#navigation-menu">Blog</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </Section>
);

const CommandItems: FC = () => (
  <>
    <CommandEmpty>No results · ไม่พบผลลัพธ์</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>
        <CalendarIcon />
        Calendar
      </CommandItem>
      <CommandItem>
        <UserIcon />
        Profile
        <CommandShortcut>⌘P</CommandShortcut>
      </CommandItem>
      <CommandItem disabled>
        <FolderIcon />
        Archive
      </CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>
        <SettingsIcon />
        Preferences
        <CommandShortcut>⌘,</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </>
);

export const CommandSection: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Section
      id="command"
      title="Command"
      note="Search-first palette. Type to filter; no match shows the empty state."
    >
      <Command className="h-auto w-full max-w-sm">
        <CommandInput placeholder="Search commands…" />
        <CommandList>
          <CommandItems />
        </CommandList>
      </Command>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="ค้นหาคำสั่ง…" />
          <CommandList>
            <CommandItems />
          </CommandList>
        </Command>
      </CommandDialog>
    </Section>
  );
};

export const ToastSection: FC = () => (
  <Section
    id="toast"
    title="Toast"
    note="Brief glass notices that stack at the corner."
  >
    <Toaster>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Changes saved",
            description: "บันทึกการเปลี่ยนแปลงแล้ว",
            type: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Upload failed",
            description: "Check your connection and try again.",
            type: "error",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "File moved to Archive",
            actionProps: { children: "Undo" },
          })
        }
      >
        With action
      </Button>
    </Toaster>
  </Section>
);

export const BreadcrumbSection: FC = () => (
  <Section
    id="breadcrumb"
    title="Breadcrumb"
    note="Where the page sits in the hierarchy."
  >
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#breadcrumb">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#breadcrumb">เอกสาร</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Report draft</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </Section>
);

export const PaginationSection: FC = () => (
  <Section
    id="pagination"
    title="Pagination"
    note="Capsule links. The current page lifts like a selected tab."
  >
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#pagination" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagination">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagination" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagination">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#pagination" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </Section>
);
