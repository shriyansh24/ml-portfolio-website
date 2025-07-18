# ML Portfolio Website

A professional portfolio website for a machine learning engineer specializing in LLMs and AI. The website showcases skills, projects, and professional background while featuring specialized sections for blog posts and research paper recommendations.

## Features

- Responsive design for all devices
- Blog system with rich text editing
- Research papers showcase with annotations
- Interactive transformer architecture visualization
- SEO optimized with Next.js App Router
- Authentication for content management
- MongoDB integration for data storage

## Tech Stack

- **Frontend**: React.js, Next.js, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js
- **File Storage**: Vercel Blob
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ml-portfolio-website.git
   cd ml-portfolio-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your own values.

4. Set up Vercel Blob for file storage:
   - If you're using Vercel for deployment:
     ```bash
     npx vercel link
     npx vercel env pull .env.local
     ```
   - Create a Vercel Blob store:
     ```bash
     npx vercel blob create
     ```
   - Add the Blob token to your environment variables:
     ```bash
     npx vercel env add BLOB_READ_WRITE_TOKEN
     ```
   - For local development, you can also use:
     ```bash
     npx vercel env pull .env.local
     ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
ml-portfolio-website/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   │   ├── blog/       # Blog-related components
│   │   ├── layout/     # Layout components (Header, Footer)
│   │   ├── papers/     # Research papers components
│   │   ├── transformer/ # Transformer visualization components
│   │   └── ui/         # UI components (Button, etc.)
│   ├── lib/            # Utility functions and libraries
│   └── types/          # TypeScript type definitions
├── .env.example        # Example environment variables
├── next.config.ts      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.