import { useState, useEffect } from "react";

interface TerminalSubheadingProps {
  text: string;
  className?: string;
  speed?: number;
}

export const TerminalSubheading = ({ text, className = "", speed = 30 }: TerminalSubheadingProps) => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= text.length) {
        setTypedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <p className={`font-mono tracking-wide min-h-[1.5em] ${className}`}>
      <span className="text-primary/70 mr-2">&gt;</span>
      {typedText}
      <span className="animate-blink text-primary">_</span>
    </p>
  );
};
