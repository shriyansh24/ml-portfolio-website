import { AboutSectionProps } from "@/types/about";
import { useState } from "react";
import { motion } from "framer-motion";
import SkillsSection from "./SkillsSection";
import ExperienceCard from "./ExperienceCard";
import EducationCard from "./EducationCard";
import { Button } from "../ui/Button";

export default function About({ skills, experience, education, showAnimation = true }: AboutSectionProps) {
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education'>('skills');
  
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={showAnimation ? "hidden" : false}
          whileInView={showAnimation ? "visible" : false}
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Machine Learning Engineer with expertise in developing and deploying
              state-of-the-art AI models, particularly in the field of natural
              language processing and transformer architectures.
            </p>
          </motion.div>
          
          {/* Tab Navigation */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-12">
            <div className="inline-flex bg-accent/30 p-1 rounded-lg">
              {[
                { id: 'skills', label: 'Skills' },
                { id: 'experience', label: 'Experience' },
                { id: 'education', label: 'Education' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Tab Content */}
          <div className="mt-8">
            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SkillsSection skillCategories={skills} />
              </motion.div>
            )}
            
            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                variants={staggerContainer}
                className="space-y-6"
              >
                {experience.map((exp, index) => (
                  <ExperienceCard key={index} experience={exp} index={index} />
                ))}
                
                <motion.div variants={fadeInUp} className="flex justify-center mt-8">
                  <Button variant="outline" href="/resume.pdf" external>
                    Download Full Resume
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Education Tab */}
            {activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                variants={staggerContainer}
                className="space-y-6"
              >
                {education.map((edu, index) => (
                  <EducationCard key={index} education={edu} index={index} />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}