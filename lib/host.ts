
/**
 * Host detection utilities for white-label multi-portal routing
 */

/**
 * Check if the current host is an admin subdomain
 * @param host - The host header value (e.g., from headers().get('host'))
 * @returns true if host starts with "admin."
 */
export function isAdminHost(host?: string): boolean {
  if (!host) return false;
  return host.toLowerCase().startsWith('admin.');
}

/**
 * Get the portal type from the host
 * @param host - The host header value
 * @returns 'admin' or 'main'
 */
export function getPortalType(host?: string): 'admin' | 'main' {
  return isAdminHost(host) ? 'admin' : 'main';
}

/**
 * Get the base domain from a host (strips subdomain)
 * @param host - The host header value
 * @returns base domain (e.g., "kreativeaiagency.com")
 */
export function getBaseDomain(host?: string): string {
  if (!host) return '';
  const parts = host.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return host;
}

/**
 * Example usage in a Server Component:
 * 
 * import { headers } from 'next/headers';
 * import { isAdminHost, getPortalType } from '@/lib/host';
 * 
 * export default function MyPage() {
 *   const host = headers().get('host') || '';
 *   const isAdmin = isAdminHost(host);
 *   const portalType = getPortalType(host);
 *   
 *   return <div>Portal: {portalType}</div>;
 * }
 */
