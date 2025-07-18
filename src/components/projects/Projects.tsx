"use client";

import { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectFilter } from './ProjectFilter';
import { PortfolioProject } from '@/types';

interface ProjectsProps {
  initialProjects: PortfolioProject[];
}

export function Projects({ initialProjects }: ProjectsProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>(initialProjects);
  
  // Handle filter changes
  const handleFilterChange = (filtered: PortfolioProject[]) => {
    setFilteredProjects(filtered);
  };
  
  // Update filtered projects when initial projects change
  useEffect(() => {
    setProjects(initialProjects);
    setFilteredProjects(initialProjects);
  }, [initialProjects]);
  
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Projects
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Explore my portfolio of machine learning and AI projects, showcasing practical applications
          and research implementations in the field.
        </p>
        
        <ProjectFilter 
          projects={projects} 
          onFilterChange={handleFilterChange} 
          className="justify-center"
        />
        
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No projects match the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}