import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getProjectById } from '@/lib/projectData';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for the project page
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectById(params.id);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  
  return {
    title: `${project.title} | ML Portfolio`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectById(params.id);
  
  if (!project) {
    notFound();
  }
  
  return (
    <main className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Project Image */}
          {project.imageUrl && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-md">
              <Image
                src={project.imageUrl}
                alt={`${project.title} project screenshot`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
          )}
          
          {/* Project Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
            
            {/* This would be expanded with more detailed content in a real application */}
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Project Details
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300">
              This project demonstrates the application of advanced machine learning techniques
              to solve real-world problems. The implementation leverages state-of-the-art
              algorithms and frameworks to deliver efficient and accurate results.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Technical Implementation
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300">
              The technical implementation involves several key components working together
              to achieve the project goals. The architecture is designed for scalability,
              performance, and maintainability.
            </p>
            
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Data preprocessing and feature engineering</li>
              <li>Model architecture and training pipeline</li>
              <li>Evaluation metrics and performance optimization</li>
              <li>Deployment and integration strategies</li>
            </ul>
          </div>
          
          {/* Project Links */}
          <div className="flex flex-wrap gap-4 mt-8">
            {project.githubUrl && (
              <Button 
                href={project.githubUrl} 
                external 
                variant="outline"
              >
                View on GitHub
              </Button>
            )}
            
            {project.liveUrl && (
              <Button 
                href={project.liveUrl} 
                external 
                variant="primary"
              >
                Live Demo
              </Button>
            )}
            
            <Button 
              href="/projects" 
              variant="ghost"
            >
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}