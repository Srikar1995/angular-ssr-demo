import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

/**
 * Client Application Configuration
 * 
 * This configuration is used when the app runs in the browser.
 * 
 * Key providers:
 * - provideHttpClient: Enables HTTP client for API calls
 *   - withFetch: Uses fetch API instead of XHR (better for SSR)
 * - provideClientHydration: Enables client-side hydration
 *   - withEventReplay: Replays user interactions that happened before hydration
 * - provideRouter: Sets up Angular Router
 * 
 * When converting your app:
 * - Add provideHttpClient if you use HttpClient
 * - Use withFetch() for better SSR compatibility
 * - Keep provideClientHydration for proper hydration
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), // Enable HttpClient with fetch API (better for SSR)
    provideClientHydration(withEventReplay()) // Enable client-side hydration
  ]
};
