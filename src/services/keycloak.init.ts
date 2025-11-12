import { APP_INITIALIZER, Provider } from '@angular/core';
import { keycloakAuth } from './keycloak.service';

export const KeycloakInitProvider: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: () => () => keycloakAuth.init().then(() => true).catch(() => true)
};
