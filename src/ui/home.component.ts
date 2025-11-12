import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
  <div class="card">
    <h3>Home</h3>
    <p>Start the Dockerized Keycloak and click Login.</p>
  </div>
  `
})
export class HomeComponent {}
