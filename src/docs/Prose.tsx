import { cn } from "cn";
import type { ComponentProps, FC, ReactNode } from "react";

export const PageTitle: FC<{ title: string; lead: string }> = ({
  title,
  lead,
}) => (
  <header className="pt-6 pb-8 md:pt-12">
    <h1 className="font-heading text-[2rem] leading-tight font-bold tracking-[-0.03em] text-balance">
      {title}
    </h1>
    <p className="mt-2 max-w-2xl text-[0.9375rem] text-pretty text-muted-foreground">
      {lead}
    </p>
  </header>
);

export const H2: FC<ComponentProps<"h2">> = ({ className, ...props }) => (
  <h2
    className={cn(
      "mt-12 mb-3 scroll-mt-24 font-heading text-xl font-semibold tracking-[-0.02em] [header+&]:mt-0",
      className
    )}
    {...props}
  />
);

export const P: FC<ComponentProps<"p">> = ({ className, ...props }) => (
  <p
    className={cn(
      "my-3 max-w-2xl text-[0.9375rem] leading-relaxed text-foreground/85",
      className
    )}
    {...props}
  />
);

export const C: FC<ComponentProps<"code">> = ({ className, ...props }) => (
  <code
    className={cn(
      "rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.8125rem] whitespace-nowrap text-foreground",
      className
    )}
    {...props}
  />
);

export const LINK =
  "font-medium text-accent-foreground underline decoration-accent-foreground/30 underline-offset-4 hover:decoration-accent-foreground";

export const A: FC<ComponentProps<"a">> = ({ className, ...props }) => (
  <a className={cn(LINK, className)} {...props} />
);

export const UL: FC<ComponentProps<"ul">> = ({ className, ...props }) => (
  <ul
    className={cn(
      "my-3 grid max-w-2xl list-disc gap-1.5 pl-5 text-[0.9375rem] leading-relaxed text-foreground/85 marker:text-muted-foreground",
      className
    )}
    {...props}
  />
);

export const Table: FC<{
  head: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}> = ({ head, rows }) => (
  <div className="my-4 max-w-2xl overflow-x-auto rounded-2xl border bg-card">
    <table className="w-full text-left text-[0.875rem]">
      <thead className="text-xs text-muted-foreground">
        <tr>
          {head.map(cell => (
            <th key={cell} className="px-4 py-2.5 font-medium">
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t align-top">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2.5">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
