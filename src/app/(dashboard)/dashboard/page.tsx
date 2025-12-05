import { ProjectCard } from "@/components/features/dashboard";
import { CreateProjectModal } from "@/components/features/dashboard";
import { Header } from "@/components/typography";
import { getUserProjects } from "@/lib/user/projects";

export default async function DashboardPage() {
  const projects = await getUserProjects();

  return (
    <div>
      <div className="items-center flex justify-between gap-4 flex-wrap">
        <Header
          title="Your Projects"
          description="Manage your projects here."
        />
        <CreateProjectModal />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-8">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              No projects yet. Create your first project to get started!
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
