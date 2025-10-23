"use client";
import { Copy, Check } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"ghost"} onClick={handleCopy}>
            {copied ? <Check /> : <Copy />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {copied ? "Copied" : "Copy to clipboard"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
