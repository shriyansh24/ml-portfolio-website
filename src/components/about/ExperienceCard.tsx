import { Experience } from "@/types/about";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/Button";

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export default function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {experience.logo && (
          <div className="flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden bg-accent/10">
            <Image 
              src={experience.logo} 
              alt={`${experience.company} logo`} 
              fill 
              className="object-contain p-1"
            />
          </div>
        )}
        
        <div className="flex-grow">
          <h3 className="text-xl font-bold">{experience.position}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">{experience.company}</span>
            {experience.location && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>{experience.location}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {experience.startDate} – {experience.current ? 'Present' : experience.endDate}
        </div>
      </div>
      
      <p className="mb-4 text-muted-foreground">{experience.description}</p>
      
      {experience.achievements && experience.achievements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Key Achievements:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {experience.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-3">
        {experience.technologies.map((tech) => (
          <span 
            key={tech} 
            className="px-2 py-1 bg-accent/50 text-accent-foreground rounded-full text-xs font-medium"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}