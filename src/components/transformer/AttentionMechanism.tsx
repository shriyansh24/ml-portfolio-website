import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ComponentTooltip from './ComponentTooltip';
import styles from './AttentionMechanism.module.css';

interface AttentionMechanismProps {
  headIndex: number;
  tokens: string[];
  className?: string;
}

/**
 * AttentionMechanism - Interactive visualization of the attention mechanism
 * Shows how tokens attend to each other with interactive highlighting
 */
const AttentionMechanism: React.FC<AttentionMechanismProps> = ({
  headIndex,
  tokens,
  className = '',
}) => {
  // Generate some sample attention weights (in a real implementation, these would come from a model)
  const generateAttentionWeights = () => {
    const numTokens = tokens.length;
    const weights = [];
    
    for (let i = 0; i < numTokens; i++) {
      const row = [];
      let sum = 0;
      
      // Generate random weights based on head index to make each head different
      for (let j = 0; j < numTokens; j++) {
        // Make attention patterns more interesting based on head index
        let weight = 0;
        
        if (headIndex % 3 === 0) {
          // Head 0, 3, 6, etc: Attend more to nearby tokens
          weight = Math.max(0.1, 1 - Math.abs(i - j) * 0.3);
        } else if (headIndex % 3 === 1) {
          // Head 1, 4, 7, etc: Attend more to the first token
          weight = j === 0 ? 0.7 : 0.3 / (numTokens - 1);
        } else {
          // Head 2, 5, 8, etc: More uniform attention
          weight = 0.8 / numTokens + Math.random() * 0.2;
        }
        
        row.push(weight);
        sum += weight;
      }
      
      // Normalize to make sure weights sum to 1
      weights.push(row.map(w => w / sum));
    }
    
    return weights;
  };

  const [attentionWeights, setAttentionWeights] = useState(generateAttentionWeights());
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Reset attention weights when tokens or head index changes
  useEffect(() => {
    setAttentionWeights(generateAttentionWeights());
    setSelectedToken(null);
  }, [tokens, headIndex]);

  // Handle token click
  const handleTokenClick = (index: number) => {
    setSelectedToken(selectedToken === index ? null : index);
  };

  // Get color intensity based on attention weight
  const getColorIntensity = (weight: number) => {
    const minOpacity = 0.1;
    const maxOpacity = 0.9;
    return minOpacity + weight * (maxOpacity - minOpacity);
  };

  // Get line thickness based on attention weight
  const getLineThickness = (weight: number) => {
    const minThickness = 1;
    const maxThickness = 3;
    return minThickness + weight * (maxThickness - minThickness);
  };

  // Determine if a connection should be highlighted
  const isConnectionHighlighted = (fromIndex: number, toIndex: number) => {
    if (selectedToken !== null) {
      return selectedToken === fromIndex;
    }
    if (hoveredToken !== null) {
      return hoveredToken === fromIndex;
    }
    return false;
  };

  return (
    <div className={`${styles.attentionContainer} ${className}`}>
      <div className="mb-2 text-center">
        <h4 className="text-sm font-medium text-blue-400">Attention Head {headIndex + 1}</h4>
        <p className="text-xs text-muted-foreground">
          Hover over tokens to see attention patterns
        </p>
      </div>

      <div className="relative w-full h-[200px] border border-border rounded-md bg-background/50">
        {/* Token display */}
        <div className="absolute top-4 left-0 w-full flex justify-around">
          {tokens.map((token, index) => (
            <ComponentTooltip
              key={`source-${index}`}
              content={
                <div>
                  <p className="font-medium">Query Token</p>
                  <p className="text-sm">"{token}"</p>
                  <p className="text-xs mt-1">Click to lock attention view</p>
                </div>
              }
            >
              <motion.div
                className={`${styles.tokenBox} ${
                  selectedToken === index
                    ? styles.sourceTokenActive
                    : hoveredToken === index
                    ? styles.sourceToken + ' opacity-80'
                    : styles.sourceToken
                }`}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setHoveredToken(index)}
                onMouseLeave={() => setHoveredToken(null)}
                onClick={() => handleTokenClick(index)}
              >
                {token}
              </motion.div>
            </ComponentTooltip>
          ))}
        </div>

        {/* Attention visualization */}
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {tokens.map((_, fromIndex) =>
            tokens.map((_, toIndex) => {
              const weight = attentionWeights[fromIndex][toIndex];
              const isHighlighted =
                isConnectionHighlighted(fromIndex, toIndex) ||
                (selectedToken !== null && selectedToken === toIndex);
              
              // Calculate positions
              const fromX = (fromIndex + 0.5) * (100 / tokens.length);
              const fromY = 15; // Source tokens at top
              const toX = (toIndex + 0.5) * (100 / tokens.length);
              const toY = 85; // Target tokens at bottom
              
              return (
                <motion.path
                  key={`attention-${fromIndex}-${toIndex}`}
                  d={`M ${fromX} ${fromY} C ${fromX} ${(fromY + toY) / 2}, ${toX} ${(fromY + toY) / 2}, ${toX} ${toY}`}
                  className={`${styles.attentionLine} ${isHighlighted ? styles.attentionLineHighlight : ''}`}
                  strokeWidth={getLineThickness(weight)}
                  fill="none"
                  opacity={isHighlighted ? 1 : getColorIntensity(weight)}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isHighlighted ? 1 : getColorIntensity(weight) }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              );
            })
          )}
        </svg>

        {/* Target tokens */}
        <div className="absolute bottom-4 left-0 w-full flex justify-around">
          {tokens.map((token, index) => (
            <ComponentTooltip
              key={`target-${index}`}
              content={
                <div>
                  <p className="font-medium">Key/Value Token</p>
                  <p className="text-sm">"{token}"</p>
                </div>
              }
            >
              <motion.div
                className={`${styles.tokenBox} ${
                  selectedToken !== null && selectedToken === index
                    ? styles.targetTokenActive
                    : hoveredToken !== null && hoveredToken === index
                    ? styles.targetToken + ' opacity-80'
                    : styles.targetToken
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {token}
              </motion.div>
            </ComponentTooltip>
          ))}
        </div>
      </div>

      {/* Weight legend */}
      <div className={styles.weightLegend}>
        <div className={styles.weightLegendItem}>
          <div className={`${styles.weightLegendColor} ${styles.lowWeight}`}></div>
          <span>Low</span>
        </div>
        <div className={styles.weightLegendItem}>
          <div className={`${styles.weightLegendColor} ${styles.medWeight}`}></div>
          <span>Medium</span>
        </div>
        <div className={styles.weightLegendItem}>
          <div className={`${styles.weightLegendColor} ${styles.highWeight}`}></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default AttentionMechanism;