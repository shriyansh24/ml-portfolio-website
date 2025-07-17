import Image from "next/image";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/Button";
import { generateMetadata } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { FeaturedProjects } from "@/components/projects";
import { PortfolioProject } from "@/types";

export const metadata = generateMetadata({
  title: "ML Portfolio | Machine Learning Engineer",
  description: "Portfolio website showcasing machine learning projects, blog posts, and research papers focused on LLMs and AI",
  keywords: ["machine learning", "artificial intelligence", "LLM", "portfolio", "transformer", "deep learning"],
});

export default function Home() {
  // Animation variants for scroll animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section - Full width, outside container */}
      <Hero 
        title="Machine Learning Engineer Portfolio"
        subtitle="Specializing in LLMs, Transformers, and AI Applications"
        primaryButtonText="View Projects"
        secondaryButtonText="Contact Me"
        primaryButtonHref="#projects"
        secondaryButtonHref="#contact"
        backgroundImage="/images/hero-bg.jpg" // This is optional, can be removed if no image is available
      />

      {/* About Section - Brief version */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeInUp} className="order-2 md:order-1">
                <p className="text-lg mb-6 leading-relaxed">
                  Machine Learning Engineer with expertise in developing and deploying
                  state-of-the-art AI models, particularly in the field of natural
                  language processing and transformer architectures.
                </p>
                <p className="text-lg mb-6 leading-relaxed">
                  This portfolio showcases my projects, research interests, and
                  technical blog posts focused on machine learning and artificial
                  intelligence.
                </p>
                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-wrap gap-3 mt-8"
                >
                  {["Python", "PyTorch", "TensorFlow", "NLP", "Computer Vision", "MLOps"].map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
                
                <motion.div variants={fadeInUp} className="mt-8">
                  <Button variant="outline" href="/about">
                    View Full Profile
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp} 
                className="order-1 md:order-2 flex justify-center"
              >
                <div className="w-64 h-64 md:w-80 md:h-80 bg-muted rounded-full flex items-center justify-center overflow-hidden relative shadow-lg border-4 border-background">
                  <span className="text-muted-foreground absolute">Profile Image</span>
                  {/* Uncomment when you have an actual image */}
                  {/* <Image 
                    src="/profile.jpg" 
                    alt="ML Engineer Profile" 
                    fill 
                    className="object-cover"
                    priority
                  /> */}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section with alternating background */}
      <section id="projects" className="py-24 bg-accent/5">
        {/* Sample projects data - in a real application, this would come from an API or database */}
        <FeaturedProjects 
          projects={[
            {
              id: '1',
              title: 'Transformer-Based Text Summarization',
              description: 'An implementation of a transformer-based model for automatic text summarization, capable of generating concise summaries while preserving key information.',
              technologies: ['PyTorch', 'Transformers', 'NLP', 'Python'],
              githubUrl: 'https://github.com/username/text-summarization',
              liveUrl: 'https://demo-summarization.example.com',
              imageUrl: '/images/projects/summarization.jpg',
              featured: true
            },
            {
              id: '2',
              title: 'Reinforcement Learning for Robotics',
              description: 'A reinforcement learning framework for robotic control tasks, implementing PPO and SAC algorithms for efficient policy learning.',
              technologies: ['TensorFlow', 'Reinforcement Learning', 'Python', 'Robotics'],
              githubUrl: 'https://github.com/username/rl-robotics',
              imageUrl: '/images/projects/robotics.jpg',
              featured: true
            },
            {
              id: '3',
              title: 'ML Portfolio Website',
              description: 'A responsive portfolio website built with Next.js and TypeScript, featuring blog capabilities and interactive ML demonstrations.',
              technologies: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS'],
              githubUrl: 'https://github.com/username/ml-portfolio',
              liveUrl: 'https://ml-portfolio.example.com',
              imageUrl: '/images/projects/portfolio.jpg',
              featured: true
            }
          ]}
        />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div variants={fadeInUp}>
                <p className="text-lg mb-6 leading-relaxed">
                  Interested in collaborating or have questions about my work?
                  Feel free to reach out using the contact form or through my
                  social media profiles.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:contact@mlportfolio.com" className="text-muted-foreground hover:text-primary transition-colors">
                        contact@mlportfolio.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  {[
                    {
                      name: "GitHub",
                      href: "https://github.com",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      )
                    },
                    {
                      name: "LinkedIn",
                      href: "https://linkedin.com",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      )
                    },
                    {
                      name: "Twitter",
                      href: "https://twitter.com",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      )
                    }
                  ].map((social) => (
                    <motion.div
                      key={social.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="outline" 
                        size="icon" 
                        href={social.href} 
                        external
                        aria-label={social.name}
                      >
                        {social.icon}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <div className="bg-background border border-border rounded-lg p-6 shadow-md">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full p-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full p-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full p-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="primary" className="w-full py-6 text-base">
                        Send Message
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Section - Blog & Research Preview */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Content</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore my latest blog posts and research paper recommendations
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div variants={fadeInUp}>
                <div className="bg-background border border-border rounded-lg overflow-hidden shadow-md">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">Latest Blog Posts</h3>
                    <div className="space-y-6">
                      {[
                        {
                          title: "Understanding Attention Mechanisms in Transformers",
                          date: "June 15, 2025",
                          excerpt: "A deep dive into how attention mechanisms work and why they're so effective for NLP tasks."
                        },
                        {
                          title: "Fine-tuning LLMs for Domain-Specific Applications",
                          date: "May 28, 2025",
                          excerpt: "Techniques and best practices for adapting large language models to specialized domains."
                        }
                      ].map((post, i) => (
                        <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                          <h4 className="font-medium text-lg mb-1">
                            <a href="/blog" className="hover:text-primary transition-colors">
                              {post.title}
                            </a>
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                          <p className="text-muted-foreground">{post.excerpt}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button variant="outline" href="/blog">
                        View All Posts
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <div className="bg-background border border-border rounded-lg overflow-hidden shadow-md">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">Research Papers</h3>
                    <div className="space-y-6">
                      {[
                        {
                          title: "Attention Is All You Need",
                          authors: "Vaswani et al.",
                          venue: "NeurIPS 2017",
                          excerpt: "The original transformer paper that revolutionized natural language processing."
                        },
                        {
                          title: "BERT: Pre-training of Deep Bidirectional Transformers",
                          authors: "Devlin et al.",
                          venue: "NAACL 2019",
                          excerpt: "Bidirectional encoder representations from transformers for language understanding."
                        }
                      ].map((paper, i) => (
                        <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                          <h4 className="font-medium text-lg mb-1">
                            <a href="/research" className="hover:text-primary transition-colors">
                              {paper.title}
                            </a>
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">{paper.authors} • {paper.venue}</p>
                          <p className="text-muted-foreground">{paper.excerpt}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button variant="outline" href="/research">
                        View All Papers
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
