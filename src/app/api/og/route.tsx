import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// Route segment config
export const runtime = 'edge';

// Define the size of the Open Graph image
const width = 1200;
const height = 630;

// Font files
const interRegular = fetch(
  new URL('../../../../public/fonts/Inter-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
  new URL('../../../../public/fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

/**
 * Generate Open Graph image for social sharing
 * This API route generates dynamic Open Graph images for blog posts, research papers, etc.
 * 
 * @example
 * Usage in HTML:
 * <meta property="og:image" content="https://ml-portfolio.example.com/api/og?title=My%20Blog%20Post&type=blog" />
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title') || 'ML Portfolio';
    const description = searchParams.get('description') || 'Machine Learning Engineer Portfolio';
    const type = searchParams.get('type') || 'default'; // blog, research, project, default
    const author = searchParams.get('author') || 'ML Engineer';
    const date = searchParams.get('date') || '';
    
    // Load fonts
    const [interRegularFont, interBoldFont] = await Promise.all([
      interRegular,
      interBold,
    ]);
    
    // Generate background color based on type
    let bgColor = '#0f172a'; // Default dark blue
    let accentColor = '#3b82f6'; // Default blue
    
    switch (type) {
      case 'blog':
        bgColor = '#0f172a'; // Dark blue
        accentColor = '#3b82f6'; // Blue
        break;
      case 'research':
        bgColor = '#1e293b'; // Dark slate
        accentColor = '#8b5cf6'; // Purple
        break;
      case 'project':
        bgColor = '#0f1b2d'; // Dark navy
        accentColor = '#10b981'; // Green
        break;
      case 'transformer':
        bgColor = '#1a1a2e'; // Dark indigo
        accentColor = '#f59e0b'; // Amber
        break;
    }
    
    // Generate the image
    return new ImageResponse(
      (
        <div
          style={{
            width,
            height,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: bgColor,
            backgroundImage: `radial-gradient(circle at 25px 25px, ${accentColor}15 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${accentColor}15 2%, transparent 0%)`,
            backgroundSize: '100px 100px',
            padding: 80,
            position: 'relative',
          }}
        >
          {/* Logo and type badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 1.5a6 6 0 100-12 6 6 0 000 12zm7.5-6a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                </svg>
              </div>
              <div style={{ fontSize: 36, color: 'white', fontWeight: 'bold' }}>ML Portfolio</div>
            </div>
            
            {type !== 'default' && (
              <div
                style={{
                  backgroundColor: `${accentColor}30`,
                  color: accentColor,
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 20,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                {type}
              </div>
            )}
          </div>
          
          {/* Main content */}
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <h1
              style={{
                fontSize: title.length > 60 ? 48 : 64,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                marginBottom: 16,
                maxWidth: 1000,
              }}
            >
              {title}
            </h1>
            
            {description && (
              <p
                style={{
                  fontSize: 24,
                  color: '#e2e8f0',
                  lineHeight: 1.5,
                  maxWidth: 800,
                }}
              >
                {description.length > 100 ? `${description.substring(0, 100)}...` : description}
              </p>
            )}
          </div>
          
          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ fontSize: 20, color: '#e2e8f0' }}>
              {author}
            </div>
            
            {date && (
              <div style={{ fontSize: 20, color: '#e2e8f0' }}>
                {date}
              </div>
            )}
          </div>
          
          {/* Accent border */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: 8,
              backgroundColor: accentColor,
            }}
          />
        </div>
      ),
      {
        width,
        height,
        fonts: [
          {
            name: 'Inter',
            data: interRegularFont,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter',
            data: interBoldFont,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating Open Graph image:', error);
    return new Response('Error generating Open Graph image', { status: 500 });
  }
}