import Image from "next/image";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/Hero";
import Contact from "@/components/contact/Contact";
import { Button } from "@/components/ui/Button";
import { generateMetadata } from "@/components/SEOHead";
import { motion } from "framer-motion";
import FeaturedProjectsSection from "./FeaturedProjectsSection";

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
        {/* @ts-expect-error Async Server Component */}
        <FeaturedProjectsSection />
      </section>

      {/* Contact Section */}
      <Contact 
        title="Get In Touch"
        subtitle="Interested in collaborating or have questions about my work? Feel free to reach out using the contact form or through my social media profiles."
      />
      
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
