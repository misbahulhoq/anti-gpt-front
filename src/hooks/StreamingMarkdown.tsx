import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useState } from "react";

interface Props {
  text: string;
  isStreaming: boolean;
}

export default function StreamingMarkdown({ text, isStreaming }: Props) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Code blocks
          code({ className, children, ...props }) {
            const isBlock = className?.includes("language-");
            return isBlock ? (
              <div className="group relative">
                <pre className="overflow-x-auto rounded-lg">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
                <CopyButton text={String(children)} />
              </div>
            ) : (
              <code
                className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Tables
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-border bg-muted border px-3 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-border border px-3 py-2">{children}</td>
            );
          },
        }}
      >
        {/* Append cursor character while streaming */}
        {isStreaming ? text + "​" : text}
      </ReactMarkdown>

      {/* Blinking cursor rendered outside markdown */}
      {isStreaming && (
        <span className="bg-foreground ml-0.5 inline-block h-3 w-3 animate-pulse rounded-full" />
      )}
    </div>
  );
}

// Copy button for code blocks
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-muted absolute top-2 right-2 rounded px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
