import type { FC, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

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

type TokenProps = { children?: ReactNode; className?: string };

// shiki gives every word and every space its own span; a command should wrap
// at the spaces only, never inside NTCHz/glass-ui at the hyphen
const keepWordsWhole = (line: ReactNode) =>
  Array.isArray(line)
    ? line.map(token => {
        if (!isValidElement<TokenProps>(token)) return token;
        const text = token.props.children;
        if (typeof text === "string" && !text.trim()) return text;
        return cloneElement(token, {
          className: `${token.props.className ?? ""} whitespace-nowrap`,
        });
      })
    : line;

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
  const wrap = language === "bash";
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
      <CodeBlockContent className="max-h-[32rem]" wrap={wrap}>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>
            {wrap ? keepWordsWhole(line) : line}
          </CodeBlockLine>
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
  <Tabs defaultValue="pnpm" className="gap-3">
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
