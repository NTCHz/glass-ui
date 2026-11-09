import { MoonIcon, SunIcon } from "lucide-react";
import type { FC } from "react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MATERIALS = ["glass-thin", "glass", "glass-thick"] as const;

const ThemeToggle: FC = () => {
  const [dark, setDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Button
      variant="glass"
      size="icon-lg"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setDark(d => !d)}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

const App: FC = () => (
  <TooltipProvider>
    <div className="min-h-svh glass-backdrop text-foreground">
      <header className="sticky top-0 z-40 mx-auto flex max-w-5xl items-center justify-between px-4 pt-4">
        <nav
          aria-label="Main navigation"
          className="flex w-full items-center justify-between rounded-full glass py-2 pr-2 pl-5"
        >
          <span className="font-heading text-base font-semibold tracking-tight">
            glass-ui
          </span>
          <ThemeToggle />
        </nav>
      </header>

      <main className="mx-auto grid max-w-5xl gap-10 px-4 py-12">
        <section aria-labelledby="hero" className="grid gap-4">
          <Badge variant="glass">v0.1 · shadcn registry</Badge>
          <h1
            id="hero"
            className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Liquid glass,
            <br />
            copied into your repo.
          </h1>
          <p className="max-w-xl text-muted-foreground">
            <code className="rounded-md glass-thin px-1.5 py-0.5 text-foreground">
              npx shadcn add NTCHz/glass-ui/button
            </code>
          </p>
        </section>

        <section aria-labelledby="materials" className="grid gap-4">
          <h2
            id="materials"
            className="text-sm font-medium text-muted-foreground"
          >
            Materials
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {MATERIALS.map(m => (
              <div
                key={m}
                className={`${m} grid h-32 place-items-center rounded-3xl`}
              >
                <code className="text-sm">.{m}</code>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="components"
          className="grid gap-6 md:grid-cols-[1.4fr_1fr]"
        >
          <h2 id="components" className="sr-only">
            Components
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>Create account</CardTitle>
              <CardDescription>
                Inputs sit on the thin material.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="A few words" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="news">Product updates</Label>
                <Switch id="news" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button>Continue</Button>
            </CardFooter>
          </Card>

          <div className="grid content-start gap-6">
            <Tabs defaultValue="buttons">
              <TabsList>
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                <TabsTrigger value="overlays">Overlays</TabsTrigger>
              </TabsList>
              <TabsContent
                value="buttons"
                className="flex flex-wrap gap-2 pt-2"
              >
                <Button>Primary</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Delete</Button>
              </TabsContent>
              <TabsContent
                value="overlays"
                className="flex flex-wrap gap-2 pt-2"
              >
                <Dialog>
                  <DialogTrigger render={<Button variant="glass" />}>
                    Open dialog
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thick material</DialogTitle>
                      <DialogDescription>
                        Dialogs and menus use glass-thick so text stays
                        readable.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter showCloseButton />
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="glass" />}>
                    Menu
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger render={<Button variant="glass" />}>
                    Hover me
                  </TooltipTrigger>
                  <TooltipContent>Tooltip on glass</TooltipContent>
                </Tooltip>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="glass">Glass</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
        </section>
      </main>
    </div>
  </TooltipProvider>
);

export default App;
