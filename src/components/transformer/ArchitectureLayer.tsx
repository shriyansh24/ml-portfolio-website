import React from 'react';
import { motion } from 'framer-motion';
import ComponentTooltip from './ComponentTooltip';

interface ArchitectureLayerProps {
  title: string;
  description: string;
  type: 'attention' | 'feedforward' | 'normalization' | 'embedding';
  children?: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * ArchitectureLayer - A component representing a layer in the transformer architecture
 * Used to visualize different parts of the transformer with consistent styling and interactivity
 */
const ArchitectureLayer: React.FC<ArchitectureLayerProps> = ({
  title,
  description,
  type,
  children,
  className = '',
  isActive = false,
  onClick,
}) => {
  // Define colors based on layer type
  const getLayerColors = () => {
    switch (type) {
      case 'attention':
        return {
          bg: 'bg-blue-950/30',
          border: isActive ? 'border-blue-500' : 'border-blue-900',
          highlight: 'bg-blue-500/10',
          text: 'text-blue-400'
        };
      case 'feedforward':
        return {
          bg: 'bg-purple-950/30',
          border: isActive ? 'border-purple-500' : 'border-purple-900',
          highlight: 'bg-purple-500/10',
          text: 'text-purple-400'
        };
      case 'normalization':
        return {
          bg: 'bg-green-950/30',
          border: isActive ? 'border-green-500' : 'border-green-900',
          highlight: 'bg-green-500/10',
          text: 'text-green-400'
        };
      case 'embedding':
        return {
          bg: 'bg-amber-950/30',
          border: isActive ? 'border-amber-500' : 'border-amber-900',
          highlight: 'bg-amber-500/10',
          text: 'text-amber-400'
        };
      default:
        return {
          bg: 'bg-slate-950/30',
          border: isActive ? 'border-slate-500' : 'border-slate-900',
          highlight: 'bg-slate-500/10',
          text: 'text-slate-400'
        };
    }
  };

  const colors = getLayerColors();

  // Tooltip content
  const tooltipContent = (
    <div>
      <h4 className={`font-bold mb-1 ${colors.text}`}>{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      {isActive ? null : <p className="text-xs mt-2 italic text-muted-foreground">Click to explore</p>}
    </div>
  );

  return (
    <ComponentTooltip content={tooltipContent}>
      <motion.div
        className={`architecture-layer ${colors.bg} ${colors.border} border rounded-lg p-4 transition-all duration-300 ${className} ${isActive ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
        whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-lg font-medium ${colors.text}`}>{title}</h3>
          {isActive && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              Active
            </span>
          )}
        </div>
        {children}
      </motion.div>
    </ComponentTooltip>
  );
};

export default ArchitectureLayer;