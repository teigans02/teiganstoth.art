import Header from '@/components/header'
import ShortDescription from '@/components/short-description'
import { getAllProjects } from '@/lib/mdx'
import FollowCursor from '@/components/follow-cursor';
import ProjectsDisplay from '@/components/projects-display';
import { getImageColors } from '@/lib/image-color';

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  
  const formattedProjects = projects.map(project => ({
    id: project.slug,
    title: project.title,
    description: project.description,
    slug: project.slug,
    tags: project.tags || [],
    date: project.date,
    workInProgress: project.workInProgress,
    heroImageUrl: project.heroImageUrl,
    hero2ImageUrl: project.hero2ImageUrl || undefined,
    externalUrl: project.externalUrl,
  }))

  const imageColors = await getImageColors(
    projects.flatMap(project => [project.heroImageUrl, project.hero2ImageUrl])
  )

  return (
    <div className="bg-white min-h-[100svh] min-w-screen">
      <FollowCursor />
      <Header/>
      <main className="px-6 md:px-12 pt-4 md:pt-6 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="max-w-3xl mx-auto py-4 md:py-8">
          <ShortDescription />
        </div>
        <div className="max-w-5xl mx-auto">
          <ProjectsDisplay projects={formattedProjects} imageColors={imageColors} />
        </div>
      </main>
    </div>
  )
}