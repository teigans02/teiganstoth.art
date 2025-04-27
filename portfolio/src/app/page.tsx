import Header from '@/components/header'
import ShortDescription from '@/components/short-description'
import { getAllProjects } from '@/lib/mdx'
import FollowCursor from '@/components/follow-cursor';
import ProjectsDisplay from '@/components/projects-display';

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  const publishedProjects = projects.filter(project => project.published !== false);
  
  const formattedProjects = publishedProjects.map(project => ({
    id: project.slug,
    title: project.title,
    description: project.description,
    imageUrl: `/images/${project.slug}/hero.jpg`,
    slug: project.slug,
    tags: project.tags || [],
    date: project.date,
    published: project.published,
    workInProgress: project.workInProgress,
    heroImageUrl: project.heroImageUrl,
    hero2ImageUrl: project.hero2ImageUrl || undefined
  }))

  return (
    <div className="bg-white min-h-screen min-w-screen">
      <FollowCursor />
      <Header/>
      <main className="px-6 md:px-12 pt-4 md:pt-6">
        <div className="max-w-3xl mx-auto py-4 md:py-8">
          <ShortDescription />
        </div>
        <div className="max-w-5xl mx-auto">
          <ProjectsDisplay projects={formattedProjects} />
        </div>
      </main>
    </div>
  )
}