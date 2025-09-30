import { ProjectCard } from "@/components/features/dashboard";
import { PageLayout } from "@/components/layout";
import { Header } from "@/components/typography";

export default function Home() {
  return (
    <PageLayout>
      <Header title="Your Projects" description="Manage your projects here." />
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mt-8">
        {[1, 2, 3, 4].map((item) => (
          <ProjectCard
            key={item}
            project={{
              id: item.toString(),
              name: `Project ${item}`,
              description: `This is project ${item}`,
              base_url: `https://api.project${item}.com`,
            }}
          />
        ))}
      </div>
    </PageLayout>
  );
}
