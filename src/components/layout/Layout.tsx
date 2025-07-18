"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  animate?: boolean;
}

export default function Layout({ 
  children, 
  showHeader = true, 
  showFooter = true,
  animate = true 
}: LayoutProps) {
  // Fixed variants to match Framer Motion's expected type
  const mainVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {showHeader && <Header />}
      
      <AnimatePresence mode="wait">
        {animate ? (
          <motion.main 
            className="flex-grow"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mainVariants}
            key="main-content"
          >
            {children}
          </motion.main>
        ) : (
          <main className="flex-grow">{children}</main>
        )}
      </AnimatePresence>
      
      {showFooter && <Footer />}
    </div>
  );
}