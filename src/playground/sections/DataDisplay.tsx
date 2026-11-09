import { InboxIcon } from "lucide-react";
import type { FC } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Section } from "../Section";

const INVOICES = [
  { id: "INV-1024", customer: "Acme Co.", status: "Paid", amount: "฿12,400" },
  {
    id: "INV-1025",
    customer: "บริษัท ตัวอย่าง จำกัด",
    status: "Pending",
    amount: "฿8,950",
  },
  { id: "INV-1026", customer: "Globex", status: "Overdue", amount: "฿21,300" },
] as const;

const STATUS_VARIANT = {
  Paid: "success",
  Pending: "warning",
  Overdue: "destructive",
} as const;

const SERIES = [
  { month: "Jan", a: 32, b: 24 },
  { month: "Feb", a: 28, b: 30 },
  { month: "Mar", a: 36, b: 29 },
  { month: "Apr", a: 33, b: 35 },
  { month: "May", a: 41, b: 38 },
  { month: "Jun", a: 38, b: 46 },
];

const chartConfig = {
  a: { label: "Series A", color: "var(--chart-2)" },
  b: { label: "Series B", color: "var(--chart-1)" },
} satisfies ChartConfig;

export const Cards: FC = () => (
  <Section id="card" title="Card" note="Content layer: opaque, hairline.">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Supporting description text.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Label</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        Body content sits on solid paper so it stays legible under any
        background.
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  </Section>
);

export const Tables: FC = () => (
  <Section id="table" title="Table" note="Tabular numerals, quiet header.">
    <Card className="w-full gap-0 py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVOICES.map(row => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
              </TableCell>
              <TableCell className="text-right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </Section>
);

export const Charts: FC = () => (
  <Section id="chart" title="Chart" note="Recharts with a glass tooltip.">
    <Card className="w-full">
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full"
        >
          <AreaChart data={SERIES} margin={{ left: 4, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="fill-b" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-b)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-b)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              width={28}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="a"
              type="monotone"
              stroke="var(--color-a)"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="transparent"
            />
            <Area
              dataKey="b"
              type="monotone"
              stroke="var(--color-b)"
              strokeWidth={2.25}
              fill="url(#fill-b)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  </Section>
);

export const People: FC = () => (
  <Section
    id="avatar"
    title="Avatar · Skeleton"
    note="Initials work in Thai too."
  >
    <AvatarGroup>
      {["AB", "CD", "กข", "EF"].map(i => (
        <Avatar key={i}>
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
    <Avatar size="lg">
      <AvatarFallback>คง</AvatarFallback>
    </Avatar>
    <Separator orientation="vertical" className="h-8" />
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  </Section>
);

export const Empties: FC = () => (
  <Section id="empty" title="Empty" note="Every list needs one.">
    <Empty className="border border-dashed bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No items yet</EmptyTitle>
        <EmptyDescription>Items you create will appear here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create item</Button>
      </EmptyContent>
    </Empty>
  </Section>
);
