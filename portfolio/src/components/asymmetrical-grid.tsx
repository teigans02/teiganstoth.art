'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion';
import { ProjectHero } from './project-hero';

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

const FAST_DURATION = 20; // seconds
const SLOW_DURATION = 60; // seconds

const AsymmetricalGrid: React.FC<AsymmetricalGridProps> = ({ projects }) => {
  const [duration, setDuration] = useState(FAST_DURATION);
  const progress = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null); // Ref for the motion div

  useAnimationFrame((time, delta) => {
    if (!ref.current) return;

    let moveBy = delta / (duration * 1000); // Calculate progress increment based on duration

    // If the current progress plus the increment exceeds 1, loop back around
    if (progress.get() + moveBy >= 1) {
        progress.set(0);
    } else {
        progress.set(progress.get() + moveBy);
    }
  });

  // Map progress (0 to 1) to x translation ('0%' to '-100%')
  const xTranslation = useTransform(progress, [0, 1], ["0%", "-100%"]);

  // Duplicate projects for seamless infinite scroll
  const duplicatedProjects = [...projects, ...projects];
  
  const renderImage = (project: Project, index: number) => (
      <div key={`${project.id}-${index}`} className="flex-shrink-0 w-[200px] relative overflow-hidden pr-4">
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
          ref={ref}
          className="flex"
          style={{ x: xTranslation, willChange: 'transform' }} // Apply manual translation
          onHoverStart={() => {
            setDuration(SLOW_DURATION);
          }}
          onHoverEnd={() => {
            setDuration(FAST_DURATION);
          }}
        >
          {/* Render duplicated projects twice for the wrap-around effect */}
          {duplicatedProjects.map(renderImage)}
          {duplicatedProjects.map((project, index) => renderImage(project, index + duplicatedProjects.length))} 
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