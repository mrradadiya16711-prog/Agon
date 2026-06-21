// API client — talks to Vercel API routes (same domain, no CORS needed)
// For local dev, set VITE_BACKEND_URL to a running backend

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

async function api(path: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `API error ${res.status}` }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

// --- Keys ---
export const saveKey = (id: string, name: string, value: string) =>
  api("/api/keys", {
    method: "POST",
    body: JSON.stringify({ id, name, value }),
  });

export const getKeys = () => api("/api/keys");

export const removeKey = (id: string) =>
  api(`/api/keys?id=${id}`, { method: "DELETE" });

// --- Analytics ---
export const getAnalytics = (metric = "views", limit = 20) =>
  api(`/api/analytics?metric=${metric}&limit=${limit}`);

export const getRules = () => api("/api/rules");

// --- Posts ---
export const generatePost = (prompt: string) =>
  api("/api/posts", {
    method: "POST",
    body: JSON.stringify({ action: "generate", prompt }),
  });

export const schedulePost = (caption: string, platform: string, scheduledAt: string, imageUrl?: string) =>
  api("/api/posts", {
    method: "POST",
    body: JSON.stringify({ caption, platform, scheduledAt, imageUrl }),
  });

export const getPosts = () => api("/api/posts");
