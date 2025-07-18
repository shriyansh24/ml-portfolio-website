// This script is adapted from the original transformer visualization
// It's been enhanced with interactive elements and explanations

declare global {
  interface Window {
    anime: any;
  }
}

const transformerScript = () => {
  // Wait for anime.js to be available
  if (typeof window === "undefined" || !window.anime) {
    console.warn("anime.js not loaded yet");
    return;
  }

  const anime = window.anime;
  
  // Add component tooltip functionality
  const addTooltips = () => {
    const components = document.querySelectorAll('.viz-container, .mha-head, .attention-scores-container, .softmax-container, .weighted-sum-container');
    const tooltip = document.getElementById('tooltip');
    
    if (!tooltip) return;
    
    const tooltipContent = {
      'multi-head-attention-container': 'Multi-Head Attention allows the model to focus on different parts of the input sequence simultaneously, capturing various types of relationships between tokens.',
      'mha-head-1': 'Each attention head learns to focus on different aspects of the relationships between tokens.',
      'attention-scores-container': 'Attention scores are calculated by comparing each token\'s query vector with all tokens\' key vectors, showing how much each token should attend to others.',
      'softmax-container': 'The softmax function normalizes attention scores into a probability distribution, ensuring they sum to 1.',
      'weighted-sum-container': 'Each token\'s output is a weighted sum of all value vectors, with weights determined by attention scores.',
      'add-norm-1-container': 'Add & Norm combines residual connections (adding the input to the output) with layer normalization for training stability.',
      'feed-forward-container': 'The feed-forward network processes each token independently through two linear transformations with a ReLU activation.',
      'add-norm-2-container': 'A second Add & Norm layer stabilizes the output of the feed-forward network.',
      'embedding-visualization-container': 'Token embeddings convert words into high-dimensional vectors that capture semantic meaning.',
      'positional-encoding-visualization-container': 'Positional encodings add information about token position in the sequence, since transformers have no inherent notion of order.'
    };
    
    // Add event listeners to components
    components.forEach(component => {
      const id = component.id || component.className.split(' ')[0];
      const content = tooltipContent[id];
      
      if (!content) return;
      
      component.addEventListener('mouseenter', (e) => {
        tooltip.textContent = content;
        tooltip.style.display = 'block';
        
        // Add interactive highlight class
        component.classList.add('component-highlight');
        
        // Position tooltip near the mouse
        updateTooltipPosition(e);
      });
      
      component.addEventListener('mousemove', updateTooltipPosition);
      
      component.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        component.classList.remove('component-highlight');
      });
    });
    
    // Update tooltip position based on mouse event
    function updateTooltipPosition(e: MouseEvent) {
      if (!tooltip) return;
      
      const padding = 15;
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      
      // Position tooltip to avoid going off screen
      let left = e.clientX + padding;
      let top = e.clientY + padding;
      
      // Adjust if tooltip would go off right edge
      if (left + tooltipWidth > window.innerWidth) {
        left = e.clientX - tooltipWidth - padding;
      }
      
      // Adjust if tooltip would go off bottom edge
      if (top + tooltipHeight > window.innerHeight) {
        top = e.clientY - tooltipHeight - padding;
      }
      
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }
  };

  // DOM Elements
  const introSection = document.getElementById("intro-section");
  const introTextContainer = document.getElementById("intro-text-container");
  const embeddingSection = document.getElementById("embedding-section");
  const embeddingVizContainer = document.getElementById("embedding-visualization-container");
  const posEncodingSection = document.getElementById("positional-encoding-section");
  const posEncodingVizContainer = document.getElementById(
    "positional-encoding-visualization-container"
  );
  const encoderSection = document.getElementById("encoder-section");
  const multiHeadAttentionContainer = document.getElementById("multi-head-attention-container");
  const addNorm1Container = document.getElementById("add-norm-1-container");
  const feedForwardContainer = document.getElementById("feed-forward-container");
  const addNorm2Container = document.getElementById("add-norm-2-container");

  // Check if all required elements exist
  if (
    !introSection ||
    !introTextContainer ||
    !embeddingSection ||
    !embeddingVizContainer ||
    !posEncodingSection ||
    !posEncodingVizContainer ||
    !encoderSection ||
    !multiHeadAttentionContainer ||
    !addNorm1Container ||
    !feedForwardContainer ||
    !addNorm2Container
  ) {
    console.error("Required DOM elements not found");
    return;
  }

  const initialText = "Transformers power modern AI";
  let tokenElements: HTMLElement[] = [];
  let embeddingElements: HTMLElement[] = [];

  // For detailed MHA
  let mhaInputEmbeddingClones: HTMLElement[] = [];
  let headSpecificQKV: Record<string, { q: HTMLElement[]; k: HTMLElement[]; v: HTMLElement[] }> =
    {};
  let attentionLines: Record<string, SVGLineElement[]> = {};
  let softmaxBars: Record<string, HTMLElement[][]> = {};
  let weightedValues: Record<string, HTMLElement[]> = {};
  let concatenatedHeadOutputs: HTMLElement[] = [];

  let postAttentionEmbeddings: HTMLElement[] = [];
  let postFFEmbeddings: HTMLElement[] = [];

  // Master timeline for scroll-controlled animations
  const masterTimeline = anime.timeline({
    autoplay: false,
    easing: "easeInOutSine",
  });

  const SCROLL_PER_STEP = window.innerHeight * 1.75; // Base for non-MHA steps
  const NUM_MHA_SUB_STEPS = 6; // InputSplit, QKVGen, Scores, Softmax, WeightedSum, Concat
  const MHA_INDIVIDUAL_SUB_STEP_SCROLL = window.innerHeight * 0.75; // Scroll for each MHA sub-step
  const MHA_TOTAL_SCROLL_DURATION = MHA_INDIVIDUAL_SUB_STEP_SCROLL * NUM_MHA_SUB_STEPS;

  const NUM_NON_MHA_MAJOR_STEPS = 3; // Intro, Embed, PosEncode.
  // Encoder block: MHA (6 sub-steps) + AddNorm1 (0.5) + FFN (0.4) + AddNorm2 (0.4) = ~ MHA_TOTAL_SCROLL_DURATION + SCROLL_PER_STEP * 1.3
  const ENCODER_BLOCK_SCROLL_DURATION = MHA_TOTAL_SCROLL_DURATION + SCROLL_PER_STEP * 1.3;

  const totalAnimationScrollHeight =
    SCROLL_PER_STEP * NUM_NON_MHA_MAJOR_STEPS + ENCODER_BLOCK_SCROLL_DURATION;

  const scrollSpacer = document.getElementById("scroll-spacer");
  if (scrollSpacer) {
    scrollSpacer.style.height = `${totalAnimationScrollHeight}px`;
  }

  function createIntroAnimation() {
    if (!introTextContainer) return;

    introTextContainer.innerHTML = "";
    const words = initialText.split(" ");
    words.forEach((word, index) => {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("word");
      wordSpan.style.display = "inline-block";
      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.textContent = char;
        charSpan.classList.add("char");
        charSpan.style.display = "inline-block";
        charSpan.style.opacity = "0";
        wordSpan.appendChild(charSpan);
      });
      introTextContainer.appendChild(wordSpan);
      if (index < words.length - 1) {
        introTextContainer.appendChild(document.createTextNode(" "));
      }
    });

    masterTimeline.add(
      {
        targets: "#intro-text-container .char",
        opacity: [0, 1],
        translateY: ["1em", 0],
        rotateZ: [anime.random(15, 30), 0], // Slightly more varied rotation
        duration: 1200, // Slightly longer duration
        delay: anime.stagger(35), // Slightly more delay
        easing: "easeOutQuint", // More pronounced easing at the end
      },
      0
    );

    document.querySelectorAll("#intro-text-container .word").forEach((wordSpan) => {
      tokenElements.push(wordSpan as HTMLElement);
    });
  }

  function createEmbeddingAnimation() {
    if (tokenElements.length === 0 || !embeddingVizContainer) return;

    tokenElements.forEach((tokenEl, i) => {
      const embedDiv = document.createElement("div");
      embedDiv.classList.add("embedding-vector");
      embedDiv.style.opacity = "0";
      const tokenRect = tokenEl.getBoundingClientRect();
      embedDiv.style.position = "absolute";
      embedDiv.style.left = `${tokenRect.left + window.scrollX}px`;
      embedDiv.style.top = `${tokenRect.top + window.scrollY}px`;
      embeddingVizContainer.appendChild(embedDiv);
      embeddingElements.push(embedDiv);
    });

    masterTimeline.add(
      {
        targets: tokenElements,
        opacity: [1, 0],
        translateY: [0, -50], // Move further up
        scale: [1, 0.7], // Shrink a bit as they fade
        duration: 600, // Slightly longer
        easing: "easeInOutQuad",
        delay: anime.stagger(80), // Slightly less delay
      },
      SCROLL_PER_STEP * 0.8
    );

    masterTimeline.add(
      {
        targets: embeddingElements,
        opacity: [0, 1],
        height: [0, "70px"], // Adjusted height from style.css
        width: ["4px", "12px"], // Adjusted width from style.css
        translateX: (el: HTMLElement, i: number) => {
          if (!embeddingVizContainer) return 0;
          const containerWidth = embeddingVizContainer.offsetWidth;
          const numElements = embeddingElements.length;
          const spacing = (containerWidth * 0.8) / numElements; // Use 80% of width for spacing
          const offset = containerWidth * 0.1; // 10% margin on left
          return (
            offset +
            spacing * i +
            spacing / 2 -
            el.offsetWidth / 2 -
            containerWidth / 2 +
            el.offsetWidth / 2
          );
        },
        translateY: (el: HTMLElement, i: number) => {
          if (!embeddingVizContainer) return 0;
          return embeddingVizContainer.offsetHeight / 2 - el.offsetHeight / 2 - 150; // Centered, then pushed up
        },
        backgroundColor: ["#ccc", "#4dd0e1"],
        duration: 1000,
        delay: anime.stagger(100),
      },
      SCROLL_PER_STEP * 1.0
    );
  }

  function createPositionalEncodingAnimation() {
    if (embeddingElements.length === 0 || !posEncodingVizContainer) return;

    embeddingElements.forEach((embedEl, i) => {
      const waveContainer = document.createElement("div");
      waveContainer.classList.add("positional-encoding-wave-container");
      waveContainer.style.position = "absolute";
      waveContainer.style.width = `${embedEl.offsetWidth}px`; // Match width of embedding
      waveContainer.style.height = `${embedEl.offsetHeight}px`; // Match height
      waveContainer.style.left = `${embedEl.offsetLeft}px`;
      waveContainer.style.top = `${embedEl.offsetTop}px`;
      waveContainer.style.overflow = "hidden";
      waveContainer.style.opacity = "0"; // Start hidden

      const wave = document.createElement("div");
      wave.classList.add("positional-encoding-wave");
      wave.style.width = "200%";
      wave.style.height = "100%";
      wave.style.backgroundImage = `linear-gradient(45deg, rgba(255,171,64,0) 0%, rgba(255,171,64,0.7) ${20 + i * 5}%, rgba(255,209,128,0.5) ${40 + i * 5}%, rgba(255,171,64,0) 100%)`;
      wave.style.opacity = "0.8"; // Wave itself is visible
      waveContainer.appendChild(wave);
      posEncodingVizContainer.appendChild(waveContainer); // Add to specific container

      masterTimeline.add(
        {
          targets: waveContainer,
          opacity: [0, 1, 0],
          duration: 1800, // Slightly longer for the effect
          easing: "easeInOutQuad",
        },
        SCROLL_PER_STEP * 2.0 + i * 100
      ); // Increased stagger

      masterTimeline.add(
        {
          targets: wave,
          translateX: ["-100%", "100%"],
          duration: 1600, // Slightly longer
          easing: "cubicBezier(0.40, 0, 0.60, 1)", // Smoother, less strictly linear
        },
        SCROLL_PER_STEP * 2.0 + i * 100 + 100
      );

      masterTimeline.add(
        {
          targets: embedEl,
          borderColor: ["transparent", "#ffab40", "transparent"], // Ensure starts transparent
          scale: [1, 1.15, 1], // Slightly more pronounced scale
          duration: 1800, // Match wave container
          easing: "easeInOutQuad",
        },
        SCROLL_PER_STEP * 2.0 + i * 100
      );
    });
  }

  function createEncoderAnimation() {
    if (embeddingElements.length === 0 || !multiHeadAttentionContainer) return;

    const numHeads = 2;

    // Define start times for each major phase within the encoder
    const positionalEncodingEndOffset = SCROLL_PER_STEP * 2; // End of Positional Encoding

    const mhaInputSplitStart = positionalEncodingEndOffset + SCROLL_PER_STEP * 0.2;
    const qkvGenStart = mhaInputSplitStart + MHA_INDIVIDUAL_SUB_STEP_SCROLL;
    const attentionScoresStart = qkvGenStart + MHA_INDIVIDUAL_SUB_STEP_SCROLL;
    const softmaxStart = attentionScoresStart + MHA_INDIVIDUAL_SUB_STEP_SCROLL;
    const weightedSumStart = softmaxStart + MHA_INDIVIDUAL_SUB_STEP_SCROLL;
    const concatStart = weightedSumStart + MHA_INDIVIDUAL_SUB_STEP_SCROLL; // End of MHA proper for Encoder

    // Encoder's AddNorm1, FFN, AddNorm2
    const encoderAddNorm1Start = concatStart + MHA_INDIVIDUAL_SUB_STEP_SCROLL * 0.5; // Shorter transition
    const encoderFfnStart = encoderAddNorm1Start + SCROLL_PER_STEP * 0.4;
    const encoderAddNorm2Start = encoderFfnStart + SCROLL_PER_STEP * 0.4;

    // Clear previous MHA elements if any
    const mhaHeadsContainer = multiHeadAttentionContainer.querySelector("#mha-heads-container");
    const mhaInputSplitContainer = multiHeadAttentionContainer.querySelector(
      "#mha-input-split-container"
    );
    const mhaConcatContainer = multiHeadAttentionContainer.querySelector("#mha-concat-container");

    if (mhaHeadsContainer) mhaHeadsContainer.innerHTML = "";
    if (mhaInputSplitContainer) mhaInputSplitContainer.innerHTML = "";
    if (mhaConcatContainer) mhaConcatContainer.innerHTML = "<h4>Concatenation & Output</h4>";

    headSpecificQKV = {};
    attentionLines = {};
    softmaxBars = {};
    weightedValues = {};
    mhaInputEmbeddingClones = [];
    concatenatedHeadOutputs = [];

    // 1. Input Splitting for MHA
    embeddingElements.forEach((embedEl, i) => {
      if (!mhaInputSplitContainer) return;

      const baseLeft =
        (mhaInputSplitContainer.offsetWidth / (embeddingElements.length + 1)) * (i + 1) -
        embedEl.offsetWidth / 2;

      for (let h = 0; h < numHeads; h++) {
        const clone = embedEl.cloneNode(true) as HTMLElement;
        clone.style.opacity = "0";
        clone.style.position = "absolute";
        // Start from original embedding position relative to its new parent
        const embedRect = embedEl.getBoundingClientRect(); // Original position
        const splitRect = mhaInputSplitContainer.getBoundingClientRect();
        clone.style.left = `${embedRect.left - splitRect.left}px`;
        clone.style.top = `${embedRect.top - splitRect.top}px`;
        mhaInputSplitContainer.appendChild(clone);
        mhaInputEmbeddingClones.push(clone);

        masterTimeline.add(
          {
            targets: clone,
            opacity: [0, 1],
            left: baseLeft + (h - numHeads / 2 + 0.5) * (embedEl.offsetWidth + 10), // Spread out horizontally
            top: mhaInputSplitContainer.offsetHeight / 2 - embedEl.offsetHeight / 2,
            scale: [1, 0.8],
            duration: 800,
            easing: "easeOutExpo",
          },
          mhaInputSplitStart + i * 50 + h * 20
        ); // Stagger by original embedding and head
      }
    });

    masterTimeline.add(
      {
        targets: embeddingElements, // Original embeddings that were in posEncodingVizContainer
        opacity: [1, 0],
        duration: 400, // Slightly longer fade for originals
        easing: "easeInQuad",
      },
      mhaInputSplitStart
    ); // Start fading originals as clones animate

    // Add scroll event listener to control animation
    let lastScrollTop = 0;
    const scrollContainer = document.getElementById("scroll-container");

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", () => {
        const scrollTop = scrollContainer.scrollTop;
        const scrollProgress = scrollTop / totalAnimationScrollHeight;
        masterTimeline.seek(scrollProgress * masterTimeline.duration);
        lastScrollTop = scrollTop;
      });
    }
  }

  // Create interactive attention visualization
  function createInteractiveAttention() {
    if (!multiHeadAttentionContainer) return;
    
    // Create a second attention head for comparison
    const mhaHeadsContainer = multiHeadAttentionContainer.querySelector('#mha-heads-container');
    if (!mhaHeadsContainer) return;
    
    const mhaHead1 = mhaHeadsContainer.querySelector('#mha-head-1');
    if (!mhaHead1) return;
    
    // Create a second attention head
    const mhaHead2 = mhaHead1.cloneNode(true) as HTMLElement;
    mhaHead2.id = 'mha-head-2';
    const head2Title = mhaHead2.querySelector('h4');
    if (head2Title) head2Title.textContent = 'Head 2';
    mhaHeadsContainer.appendChild(mhaHead2);
    
    // Add interactive attention patterns
    const attentionSvgs = document.querySelectorAll('.attention-svg');
    attentionSvgs.forEach((svg, headIndex) => {
      const svgNS = "http://www.w3.org/2000/svg";
      
      // Create token representations at top and bottom of SVG
      const numTokens = tokenElements.length;
      const tokenWidth = 100 / (numTokens + 1);
      
      // Create token boxes
      for (let i = 0; i < numTokens; i++) {
        // Source token (query)
        const sourceTokenG = document.createElementNS(svgNS, "g");
        sourceTokenG.classList.add('token-source');
        sourceTokenG.setAttribute('data-index', i.toString());
        
        const sourceTokenRect = document.createElementNS(svgNS, "rect");
        sourceTokenRect.setAttribute('x', `${(i + 1) * tokenWidth - 5}%`);
        sourceTokenRect.setAttribute('y', '5%');
        sourceTokenRect.setAttribute('width', '10%');
        sourceTokenRect.setAttribute('height', '15%');
        sourceTokenRect.setAttribute('rx', '2');
        sourceTokenRect.setAttribute('fill', '#FF7B7B');
        sourceTokenRect.setAttribute('stroke', '#FF5252');
        sourceTokenRect.setAttribute('stroke-width', '1');
        sourceTokenG.appendChild(sourceTokenRect);
        
        // Target token (key)
        const targetTokenG = document.createElementNS(svgNS, "g");
        targetTokenG.classList.add('token-target');
        targetTokenG.setAttribute('data-index', i.toString());
        
        const targetTokenRect = document.createElementNS(svgNS, "rect");
        targetTokenRect.setAttribute('x', `${(i + 1) * tokenWidth - 5}%`);
        targetTokenRect.setAttribute('y', '80%');
        targetTokenRect.setAttribute('width', '10%');
        targetTokenRect.setAttribute('height', '15%');
        targetTokenRect.setAttribute('rx', '2');
        targetTokenRect.setAttribute('fill', '#7BFFB8');
        targetTokenRect.setAttribute('stroke', '#00C853');
        targetTokenRect.setAttribute('stroke-width', '1');
        targetTokenG.appendChild(targetTokenRect);
        
        svg.appendChild(sourceTokenG);
        svg.appendChild(targetTokenG);
        
        // Create attention lines between tokens
        for (let j = 0; j < numTokens; j++) {
          const line = document.createElementNS(svgNS, "path");
          
          // Different attention patterns for different heads
          let opacity = 0.2;
          if (headIndex === 0) {
            // Head 1: Diagonal attention (attend to self and adjacent)
            opacity = Math.max(0.1, 1 - Math.abs(i - j) * 0.3);
          } else {
            // Head 2: First token attends to all, others attend mostly to first
            opacity = j === 0 ? 0.8 : 0.3;
          }
          
          const sourceX = (i + 1) * tokenWidth;
          const sourceY = 20;
          const targetX = (j + 1) * tokenWidth;
          const targetY = 80;
          
          line.setAttribute('d', `M ${sourceX}% ${sourceY}% C ${sourceX}% ${(sourceY + targetY) / 2}%, ${targetX}% ${(sourceY + targetY) / 2}%, ${targetX}% ${targetY}%`);
          line.setAttribute('stroke', '#FFC107');
          line.setAttribute('stroke-width', '1.5');
          line.setAttribute('fill', 'none');
          line.setAttribute('opacity', opacity.toString());
          line.classList.add('attention-line');
          line.setAttribute('data-source', i.toString());
          line.setAttribute('data-target', j.toString());
          
          svg.appendChild(line);
        }
        
        // Add interactivity to source tokens
        sourceTokenG.addEventListener('mouseenter', () => {
          // Highlight all lines from this source
          const lines = svg.querySelectorAll(`.attention-line[data-source="${i}"]`);
          lines.forEach(line => {
            line.classList.add('strong');
          });
          
          // Show attention weights in softmax container
          const softmaxContainer = headIndex === 0 
            ? mhaHead1.querySelector('.softmax-container')
            : mhaHead2.querySelector('.softmax-container');
            
          if (softmaxContainer) {
            softmaxContainer.innerHTML = '';
            const softmaxTitle = document.createElement('p');
            softmaxTitle.textContent = `Softmax Weights (Token ${i + 1})`;
            softmaxContainer.appendChild(softmaxTitle);
            
            const barsContainer = document.createElement('div');
            barsContainer.style.display = 'flex';
            barsContainer.style.justifyContent = 'center';
            barsContainer.style.alignItems = 'flex-end';
            barsContainer.style.height = '40px';
            
            for (let j = 0; j < numTokens; j++) {
              let weight = 0;
              if (headIndex === 0) {
                weight = Math.max(0.1, 1 - Math.abs(i - j) * 0.3);
              } else {
                weight = j === 0 ? 0.7 : 0.3 / (numTokens - 1);
              }
              
              const bar = document.createElement('div');
              bar.classList.add('softmax-bar');
              bar.style.height = `${weight * 35}px`;
              bar.style.backgroundColor = j === i ? '#FFC107' : '#4CAF50';
              
              const barLabel = document.createElement('div');
              barLabel.textContent = (j + 1).toString();
              barLabel.style.fontSize = '0.7em';
              barLabel.style.marginTop = '2px';
              
              const barWrapper = document.createElement('div');
              barWrapper.style.display = 'flex';
              barWrapper.style.flexDirection = 'column';
              barWrapper.style.alignItems = 'center';
              barWrapper.style.margin = '0 2px';
              barWrapper.appendChild(bar);
              barWrapper.appendChild(barLabel);
              
              barsContainer.appendChild(barWrapper);
            }
            
            softmaxContainer.appendChild(barsContainer);
          }
        });
        
        sourceTokenG.addEventListener('mouseleave', () => {
          // Remove highlight from all lines
          const lines = svg.querySelectorAll('.attention-line');
          lines.forEach(line => {
            line.classList.remove('strong');
          });
          
          // Reset softmax container
          const softmaxContainer = headIndex === 0 
            ? mhaHead1.querySelector('.softmax-container')
            : mhaHead2.querySelector('.softmax-container');
            
          if (softmaxContainer) {
            softmaxContainer.innerHTML = '<p>Softmax</p>';
          }
        });
      }
    });
  }

  // Initialize animations
  createIntroAnimation();
  createEmbeddingAnimation();
  createPositionalEncodingAnimation();
  createEncoderAnimation();
  createInteractiveAttention();
  addTooltips();

  // Add CSS styles
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #121212;
      color: #e0e0e0;
      overflow-x: hidden;
      line-height: 1.6;
    }
    
    #scroll-container {
      width: 100%;
      position: relative;
    }
    
    .scroll-section {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 50px 20px;
      box-sizing: border-box;
      position: relative;
    }
    
    h2, h3 {
      text-align: center;
      color: #00acc1;
      margin-bottom: 40px;
      font-weight: 300;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-size: 1.8em;
    }
    
    h3 {
      font-size: 1.4em;
      color: #0097a7;
      margin-bottom: 20px;
    }
    
    #intro-text-container {
      font-size: clamp(1.5em, 4vw, 2.8em);
      text-align: center;
      min-height: 120px;
      font-weight: 200;
      letter-spacing: 1px;
      padding: 20px;
    }
    
    .word {
      display: inline-block;
      margin-right: 0.2em;
    }
    
    .char {
      display: inline-block;
      opacity: 0;
    }
    
    .viz-container {
      width: 90%;
      max-width: 800px;
      min-height: 250px;
      background-color: rgba(25, 25, 25, 0.5);
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 20px;
      margin-top: 25px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    #multi-head-attention-container {
      min-height: 400px;
      padding: 15px;
    }
    
    #mha-input-split-container,
    #mha-concat-container {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      text-align: center;
      min-height: 50px;
    }
    
    #mha-heads-container {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      margin-bottom: 15px;
      min-height: 200px;
    }
    
    .mha-head {
      border: 1px solid #444;
      border-radius: 8px;
      padding: 10px;
      margin: 5px;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 150px;
    }
    
    .mha-head h4 {
      font-size: 0.9em;
      color: #00bcd4;
      margin-bottom: 10px;
      text-transform: none;
    }
    
    .qkv-gen-container,
    .attention-scores-container,
    .softmax-container,
    .weighted-sum-container {
      width: 100%;
      padding: 5px;
      margin-bottom: 8px;
      text-align: center;
      min-height: 40px;
      font-size: 0.8em;
      color: #bbb;
    }
    
    .attention-scores-container .attention-svg {
      width: 100%;
      min-height: 80px;
    }
    
    .attention-line {
      stroke: #FFC107;
      stroke-width: 1.5px;
      opacity: 0.7;
      transition: opacity 0.3s, stroke-width 0.3s;
    }
    
    .attention-line.strong {
      stroke-width: 2.5px;
      opacity: 1;
    }
    
    .softmax-bar {
      display: inline-block;
      width: 15px;
      margin: 0 2px;
      background-color: #4CAF50;
      border-radius: 2px 2px 0 0;
    }
    
    .embedding-vector {
      width: 12px;
      height: 70px;
      background-color: #4dd0e1;
      margin: 0 4px;
      border-radius: 2px;
      opacity: 0;
      border: 1px solid transparent;
      box-shadow: 0 0 8px rgba(77, 208, 225, 0.7), 0 0 12px rgba(77, 208, 225, 0.5);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .embedding-vector.post-attention {
      background-color: #C17BFF;
      box-shadow: 0 0 8px rgba(193, 123, 255, 0.7), 0 0 12px rgba(193, 123, 255, 0.5);
    }
    
    .embedding-vector.post-ffn {
      background-color: #FFEB3B;
      box-shadow: 0 0 8px rgba(255, 235, 59, 0.7), 0 0 12px rgba(255, 235, 59, 0.5);
    }
    
    .embedding-vector.final-encoder-output {
      background-color: #4CAF50;
      box-shadow: 0 0 8px rgba(76, 175, 80, 0.7), 0 0 12px rgba(76, 175, 80, 0.5);
    }
    
    .positional-encoding-wave-container {
      position: absolute;
      overflow: hidden;
      border-radius: 2px;
      opacity: 0;
    }
    
    .positional-encoding-wave {
      width: 200%;
      height: 100%;
      opacity: 0.6;
    }
    
    .qkv-element {
      border-radius: 2px;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
    }
    
    .qkv-element.q { background-color: #FF7B7B; }
    .qkv-element.k { background-color: #7BFFB8; }
    .qkv-element.v { background-color: #7BA6FF; }
    
    .data-flow-svg-container {
      width: 100%;
      height: 100px;
      margin: 10px 0;
      position: relative;
    }
    
    .inter-component-flow-svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }
    
    .data-flow-path {
      fill: none;
      stroke: #00bcd4;
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-dasharray: 10 5;
      opacity: 0.7;
    }
  `;
  document.head.appendChild(styleElement);
};

export default transformerScript;
