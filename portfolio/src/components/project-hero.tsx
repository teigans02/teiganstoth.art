"use client"

import { ProjectMetadata } from "@/types/project"
import Image from "next/image"
import { ArrowRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"

interface ProjectHeroProps {
  project: ProjectMetadata
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!project.heroImageUrl) {
    return <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg">Missing Hero Image</div>;
  }

  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <div className="w-full space-y-4">
        <h1 className="text-leading text-2xl font-medium">
          {project.title}
        </h1>

        <div 
          className={`relative grid md:grid-cols-5 grid-cols-1 gap-1 md:gap-2`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:col-span-2 col-span-1">
            <Image
              src={project.heroImageUrl}
              alt={`${project.title} preview`}
              width={2000}
              height={1500}
              className="object-cover w-full h-full bg-white"
              priority
            />
          </div>

          {project.hero2ImageUrl && !isMobile && (
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
          
          <div className="hidden md:flex md:col-span-1 h-full rounded-lg bg-white items-center justify-start">
             {/* <ArrowRightIcon className="w-12 h-12 text-gray-500 font-regular p-4 bg-gray-100 rounded-full ml-4" /> */}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-md">
            {project.description}
          </p>
          
          {/* <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-black text-[#F8F8EF]"
              >
                {tag}
              </span>
            ))}
          </div> */}
        </div>
      </div>
    </Link>
  )
}
