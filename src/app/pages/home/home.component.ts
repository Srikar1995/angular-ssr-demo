import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Home Component - Basic SSR Example
 * 
 * This component demonstrates:
 * - Simple static content that renders on server
 * - No special SSR handling needed for basic content
 * - Works out of the box with Angular SSR
 */

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentDate = new Date().toLocaleDateString();
}
