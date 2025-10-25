"use client";

import { useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";

import { Badge } from "../ui/badge";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Field, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Mode = {
  name: string;
  badge?: string;
  disabled?: boolean;
  disabledReason?: string;
};
interface ChatInputProps {
  onSubmit?: (
    prompt: string,
    selectedTools: string[],
    selectedMode: Mode
  ) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

const modes: Mode[] = [
  // {
  //   name: "Auto",
  // },
  {
    name: "Agent Mode",
    // badge: "Beta",
  },
  //   {
  //     name: "Plan Mode",
  //     disabled: true,
  //     disabledReason: "Coming Soon",
  //   },
];

/*






  TODO: ADD CHAT STOP BUTTON





  
*/

export function ChatInput({
  onSubmit,
  onStop,
  disabled = false,
  isStreaming = false,
}: ChatInputProps) {
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Mode>(modes[0]!);
  const [prompt, setPrompt] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    setPrompt("");

    onSubmit?.(prompt, [], selectedModel);
  }

  return (
    <form
      ref={formRef}
      className="[--radius:1.2rem] w-full"
      onSubmit={handleSubmit}
    >
      <Field>
        <FieldLabel htmlFor="prompt" className="sr-only">
          Prompt
        </FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="prompt"
            placeholder="Ask, search, or make anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            disabled={disabled}
          />

          <InputGroupAddon align="block-end" className="gap-1">
            <DropdownMenu
              open={modelPopoverOpen}
              onOpenChange={setModelPopoverOpen}
              modal={false}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton
                      size="sm"
                      className="rounded-full"
                      disabled={disabled}
                    >
                      {selectedModel.name}
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Select AI mode</TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                side="top"
                align="start"
                className="[--radius:1rem]"
              >
                <DropdownMenuGroup className="w-42">
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Select Agent Mode
                  </DropdownMenuLabel>
                  {modes.map((mode) => (
                    <DropdownMenuCheckboxItem
                      key={mode.name}
                      checked={mode.name === selectedModel.name}
                      disabled={!!mode.disabled || !!mode.disabledReason}
                      onCheckedChange={(checked) => {
                        if (checked && !mode.disabled && !mode.disabledReason) {
                          setSelectedModel(mode);
                        }
                      }}
                      className="pl-2 *:[span:first-child]:right-2 *:[span:first-child]:left-auto"
                    >
                      {mode.name}
                      {mode.badge && (
                        <Badge
                          variant="secondary"
                          className="h-5 rounded-sm bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          {mode.badge}
                        </Badge>
                      )}
                      {mode.disabledReason && (
                        <Badge
                          variant="secondary"
                          className="h-5 rounded-sm bg-gray-100 px-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {mode.disabledReason}
                        </Badge>
                      )}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {isStreaming ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    aria-label="Stop"
                    className="ml-auto rounded-full"
                    variant="outline"
                    size="icon-sm"
                    type="button"
                    onClick={onStop}
                  >
                    <Square className="size-4" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>Stop generating</TooltipContent>
              </Tooltip>
            ) : (
              <InputGroupButton
                aria-label="Send"
                className="ml-auto rounded-full"
                variant="default"
                size="icon-sm"
                type="submit"
                disabled={disabled}
              >
                <ArrowUp className="size-4" />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  );
}
