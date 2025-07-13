// Centralized API utility for backend requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch(path: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  return fetch(url, options);
}
