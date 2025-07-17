// Types for the About section components

export interface Skill {
  name: string;
  level?: number; // 0-100 for progress bars
  category: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  description: string;
  achievements?: string[];
  technologies: string[];
  logo?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  graduationDate: string;
  location?: string;
  description?: string;
  achievements?: string[];
  logo?: string;
}

export interface AboutSectionProps {
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  showAnimation?: boolean;
}