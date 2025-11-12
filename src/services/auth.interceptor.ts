import { HttpInterceptorFn } from '@angular/common/http';
import { keycloakAuth } from './keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = keycloakAuth.getAccessToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
