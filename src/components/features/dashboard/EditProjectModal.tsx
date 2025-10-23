"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import updateUserProject from "@/lib/user/projects/actions/updateUserProject";
import { useRouter } from "next/navigation";

const editProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  baseUrl: z.url("Invalid URL format"),
});

interface EditProjectModalProps {
  project: {
    id: string;
    name: string;
    baseUrl: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EditProjectModal({
  project,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: EditProjectModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    externalOpen !== undefined && externalOnOpenChange !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange : setInternalOpen;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof editProjectSchema>>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name,
      baseUrl: project.baseUrl,
    },
  });

  async function onSubmit(data: z.infer<typeof editProjectSchema>) {
    setIsLoading(true);
    try {
      await updateUserProject(project.id, data.name, data.baseUrl);
      toast.success("Project updated successfully!");
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update project. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form id="edit-project-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-project-name">
                    Project Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-project-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter project name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="baseUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-project-baseUrl">
                    Base URL
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-project-baseUrl"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Enter the base URL for the project (where your website is
                    hosted).
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            type="submit"
            form="edit-project-form"
          >
            {isLoading ? "Updating..." : "Update Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
