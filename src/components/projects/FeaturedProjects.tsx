import { Button } from '@/components/ui/Button';
import { ProjectCard } from './ProjectCard';
import { PortfolioProject } from '@/types';

interface FeaturedProjectsProps {
  projects: PortfolioProject[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  // Filter to only show featured projects, limited to 3
  const featuredProjects = projects
    .filter(project => project.featured)
    .slice(0, 3);
  
  return (
    <section id="projects" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Featured Projects
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Explore some of my highlighted machine learning and AI projects. These showcase my expertise
          in developing practical solutions using cutting-edge technologies.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button href="/projects" variant="primary" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}