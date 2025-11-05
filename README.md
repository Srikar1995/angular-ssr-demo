# Angular SSR Demo - Reference Guide

This is a comprehensive demo application showcasing Server-Side Rendering (SSR) patterns in Angular. Use this as a reference when converting your existing Angular application to SSR.

## 🎯 Purpose

This demo demonstrates:
- ✅ Server-side rendering with Angular Universal
- ✅ Server-side data fetching with TransferState API
- ✅ Platform detection (browser vs server)
- ✅ Handling browser-only features in SSR context
- ✅ Forms with SSR compatibility
- ✅ Routing configuration for SSR
- ✅ Express.js server setup with mock APIs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Serve with SSR
npm run serve:ssr:angular-ssr-demo
```

The application will be available at `http://localhost:4000`

### Development Mode

```bash
# Start development server (client-side only)
ng serve

# Build for SSR development
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
│   │   ├── pages/
│   │   │   ├── home/              # Basic SSR example
│   │   │   ├── products/          # SSR with API data fetching
│   │   │   ├── about/             # Platform detection example
│   │   │   └── contact/           # Forms with SSR
│   │   ├── services/
│   │   │   └── data.service.ts     # SSR-compatible data service
│   │   ├── app.component.*        # Main app component
│   │   ├── app.routes.ts          # Route configuration
│   │   ├── app.config.ts          # Client configuration
│   │   └── app.config.server.ts   # Server configuration
│   ├── server.ts                   # Express server with API endpoints
│   ├── main.ts                     # Client entry point
│   └── main.server.ts             # Server entry point
└── package.json
```

## 🔑 Key SSR Patterns Demonstrated

### 1. Server-Side Data Fetching with TransferState

**Location:** `src/app/services/data.service.ts`, `src/app/pages/products/products.component.ts`

**Pattern:**
```typescript
// In your service
getProducts(): Observable<Product[]> {
  const stateProducts = this.transferState.get<Product[]>(PRODUCTS_KEY, null);
  
  if (stateProducts) {
    return of(stateProducts); // Use data from server
  }

  return this.http.get<Product[]>(`${this.apiBaseUrl}/products`).pipe(
    tap(products => {
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(PRODUCTS_KEY, products);
      }
    })
  );
}
```

**When converting your app:**
- Wrap all HttpClient calls with TransferState pattern
- Create unique state keys for each data type
- Store data on server, reuse on client

### 2. Platform Detection

**Location:** `src/app/pages/about/about.component.ts`

**Pattern:**
```typescript
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

private platformId = inject(PLATFORM_ID);
isBrowser = isPlatformBrowser(this.platformId);

// Use browser-only APIs safely
if (this.isBrowser) {
  localStorage.setItem('key', 'value');
}
```

**When converting your app:**
- Always check platform before using: `window`, `document`, `localStorage`, `sessionStorage`
- Use `isPlatformBrowser()` or `isPlatformServer()` helpers
- Provide server-side fallbacks

### 3. Forms with SSR

**Location:** `src/app/pages/contact/contact.component.ts`

**Pattern:**
- Forms render on server (structure only)
- Form logic runs on client (user interactions)
- No special SSR handling needed for forms

**When converting your app:**
- Forms work out of the box with SSR
- Just ensure any browser-only features (like analytics) are platform-checked

### 4. Routing Configuration

**Location:** `src/app/app.routes.ts`

**Pattern:**
- Lazy loading works with SSR
- Route guards work on both server and client
- Resolvers can fetch data server-side

**When converting your app:**
- Most routing code works without changes
- Use lazy loading for better performance
- Consider route resolvers for data fetching

## 🔄 Converting Your Existing App to SSR

### Step 1: Add SSR to Your Project

```bash
ng add @angular/ssr
```

This command:
- Adds necessary dependencies
- Creates server configuration files
- Updates `angular.json` with SSR build configuration

### Step 2: Update Your Services

Convert your data services to use TransferState:

```typescript
// Before (client-only)
getData(): Observable<Data> {
  return this.http.get<Data>('/api/data');
}

// After (SSR-compatible)
getData(): Observable<Data> {
  const stateKey = makeStateKey<Data>('data');
  const stateData = this.transferState.get<Data>(stateKey, null);
  
  if (stateData) {
    return of(stateData);
  }

  return this.http.get<Data>('/api/data').pipe(
    tap(data => {
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(stateKey, data);
      }
    })
  );
}
```

### Step 3: Handle Browser-Only APIs

Wrap browser-only code with platform checks:

```typescript
// Before
ngOnInit() {
  const data = localStorage.getItem('key');
  window.scrollTo(0, 0);
}

// After
ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    const data = localStorage.getItem('key');
    window.scrollTo(0, 0);
  }
}
```

### Step 4: Update App Configuration

Ensure `app.config.ts` includes HttpClient:

```typescript
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()), // Use fetch API for SSR
    // ... other providers
  ]
};
```

### Step 5: Set Up Server API Endpoints

Update `server.ts` to include your API endpoints:

```typescript
// Add your API endpoints before the SSR route handler
app.get('/api/your-endpoint', (req, res) => {
  // Your API logic
  res.json({ data: 'your data' });
});
```

### Step 6: Build and Test

```bash
# Build for production
npm run build

# Test SSR
npm run serve:ssr:your-app-name
```

## 📝 Common Pitfalls and Solutions

### Issue: "window is not defined"

**Solution:** Always check platform before using browser APIs:
```typescript
if (isPlatformBrowser(this.platformId)) {
  // Use window, document, etc.
}
```

### Issue: Duplicate API Calls

**Solution:** Use TransferState to prevent duplicate calls:
```typescript
const stateData = this.transferState.get(key, null);
if (stateData) return of(stateData);
```

### Issue: Third-party Libraries Not SSR-Compatible

**Solution:** 
- Check if the library has SSR support
- Use dynamic imports for browser-only libraries
- Or conditionally load them only in browser

### Issue: Styles Not Loading

**Solution:** Ensure styles are imported in `angular.json` or component styles are properly configured.

## 🧪 Testing SSR

### Verify SSR is Working

1. **View Page Source:**
   - Right-click → "View Page Source"
   - You should see fully rendered HTML (not just `<app-root>`)

2. **Check Network Tab:**
   - Initial page load should have complete HTML
   - API calls should happen on server (check server logs)

3. **Disable JavaScript:**
   - Content should still be visible (proves server rendering)

## 📚 Additional Resources

- [Angular SSR Documentation](https://angular.dev/guide/ssr)
- [TransferState API](https://angular.dev/api/platform-browser/TransferState)
- [Platform Detection](https://angular.dev/api/common/isPlatformBrowser)

## 🎨 Demo Features

### Home Page
- Basic SSR demonstration
- Static content rendering
- No special SSR patterns needed

### Products Page
- **Key Pattern:** Server-side API data fetching
- Uses TransferState to prevent duplicate calls
- Shows loading and error states

### About Page
- **Key Pattern:** Platform detection
- Conditional rendering based on browser vs server
- Safe browser API access (localStorage example)

### Contact Page
- **Key Pattern:** Forms with SSR
- Reactive forms work seamlessly
- Client-side form logic, server-side structure rendering

## 🛠️ Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules .angular dist
npm install
npm run build
```

### Server Errors

Check server logs for detailed error messages. Common issues:
- Missing API endpoints
- Import errors in server code
- Missing dependencies

## 📄 License

This is a demo project for educational purposes.

## 🤝 Contributing

This is a reference demo. Feel free to use it as a starting point for your SSR conversion!

---

**Happy SSR Converting! 🚀**
