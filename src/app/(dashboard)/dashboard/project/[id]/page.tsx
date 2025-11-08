import { getUserMethodsByProject } from "@/lib/user/methods";
import { MethodCard } from "@/components/features/project";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Header } from "@/components/typography";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const methods = await getUserMethodsByProject(params.id);

  return (
    <div className="container mx-auto py-8">
      <Header
        title="Project Methods"
        description="View and manage your API methods"
      />

      {methods.length === 0 ? (
        <Empty className="mt-6">
          <EmptyHeader>
            <EmptyTitle>No methods found</EmptyTitle>
            <EmptyDescription>
              This project doesn&apos;t have any methods yet. Methods will
              appear here once you sync your API.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {methods.map((method) => (
            <MethodCard key={method._id.toString()} method={method} />
          ))}
        </div>
      )}
    </div>
  );
}
