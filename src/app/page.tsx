"use client";

import TempChat from "@/components/temp-chat";
import { useTempChat } from "@/hooks/useTempChat";

export default function Home() {
  const { mutate } = useTempChat();

  return (
    <div className="px-5 py-5 flex h-screen justify-center items-center">
      <TempChat />
    </div>
  );
}
