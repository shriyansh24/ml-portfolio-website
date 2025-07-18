import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PortfolioProject } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: PortfolioProject;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { id, title, description, technologies, githubUrl, liveUrl, imageUrl } = project;
  
  return (
    <div className={cn(
      "flex flex-col rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 transition-all hover:shadow-lg hover:translate-y-[-5px]",
      className
    )}>
      <Link href={`/projects/${id}`} className="block">
        {imageUrl ? (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={`${title} project thumbnail`}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No image available</span>
          </div>
        )}
      </Link>
      
      <div className="flex flex-col flex-grow p-5 space-y-4">
        <Link href={`/projects/${id}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {technologies.map((tech) => (
            <span 
              key={tech} 
              className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3 mt-4">
          <Button 
            href={`/projects/${id}`}
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            View Details
          </Button>
          
          {githubUrl && (
            <Button 
              href={githubUrl} 
              external 
              variant="primary" 
              size="sm"
              className="flex-1"
            >
              GitHub
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}