import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/**
 * Contact Component - Client-Side Only Features with SSR
 * 
 * This component demonstrates:
 * - Forms that work client-side only (no SSR needed for form logic)
 * - Server renders the form structure, client handles interactions
 * - Safe handling of browser-only APIs in SSR context
 * 
 * KEY SSR PATTERNS:
 * 1. Forms are rendered on server but logic runs on client
 * 2. Check platform before accessing browser APIs
 * 3. Provide meaningful server-side content
 * 
 * When converting your app:
 * - Forms work fine with SSR (structure rendered, logic client-side)
 * - Always check platform before using browser APIs
 * - Consider using AfterViewInit for client-only initialization
 */

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  
  contactForm: FormGroup;
  submitted = false;
  isBrowser = false;

  constructor() {
    // Form creation works on both server and client
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Check if we're in browser for client-only features
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  onSubmit(): void {
    // This method only runs in browser (user interaction)
    if (this.contactForm.valid) {
      this.submitted = true;
      console.log('Form submitted:', this.contactForm.value);
      
      // Example: Browser-only API usage
      if (this.isBrowser) {
        // Could save to localStorage, send analytics, etc.
        alert('Thank you for your message! (This is a demo - form not actually submitted)');
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
    }
    return '';
  }
}
