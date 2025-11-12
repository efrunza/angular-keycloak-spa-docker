import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './ui/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';
import { KeycloakInitProvider } from './services/keycloak.init';

const routes: Routes = [
  { path: '', loadComponent: () => import('./ui/home.component').then(m => m.HomeComponent) },
  { path: 'protected', loadComponent: () => import('./ui/protected.component').then(m => m.ProtectedComponent) },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    KeycloakInitProvider
  ]
}).catch(err => console.error(err));
