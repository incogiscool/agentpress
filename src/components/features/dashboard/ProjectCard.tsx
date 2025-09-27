import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/lib/database/types";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  className?: string;
  project: Project;
}

export default function ProjectCard({ className, project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {
          // base url, secret key, created at, updated at
          <>
            <p>Base URL: {project.base_url}</p>
            <p>Secret Key: {project.secret_key}</p>
          </>
        }
      </CardContent>
      <CardFooter>
        <ArrowRight />
      </CardFooter>
    </Card>
  );
}
