import { Education } from "@/types/about";
import { motion } from "framer-motion";
import Image from "next/image";

interface EducationCardProps {
  education: Education;
  index: number;
}

export default function EducationCard({ education, index }: EducationCardProps) {
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
        {education.logo && (
          <div className="flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden bg-accent/10">
            <Image 
              src={education.logo} 
              alt={`${education.institution} logo`} 
              fill 
              className="object-contain p-1"
            />
          </div>
        )}
        
        <div className="flex-grow">
          <h3 className="text-xl font-bold">{education.degree}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">{education.institution}</span>
            {education.location && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>{education.location}</span>
              </>
            )}
          </div>
          <p className="text-sm text-primary">{education.field}</p>
        </div>
        
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {education.startDate ? `${education.startDate} – ` : ''}{education.graduationDate}
        </div>
      </div>
      
      {education.description && (
        <p className="mb-4 text-muted-foreground">{education.description}</p>
      )}
      
      {education.achievements && education.achievements.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm font-medium mb-2">Achievements:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {education.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}