"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, MinusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  placeholder?: string;
};

const ChatInput = ({ placeholder = "Ask anything.." }: Props) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      console.log("Enter key pressed");
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="border rounded-xl min-h-28 max-h-42 max-w-3xl mx-auto"
    >
      <Textarea
        placeholder={placeholder}
        className="bg-neutral border-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus-visible:ring-0 placeholder:text-lg placeholder:leading-none p-3 min-h-20 max-h-36 overflow-y-auto"
        autoFocus
      />

      <div className="flex justify-between pr-3 pb-2">
        <Tooltip>
          <TooltipTrigger className="pl-2 ">
            <span className="h-9 w-9 flex items-center justify-center text-muted-foreground">
              <MinusIcon size={24} />
            </span>
          </TooltipTrigger>

          <TooltipContent className="relative">
            <p className="text-sm">No file insertion is allowed. 😆 </p>
          </TooltipContent>
        </Tooltip>

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
    </div>
  );
};

export default ChatInput;
