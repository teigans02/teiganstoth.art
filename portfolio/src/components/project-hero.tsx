"use client"

import { ProjectMetadata } from "@/types/project"
import Image from "next/image"
import Link from "next/link"

interface ProjectHeroProps {
  project: ProjectMetadata
}

export function ProjectHero({ project }: ProjectHeroProps) {

  if (!project.heroImageUrl) {
    return <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg">Missing Hero Image</div>;
  }

  const LinkWrapper = ({ children }: { children: React.ReactNode }) => {
    if (project.externalUrl) {
      return (
        <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="block">
          {children}
        </a>
      );
    }
    return (
      <Link href={`/projects/${project.slug}`} className="block">
        {children}
      </Link>
    );
  };

  return (
    <LinkWrapper>
      <div className="w-full space-y-4">
        <h1 className="text-leading text-2xl font-medium">
          {project.title}
        </h1>
        <h1 className="text-leading text-2xl font-medium text-gray-500">
          {project.description}
        </h1>

        {/* Desktop Grid Layout */}
        <div
          className={`hidden md:grid md:grid-cols-5 gap-2`}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:col-span-2">
            <Image
              src={project.heroImageUrl}
              alt={`${project.title} preview`}
              width={2000}
              height={1500}
              className="object-cover w-full h-full bg-white"
              priority
            />
          </div>
          {project.hero2ImageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:col-span-2">
              <Image
                src={project.hero2ImageUrl}
                alt={`${project.title} secondary preview`}
                width={2000}
                height={1500}
                className="object-cover w-full h-full bg-white"
              />
            </div>
          )}
        </div>

        {/* Mobile Horizontal Scroll Layout */}
        <div className="md:hidden w-full overflow-x-auto whitespace-nowrap space-x-2 pb-2 rounded-lg">
           <div className="relative aspect-[4/3] overflow-hidden rounded-lg inline-block w-[200px]">
             <Image
               src={project.heroImageUrl}
               alt={`${project.title} preview`}
               width={2000}
               height={1500}
               className="object-cover w-full h-full bg-white"
               priority
             />
           </div>
           {project.hero2ImageUrl && (
             <div className="relative aspect-[4/3] overflow-hidden rounded-lg inline-block w-[200px]">
               <Image
                 src={project.hero2ImageUrl}
                 alt={`${project.title} secondary preview`}
                 width={2000}
                 height={1500}
                 className="object-cover w-full h-full bg-white"
               />
             </div>
           )}
         </div>
      </div>
    </LinkWrapper>
  )
}
