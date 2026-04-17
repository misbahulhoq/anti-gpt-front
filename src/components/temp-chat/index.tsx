import React, { useState } from "react";
import ChatInput from "../chat-input";
import { useSSEStream } from "@/hooks/useSSEStream";
import { baseURL } from "@/lib/axios";
import { useAnimatedText } from "@/hooks/useAnimatedText";
import StreamingMarkdown from "@/hooks/StreamingMarkdown";

const TempChat = () => {
  const [prompt, setPrompt] = useState("");

  const { text, isStreaming, error, start, stop, reset } = useSSEStream({
    url: baseURL + "/chat/temporary-chat",
    onDone: (fullText) => console.log("Stream complete:", fullText),
    onError: (err) => console.error("Stream error:", err),
  });
  const displayedText = useAnimatedText(text);

  const handleSend = async () => {
    setPrompt("");
    if (!prompt.trim() || isStreaming) return;
    await start({ prompt }); // pass body at call time
  };

  return (
    <div className="w-full flex flex-col gap-4 justify-center py-5">
      <div className="max-w-3xl mx-auto pb-24">
        {/* Output */}
        <div className="p-4 rounded-lg text-sm whitespace-pre-wrap">
          <StreamingMarkdown text={displayedText} isStreaming={isStreaming} />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive">Error: {error.message}</p>
        )}
      </div>

      <div className="fixed bottom-0 pb-5 w-full bg-background pt-4">
        <ChatInput
          onChange={(message) => setPrompt(message)}
          value={prompt}
          onSubmit={handleSend}
        />
      </div>
    </div>
  );
};

export default TempChat;
