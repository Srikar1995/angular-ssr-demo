import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * SSR Data Service - Reference Implementation
 * 
 * This service demonstrates how to fetch data in an SSR-compatible way.
 * Key patterns shown:
 * 1. Using TransferState to prevent duplicate API calls (server fetches, client reuses)
 * 2. Platform detection (browser vs server)
 * 3. Error handling for SSR context
 * 
 * When converting your existing app:
 * - Wrap any HttpClient calls with TransferState pattern
 * - Check platform before using browser-only APIs
 * - Use makeStateKey for each unique data fetch
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface AboutInfo {
  title: string;
  content: string;
  lastUpdated: string;
}

// Create state keys for each data type
// These keys must be unique across your application
const PRODUCTS_KEY = makeStateKey<Product[]>('products');
const ABOUT_KEY = makeStateKey<AboutInfo>('about');

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);
  private apiBaseUrl = '/api'; // API base URL

  /**
   * Fetch products with SSR support
   * - On server: Fetches from API and stores in TransferState
   * - On client: Checks TransferState first, only fetches if not available
   */
  getProducts(): Observable<Product[]> {
    // Check if data already exists in TransferState (from server render)
    if (this.transferState.hasKey(PRODUCTS_KEY)) {
      // Data already available from server render, use it
      // This prevents duplicate API calls on client hydration
      const stateProducts = this.transferState.get<Product[]>(PRODUCTS_KEY, []);
      return of(stateProducts);
    }

    // Fetch from API (only happens on client if not in state)
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products`).pipe(
      tap(products => {
        // Only store in TransferState if we're on the server
        // On client, this data will be hydrated automatically
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(PRODUCTS_KEY, products);
        }
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        // Return empty array on error
        return of([]);
      })
    );
  }

  /**
   * Fetch about page content with SSR support
   */
  getAboutInfo(): Observable<AboutInfo> {
    // Check if data already exists in TransferState
    if (this.transferState.hasKey(ABOUT_KEY)) {
      const stateAbout = this.transferState.get<AboutInfo>(ABOUT_KEY, {
        title: '',
        content: '',
        lastUpdated: ''
      });
      return of(stateAbout);
    }

    return this.http.get<AboutInfo>(`${this.apiBaseUrl}/about`).pipe(
      tap(about => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(ABOUT_KEY, about);
        }
      }),
      catchError(error => {
        console.error('Error fetching about info:', error);
        return of({
          title: 'About',
          content: 'Failed to load content.',
          lastUpdated: new Date().toISOString()
        });
      })
    );
  }

  /**
   * Example: How to safely access browser-only APIs
   * This pattern should be used when converting existing code
   */
  isBrowser(): boolean {
    return !isPlatformServer(this.platformId);
  }

  /**
   * Example: Safe window access (only works in browser)
   * Use this pattern when you need window/document access
   */
  getWindow(): Window | null {
    if (isPlatformServer(this.platformId)) {
      return null;
    }
    return window;
  }
}
