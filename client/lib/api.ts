/** Backend API base URL (browser uses same-origin /api via Next rewrites in dev). */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE}${normalized}`
}
