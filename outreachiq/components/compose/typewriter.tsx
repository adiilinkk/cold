"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 12,
  onComplete,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setIndex(0);
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (index >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayed((prev) => prev + text[index]);
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, text, speed, onComplete]);

  return (
    <span>
      {displayed}
      {!done && (
        <span className="inline-block w-0.5 h-4 bg-[#2563eb] ml-0.5 animate-blink" />
      )}
    </span>
  );
}
