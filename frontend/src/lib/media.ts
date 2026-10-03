const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Bundled assets live in frontend/public/static; user uploads only exist on the backend.
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/static/uploads/")) return `${API_URL}${url}`;
  return url;
}
