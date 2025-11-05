import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DataService, AboutInfo } from '../../services/data.service';
import { Observable } from 'rxjs';

/**
 * About Component - SSR with Conditional Rendering
 * 
 * This component demonstrates:
 * - Server-side data fetching
 * - Conditional rendering based on platform (browser vs server)
 * - Safe access to browser-only features
 * 
 * KEY SSR PATTERNS:
 * 1. Use PLATFORM_ID to detect browser vs server
 * 2. Conditionally render browser-only features
 * 3. Always provide server-side fallback content
 * 
 * When converting your app:
 * - Check for browser before using window, document, localStorage, etc.
 * - Use isPlatformBrowser() or isPlatformServer() helpers
 * - Provide meaningful server-side content
 */

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  private dataService = inject(DataService);
  private platformId = inject(PLATFORM_ID);
  
  aboutInfo$!: Observable<AboutInfo>;
  isBrowser = false;
  viewCount = 0;

  ngOnInit(): void {
    // Check if we're in the browser
    // This is important for features that only work in browser
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Fetch data (works on both server and client)
    this.aboutInfo$ = this.dataService.getAboutInfo();
    
    // Example: Browser-only feature (localStorage)
    // This only runs in the browser, not on the server
    if (this.isBrowser) {
      const stored = localStorage.getItem('viewCount');
      this.viewCount = stored ? parseInt(stored, 10) + 1 : 1;
      localStorage.setItem('viewCount', this.viewCount.toString());
    }
  }

  /**
   * Example method showing safe browser API access
   * Use this pattern when you need window/document in your app
   */
  getBrowserInfo(): string {
    if (!this.isBrowser) {
      return 'Server-side rendering';
    }
    return `Browser: ${navigator.userAgent.substring(0, 50)}...`;
  }
}
