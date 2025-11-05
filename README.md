# Angular SSR Demo

A comprehensive demo application showcasing Server-Side Rendering (SSR) patterns in Angular. This project demonstrates how to build and configure an Angular application with SSR support, including the ability to toggle between SSR and client-side rendering modes.

## 🎯 What This Demo Shows

This application demonstrates:
- ✅ **Server-Side Rendering (SSR)** - HTML rendered on the server before being sent to the browser
- ✅ **SSR/CSR Toggle** - Easy comparison between SSR and client-side rendering
- ✅ **Server-side data fetching** - Using TransferState API to prevent duplicate API calls
- ✅ **Platform detection** - Handling browser-only features safely in SSR context
- ✅ **Forms with SSR** - Forms that work seamlessly with server-side rendering
- ✅ **Routing configuration** - SSR-compatible routing with lazy loading
- ✅ **Express.js server** - Custom server setup with mock API endpoints

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18 or higher (20+ recommended)
- **npm** (comes with Node.js) or **yarn**
- Basic knowledge of Angular and TypeScript

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/Srikar1995/angular-ssr-demo.git
cd angular-ssr-demo
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Angular framework and SSR packages
- Express.js for the server
- TypeScript and build tools

### Step 3: Build the Application

```bash
npm run build
```

This creates:
- Client-side bundle in `dist/angular-ssr-demo/browser/`
- Server-side bundle in `dist/angular-ssr-demo/server/`
- Prerendered static routes

### Step 4: Run the Application

#### Run with SSR (Default - Recommended)

```bash
npm run serve:ssr:angular-ssr-demo
```

- Server starts on: **http://localhost:4000**
- Console will show: `✅ SSR is ENABLED - Running in server-side rendering mode`
- Open http://localhost:4000 in your browser

#### Run without SSR (Client-Side Only)

```bash
# Same port (4000) - stops SSR server first
npm run serve:ssr:angular-ssr-demo:no-ssr

# Different port (4001) - runs alongside SSR server
npm run serve:ssr:angular-ssr-demo:no-ssr:4001
```

- Server starts on: **http://localhost:4000** (or 4001)
- Console will show: `⚠️ SSR is DISABLED - Running in client-side rendering mode`

#### Run Both Servers Simultaneously (For Comparison)

Open two terminal windows:

**Terminal 1:**
```bash
npm run serve:ssr:angular-ssr-demo
# Runs on http://localhost:4000 (with SSR)
```

**Terminal 2:**
```bash
npm run serve:ssr:angular-ssr-demo:no-ssr:4001
# Runs on http://localhost:4001 (without SSR)
```

Then open both URLs side-by-side to compare!

## 🛑 How to Stop and Restart the Server

### Stop Running Servers

**Stop server on port 4000:**
```bash
lsof -ti:4000 | xargs kill -9
```

**Stop server on port 4001:**
```bash
lsof -ti:4001 | xargs kill -9
```

**Stop both servers:**
```bash
lsof -ti:4000,4001 | xargs kill -9
```

**Alternative (if kill command doesn't work):**
- Press `Ctrl+C` in the terminal where the server is running

### Restart Fresh

1. **Stop all running servers** (use commands above or Ctrl+C)
2. **Rebuild if you made code changes:**
   ```bash
   npm run build
   ```
3. **Start the server:**
   ```bash
   npm run serve:ssr:angular-ssr-demo
   ```

### Complete Fresh Start

```bash
# Stop all servers, rebuild, and start
lsof -ti:4000,4001 | xargs kill -9 2>/dev/null
npm run build
npm run serve:ssr:angular-ssr-demo
```

## 📁 Project Structure

```
angular-ssr-demo/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── sidebar/          # Sidebar navigation component
│   │   ├── pages/                # Page components
│   │   │   ├── home/            # Home page (basic SSR demo)
│   │   │   ├── products/        # Products page (SSR with API data fetching)
│   │   │   ├── about/           # About page (platform detection demo)
│   │   │   └── contact/         # Contact page (forms with SSR)
│   │   ├── services/
│   │   │   └── data.service.ts  # Data service with TransferState pattern
│   │   ├── app.component.ts     # Root component
│   │   ├── app.config.ts        # Client-side configuration
│   │   ├── app.config.server.ts # Server-side configuration (provides SSR)
│   │   └── app.routes.ts        # Route configuration
│   ├── server.ts                # Express server with SSR engine
│   ├── main.ts                  # Client entry point
│   ├── main.server.ts          # Server entry point
│   └── index.html               # HTML template
├── public/                      # Static assets
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🎮 Available Routes

Once the server is running, you can access:

- **http://localhost:4000/** → Redirects to `/home`
- **http://localhost:4000/home** → Home page (basic SSR demo)
- **http://localhost:4000/products** → Products page (SSR with API data fetching)
- **http://localhost:4000/about** → About page (platform detection)
- **http://localhost:4000/contact** → Contact page (forms)

## 🔌 API Endpoints

The server includes mock API endpoints for demonstration:

- **GET /api/products** → Returns list of products (used by Products page)
- **GET /api/about** → Returns about page content
- **GET /api/health** → Health check endpoint

These endpoints are defined in `src/server.ts` and are used during server-side rendering.

## ✅ Verify SSR is Working

### Method 1: View Page Source

1. Open http://localhost:4000 in your browser
2. Right-click → "View Page Source" (or Cmd+Option+U / Ctrl+U)
3. Search for: `ng-server-context="ssr"`
4. ✅ **You should find it!** This proves SSR is working
5. Look inside `<app-root>` - you should see fully rendered HTML content

### Method 2: Disable JavaScript

1. Open DevTools (F12)
2. Settings → Preferences → Search "JavaScript"
3. Check "Disable JavaScript"
4. Refresh the page
5. ✅ **Content should still be visible** (proves server rendering)
6. ❌ **If using CSR mode** - you'll see a blank page

### Method 3: Network Tab

1. Open DevTools → Network tab
2. Refresh the page
3. Click the first request (document request)
4. Go to **Response** tab
5. Search for: `ng-server-context="ssr"`
6. ✅ **Should be found** - proves HTML came from server with SSR

## 🔑 Key SSR Patterns Demonstrated

### 1. Server-Side Data Fetching with TransferState

**Files:** `src/app/services/data.service.ts`, `src/app/pages/products/products.component.ts`

**What it does:**
- Server fetches data from API during SSR
- Data is stored in TransferState
- Client reuses the data (no duplicate API call)
- Prevents double-fetching issue

**Code Pattern:**
```typescript
getProducts(): Observable<Product[]> {
  // Check if data already exists (from server render)
  if (this.transferState.hasKey(PRODUCTS_KEY)) {
    return of(this.transferState.get<Product[]>(PRODUCTS_KEY, []));
  }
  
  // Fetch from API (only on client if not in state)
  return this.http.get<Product[]>(`${this.apiBaseUrl}/products`).pipe(
    tap(products => {
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(PRODUCTS_KEY, products);
      }
    })
  );
}
```

### 2. Platform Detection

**File:** `src/app/pages/about/about.component.ts`

**What it does:**
- Safely uses browser-only APIs (like `localStorage`, `window`)
- Checks if running on browser before using browser APIs
- Prevents "window is not defined" errors

**Code Pattern:**
```typescript
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

private platformId = inject(PLATFORM_ID);
isBrowser = isPlatformBrowser(this.platformId);

if (this.isBrowser) {
  // Safe to use window, document, localStorage, etc.
  localStorage.setItem('key', 'value');
}
```

### 3. SSR Configuration

**Files:** 
- `angular.json` - Build configuration (`"ssr": { "entry": "src/server.ts" }`)
- `app.config.server.ts` - Server config (`provideServerRendering()`)
- `server.ts` - Express server with `CommonEngine`

## 📊 Understanding SSR vs CSR

### Server-Side Rendering (SSR)

**What happens:**
1. User requests page
2. Server renders Angular components to HTML
3. Server makes API calls (if needed)
4. Server sends fully rendered HTML to browser
5. Browser displays content immediately
6. JavaScript loads and "hydrates" the HTML (makes it interactive)

**Benefits:**
- ✅ Content visible immediately (better First Contentful Paint)
- ✅ Better SEO (search engines see full content)
- ✅ Works without JavaScript
- ✅ Better perceived performance

### Client-Side Rendering (CSR)

**What happens:**
1. User requests page
2. Server sends minimal HTML (`<app-root></app-root>`)
3. Browser downloads JavaScript
4. JavaScript executes and renders components
5. JavaScript makes API calls
6. Content finally appears

**Drawbacks:**
- ❌ White page flash (user sees blank page first)
- ❌ Poor SEO (search engines see empty HTML)
- ❌ Doesn't work without JavaScript
- ❌ Slower perceived performance

## 🛠️ Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the application for production |
| `npm run serve:ssr:angular-ssr-demo` | Run with SSR on port 4000 |
| `npm run serve:ssr:angular-ssr-demo:no-ssr` | Run without SSR on port 4000 |
| `npm run serve:ssr:angular-ssr-demo:no-ssr:4001` | Run without SSR on port 4001 |
| `npm start` | Run development server (client-side only, no SSR) |
| `npm test` | Run unit tests |

## 🔧 Configuration

### SSR Toggle

SSR can be toggled using the `DISABLE_SSR` environment variable:

- **SSR Enabled (default):** `npm run serve:ssr:angular-ssr-demo`
- **SSR Disabled:** `DISABLE_SSR=true npm run serve:ssr:angular-ssr-demo`

The toggle is implemented in `src/server.ts` (line 152) where it checks:
```typescript
const disableSSR = process.env['DISABLE_SSR'] === 'true';
```

### Port Configuration

Default port is 4000. Change it using the `PORT` environment variable:
```bash
PORT=3000 npm run serve:ssr:angular-ssr-demo
```

## 📝 Common Issues and Solutions

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::4000`

**Solution:**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use a different port
PORT=4002 npm run serve:ssr:angular-ssr-demo
```

### Issue: Build Errors

**Solution:**
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Issue: "window is not defined" Error

**Solution:** Always check platform before using browser APIs:
```typescript
if (isPlatformBrowser(this.platformId)) {
  // Use window, document, localStorage, etc.
}
```

### Issue: Chunks Not Loading

**Solution:**
1. Ensure `npm run build` completed successfully
2. Check that static files are being served (see `server.ts` line 124)
3. Verify `dist/angular-ssr-demo/browser/` contains JS files

## 🎓 Learning Path

1. **Start with Home page** - See basic SSR in action
2. **Check Products page** - Understand server-side data fetching
3. **Explore About page** - Learn platform detection
4. **Review Contact page** - See forms with SSR
5. **Examine server.ts** - Understand how SSR rendering works
6. **Check data.service.ts** - Learn TransferState pattern

## 📚 Additional Resources

- [Angular SSR Official Documentation](https://angular.dev/guide/ssr)
- [TransferState API Reference](https://angular.dev/api/platform-browser/TransferState)
- [Platform Detection Guide](https://angular.dev/api/common/isPlatformBrowser)
- [Angular Router Documentation](https://angular.dev/guide/router)

## 🤝 Contributing

This is a demo/reference project. Feel free to:
- Fork the repository
- Use it as a reference for your own SSR projects
- Submit issues or improvements

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Built with Angular 19 and Angular SSR. Uses Express.js for the server.

---

**Ready to explore?** Start the server and open http://localhost:4000 to see SSR in action!
