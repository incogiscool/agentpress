import { ProjectCard } from "@/components/features/dashboard";
import { PageLayout } from "@/components/layout";

export default function Home() {
  return (
    <PageLayout>
      <p>asdsd</p>

      {[1, 2, 3].map((item) => (
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
    </PageLayout>
  );
}
