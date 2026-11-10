import type { FC, ReactNode } from "react";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";

type CodeProps = {
  code: string;
  language?: string;
  title?: ReactNode;
  className?: string;
};

export const Code: FC<CodeProps> = ({
  code,
  language = "tsx",
  title,
  className,
}) => {
  const lines = useHighlightedCode(code, language);
  return (
    <CodeBlock className={className}>
      {title ? (
        <CodeBlockHeader>
          <CodeBlockTitle>{title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
      ) : (
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      )}
      <CodeBlockContent className="max-h-[32rem]" wrap={language === "bash"}>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  );
};

const RUNNERS = [
  { id: "pnpm", run: "pnpx" },
  { id: "npm", run: "npx" },
  { id: "bun", run: "bunx" },
] as const;

export const CommandTabs: FC<{ args: string }> = ({ args }) => (
  <Tabs defaultValue="pnpm" className="gap-2">
    <TabsList variant="line">
      {RUNNERS.map(({ id }) => (
        <TabsTrigger key={id} value={id}>
          {id}
        </TabsTrigger>
      ))}
    </TabsList>
    {RUNNERS.map(({ id, run }) => (
      <TabsContent key={id} value={id}>
        <Code code={`${run} shadcn@latest ${args}`} language="bash" />
      </TabsContent>
    ))}
  </Tabs>
);
