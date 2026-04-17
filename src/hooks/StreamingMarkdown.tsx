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
    <div className="prose prose-sm dark:prose-invert max-w-none text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Code blocks
          code({ className, children, ...props }) {
            const isBlock = className?.includes("language-");
            return isBlock ? (
              <div className="relative group">
                <pre className="rounded-lg overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
                <CopyButton text={String(children)} />
              </div>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Tables
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="border-collapse w-full text-sm">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-border px-3 py-2 bg-muted text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-border px-3 py-2">{children}</td>
            );
          },
        }}
      >
        {/* Append cursor character while streaming */}
        {isStreaming ? text + "​" : text}
      </ReactMarkdown>

      {/* Blinking cursor rendered outside markdown */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-foreground ml-0.5 animate-pulse rounded-sm" />
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
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-muted 
                 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
