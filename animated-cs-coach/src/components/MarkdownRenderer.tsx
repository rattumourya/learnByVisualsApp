interface MarkdownRendererProps {
  markdown: string;
}

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none dark:prose-invert" aria-live="polite">
      {markdown.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}
