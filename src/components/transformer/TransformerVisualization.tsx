import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ArchitectureLayer from './ArchitectureLayer';
import AttentionMechanism from './AttentionMechanism';
import ComponentTooltip from './ComponentTooltip';
import styles from './TransformerVisualization.module.css';

interface TransformerVisualizationProps {
  className?: string;
}

const TransformerVisualization: React.FC<TransformerVisualizationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState<'interactive' | 'scroll'>('interactive');
  const [sampleTokens, setSampleTokens] = useState(['Transformers', 'power', 'modern', 'AI']);
  
  // Load anime.js script
  useEffect(() => {
    const animeScript = document.createElement('script');
    animeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    animeScript.async = true;
    
    animeScript.onload = () => {
      setIsScriptLoaded(true);
    };
    
    document.head.appendChild(animeScript);
    
    return () => {
      if (document.head.contains(animeScript)) {
        document.head.removeChild(animeScript);
      }
    };
  }, []);
  
  // Initialize scroll-based visualization when switching to that mode
  useEffect(() => {
    if (visualizationMode === 'scroll' && isScriptLoaded) {
      initializeScrollVisualization();
    }
  }, [visualizationMode, isScriptLoaded]);
  
  // Initialize the scroll-based visualization
  const initializeScrollVisualization = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = ''; // Clear container
    
    // Create the scroll container
    const scrollContainer = document.createElement('div');
    scrollContainer.id = 'scroll-container';
    container.appendChild(scrollContainer);
    
    // Create intro section
    const introSection = document.createElement('section');
    introSection.id = 'intro-section';
    introSection.className = 'scroll-section';
    
    const introTextContainer = document.createElement('div');
    introTextContainer.id = 'intro-text-container';
    introSection.appendChild(introTextContainer);
    scrollContainer.appendChild(introSection);
    
    // Create embedding section
    const embeddingSection = document.createElement('section');
    embeddingSection.id = 'embedding-section';
    embeddingSection.className = 'scroll-section';
    
    const embeddingVizContainer = document.createElement('div');
    embeddingVizContainer.id = 'embedding-visualization-container';
    embeddingSection.appendChild(embeddingVizContainer);
    scrollContainer.appendChild(embeddingSection);
    
    // Create positional encoding section
    const posEncodingSection = document.createElement('section');
    posEncodingSection.id = 'positional-encoding-section';
    posEncodingSection.className = 'scroll-section';
    
    const posEncodingVizContainer = document.createElement('div');
    posEncodingVizContainer.id = 'positional-encoding-visualization-container';
    posEncodingVizContainer.className = 'viz-container';
    posEncodingSection.appendChild(posEncodingVizContainer);
    scrollContainer.appendChild(posEncodingSection);
    
    // Add data flow SVG container
    const dataFlowSvgContainer1 = document.createElement('div');
    dataFlowSvgContainer1.className = 'data-flow-svg-container';
    
    const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg1.classList.add('inter-component-flow-svg');
    svg1.id = 'svg-flow-posenc-to-encmha';
    svg1.setAttribute('width', '100%');
    svg1.setAttribute('height', '100px');
    dataFlowSvgContainer1.appendChild(svg1);
    scrollContainer.appendChild(dataFlowSvgContainer1);
    
    // Create encoder section
    const encoderSection = document.createElement('section');
    encoderSection.id = 'encoder-section';
    encoderSection.className = 'scroll-section';
    
    const encoderTitle = document.createElement('h2');
    encoderTitle.textContent = 'Encoder Block';
    encoderSection.appendChild(encoderTitle);
    
    // Create multi-head attention container
    const mhaContainer = document.createElement('div');
    mhaContainer.id = 'multi-head-attention-container';
    mhaContainer.className = 'viz-container';
    
    const mhaTitle = document.createElement('h3');
    mhaTitle.textContent = 'Multi-Head Attention';
    mhaContainer.appendChild(mhaTitle);
    
    // Create MHA input split container
    const mhaInputSplitContainer = document.createElement('div');
    mhaInputSplitContainer.id = 'mha-input-split-container';
    mhaContainer.appendChild(mhaInputSplitContainer);
    
    // Create MHA heads container
    const mhaHeadsContainer = document.createElement('div');
    mhaHeadsContainer.id = 'mha-heads-container';
    
    // Create example head
    const mhaHead1 = document.createElement('div');
    mhaHead1.className = 'mha-head';
    mhaHead1.id = 'mha-head-1';
    
    const headTitle = document.createElement('h4');
    headTitle.textContent = 'Head 1';
    mhaHead1.appendChild(headTitle);
    
    // Create QKV generation container
    const qkvGenContainer = document.createElement('div');
    qkvGenContainer.className = 'qkv-gen-container';
    
    const qkvGenText = document.createElement('p');
    qkvGenText.textContent = 'Q, K, V Generation';
    qkvGenContainer.appendChild(qkvGenText);
    mhaHead1.appendChild(qkvGenContainer);
    
    // Create attention scores container
    const attentionScoresContainer = document.createElement('div');
    attentionScoresContainer.className = 'attention-scores-container';
    
    const attentionScoresText = document.createElement('p');
    attentionScoresText.textContent = 'Attention Scores (Q & K)';
    attentionScoresContainer.appendChild(attentionScoresText);
    
    const attentionSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    attentionSvg.classList.add('attention-svg');
    attentionSvg.setAttribute('width', '100%');
    attentionSvg.setAttribute('height', '100px');
    attentionScoresContainer.appendChild(attentionSvg);
    mhaHead1.appendChild(attentionScoresContainer);
    
    // Create softmax container
    const softmaxContainer = document.createElement('div');
    softmaxContainer.className = 'softmax-container';
    
    const softmaxText = document.createElement('p');
    softmaxText.textContent = 'Softmax';
    softmaxContainer.appendChild(softmaxText);
    mhaHead1.appendChild(softmaxContainer);
    
    // Create weighted sum container
    const weightedSumContainer = document.createElement('div');
    weightedSumContainer.className = 'weighted-sum-container';
    
    const weightedSumText = document.createElement('p');
    weightedSumText.textContent = 'Weighted Sum (V)';
    weightedSumContainer.appendChild(weightedSumText);
    mhaHead1.appendChild(weightedSumContainer);
    
    mhaHeadsContainer.appendChild(mhaHead1);
    mhaContainer.appendChild(mhaHeadsContainer);
    
    // Create MHA concat container
    const mhaConcatContainer = document.createElement('div');
    mhaConcatContainer.id = 'mha-concat-container';
    
    const concatTitle = document.createElement('h4');
    concatTitle.textContent = 'Concatenation & Output';
    mhaConcatContainer.appendChild(concatTitle);
    mhaContainer.appendChild(mhaConcatContainer);
    
    encoderSection.appendChild(mhaContainer);
    
    // Add more encoder components (add & norm, feed-forward, etc.)
    // Data flow SVG container
    const dataFlowSvgContainer2 = document.createElement('div');
    dataFlowSvgContainer2.className = 'data-flow-svg-container';
    
    const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg2.classList.add('inter-component-flow-svg');
    svg2.id = 'svg-flow-encmha-to-addnorm1';
    svg2.setAttribute('width', '100%');
    svg2.setAttribute('height', '100px');
    dataFlowSvgContainer2.appendChild(svg2);
    encoderSection.appendChild(dataFlowSvgContainer2);
    
    // Add & Norm 1
    const addNorm1Container = document.createElement('div');
    addNorm1Container.id = 'add-norm-1-container';
    addNorm1Container.className = 'viz-container';
    
    const addNorm1Title = document.createElement('h3');
    addNorm1Title.textContent = 'Add & Norm (1)';
    addNorm1Container.appendChild(addNorm1Title);
    encoderSection.appendChild(addNorm1Container);
    
    // Data flow SVG container
    const dataFlowSvgContainer3 = document.createElement('div');
    dataFlowSvgContainer3.className = 'data-flow-svg-container';
    
    const svg3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg3.classList.add('inter-component-flow-svg');
    svg3.id = 'svg-flow-addnorm1-to-ffn';
    svg3.setAttribute('width', '100%');
    svg3.setAttribute('height', '100px');
    dataFlowSvgContainer3.appendChild(svg3);
    encoderSection.appendChild(dataFlowSvgContainer3);
    
    // Feed-Forward Network
    const feedForwardContainer = document.createElement('div');
    feedForwardContainer.id = 'feed-forward-container';
    feedForwardContainer.className = 'viz-container';
    
    const ffnTitle = document.createElement('h3');
    ffnTitle.textContent = 'Feed-Forward Network';
    feedForwardContainer.appendChild(ffnTitle);
    encoderSection.appendChild(feedForwardContainer);
    
    // Data flow SVG container
    const dataFlowSvgContainer4 = document.createElement('div');
    dataFlowSvgContainer4.className = 'data-flow-svg-container';
    
    const svg4 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg4.classList.add('inter-component-flow-svg');
    svg4.id = 'svg-flow-ffn-to-addnorm2';
    svg4.setAttribute('width', '100%');
    svg4.setAttribute('height', '100px');
    dataFlowSvgContainer4.appendChild(svg4);
    encoderSection.appendChild(dataFlowSvgContainer4);
    
    // Add & Norm 2
    const addNorm2Container = document.createElement('div');
    addNorm2Container.id = 'add-norm-2-container';
    addNorm2Container.className = 'viz-container';
    
    const addNorm2Title = document.createElement('h3');
    addNorm2Title.textContent = 'Add & Norm (2)';
    addNorm2Container.appendChild(addNorm2Title);
    encoderSection.appendChild(addNorm2Container);
    
    scrollContainer.appendChild(encoderSection);
    
    // Add scroll spacer
    const scrollSpacer = document.createElement('div');
    scrollSpacer.id = 'scroll-spacer';
    scrollContainer.appendChild(scrollSpacer);
    
    // Add tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '0.9em';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '1000';
    tooltip.style.whiteSpace = 'pre-wrap';
    tooltip.textContent = 'Tooltip';
    container.appendChild(tooltip);
    
    // Load and execute the visualization script
    import('./transformerScript').then(module => {
      const script = module.default;
      script();
    }).catch(error => {
      console.error('Error loading transformer script:', error);
    });
  };

  // Handle layer click
  const handleLayerClick = (layerId: string) => {
    setActiveLayer(activeLayer === layerId ? null : layerId);
  };

  // Render the interactive visualization
  const renderInteractiveVisualization = () => {
    return (
      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Transformer Architecture</h2>
          <button 
            onClick={() => setVisualizationMode('scroll')}
            className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
          >
            Switch to Scroll Animation
          </button>
        </div>

        {/* Input Tokens */}
        <div className="mb-8">
          <ComponentTooltip
            content={
              <div>
                <h4 className="font-bold mb-1">Input Tokens</h4>
                <p className="text-sm">The input text is split into tokens that the transformer processes.</p>
              </div>
            }
          >
            <div className="p-3 border border-border rounded-md bg-background/50 mb-2">
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Input Tokens</h3>
              <div className="flex flex-wrap gap-2">
                {sampleTokens.map((token, index) => (
                  <motion.div
                    key={index}
                    className="px-2 py-1 bg-amber-500/10 border border-amber-900 rounded text-amber-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {token}
                  </motion.div>
                ))}
              </div>
            </div>
          </ComponentTooltip>
        </div>

        {/* Architecture Layers */}
        <div className="space-y-6">
          {/* Embedding Layer */}
          <ArchitectureLayer
            title="Token Embedding"
            description="Converts each token into a vector representation that captures its meaning."
            type="embedding"
            isActive={activeLayer === 'embedding'}
            onClick={() => handleLayerClick('embedding')}
          >
            {activeLayer === 'embedding' && (
              <motion.div 
                className="mt-4 p-3 bg-amber-950/30 border border-amber-900 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Each token is converted to a high-dimensional vector (typically 512-1024 dimensions) 
                  that represents its semantic meaning.
                </p>
                <div className="flex justify-center">
                  {sampleTokens.map((token, index) => (
                    <div key={index} className="flex flex-col items-center mx-2">
                      <div className="text-sm text-amber-400 mb-1">{token}</div>
                      <motion.div 
                        className="w-4 h-16 bg-amber-500/70 rounded-sm"
                        initial={{ height: 0 }}
                        animate={{ height: 64 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </ArchitectureLayer>

          {/* Positional Encoding Layer */}
          <ArchitectureLayer
            title="Positional Encoding"
            description="Adds information about token position in the sequence, since transformer has no inherent notion of order."
            type="normalization"
            isActive={activeLayer === 'positional'}
            onClick={() => handleLayerClick('positional')}
          >
            {activeLayer === 'positional' && (
              <motion.div 
                className="mt-4 p-3 bg-green-950/30 border border-green-900 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Since transformers process all tokens simultaneously, positional encoding adds 
                  information about where each token appears in the sequence.
                </p>
                <div className="flex justify-center">
                  {sampleTokens.map((token, index) => (
                    <div key={index} className="flex flex-col items-center mx-2">
                      <div className="text-sm text-green-400 mb-1">Position {index + 1}</div>
                      <div className="relative">
                        <motion.div 
                          className="w-4 h-16 bg-amber-500/70 rounded-sm"
                        />
                        <motion.div 
                          className="absolute top-0 left-0 w-4 h-16 bg-green-500/50 rounded-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </ArchitectureLayer>

          {/* Self-Attention Layer */}
          <ArchitectureLayer
            title="Multi-Head Self-Attention"
            description="The core mechanism that allows tokens to attend to other tokens, capturing relationships regardless of distance."
            type="attention"
            isActive={activeLayer === 'attention'}
            onClick={() => handleLayerClick('attention')}
          >
            {activeLayer === 'attention' && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Self-attention allows each token to focus on relevant parts of the input sequence.
                  Multiple attention heads capture different types of relationships.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <AttentionMechanism headIndex={0} tokens={sampleTokens} />
                  <AttentionMechanism headIndex={1} tokens={sampleTokens} />
                </div>
                
                <div className="mt-4 p-3 bg-blue-950/30 border border-blue-900 rounded-md">
                  <h4 className="text-sm font-medium text-blue-400 mb-2">How Self-Attention Works</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                    <li>Each token creates three vectors: Query (Q), Key (K), and Value (V)</li>
                    <li>Attention scores are calculated by comparing each Query with all Keys</li>
                    <li>Scores are normalized using Softmax to create attention weights</li>
                    <li>Each token's output is a weighted sum of all Value vectors</li>
                    <li>Multiple attention heads are concatenated and projected</li>
                  </ol>
                </div>
              </motion.div>
            )}
          </ArchitectureLayer>

          {/* Add & Norm Layer */}
          <ArchitectureLayer
            title="Add & Norm"
            description="Residual connection and layer normalization that helps with training stability and information flow."
            type="normalization"
            isActive={activeLayer === 'addnorm'}
            onClick={() => handleLayerClick('addnorm')}
          >
            {activeLayer === 'addnorm' && (
              <motion.div 
                className="mt-4 p-3 bg-green-950/30 border border-green-900 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Add & Norm combines two important techniques:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-1">Residual Connection</h4>
                    <p className="text-xs text-muted-foreground">
                      Adds the input directly to the output of the previous layer, helping with gradient flow during training.
                    </p>
                    <div className="flex justify-center mt-2">
                      <div className="flex items-center">
                        <div className="w-4 h-12 bg-blue-500/70 rounded-sm mr-2"></div>
                        <div className="text-xl">+</div>
                        <div className="w-4 h-12 bg-amber-500/70 rounded-sm mx-2"></div>
                        <div className="text-xl">=</div>
                        <div className="w-4 h-12 bg-green-500/70 rounded-sm ml-2"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-1">Layer Normalization</h4>
                    <p className="text-xs text-muted-foreground">
                      Normalizes the values across each feature dimension, stabilizing training.
                    </p>
                    <div className="flex justify-center mt-2">
                      <motion.div 
                        className="w-full max-w-xs h-8 bg-gradient-to-r from-green-700/50 via-green-500/50 to-green-700/50 rounded-sm"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </ArchitectureLayer>

          {/* Feed-Forward Layer */}
          <ArchitectureLayer
            title="Feed-Forward Network"
            description="A simple neural network applied to each position separately, adding non-linearity and processing capacity."
            type="feedforward"
            isActive={activeLayer === 'feedforward'}
            onClick={() => handleLayerClick('feedforward')}
          >
            {activeLayer === 'feedforward' && (
              <motion.div 
                className="mt-4 p-3 bg-purple-950/30 border border-purple-900 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  The feed-forward network processes each token independently through two linear transformations 
                  with a ReLU activation in between.
                </p>
                
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {sampleTokens.map((_, index) => (
                      <motion.div 
                        key={index}
                        className="w-4 h-12 bg-green-500/70 rounded-sm mx-auto"
                        initial={{ height: 0 }}
                        animate={{ height: 48 }}
                        transition={{ delay: index * 0.1 }}
                      />
                    ))}
                  </div>
                  
                  <motion.div 
                    className="w-full h-px bg-purple-500 mb-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                  />
                  
                  <div className="text-sm text-purple-400 mb-2">Linear Layer 1 + ReLU</div>
                  
                  <div className="grid grid-cols-8 gap-1 mb-4">
                    {Array(8).fill(0).map((_, index) => (
                      <motion.div 
                        key={index}
                        className="w-3 h-8 bg-purple-500/70 rounded-sm mx-auto"
                        initial={{ height: 0 }}
                        animate={{ height: 32 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      />
                    ))}
                  </div>
                  
                  <motion.div 
                    className="w-full h-px bg-purple-500 mb-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9 }}
                  />
                  
                  <div className="text-sm text-purple-400 mb-2">Linear Layer 2</div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {sampleTokens.map((_, index) => (
                      <motion.div 
                        key={index}
                        className="w-4 h-12 bg-purple-500/70 rounded-sm mx-auto"
                        initial={{ height: 0 }}
                        animate={{ height: 48 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </ArchitectureLayer>
        </div>

        {/* Mode Switch Button (Mobile) */}
        <div className="mt-8 text-center md:hidden">
          <button 
            onClick={() => setVisualizationMode('scroll')}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
          >
            Switch to Scroll Animation
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`transformer-visualization-container ${className}`}>
      <div 
        ref={containerRef} 
        className={styles.visualizationWrapper}
      >
        {visualizationMode === 'interactive' && renderInteractiveVisualization()}
      </div>
    </div>
  );
};

export default TransformerVisualization;