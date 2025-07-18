import React from 'react';
import { motion } from 'framer-motion';

interface ArchitectureLayerExplanationProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

/**
 * ArchitectureLayerExplanation - A component that provides detailed explanations
 * for different parts of the transformer architecture
 */
const ArchitectureLayerExplanation: React.FC<ArchitectureLayerExplanationProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <motion.div
      className="p-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children}
    </motion.div>
  );
};

export default ArchitectureLayerExplanation;