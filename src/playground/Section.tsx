import type { FC, ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  note: string;
  children: ReactNode;
};

export const Section: FC<SectionProps> = ({ id, title, note, children }) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="grid scroll-mt-32 gap-4 border-t py-10 first:border-t-0 lg:grid-cols-[13rem_minmax(0,1fr)]"
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
    <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
  </section>
);
