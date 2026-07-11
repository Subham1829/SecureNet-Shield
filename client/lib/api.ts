/** Backend API base URL (points to production backend on Vercel, or localhost in dev). */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE}${normalized}`
}
