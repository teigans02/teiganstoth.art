'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProjectHero } from './project-hero';
import { ProjectMetadata } from '@/types/project';

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
};

interface ProjectCarouselProps {
  projects: Project[];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  const [contentWidth, setContentWidth] = useState(0);
  const motionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container

  // Define the width of a single item (including margin)
  const itemWidth = 200 + 8; // 200px width + mr-2 (8px) margin
  // Define a minimum width (e.g., container width, or a bit more)
  const minWidthToCover = 1024; // Or dynamically measure containerRef.current?.offsetWidth

  // Calculate how many times the original projects need to repeat
  const numOriginalItems = projects.length;
  const originalSetWidth = numOriginalItems * itemWidth;
  
  // Ensure we have at least enough items to cover the minimum width
  // Make sure we have at least 1 repetition
  const repetitionsNeeded = numOriginalItems > 0 
    ? Math.max(1, Math.ceil(minWidthToCover / originalSetWidth)) 
    : 1;

  // Create the base set by repeating the original projects
  const baseSet = Array(repetitionsNeeded).fill(projects).flat();
  
  // Duplicate the extended base set for seamless infinite scroll
  const duplicatedProjects = [...baseSet, ...baseSet];
  
  const renderImage = (project: Project, index: number) => (
      // Use a key that accounts for repetitions
      <div key={`${project.id}-${index}`} className="flex-shrink-0 w-[200px] relative overflow-hidden mr-2"> 
        <Image 
          src={project.imageUrl} 
          alt={project.title}
          width={2000}
          height={1500}
          className="w-full h-full object-cover rounded-lg bg-gray-200"
          // Prioritize images likely to be initially visible
          priority={index < Math.ceil(minWidthToCover / itemWidth)} 
        />
      </div>
  );

  useEffect(() => {
    // Measure the width after render
    if (motionRef.current) {
      // scrollWidth gives the total width of all items in duplicatedProjects
      const totalWidth = motionRef.current.scrollWidth;
      // The width of one 'baseSet' is half the total
      setContentWidth(totalWidth / 2); 
    }
    // Re-run if the number of projects changes (affects baseSet)
  }, [projects, baseSet.length]); // Depend on baseSet.length as it changes with projects

  // Only start animation when width is measured
  const animationVariants = contentWidth > 0 ? {
    x: [0, -contentWidth] // Animate by the width of the baseSet
  } : {
    x: 0 // Start at 0 if width is not yet measured
  };

  return (
    // Add ref to the container if you want dynamic width measurement later
    <div ref={containerRef} style={{ overflow: 'hidden', width: `${minWidthToCover}px` }}> 
      <motion.div
        ref={motionRef}
        className="flex" // Make sure items don't wrap
        style={{ willChange: 'transform' }}
        animate={animationVariants} // Use the calculated width
        transition={{
          x: {
            // Adjust duration based on the actual width being animated? Optional.
            duration: contentWidth / 50, // Example: Scale duration (adjust divisor as needed)
            repeat: Infinity,
            ease: "linear"
          }
        }}
      >
        {/* Render the potentially much longer duplicated list */}
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
      <h3 className="text-leading text-2xl font-medium mt-24">Selected Projects. <span className="text-gray-500">Explore some of my recent projects in brand strategy and digital marketing.</span></h3>
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
  return (
    <div className="container mx-auto py-8 md:py-12">
      <ProjectCarousel projects={projects} />
      <ProjectList projects={projects} />
    </div>
  );
};

export { ProjectCarousel, ProjectList };
export default ProjectsDisplay;