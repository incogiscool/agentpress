"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/lib/database/types";
import { cn } from "@/lib/utils";
import { ArrowRight, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { EditProjectModal } from ".";
import deleteUserProject from "@/lib/user/projects/actions/deleteUserProject";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CopyButton } from "@/components/elements";

interface ProjectCardProps {
  className?: string;
  project: Project;
}

export default function ProjectCard({ className, project }: ProjectCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserProject(project._id.toString());
      toast.success("Project deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete project. Please try again.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{project.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                Edit Project
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete Project
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{project.name}
                      &quot;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant={"destructive"}
                      onClick={handleDelete}
                      isLoading={isDeleting}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {
            <>
              <p>Base URL: {project.base_url}</p>
              <div className="flex items-center gap-2">
                <p>
                  Secret Key: {project.secret_key?.slice(0, 6)}...
                  {project.secret_key?.slice(-4)}
                </p>
                <CopyButton text={project.secret_key || ""} />
              </div>
              <div className="flex items-center gap-2">
                <p>
                  Project ID: {project._id.toString()?.slice(0, 6)}...P
                  {project._id.toString()?.slice(-4)}
                </p>
                <CopyButton text={project._id.toString()} />
              </div>
            </>
          }
        </CardContent>
        <CardFooter className="flex items-center gap-2 text-muted-foreground/30">
          <p>Go to project</p>
          <ArrowRight />
        </CardFooter>
      </Card>
      <EditProjectModal
        project={{
          id: project._id.toString(),
          name: project.name || "",
          baseUrl: project.base_url || "",
        }}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        key={project._id.toString() + project.name + project.base_url}
      />
    </>
  );
}
