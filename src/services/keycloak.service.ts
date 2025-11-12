import Keycloak, { KeycloakConfig, KeycloakError } from 'keycloak-js';
import { environment } from '../environments/environment';

export type MinimalProfile = { name?: string; email?: string; roles?: string[] };

class InMemoryTokenStore {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  idToken: string | null = null;
  profile: MinimalProfile | null = null;
  clear() { this.accessToken = this.refreshToken = this.idToken = null; this.profile = null; }
}
export const tokenStore = new InMemoryTokenStore();

export class KeycloakAuthService {
  private kc: Keycloak;
  private ready = false;
  private refreshInFlight = false;

  constructor() {
    const cfg: KeycloakConfig = {
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    };
    this.kc = new Keycloak(cfg);
  }

  async init(): Promise<boolean> {
    const authenticated = await this.kc.init({
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: environment.keycloak.silentRedirectUri,
      pkceMethod: 'S256',
      checkLoginIframe: false,
      flow: 'standard'
    });
    if (authenticated) this.captureTokens();
    this.kc.onTokenExpired = () => this.refreshToken().catch(err => console.warn('Token refresh failed:', err));
    this.ready = true;
    return authenticated;
  }

  private captureTokens() {
    tokenStore.accessToken = this.kc.token ?? null;
    tokenStore.refreshToken = this.kc.refreshToken ?? null;
    tokenStore.idToken = this.kc.idToken ?? null;
    tokenStore.profile = this.buildMinimalProfile();
  }

  private buildMinimalProfile(): MinimalProfile {
    const token = this.kc.tokenParsed as any;
    const name = token?.name || token?.preferred_username;
    const email = token?.email;
    const roles = this.readRolesFromToken();
    return { name, email, roles };
  }

  private readRolesFromToken(): string[] {
    const parsed: any = this.kc.tokenParsed || {};
    const res = parsed.resource_access?.[environment.keycloak.clientId]?.roles || [];
    const realm = parsed.realm_access?.roles || [];
    return Array.from(new Set([...(res||[]), ...(realm||[])]));
  }

  isAuthenticated() { return !!this.kc.authenticated; }
  getAccessToken() { return tokenStore.accessToken; }
  getProfile() { return tokenStore.profile; }

  async login() { await this.kc.login({ redirectUri: window.location.origin + window.location.pathname }); }
  async logout() { tokenStore.clear(); await this.kc.logout({ redirectUri: window.location.origin + '/' }); }
  async refreshToken(): Promise<void> {
    if (this.refreshInFlight) return;
    this.refreshInFlight = true;
    try {
      const refreshed = await this.kc.updateToken(60);
      if (refreshed) this.captureTokens(); else this.captureTokens();
    } catch (e) {
      await this.login();
    } finally { this.refreshInFlight = false; }
  }
}

export const keycloakAuth = new KeycloakAuthService();
