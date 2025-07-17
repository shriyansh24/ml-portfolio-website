import Layout from "@/components/layout/Layout";
import About from "@/components/about/About";
import { generateMetadata } from "@/components/SEOHead";
import { SkillCategory, Experience, Education } from "@/types/about";

export const metadata = generateMetadata({
  title: "About Me | ML Portfolio",
  description: "Learn about my skills, experience, and education in machine learning and AI",
  keywords: ["about", "skills", "experience", "education", "machine learning", "AI"],
});

// Sample data - in a real application, this would come from a database or API
const skillsData: SkillCategory[] = [
  {
    name: "Machine Learning",
    skills: [
      { name: "PyTorch", level: 90, category: "Machine Learning" },
      { name: "TensorFlow", level: 85, category: "Machine Learning" },
      { name: "Scikit-Learn", level: 95, category: "Machine Learning" },
      { name: "Hugging Face", level: 90, category: "Machine Learning" },
      { name: "NLP", level: 95, category: "Machine Learning" },
      { name: "Computer Vision", level: 80, category: "Machine Learning" },
    ]
  },
  {
    name: "Programming",
    skills: [
      { name: "Python", level: 95, category: "Programming" },
      { name: "JavaScript", level: 80, category: "Programming" },
      { name: "TypeScript", level: 75, category: "Programming" },
      { name: "C++", level: 70, category: "Programming" },
      { name: "SQL", level: 85, category: "Programming" },
      { name: "R", level: 75, category: "Programming" },
    ]
  },
  {
    name: "DevOps & Cloud",
    skills: [
      { name: "Docker", level: 85, category: "DevOps & Cloud" },
      { name: "Kubernetes", level: 75, category: "DevOps & Cloud" },
      { name: "AWS", level: 80, category: "DevOps & Cloud" },
      { name: "GCP", level: 75, category: "DevOps & Cloud" },
      { name: "CI/CD", level: 80, category: "DevOps & Cloud" },
      { name: "MLOps", level: 85, category: "DevOps & Cloud" },
    ]
  }
];

const experienceData: Experience[] = [
  {
    company: "AI Research Lab",
    position: "Senior Machine Learning Engineer",
    startDate: "Jan 2023",
    current: true,
    location: "San Francisco, CA",
    description: "Leading research and development of transformer-based language models for various NLP tasks. Implementing state-of-the-art architectures and optimizing model performance.",
    achievements: [
      "Developed a novel attention mechanism that improved model efficiency by 15%",
      "Led a team of 5 engineers in deploying models to production",
      "Published 2 papers in top-tier ML conferences"
    ],
    technologies: ["PyTorch", "Transformers", "CUDA", "Python", "Docker", "Kubernetes"]
  },
  {
    company: "Tech Innovations Inc.",
    position: "Machine Learning Engineer",
    startDate: "Mar 2020",
    endDate: "Dec 2022",
    location: "Boston, MA",
    description: "Designed and implemented machine learning solutions for computer vision and NLP applications. Worked on model optimization and deployment pipelines.",
    achievements: [
      "Reduced inference time by 40% through model quantization and optimization",
      "Built an end-to-end MLOps pipeline that reduced deployment time from days to hours",
      "Mentored junior engineers and led technical workshops"
    ],
    technologies: ["TensorFlow", "Python", "AWS", "Docker", "CI/CD", "Computer Vision"]
  },
  {
    company: "Data Analytics Corp",
    position: "Data Scientist",
    startDate: "Jun 2018",
    endDate: "Feb 2020",
    location: "New York, NY",
    description: "Analyzed large datasets to extract insights and build predictive models. Collaborated with cross-functional teams to implement data-driven solutions.",
    achievements: [
      "Developed recommendation algorithms that increased user engagement by 25%",
      "Created automated reporting dashboards used by executive leadership",
      "Optimized ETL processes reducing data processing time by 60%"
    ],
    technologies: ["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau", "AWS"]
  }
];

const educationData: Education[] = [
  {
    institution: "Stanford University",
    degree: "Ph.D.",
    field: "Computer Science, Machine Learning",
    startDate: "2015",
    graduationDate: "2018",
    location: "Stanford, CA",
    description: "Focused on deep learning architectures for natural language processing. Thesis on attention mechanisms in neural networks.",
    achievements: [
      "Published 3 papers in top ML conferences",
      "Received departmental award for outstanding research",
      "Teaching assistant for graduate-level ML courses"
    ]
  },
  {
    institution: "Massachusetts Institute of Technology",
    degree: "M.S.",
    field: "Artificial Intelligence",
    startDate: "2013",
    graduationDate: "2015",
    location: "Cambridge, MA",
    description: "Specialized in machine learning algorithms and applications. Research on reinforcement learning for robotics.",
    achievements: [
      "Graduated with honors",
      "Research assistant in the Computer Science and AI Laboratory",
      "Recipient of merit-based scholarship"
    ]
  },
  {
    institution: "University of California, Berkeley",
    degree: "B.S.",
    field: "Computer Science",
    startDate: "2009",
    graduationDate: "2013",
    location: "Berkeley, CA",
    description: "Foundations in computer science with focus on algorithms and data structures. Minor in Mathematics.",
    achievements: [
      "Dean's List all semesters",
      "Undergraduate research in machine learning lab",
      "President of Computer Science Student Association"
    ]
  }
];

export default function AboutPage() {
  return (
    <Layout>
      <About 
        skills={skillsData}
        experience={experienceData}
        education={educationData}
      />
    </Layout>
  );
}