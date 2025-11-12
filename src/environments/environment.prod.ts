export const environment = {
  production: true,
  keycloak: {
    realm: 'demo',
    url: 'http://localhost:8080',
    clientId: 'angular-spa',
    silentRedirectUri: window.location.origin + '/silent-renew.html'
  },
  apiBaseUrl: '/api'
};
