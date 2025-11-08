"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Method } from "@/lib/database/types";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteUserMethod } from "@/lib/user/methods";
import { Badge } from "@/components/ui/badge";

interface MethodCardProps {
  className?: string;
  method: Method;
}

const REQUEST_METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  POST: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  PUT: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  PATCH: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  DELETE: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export default function MethodCard({ className, method }: MethodCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserMethod(method._id.toString());
      toast.success("Method deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete method. Please try again.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex items-center justify-between">
        <div className="w-full">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Badge
                className={cn(
                  "font-mono font-semibold",
                  REQUEST_METHOD_COLORS[
                    method.request_method?.toUpperCase() || "GET"
                  ] || "bg-gray-500/10 text-gray-500"
                )}
              >
                {method.request_method?.toUpperCase() || "GET"}
              </Badge>
              {method.name}
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size="icon">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{method.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Delete Method
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Method</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{method.name}
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
          </div>
          <CardDescription className="mt-1">
            {method.description || "No description provided"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Pathname:</span>{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              {method.pathname || "/"}
            </code>
          </p>
          {method.params_type && (
            <p>
              <span className="font-semibold">Params Type:</span>{" "}
              <Badge variant="outline">{method.params_type}</Badge>
            </p>
          )}
          {method.parameters && (
            <div>
              <p className="font-semibold">Parameters:</p>
              <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-x-auto">
                {JSON.stringify(method.parameters, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
