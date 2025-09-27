import type { ReactNode } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  children?: ReactNode;
}

export function CodeBlock({ code, language = 'typescript', children }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed">
      <code className={`language-${language}`}>{children ?? code}</code>
    </pre>
  );
}
