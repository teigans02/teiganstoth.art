'use client';

import React, { useState, useEffect } from 'react';
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
  // Split projects into two columns for desktop view
  const leftColumnProjects = projects.filter((_, index) => index % 2 === 0);
  const rightColumnProjects = projects.filter((_, index) => index % 2 === 1);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
          {(hoveredProject === project.id || isMobile) && (
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

  // For mobile: single column layout
  if (isMobile) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-16">
          {projects.map(renderProject)}
        </div>
      </div>
    );
  }

  // For desktop: asymmetrical two-column layout
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-12 gap-12">
        {/* Left column */}
        <div className="col-span-6 space-y-24">
          {leftColumnProjects.map(renderProject)}
        </div>

        {/* Right column */}
        <div className="col-span-6 space-y-24 mt-20">
          {rightColumnProjects.map(renderProject)}
        </div>
      </div>
    </div>
  );
};

export default AsymmetricalGrid;