import { Metadata } from 'next';
import { Projects } from '@/components/projects';
import { getAllProjects } from '@/lib/projectData';

export const metadata: Metadata = {
  title: 'Projects | ML Portfolio',
  description: 'Explore my machine learning and AI projects, including NLP, computer vision, and reinforcement learning implementations.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  
  return (
    <main>
      <Projects initialProjects={projects} />
    </main>
  );
}