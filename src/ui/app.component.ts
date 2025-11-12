import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { keycloakAuth, tokenStore } from '../services/keycloak.service';
import { secondsToExpiry } from '../common/token-util';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule], // <-- add AsyncPipe here
  template: `
  <div class="container">
    <h2>Angular + Keycloak (Docker demo)</h2>
    <div class="card">
      <div *ngIf="!isAuth(); else authBlock">
        <p>You are not logged in.</p>
        <button class="btn btn-primary" (click)="login()">Login</button>
      </div>
      <ng-template #authBlock>
        <p>Welcome, <b>{{tokenStore.profile?.name || 'user'}}</b></p>
        <p class="small">Expires in: {{expiresIn()}}s</p>
        <button class="btn" (click)="refresh()">Refresh token now</button>
        <button class="btn" (click)="logout()">Logout</button>
      </ng-template>
    </div>

    <nav class="card">
      <a routerLink="/">Home</a> |
      <a routerLink="/protected">Protected</a>
    </nav>

    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent {
  tokenStore = tokenStore;
  isAuth = () => keycloakAuth.isAuthenticated();
  login = () => keycloakAuth.login();
  logout = () => keycloakAuth.logout();
  refresh = () => keycloakAuth.refreshToken();
  expiresIn = () => secondsToExpiry(tokenStore.accessToken || undefined);
}
