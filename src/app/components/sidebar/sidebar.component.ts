import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Sidebar Component
 * 
 * This component demonstrates:
 * - Navigation with router links
 * - Active route highlighting
 * - Works seamlessly with SSR (no special handling needed for routing)
 */

interface MenuItem {
  path: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📧' }
  ];
}
