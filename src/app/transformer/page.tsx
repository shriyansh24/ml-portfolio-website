import Layout from "@/components/layout/Layout";
import { generateMetadata } from "@/components/SEOHead";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export const metadata = generateMetadata({
  title: "Transformer Visualization | ML Portfolio",
  description:
    "Interactive visualization of transformer architecture for understanding modern LLMs",
  keywords: ["transformer", "visualization", "machine learning", "AI", "LLM", "interactive"],
  ogType: "article",
  publishedTime: "2023-09-15T12:00:00Z",
  section: "AI Visualizations",
  tags: ["transformer", "visualization", "machine learning", "AI", "LLM", "interactive"],
});

export default function TransformerPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Transformer Architecture Visualization</h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
            An interactive visualization of transformer architecture to help understand how modern
            Large Language Models work under the hood.
          </p>
        </motion.div>

        <motion.div 
          className="border border-border rounded-lg p-6 mb-12 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="h-[500px] bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">
              Transformer Visualization Will Be Integrated Here
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="border border-border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="mb-4">
              This interactive visualization demonstrates the key components of transformer
              architecture, including self-attention mechanisms, feed-forward networks, and how
              information flows through the model during inference.
            </p>
            <p className="mb-6">
              Interact with different parts of the visualization to see detailed explanations and
              understand the role of each component in the overall architecture.
            </p>
            <Button variant="primary" href="#visualization">
              Explore Visualization
            </Button>
          </div>
          <div className="border border-border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Key Components</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <div>
                  <strong className="text-foreground">Self-Attention Mechanism:</strong>
                  <p className="text-muted-foreground mt-1">
                    Allows the model to weigh the importance of different words in relation to each other.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <div>
                  <strong className="text-foreground">Feed-Forward Networks:</strong>
                  <p className="text-muted-foreground mt-1">
                    Process the attention outputs to create rich representations.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <div>
                  <strong className="text-foreground">Layer Normalization:</strong>
                  <p className="text-muted-foreground mt-1">
                    Stabilizes the learning process by normalizing the inputs across features.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <div>
                  <strong className="text-foreground">Residual Connections:</strong>
                  <p className="text-muted-foreground mt-1">
                    Help information flow through deep networks by adding inputs to outputs.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-muted-foreground mb-4">
            Want to learn more about transformer architectures?
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" href="/blog" size="lg">
              Read Blog Posts
            </Button>
            <Button variant="ghost" href="/research" size="lg">
              View Research Papers
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
