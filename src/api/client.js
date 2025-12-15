const API_BASE = "http://localhost:8001";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      throw new Error("API Error");
    }
    throw err;
  }

  return res.json();
}
