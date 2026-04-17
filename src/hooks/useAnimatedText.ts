// hooks/useAnimatedText.ts
import { useState, useEffect, useRef } from "react";

export function useAnimatedText(streamedText: string) {
  const [displayedText, setDisplayedText] = useState("");
  const queueRef = useRef<string[]>([]);
  const isAnimatingRef = useRef(false);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    // Only queue the NEW characters since last update
    const newChars = streamedText.slice(prevLengthRef.current).split("");
    prevLengthRef.current = streamedText.length;
    queueRef.current.push(...newChars);

    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    const flush = () => {
      if (queueRef.current.length === 0) {
        isAnimatingRef.current = false;
        return;
      }

      // Drain up to 3 chars per frame for speed balance
      const batch = queueRef.current.splice(0, 3).join("");
      setDisplayedText((prev) => prev + batch);
      requestAnimationFrame(flush);
    };

    requestAnimationFrame(flush);
  }, [streamedText]);

  // Instantly sync when streaming stops (no lag at the end)
  useEffect(() => {
    if (streamedText === "") {
      setDisplayedText("");
      prevLengthRef.current = 0;
      queueRef.current = [];
    }
  }, [streamedText]);

  return displayedText;
}
