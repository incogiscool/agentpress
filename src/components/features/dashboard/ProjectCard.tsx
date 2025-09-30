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
import { Project } from "@/lib/database/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Copy, EllipsisVertical } from "lucide-react";

interface ProjectCardProps {
  className?: string;
  project: Project;
}

export default function ProjectCard({ className, project }: ProjectCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </div>

        <Button variant={"ghost"}>
          {/* OPENS MODAL TO CHANGE THE PROJECT NAME, DESCRIPTION, BASE URL, OR DELETE */}
          <EllipsisVertical />
        </Button>
      </CardHeader>
      <CardContent>
        {
          <>
            <p>Base URL: {project.base_url}</p>
            <div className="flex items-center gap-2">
              <p>Copy Secret Key</p>
              <Button
                variant={"ghost"}
                onClick={() =>
                  navigator.clipboard.writeText(project.secret_key || "")
                }
              >
                <Copy />
              </Button>
            </div>
          </>
        }
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-muted-foreground/30">
        <p>Go to project</p>
        <ArrowRight />
      </CardFooter>
    </Card>
  );
}
