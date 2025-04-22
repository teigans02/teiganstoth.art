import AsymmetricalGrid from '@/components/asymmetrical-grid'
import Header from '@/components/header'
import ShortDescription from '@/components/short-description'
import { getAllProjects } from '@/lib/mdx'
import FollowCursor from '@/components/follow-cursor';

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  const publishedProjects = projects.filter(project => project.published !== false);
  
  const formattedProjects = publishedProjects.map(project => ({
    id: project.slug,
    title: project.title,
    imageUrl: `/images/${project.slug}/hero.jpg`,
    tags: project.tags || [],
    featured: false,
    slug: project.slug
  }))

  return (
    <div className="bg-white min-h-screen min-w-screen">
      <FollowCursor />
      <Header/>
      <main className="px-6 md:px-12 pt-4 md:pt-6">
        <div className="max-w-xl mx-auto">
          <ShortDescription />
        </div>
        <div className="max-w-5xl mx-auto">
          <AsymmetricalGrid projects={formattedProjects} />
        </div>
      </main>
    </div>
  )
}