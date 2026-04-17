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
};

const ChatInput = ({
  placeholder = "Ask anything..",
  onChange,
  value = "",
  onSubmit,
}: Props) => {
  const [inputHeight, setInputHeight] = useState(0);
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      console.log("Enter key pressed");
      onSubmit();
    }
  };

  return (
    <form
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      className={`border flex items-center ${inputHeight < 60 ? "rounded-full flex-row" : "rounded-lg flex-col"} min-h-14 max-h-40 max-w-3xl mx-auto`}
    >
      <Textarea
        placeholder={placeholder}
        className={`bg-neutral border-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus-visible:ring-0 text-lg ml-2 placeholder:text-lg placeholder:leading-none p-3 ${inputHeight < 60 ? "min-h-11" : "min-h-20"} max-h-36 overflow-y-auto`}
        autoFocus
        onChange={(e) => {
          onChange(e.target.value);
          setInputHeight(e.target.scrollHeight);
          console.log("client height", e.target.clientHeight);
          console.log("scroll height", e.target.scrollHeight);
          console.log("offset height", e.target.offsetHeight);
        }}
        value={value}
      />

      <div className={`pr-3 ml-3 ${inputHeight > 60 && "self-end mb-2"}`}>
        <Tooltip>
          <TooltipTrigger>
            <span className="bg-primary text-primary-foreground flex items-center justify-center right-4 h-9 w-9 text-xl rounded-full">
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
