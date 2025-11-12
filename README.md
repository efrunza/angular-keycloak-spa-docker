# Angular + Keycloak (Docker) — Demo Project

This package includes:
- Angular 18 SPA using keycloak-js (PKCE, in-memory tokens)
- Dockerized Keycloak with a preconfigured realm, clients, role, and a test user

## 1) Start Keycloak (Docker)
```bash
cd docker
docker compose up -d
# Admin console: http://localhost:8080/
# Admin credentials: admin / admin
```
This imports the `demo` realm automatically.

**Demo realm details**
- Realm: `demo`
- SPA Client (public): `wildfire-admin-app`
  - Redirect URIs: `http://localhost:4200/*`
  - Web origins: `+`
- API Client (bearer-only): `wildfire-admin-api`
  - Client role: `Adm_RoleManager_W`
- Test user: `alice` / `Password1!` (has client role `Adm_RoleManager_W`)

## 2) Configure Angular (already set for localhost Keycloak)
Environment points to `http://localhost:8080` and realm `demo` in:
- `src/environments/environment.ts`

## 3) Run Angular
```bash
npm install
npm start
# Open http://localhost:4200
```
Click **Login**, authenticate as `alice` / `Password1!`.  
Navigate to **/protected** to see role-gated area.

## Notes
- Tokens are stored **in-memory** only.
- Silent renew page is included at `/silent-renew.html`.
- HTTP interceptor adds Bearer token to `/api/*` calls.
- You can swap the API base URL in `environment.ts`.

## Troubleshooting
- If login loops, check Keycloak client `wildfire-admin-app` has `http://localhost:4200/*` in Redirect URIs and Web origins.
- Ensure Docker Keycloak is reachable at `http://localhost:8080`.
