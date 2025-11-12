import { Component, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { keycloakAuth, tokenStore } from '../services/keycloak.service';
import { hasResourceRole } from '../common/token-util';

@Component({
  standalone: true,
  selector: 'app-protected',
  template: `
  <div class="card" *ngIf="isAuth(); else anon">
    <h3>Protected area</h3>
    <p *ngIf="!canView()">Access denied (need role angular-spa-admin-api/Adm_RoleManager_W)</p>
    <div *ngIf="canView()">
      <button class="btn" (click)="load()">Load Users (example)</button>
      <pre>{{ users() | json }}</pre>
    </div>
  </div>
  <ng-template #anon>
    <div class="card">Please log in to see this page.</div>
  </ng-template>
  `
})
export class ProtectedComponent {
  users = signal<any>(null);
  constructor(private api: ApiService) {}
  isAuth() { return keycloakAuth.isAuthenticated(); }
  canView() { return hasResourceRole('angular-spa-admin-api', 'Adm_RoleManager_W', tokenStore.accessToken || undefined); }
  async load() { this.users.set(await this.api.getUsers().catch(e => ({ error: e?.message || e }))); }
}
