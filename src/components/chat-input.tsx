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
      className="border rounded-xl relative min-h-28 max-h-42 max-w-3xl mx-auto"
    >
      <Textarea
        placeholder={placeholder}
        className="bg-neutral border-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus-visible:ring-0 placeholder:text-lg placeholder:leading-none p-3 min-h-14 max-h-28 overflow-y-auto"
        autoFocus
      />

      <div className="">
        <Tooltip>
          <TooltipTrigger className="">
            <span className="absolute left-3 h-9 w-9 flex items-center justify-center bottom-2 text-muted-foreground">
              <MinusIcon size={24} />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>No file insertion is allowed.</p>
          </TooltipContent>
        </Tooltip>

        <Button
          type="submit"
          className="absolute right-4 h-9 w-9 text-xl rounded-full bottom-2"
        >
          <ArrowUp size={32} className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
