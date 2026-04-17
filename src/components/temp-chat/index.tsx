import { useState } from "react";
import ChatInput from "../chat-input";
import { useSSEStream } from "@/hooks/useSSEStream";
import { baseURL } from "@/lib/axios";
import { useAnimatedText } from "@/hooks/useAnimatedText";
import StreamingMarkdown from "@/hooks/StreamingMarkdown";

const TempChat = () => {
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState<
    {
      role: "user" | "assistant";
      content: string;
    }[]
  >([]);

  const { text, isStreaming, error, start } = useSSEStream({
    url: baseURL + "/chat/temporary-chat",
    onDone: (fullText) => {
      // Commit the completed response to persisted state
      setChats((prev) => [...prev, { role: "assistant", content: fullText }]);
    },
    onError: (err) => console.error("Stream error:", err),
  });

  const displayedText = useAnimatedText(text);

  const handleSend = async () => {
    // ✅ Guard BEFORE mutating state
    if (!prompt.trim() || isStreaming) return;

    const userMessage = prompt;
    setChats((prev) => [...prev, { role: "user", content: userMessage }]);
    setPrompt("");
    await start({ prompt: userMessage });
  };

  return (
    <div
      className={`flex w-full max-w-3xl flex-1 flex-col gap-4 py-5 ${chats.length === 0 ? "min-h-full justify-center" : "h-full"} `}
    >
      {/* ✅ Completed messages only */}
      {chats.map((chat, idx) =>
        chat.role === "user" ? (
          // ✅ Added return (arrow fn implicit return via ternary)
          <div
            key={idx}
            className="max-w-2xl grow self-end px-4 pb-5 text-right"
          >
            <p className="bg-muted rounded-lg px-4 py-2 text-right text-lg">
              {chat.content}
            </p>
          </div>
        ) : (
          <div key={idx} className="mb-5 max-w-3xl px-4 text-left">
            <StreamingMarkdown text={chat.content} isStreaming={false} />
          </div>
        ),
      )}

      {/* ✅ Live stream shown separately, outside the map */}
      {isStreaming && (
        <div className="max-w-3xl px-4 pb-24">
          <StreamingMarkdown text={displayedText} isStreaming={true} />
        </div>
      )}

      {error && (
        <p className="text-destructive max-w-3xl px-4">
          Error: {error.message}
        </p>
      )}

      <div
        className={`${chats.length > 0 ? "fixed" : ""} bg-background bottom-0 mx-auto w-full max-w-3xl px-4 pt-4 pb-5`}
      >
        <ChatInput
          onChange={(message) => setPrompt(message)}
          value={prompt}
          onSubmit={handleSend}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
};

export default TempChat;
