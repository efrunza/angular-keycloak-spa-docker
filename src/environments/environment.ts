export const environment = {
  production: false,
  keycloak: {
    realm: 'demo',
    url: 'http://localhost:8080',
    clientId: 'angular-spa',
    silentRedirectUri: window.location.origin + '/silent-renew.html'
  },
  apiBaseUrl: '/api'
};
