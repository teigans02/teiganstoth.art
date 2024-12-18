import Header from "@/components/header";
import { ProjectHero } from "@/components/project-hero";
import { getAllProjects } from "@/lib/mdx";

export default async function Home() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen bg-[#F8F8EF]">
      <Header />
      <main className="py-4">
        {projects.map((project) => (
          <ProjectHero key={project.slug} project={project} />
        ))}
      </main>
    </div>
  );
}
