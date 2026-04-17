"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  placeholder?: string;
  value: string;
  onChange: (message: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
};

const ChatInput = ({
  placeholder = "Ask anything..",
  onChange,
  value = "",
  onSubmit,
  isStreaming,
}: Props) => {
  const [inputHeight, setInputHeight] = useState(0);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
    setInputHeight(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      console.log("Enter key pressed");
      onSubmit();
      setInputHeight(0);
    }
  };

  return (
    <form
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      className={`flex items-center border ${inputHeight < 60 ? "flex-row rounded-full" : "flex-col rounded-lg"} mx-auto max-h-40 min-h-14 max-w-3xl ${value.length > 100 ? "border-destructive" : ""}`}
    >
      <Textarea
        autoFocus
        placeholder={placeholder}
        className={`bg-neutral ml-2 border-none p-3 text-lg placeholder:pt-0.5 placeholder:text-lg placeholder:leading-none focus:border-none focus:shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 md:text-lg ${inputHeight < 60 ? "min-h-11" : "min-h-20"} max-h-36 overflow-y-auto`}
        onChange={(e) => {
          onChange(e.target.value);
          setInputHeight(e.target.scrollHeight);
        }}
        value={value}
      />

      <div className={`ml-3 pr-3 ${inputHeight > 60 && "mb-2 self-end"}`}>
        {value.length > 100 && (
          <span className="text-destructive pr-5">Message is too long</span>
        )}

        <Tooltip>
          <TooltipTrigger disabled={isStreaming}>
            <span className="bg-primary text-primary-foreground right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl">
              <ArrowUp size={24} className="h-6 w-6" />
            </span>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p className="text-sm">
              Send Prompt. <kbd>↵</kbd>
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </form>
  );
};

export default ChatInput;
