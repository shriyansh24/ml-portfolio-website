import { FeaturedProjects } from "@/components/projects";
import { getFeaturedProjects } from "@/lib/projectData";

export default async function FeaturedProjectsSection() {
  // Fetch featured projects
  const featuredProjects = await getFeaturedProjects();
  
  return <FeaturedProjects projects={featuredProjects} />;
}