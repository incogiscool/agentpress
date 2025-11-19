import { Book } from "lucide-react";
import { Button } from "../ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DocsButtonProps extends VariantProps<typeof docsButtonVariants> {
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
}: DocsButtonProps) {
  if (variant === "text") {
    return (
      <Link
        href="/docs"
        className={cn(docsButtonVariants({ variant, className }))}
      >
        <Button variant="outline">
          <Book className="size-4" />
          <span>Documentation</span>
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/docs">
      <Button variant="outline" size="icon" className={className}>
        <Book />
      </Button>
    </Link>
  );
}
