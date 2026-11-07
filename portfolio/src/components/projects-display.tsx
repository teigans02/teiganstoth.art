'use client';

import React from 'react';
import { ProjectHero } from './project-hero';
import { ProjectCarousel } from './project-carousel';
import { getCarouselSlides } from '@/lib/project-carousel';

type Project = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  description: string;
  date: string;
  workInProgress?: boolean;
  heroImageUrl: string;
  hero2ImageUrl?: string;
};

interface ProjectListProps {
  projects: Project[];
  imageColors: Record<string, string>;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, imageColors }) => {
  return (
    <>
      <h3 className="text-leading text-2xl font-medium mt-24">Selected Projects. <span className="text-gray-500">Explore some of my recent work in Social Growth, Brand Strategy and Digital Marketing.</span></h3>
      {projects.map((project) => (
        <div key={project.id}>
           <div className="divider border-t border-gray-200 my-8"></div>
          <ProjectHero key={project.id} project={project} imageColors={imageColors} />
        </div>
      ))}
    </>
  );
};

const ProjectsDisplay: React.FC<ProjectListProps> = ({ projects, imageColors }) => {
  const carouselSlides = getCarouselSlides(projects, imageColors);

  const listProjects = [...projects].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto py-8 md:py-12">
      <ProjectCarousel slides={carouselSlides} />
      <ProjectList projects={listProjects} imageColors={imageColors} />
    </div>
  );
};

export { ProjectCarousel, ProjectList };
export default ProjectsDisplay;
