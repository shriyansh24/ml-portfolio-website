import { SkillCategory } from "@/types/about";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}

export default function SkillsSection({ skillCategories }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>(skillCategories[0]?.name || "");
  
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
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {skillCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category.name
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-accent/50 text-accent-foreground hover:bg-accent"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Skills Display */}
      <AnimatePresence mode="wait">
        {skillCategories.map((category) => (
          category.name === activeCategory && (
            <motion.div
              key={category.name}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {category.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={fadeInUp}
                  className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{skill.name}</h4>
                    {skill.level !== undefined && (
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    )}
                  </div>
                  
                  {skill.level !== undefined && (
                    <div className="w-full bg-accent/30 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="bg-primary h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
}