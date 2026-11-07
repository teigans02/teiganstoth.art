"use client"

import { ProjectMetadata } from "@/types/project"
import Link from "next/link"
import { RevealImage } from "@/components/reveal-image"

const IMAGE_SIZES = "(min-width: 1100px) 410px, (min-width: 768px) 40vw, 200px"

interface ProjectHeroProps {
  project: ProjectMetadata
  imageColors: Record<string, string>
}

function ProjectLink({ project, children }: { project: ProjectMetadata; children: React.ReactNode }) {
  if (project.externalUrl) {
    return (
      <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="project-link block rounded-lg">
        {children}
      </a>
    )
  }
  return (
    <Link href={`/projects/${project.slug}`} className="project-link block rounded-lg">
      {children}
    </Link>
  )
}

export function ProjectHero({ project, imageColors }: ProjectHeroProps) {
  const images = [
    { src: project.heroImageUrl, alt: `${project.title} preview` },
    ...(project.hero2ImageUrl ? [{ src: project.hero2ImageUrl, alt: `${project.title} secondary preview` }] : []),
  ].filter((image) => image.src)

  if (!project.heroImageUrl) {
    return <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg">Missing Hero Image</div>
  }

  return (
    <ProjectLink project={project}>
      <div className="w-full space-y-4">
        <h1 className="text-leading text-2xl font-medium">
          {project.title}
        </h1>
        <h1 className="text-leading text-2xl font-medium text-gray-500">
          {project.description}
        </h1>

        <div className="flex gap-2 overflow-x-auto rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-5 md:overflow-visible">
          {images.map((image) => (
            <RevealImage
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={2000}
              height={1500}
              sizes={IMAGE_SIZES}
              loading="eager"
              placeholderColor={imageColors[image.src]}
              wrapperClassName="relative aspect-[4/3] w-[200px] shrink-0 overflow-hidden rounded-lg md:w-auto md:col-span-2"
              className="object-cover w-full h-full"
            />
          ))}
        </div>
      </div>
    </ProjectLink>
  )
}
