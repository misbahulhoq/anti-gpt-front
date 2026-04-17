import { useState, useRef, useCallback } from "react";

interface UseSSEStreamOptions {
  url: string;
  body?: Record<string, unknown>;
  onChunk?: (chunk: string) => void;
  onDone?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

interface UseSSEStreamReturn {
  text: string;
  isStreaming: boolean;
  error: Error | null;
  start: (overrideBody?: Record<string, unknown>) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export function useSSEStream({
  url,
  body,
  onChunk,
  onDone,
  onError,
}: UseSSEStreamOptions): UseSSEStreamReturn {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setText("");
    setError(null);
  }, [stop]);

  const start = useCallback(
    async (overrideBody?: Record<string, unknown>) => {
      // Abort any ongoing stream
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setText("");
      setError(null);
      setIsStreaming(true);

      let fullText = "";

      const appendToken = (token: string) => {
        fullText += token;
        setText((prev) => prev + token);
        onChunk?.(token);
      };

      const processSSEPart = (part: string) => {
        const lines = part.split("\n");
        const dataLines: string[] = [];

        for (const line of lines) {
          if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).replace(/^\s/, ""));
          }
        }

        if (dataLines.length === 0) return false;

        const data = dataLines.join("\n");
        if (!data) return false;

        if (data === "[DONE]") {
          onDone?.(fullText);
          return true;
        }

        try {
          const parsed = JSON.parse(data) as {
            token?: string;
            content?: string;
            text?: string;
            done?: boolean;
          };

          if (parsed.done) {
            onDone?.(fullText);
            return true;
          }

          const token = parsed.token ?? parsed.content ?? parsed.text;
          if (!token) return false;

          appendToken(token);
          return false;
        } catch {
          appendToken(data);
          return false;
        }
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify(overrideBody ?? body),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status} ${response.statusText}`,
          );
        }

        if (!response.body) {
          throw new Error("Response body is empty");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode and buffer the incoming bytes
          buffer += decoder.decode(value, { stream: true });

          // SSE messages are separated by double newlines
          const parts = buffer.split("\n\n");

          // The last part may be incomplete — keep it in the buffer
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const isDone = processSSEPart(part);
            if (isDone) {
              return;
            }
          }
        }

        if (buffer.trim()) {
          processSSEPart(buffer);
        }

        onDone?.(fullText);
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // intentional stop
        const error = err instanceof Error ? err : new Error("Stream failed");
        setError(error);
        onError?.(error);
      } finally {
        setIsStreaming(false);
      }
    },
    [url, body, onChunk, onDone, onError],
  );

  return { text, isStreaming, error, start, stop, reset };
}
