import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

/**
 * Main App Component
 * 
 * This is the root component that sets up the layout structure:
 * - Sidebar navigation on the left
 * - Main content area on the right (router outlet)
 * 
 * SSR Note: This component renders on both server and client.
 * The layout structure is the same for both.
 */

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular SSR Demo';
}
