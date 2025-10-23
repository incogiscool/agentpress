"use client";

import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Mode = {
  name: string;
  badge?: string;
  disabled?: boolean;
  disabledReason?: string;
};

type Tool = {
  title: string;
  id: string;
  description: string;
};

interface ChatInputProps {
  onSubmit?: (
    prompt: string,
    selectedTools: string[],
    selectedMode: Mode
  ) => void;
  tools?: Tool[];
  disabled?: boolean;
}

const modes: Mode[] = [
  // {
  //   name: "Auto",
  // },
  {
    name: "Agent Mode",
    badge: "Beta",
  },
  {
    name: "Plan Mode",
    disabled: true,
    // disabledReason: "Coming Soon",
  },
];

/*






  TODO: ADD CHAT STOP BUTTON





  
*/

export function ChatInput({
  onSubmit,
  // tools,
  disabled = false,
}: ChatInputProps) {
  // const [selectedTools, setSelectedTools] = useState<string[]>([]);
  // const [toolPopoverOpen, setToolPopoverOpen] = useState(false);
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Mode>(modes[0]);
  const [prompt, setPrompt] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  // const availableTools = useMemo(() => {
  //   return tools?.filter((tool) => !selectedTools.includes(tool.id));
  // }, [selectedTools, tools]);

  // const hasSelectedTools = selectedTools.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    setPrompt("");

    // onSubmit?.(prompt, selectedTools, selectedModel);
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

          {/* FOR NOW, DISABLE TOOLS SELECTION */}
          {/* <InputGroupAddon align="block-start">
            <Popover open={toolPopoverOpen} onOpenChange={setToolPopoverOpen}>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  onFocusCapture={(e) => e.stopPropagation()}
                >
                  <PopoverTrigger asChild>
                    <InputGroupButton
                      variant="outline"
                      size={!hasSelectedTools ? "sm" : "icon-sm"}
                      className="rounded-full transition-transform"
                      disabled={disabled}
                    >
                      <Wrench className="size-4" />
                      {!hasSelectedTools && "Select tools"}
                    </InputGroupButton>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  Select tools for the agent to use
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="p-0 [--radius:1.2rem]" align="start">
                <Command>
                  <CommandInput placeholder="Search tools..." />
                  <CommandList>
                    <CommandEmpty>No tools found</CommandEmpty>
                    <CommandGroup heading="Available Tools">
                      {availableTools?.map((tool) => (
                        <CommandItem
                          key={tool.id}
                          value={tool.id}
                          onSelect={() => {
                            setSelectedTools((prev) => [...prev, tool.id]);
                            setToolPopoverOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{tool.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {tool.description}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="no-scrollbar -m-1.5 flex gap-1 overflow-y-auto p-1.5">
              {selectedTools.map((toolId) => {
                const tool = tools?.find((t) => t.id === toolId);

                if (!tool) {
                  return null;
                }

                return (
                  <InputGroupButton
                    key={toolId}
                    size="sm"
                    variant="secondary"
                    className="rounded-full !pl-2"
                    onClick={() => {
                      setSelectedTools((prev) =>
                        prev.filter((id) => id !== toolId)
                      );
                    }}
                  >
                    {tool.title}
                    <X className="size-3" />
                  </InputGroupButton>
                );
              })}
            </div>
          </InputGroupAddon> */}

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
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  );
}
