import { Routes } from '@angular/router';

/**
 * SSR Route Configuration
 * 
 * When converting your existing app:
 * - All routes work the same way in SSR
 * - Lazy loading is supported (example below)
 * - Route guards work on both server and client
 * - Resolvers can fetch data server-side
 * 
 * Example lazy loading:
 * {
 *   path: 'products',
 *   loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
 * }
 */

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home - Angular SSR Demo'
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
    title: 'Products - Angular SSR Demo'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About - Angular SSR Demo'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact - Angular SSR Demo'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
