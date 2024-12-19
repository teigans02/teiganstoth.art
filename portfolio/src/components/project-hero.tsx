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
  const imageUrl = `/images/${project.slug}/hero.jpg`
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

  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <div className="w-full py-2 md:py-3">
        <div className="px-8">
          <div className="grid grid-cols-1 gap-3 md:gap-12 md:grid-cols-2 items-center">
            {/* Image Section - Moved above content for mobile */}
            <div 
              className="relative aspect-[16/9] overflow-hidden rounded-lg md:order-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <Image
                  src={imageUrl}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover bg-white"
                  priority
                  onError={(e) => {
                    // @ts-ignore: Object is possibly 'null'
                    e.target.style.display = 'none';
                  }}
                />
              </motion.div>
              <AnimatePresence>
                {(isHovered || isMobile) && (
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }}
                    className="absolute bottom-4 right-4 bg-black text-[#F8F8EF] rounded-full p-2 
                      flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }}
                    >
                      <ArrowRightIcon className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Section */}
            <div className="space-y-4 md:order-1">
              <h1 className="text-3xl font-['StyreneA-Regular']">
                {project.title}
              </h1>
              <p className="text-md">
                {project.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-black text-[#F8F8EF]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
