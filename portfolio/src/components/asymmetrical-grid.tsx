'use client';

import React from 'react';
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
};

interface AsymmetricalGridProps {
  projects: Project[];
}

const AsymmetricalGrid: React.FC<AsymmetricalGridProps> = ({ projects }) => {
  // Duplicate projects for seamless infinite scroll
  const duplicatedProjects = [...projects, ...projects];
  
  const renderImage = (project: Project, index: number) => (
      <div key={`${project.id}-${index}`} className="flex-shrink-0 w-[200px] relative overflow-hidden ml-2">
        <Image 
          src={project.imageUrl} 
          alt={project.title}
          width={2000}
          height={1500}
          className="w-full h-full object-cover rounded-lg bg-gray-200"
          priority={index < 5} // Prioritize loading initial images
        />
      </div>
  );

  return (
    <div className="container mx-auto py-8 md:py-12">
      {/* Infinite scroll container */}
      <div className="relative w-full overflow-hidden rounded-lg">
        <motion.div 
          className="flex"
          style={{ willChange: 'transform' }}
          animate={{
            x: ["0%", "-100%"]
          }}
          transition={{
            x: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          {duplicatedProjects.map((project, index) => renderImage(project, index))}
        </motion.div>
      </div>
      {/* <div className="divider border-t border-gray-200 mt-16 mb-8"></div> */}
      <h3 className="text-leading text-2xl font-medium mt-24">Selected Projects. <span className="text-gray-500">Explore some of my recent projects in brand strategy and digital marketing.</span></h3>
      {projects.map((project) => (
        <div key={project.id}>
           <div className="divider border-t border-gray-200 my-8"></div>
          <ProjectHero key={project.id} project={project} />
        </div>
      ))}
    </div>
  );
};

export default AsymmetricalGrid;