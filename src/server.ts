import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Mock API Endpoints for SSR Demo
 * 
 * These endpoints demonstrate how to handle API requests in an SSR application.
 * In a real application, these would typically connect to a database or external API.
 * 
 * When converting your app:
 * - You can add your actual API endpoints here
 * - Or proxy to your existing API server
 * - Consider adding authentication, error handling, etc.
 */

// Middleware to parse JSON bodies
app.use(express.json());

// Mock Products API
// This endpoint is called by the Products component to fetch product data
app.get('/api/products', (req, res) => {
  // Simulate a small delay (like a real API call)
  setTimeout(() => {
    const products = [
      {
        id: 1,
        name: 'Angular Framework',
        description: 'A powerful frontend framework for building modern web applications with TypeScript.',
        price: 0,
        category: 'Framework'
      },
      {
        id: 2,
        name: 'Server-Side Rendering',
        description: 'Improve SEO and initial load performance by rendering pages on the server.',
        price: 0,
        category: 'Feature'
      },
      {
        id: 3,
        name: 'TransferState API',
        description: 'Prevent duplicate API calls by transferring server-fetched data to the client.',
        price: 0,
        category: 'Feature'
      },
      {
        id: 4,
        name: 'TypeScript Support',
        description: 'Full TypeScript support with type safety and modern JavaScript features.',
        price: 0,
        category: 'Language'
      },
      {
        id: 5,
        name: 'Reactive Forms',
        description: 'Powerful form handling with validation and reactive programming patterns.',
        price: 0,
        category: 'Feature'
      },
      {
        id: 6,
        name: 'Angular Router',
        description: 'Advanced routing with lazy loading, guards, and resolvers.',
        price: 0,
        category: 'Feature'
      }
    ];
    
    res.json(products);
  }, 100); // Small delay to simulate network latency
});

// Mock About API
// This endpoint is called by the About component
app.get('/api/about', (req, res) => {
  setTimeout(() => {
    const aboutInfo = {
      title: 'About Angular SSR Demo',
      content: `This demo application showcases Server-Side Rendering (SSR) patterns in Angular. 
                It demonstrates how to convert an existing Angular application to support SSR, 
                including data fetching, platform detection, and handling browser-only features.
                
                The application includes examples of:
                - Server-side data fetching with TransferState
                - Platform detection (browser vs server)
                - Conditional rendering based on platform
                - Forms that work with SSR
                - Routing configuration for SSR
                
                Use this demo as a reference when converting your existing Angular application to SSR.`,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(aboutInfo);
  }, 100);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Serve static files from /browser
 * 
 * This middleware serves all static assets (JS, CSS, images, etc.)
 * that were generated during the build process.
 * 
 * IMPORTANT: Use app.use() with a check to only serve files that exist,
 * not document routes. This ensures static files are served but doesn't
 * interfere with SSR/CSR document rendering.
 */
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false // Don't serve index.html automatically - we handle that below
}));

/**
 * Handle all document requests by rendering the Angular application.
 * 
 * SSR TOGGLE: Set DISABLE_SSR=true to serve client-side only (for comparison)
 * 
 * When SSR is enabled (default):
 * 1. Angular renders the component on the server
 * 2. Components may make API calls (which are handled above)
 * 3. The fully rendered HTML is sent to the client
 * 4. The client hydrates the application (makes it interactive)
 * 
 * When SSR is disabled:
 * - Serves static HTML file (client-side rendering only)
 * - Good for demonstrating the difference between SSR and CSR
 */
app.get('**', (req, res, next) => {
  // Skip if this is a static file request (should have been handled above)
  // Check if the path looks like a static file
  if (req.path.match(/\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    return next(); // Let static middleware handle it or 404
  }

  // Check if SSR is disabled via environment variable
  const disableSSR = process.env['DISABLE_SSR'] === 'true';
  
  if (disableSSR) {
    // Client-side rendering mode: serve static index.csr.html
    // This will show empty <app-root></app-root> until JavaScript loads
    const staticIndexHtml = join(browserDistFolder, 'index.csr.html');
    res.sendFile(staticIndexHtml, (err) => {
      if (err) {
        // Fallback: try index.html if index.csr.html doesn't exist
        const fallbackHtml = join(browserDistFolder, 'index.html');
        res.sendFile(fallbackHtml, (fallbackErr) => {
          if (fallbackErr) {
            console.error('Error serving static HTML:', fallbackErr);
            next(fallbackErr);
          }
        });
      }
    });
    return;
  }

  // Server-side rendering mode (default)
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => {
      console.error('SSR rendering error:', err);
      next(err);
    });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 * 
 * To run the server:
 * npm run serve:ssr:angular-ssr-demo
 * 
 * Or after building:
 * node dist/angular-ssr-demo/server/server.mjs
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  const disableSSR = process.env['DISABLE_SSR'] === 'true';
  
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
    console.log(`API endpoints available at http://localhost:${port}/api`);
    if (disableSSR) {
      console.log(`⚠️  SSR is DISABLED - Running in client-side rendering mode`);
      console.log(`   To enable SSR: unset DISABLE_SSR or set DISABLE_SSR=false`);
    } else {
      console.log(`✅ SSR is ENABLED - Running in server-side rendering mode`);
      console.log(`   To disable SSR: set DISABLE_SSR=true`);
    }
  });
}

export default app;
