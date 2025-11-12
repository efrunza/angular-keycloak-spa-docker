export function parseJwt(token?: string): any | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch { return null; }
}
export function hasResourceRole(resource: string, role: string, token?: string): boolean {
  const t = parseJwt(token);
  const roles = t?.resource_access?.[resource]?.roles ?? [];
  return roles.includes(role);
}
export function secondsToExpiry(token?: string): number {
  const t = parseJwt(token);
  if (!t?.exp) return 0;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, t.exp - now);
}
