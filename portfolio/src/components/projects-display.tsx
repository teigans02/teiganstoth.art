'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProjectHero } from './project-hero';

type Project = {
  id: string;
  title: string;
  imageUrl: string;
  slug: string;
  tags: string[];
  description: string;
  date: string;
  published: boolean;
  workInProgress?: boolean;
  heroImageUrl: string;
  hero2ImageUrl?: string;
  carouselPriority?: boolean;
};

interface ProjectCarouselProps {
  projects: Project[];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0); // State for container width
  const motionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); 

  // Define the width of a single item (including margin)
  const itemWidth = 200 + 8; // 200px width + mr-2 (8px) margin
  
  // Calculate repetitions based on measured container width
  const numOriginalItems = projects.length;
  const originalSetWidth = numOriginalItems * itemWidth;
  
  // Ensure we have at least enough items to cover the measured width
  // Only calculate if containerWidth is measured and projects exist
  const repetitionsNeeded = containerWidth > 0 && numOriginalItems > 0
    ? Math.max(1, Math.ceil(containerWidth / originalSetWidth)) 
    : 1;

  // Create the base set by repeating the original projects
  const baseSet = Array(repetitionsNeeded).fill(projects).flat();
  
  // Duplicate the extended base set for seamless infinite scroll
  const duplicatedProjects = [...baseSet, ...baseSet];
  
  const renderImage = (project: Project, index: number) => (
      <div key={`${project.id}-${index}`} className="flex-shrink-0 w-[200px] relative overflow-hidden mr-2"> 
        <Image 
          src={project.imageUrl} 
          alt={project.title}
          width={2000}
          height={1500}
          className="w-full h-full object-cover rounded-lg bg-gray-200" // Image remains rounded
          // Prioritize images based on estimated visible count
          priority={containerWidth > 0 && index < Math.ceil(containerWidth / itemWidth)} 
        />
      </div>
  );

  useEffect(() => {
    // Measure container width on mount and resize
    const measureContainer = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    measureContainer(); // Initial measure
    window.addEventListener('resize', measureContainer); // Measure on resize

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', measureContainer);
  }, []); // Run only once on mount

  useEffect(() => {
    // Measure content width after render/update
    // This needs to run *after* baseSet might have changed due to containerWidth update
    if (motionRef.current && baseSet.length > 0) {
      const totalWidth = motionRef.current.scrollWidth;
      setContentWidth(totalWidth / 2); 
    } else {
      setContentWidth(0); // Reset if no items/ref
    }
    // Re-run if the number of items in baseSet changes
  }, [baseSet]); // Depend on baseSet directly

  // Only start animation when width is measured
  const animationVariants = contentWidth > 0 ? {
    x: [0, -contentWidth] // Animate by the width of the baseSet
  } : {
    x: 0 
  };

  return (
    // Remove fixed width, add w-full (or let parent handle), add rounded-lg
    <div 
      ref={containerRef} 
      className="w-full overflow-hidden rounded-lg" // Make container responsive and rounded
    > 
      <motion.div
        ref={motionRef}
        className="flex" 
        style={{ willChange: 'transform' }}
        animate={animationVariants} 
        transition={{
          x: {
            duration: contentWidth > 0 ? contentWidth / 50 : 0, // Prevent duration 0 if width is 0
            repeat: Infinity,
            ease: "linear"
          }
        }}
      >
        {duplicatedProjects.map((project, index) => renderImage(project, index))}
      </motion.div>
    </div>
  );
};

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <>
      <h3 className="text-leading text-2xl font-medium mt-24">Selected Projects. <span className="text-gray-500">Explore some of my recent work in Social Growth, Brand Strategy and Digital Marketing.</span></h3>
      {projects.map((project) => (
        <div key={project.id}>
           <div className="divider border-t border-gray-200 my-8"></div>
          <ProjectHero key={project.id} project={project} />
        </div>
      ))}
    </>
  );
};

// Main component that combines both
const ProjectsDisplay: React.FC<{projects: Project[]}> = ({ projects }) => {
  // Sort projects for carousel: priority=true first (by date), then priority=false/undefined (by date)
  const carouselProjects = [...projects].sort((a, b) => {
    const aPriority = a.carouselPriority === true;
    const bPriority = b.carouselPriority === true;
    
    // If both have same priority status, sort by date (most recent first)
    if (aPriority === bPriority) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    // Priority projects come first
    return aPriority ? -1 : 1;
  });

  // List projects remain sorted by date (most recent first)
  const listProjects = [...projects].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto py-8 md:py-12">
      <ProjectCarousel projects={carouselProjects} />
      <ProjectList projects={listProjects} />
    </div>
  );
};

export { ProjectCarousel, ProjectList };
export default ProjectsDisplay;