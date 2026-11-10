import type { FC, ReactNode } from "react";
import { createContext, createElement, useContext } from "react";

export type SectionProps = {
  id: string;
  title: string;
  note: string;
  children: ReactNode;
};

// A docs page swaps the layout so each demo keeps owning its title and note.
// The layout is a module-level component, so createElement keeps its identity stable.
export const SectionLayout = createContext<FC<SectionProps> | null>(null);

export const Section: FC<SectionProps> = props => {
  const Layout = useContext(SectionLayout);
  if (Layout) return createElement(Layout, props);
  const { id, title, note, children } = props;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="grid scroll-mt-36 gap-4 border-t py-10 first:border-t-0 lg:grid-cols-[13rem_minmax(0,1fr)]"
    >
      <div>
        <h2
          id={`${id}-title`}
          className="text-[0.9375rem] font-semibold tracking-[-0.01em]"
        >
          {title}
        </h2>
        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{note}</p>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {children}
      </div>
    </section>
  );
};
