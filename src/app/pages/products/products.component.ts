import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Product } from '../../services/data.service';
import { Observable } from 'rxjs';

/**
 * Products Component - SSR with API Data Fetching
 * 
 * This component demonstrates the most common SSR pattern:
 * - Fetching data from an API on the server
 * - Using TransferState to prevent duplicate API calls
 * - Handling loading and error states
 * 
 * KEY SSR PATTERNS:
 * 1. Data is fetched in ngOnInit (runs on both server and client)
 * 2. TransferState automatically handles preventing duplicate calls
 * 3. Server renders with data, client hydrates with same data
 * 
 * When converting your app:
 * - Use this pattern for any component that fetches data
 * - Ensure your DataService uses TransferState (see data.service.ts)
 * - Handle loading/error states appropriately
 */

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private dataService = inject(DataService);
  
  products$!: Observable<Product[]>;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    // This method runs on both server and client
    // On server: Fetches data and stores in TransferState
    // On client: Uses data from TransferState (no duplicate API call)
    this.products$ = this.dataService.getProducts();
    
    // Subscribe to handle loading/error states
    this.products$.subscribe({
      next: (products) => {
        this.loading = false;
        this.error = null;
        console.log('Products loaded:', products.length);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load products. Please try again later.';
        console.error('Error loading products:', err);
      }
    });
  }
}
