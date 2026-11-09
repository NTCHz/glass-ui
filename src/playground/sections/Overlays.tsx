import {
  CalendarIcon,
  ChevronDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import type { FC } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Section } from "../Section";

export const Overlays: FC = () => (
  <Section
    id="overlays"
    title="Menu · Popover · Dialog · Tooltip · Toast"
    note="Overlays use glass-thick for readable text."
  >
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="glass" />}>
        Account
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Popover>
      <PopoverTrigger render={<Button variant="glass" />}>
        <CalendarIcon data-icon="inline-start" />
        Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover title</PopoverTitle>
          <PopoverDescription>Short supporting text.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>

    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this item?</DialogTitle>
          <DialogDescription>
            This removes it permanently. You can’t undo this.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button className="bg-destructive" />}>
            Delete
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" />}>
        Hover me
      </TooltipTrigger>
      <TooltipContent>Tooltip on glass</TooltipContent>
    </Tooltip>

    <Button
      variant="secondary"
      onClick={() =>
        toast.success("Saved", { description: "Your changes are live." })
      }
    >
      Show toast
    </Button>
  </Section>
);
