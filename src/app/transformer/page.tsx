import { Metadata } from 'next';
import TransformerVisualization from '@/components/transformer/TransformerVisualization';
import { generateMetadata } from '@/components/SEOHead';
import StructuredData, { generateBreadcrumbData } from '@/components/SEOStructuredData';

// Generate metadata for the page
export const metadata: Metadata = generateMetadata({
  title: 'Interactive Transformer Architecture Visualization',
  description: 'Explore the architecture of transformer models with this interactive visualization. Learn about attention mechanisms, encoder-decoder structures, and more.',
  ogUrl: '/transformer',
  ogType: 'website',
  keywords: ['transformer', 'deep learning', 'attention mechanism', 'NLP', 'machine learning', 'visualization', 'interactive'],
  schemaType: 'WebSite',
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Transformer Visualization', url: '/transformer' },
  ],
});

// Transformer visualization page component
export default function TransformerPage() {
  // Generate structured data for the page
  const pageData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Interactive Transformer Architecture Visualization",
    "description": "Explore the architecture of transformer models with this interactive visualization. Learn about attention mechanisms, encoder-decoder structures, and more.",
    "author": {
      "@type": "Person",
      "name": "ML Engineer",
    },
    "publisher": {
      "@type": "Organization",
      "name": "ML Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ml-portfolio.example.com/images/logo.png",
      },
    },
    "datePublished": "2023-01-01",
    "dateModified": "2023-01-01",
    "image": "https://ml-portfolio.example.com/images/transformer-visualization.png",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://ml-portfolio.example.com/transformer",
    },
    "keywords": "transformer, deep learning, attention mechanism, NLP, machine learning, visualization, interactive",
  };
  
  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbData([
    { name: 'Home', url: '/' },
    { name: 'Transformer Visualization', url: '/transformer' },
  ]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add structured data */}
      <StructuredData data={pageData} />
      <StructuredData data={breadcrumbData} />
      
      <h1 className="text-4xl font-bold mb-4">Interactive Transformer Architecture Visualization</h1>
      
      <p className="text-lg mb-8">
        Explore the architecture of transformer models with this interactive visualization.
        Learn about attention mechanisms, encoder-decoder structures, and the components that
        make transformers so powerful for natural language processing and other tasks.
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <TransformerVisualization />
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">About Transformer Architecture</h2>
        
        <p className="mb-4">
          The Transformer architecture, introduced in the paper "Attention Is All You Need" by Vaswani et al.,
          revolutionized natural language processing and has become the foundation for models like BERT, GPT,
          and T5. Unlike previous sequence models that used recurrence or convolution, Transformers rely
          entirely on attention mechanisms to draw global dependencies between input and output.
        </p>
        
        <p className="mb-4">
          Key components of the Transformer architecture include:
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Multi-Head Attention:</strong> Allows the model to focus on different parts of the input sequence simultaneously
          </li>
          <li className="mb-2">
            <strong>Positional Encoding:</strong> Provides information about the position of tokens in the sequence
          </li>
          <li className="mb-2">
            <strong>Feed-Forward Networks:</strong> Process the attention output through fully connected layers
          </li>
          <li className="mb-2">
            <strong>Layer Normalization:</strong> Stabilizes the learning process
          </li>
          <li className="mb-2">
            <strong>Residual Connections:</strong> Help with gradient flow during training
          </li>
        </ul>
        
        <p>
          This interactive visualization allows you to explore these components and understand how they work together
          to process and generate sequences. Hover over different parts of the visualization to learn more about each component.
        </p>
      </div>
    </div>
  );
}