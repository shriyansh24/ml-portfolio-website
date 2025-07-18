import { PortfolioProject } from '@/types';

// Sample projects data - in a real application, this would come from an API or database
export const projectsData: PortfolioProject[] = [
  {
    id: '1',
    title: 'Transformer-Based Text Summarization',
    description: 'An implementation of a transformer-based model for automatic text summarization, capable of generating concise summaries while preserving key information.',
    technologies: ['PyTorch', 'Transformers', 'NLP', 'Python'],
    githubUrl: 'https://github.com/username/text-summarization',
    liveUrl: 'https://demo-summarization.example.com',
    imageUrl: '/images/projects/summarization.jpg',
    featured: true
  },
  {
    id: '2',
    title: 'Reinforcement Learning for Robotics',
    description: 'A reinforcement learning framework for robotic control tasks, implementing PPO and SAC algorithms for efficient policy learning.',
    technologies: ['TensorFlow', 'Reinforcement Learning', 'Python', 'Robotics'],
    githubUrl: 'https://github.com/username/rl-robotics',
    imageUrl: '/images/projects/robotics.jpg',
    featured: true
  },
  {
    id: '3',
    title: 'Computer Vision Object Detection',
    description: 'Real-time object detection system using YOLOv5 with custom training for specialized object recognition tasks.',
    technologies: ['PyTorch', 'Computer Vision', 'YOLO', 'Python'],
    githubUrl: 'https://github.com/username/object-detection',
    liveUrl: 'https://object-detection-demo.example.com',
    imageUrl: '/images/projects/object-detection.jpg',
    featured: false
  },
  {
    id: '4',
    title: 'ML Portfolio Website',
    description: 'A responsive portfolio website built with Next.js and TypeScript, featuring blog capabilities and interactive ML demonstrations.',
    technologies: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS'],
    githubUrl: 'https://github.com/username/ml-portfolio',
    liveUrl: 'https://ml-portfolio.example.com',
    imageUrl: '/images/projects/portfolio.jpg',
    featured: true
  },
  {
    id: '5',
    title: 'Sentiment Analysis API',
    description: 'A REST API for real-time sentiment analysis of text data, built with FastAPI and a fine-tuned BERT model.',
    technologies: ['FastAPI', 'BERT', 'NLP', 'Python', 'Docker'],
    githubUrl: 'https://github.com/username/sentiment-api',
    imageUrl: '/images/projects/sentiment.jpg',
    featured: false
  },
  {
    id: '6',
    title: 'Time Series Forecasting Tool',
    description: 'A tool for forecasting time series data using various statistical and deep learning methods, with interactive visualization.',
    technologies: ['Python', 'TensorFlow', 'Time Series', 'Streamlit'],
    githubUrl: 'https://github.com/username/time-series-forecasting',
    liveUrl: 'https://forecast-demo.example.com',
    imageUrl: '/images/projects/time-series.jpg',
    featured: false
  }
];

// Function to get all projects
export async function getAllProjects(): Promise<PortfolioProject[]> {
  // In a real application, this would fetch from an API or database
  return projectsData;
}

// Function to get featured projects
export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  // In a real application, this would fetch from an API or database
  return projectsData.filter(project => project.featured);
}

// Function to get a project by ID
export async function getProjectById(id: string): Promise<PortfolioProject | undefined> {
  // In a real application, this would fetch from an API or database
  return projectsData.find(project => project.id === id);
}