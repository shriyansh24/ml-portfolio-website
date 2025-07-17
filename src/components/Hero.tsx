import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonHref?: string;
  backgroundImage?: string;
}

export default function Hero({
  title,
  subtitle,
  primaryButtonText = "View Projects",
  secondaryButtonText = "Contact Me",
  primaryButtonHref = "#projects",
  secondaryButtonHref = "#contact",
  backgroundImage,
}: HeroProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    },
  };

  const highlightVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "100%", 
      transition: { 
        delay: 0.8, 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/50 to-background z-10" />
      
      {/* Optional background image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image 
            src={backgroundImage} 
            alt="Hero background" 
            fill 
            priority
            className="object-cover opacity-20"
          />
        </div>
      )}
      
      {/* Hero content */}
      <div className="container mx-auto px-4 relative z-20">
        <motion.div 
          className="py-24 md:py-32 flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6 relative">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              {title.split(' ').map((word, i) => (
                <span key={i} className="inline-block">
                  {word}{' '}
                </span>
              ))}
            </h1>
            <motion.div 
              className="h-1 bg-primary mt-2 mx-auto"
              variants={highlightVariants}
            />
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10"
          >
            {subtitle}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex gap-4 flex-wrap justify-center"
          >
            <Button 
              variant="primary" 
              size="lg" 
              href={primaryButtonHref}
              className="transition-transform hover:scale-105"
            >
              {primaryButtonText}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              href={secondaryButtonHref}
              className="transition-transform hover:scale-105"
            >
              {secondaryButtonText}
            </Button>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden md:block"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          >
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
              className="h-6 w-6 text-muted-foreground"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}