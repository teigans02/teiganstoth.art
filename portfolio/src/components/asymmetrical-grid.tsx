'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  imageUrl: string;
  slug: string;
  tags: string[];
};

interface AsymmetricalGridProps {
  projects: Project[];
}

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AsymmetricalGrid: React.FC<AsymmetricalGridProps> = ({ projects }) => {
  const leftColumnProjects = projects.filter((_, index) => index % 2 === 0);
  const rightColumnProjects = projects.filter((_, index) => index % 2 === 1);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  
  // Render a single project card
  const renderProject = (project: Project) => (
    <Link 
      key={project.id} 
      href={`/projects/${project.slug}`}
      className="flex flex-col group relative cursor-pointer"
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      <div className="relative w-full overflow-hidden mb-3">
        <motion.div
          animate={{
            scale: hoveredProject === project.id ? 1.05 : 1
          }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-auto"
          />
        </motion.div>
        <AnimatePresence>
          {(hoveredProject === project.id || true) && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              className="absolute bottom-4 right-4 bg-black text-white rounded-full p-2 
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
                <ArrowRightIcon />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">{project.title}</h3>
        <div className="flex flex-col items-end">
          {project.tags.map((tag, sIndex) => (
            <span key={`${project.id}-service-${sIndex}`} 
                  className="text-sm text-gray-500 group-hover:text-black group-hover:font-medium duration-100 inline-block max-w-[200px] truncate"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto py-8 md:py-12">
      {/* Single column for sm, two columns for md+ */}
      <div className="sm:grid-cols-1 md:grid-cols-12 grid gap-16 md:gap-12">
        {/* For small screens: all projects in a single column */}
        <div className="sm:block md:hidden col-span-full space-y-16">
          {projects.map(renderProject)}
        </div>
        
        {/* For medium screens and up: asymmetrical two-column layout */}
        <div className="hidden md:block col-span-6 space-y-24">
          {leftColumnProjects.map(renderProject)}
        </div>
        <div className="hidden md:block col-span-6 space-y-24 mt-20">
          {rightColumnProjects.map(renderProject)}
        </div>
      </div>
    </div>
  );
};

export default AsymmetricalGrid;