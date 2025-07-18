"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PortfolioProject } from '@/types';

interface ProjectFilterProps {
  projects: PortfolioProject[];
  onFilterChange: (filteredProjects: PortfolioProject[]) => void;
  className?: string;
}

export function ProjectFilter({ projects, onFilterChange, className }: ProjectFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Extract unique technologies from all projects
  const allTechnologies = Array.from(
    new Set(
      projects.flatMap(project => project.technologies)
    )
  ).sort();
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      onFilterChange(projects);
    } else {
      const filtered = projects.filter(project => 
        project.technologies.includes(filter)
      );
      onFilterChange(filtered);
    }
  };
  
  return (
    <div className={cn("flex flex-wrap gap-2 mb-8", className)}>
      <button
        onClick={() => handleFilterClick('all')}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-full transition-colors",
          activeFilter === 'all' 
            ? "bg-primary text-white" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
      >
        All
      </button>
      
      {allTechnologies.map(tech => (
        <button
          key={tech}
          onClick={() => handleFilterClick(tech)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-colors",
            activeFilter === tech 
              ? "bg-primary text-white" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}