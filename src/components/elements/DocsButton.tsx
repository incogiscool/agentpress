import { Book } from "lucide-react";
import { Button } from "../ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface DocsButtonProps
  extends React.ComponentProps<"a">,
    VariantProps<typeof docsButtonVariants> {
  className?: string;
}

const docsButtonVariants = cva("w-fit", {
  variants: {
    variant: {
      icon: "",
      text: "flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium",
    },
  },
  defaultVariants: {
    variant: "icon",
  },
});

export default function DocsButton({
  className,
  variant = "icon",
  ...props
}: DocsButtonProps) {
  const url = "https://docs.agentpress.ai";

  if (variant === "text") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={cn(docsButtonVariants({ variant, className }))}
        {...props}
      >
        <Button variant="outline">
          <Book className="size-4" />
          <span>Documentation</span>
        </Button>
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" {...props}>
      <Button variant="outline" size="icon" className={className}>
        <Book />
      </Button>
    </a>
  );
}
