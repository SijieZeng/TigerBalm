/**
 * Resolve a /public asset path against the Vite base URL so images work both at
 * root (local dev, cloudflared tunnel) and under a subpath (GitHub Pages
 * /TigerBalm/). Input paths start with "/", e.g. "/images/dishes/x.jpg".
 */
export function asset(path) {
  if (!path) return path
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return base + (path.startsWith('/') ? path : '/' + path)
}
