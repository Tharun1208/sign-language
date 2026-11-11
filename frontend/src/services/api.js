/**
 * Thin fetch wrapper used across the app.
 *
 * Centralising this gives every request the same timeout, JSON handling,
 * auth-header behaviour and error shape, so pages can show useful messages
 * instead of failing silently.
 */

export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const getStoredToken = () => {
  try {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  } catch {
    return null;
  }
};

const parseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }
  return response.text().catch(() => "");
};

/**
 * @param {string} path - API path beginning with "/".
 * @param {object} [options]
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} [options.method]
 * @param {any} [options.body] - Plain objects are JSON encoded; FormData is sent as-is.
 * @param {object} [options.headers]
 * @param {string} [options.token] - Defaults to the token stored in localStorage.
 * @param {number} [options.timeout] - Milliseconds before the request is aborted.
 * @param {AbortSignal} [options.signal]
 */
export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    token = getStoredToken(),
    timeout = 20000,
    signal,
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const abortFromOutside = () => controller.abort();
  signal?.addEventListener("abort", abortFromOutside);

  const finalHeaders = { ...headers };
  let payload = body;

  if (body !== undefined && body !== null && !(body instanceof FormData) && typeof body !== "string") {
    if (!finalHeaders["Content-Type"] && !finalHeaders["content-type"]) {
      finalHeaders["Content-Type"] = "application/json";
    }
    payload = JSON.stringify(body);
  }

  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  const url = path.startsWith("http") ? path : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  try {
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: payload,
      signal: controller.signal,
    });

    const data = await parseBody(response);

    if (!response.ok) {
      const message =
        (data && (data.message || data.error)) ||
        `Request failed with status ${response.status}.`;
      throw new ApiError(message, response.status, data);
    }

    return data;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.", 0, null);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Unable to reach the SignAI backend. Check your connection and try again.",
      0,
      null
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abortFromOutside);
  }
}

export const api = {
  get: (path, options) => apiFetch(path, { ...options, method: "GET" }),
  post: (path, body, options) => apiFetch(path, { ...options, method: "POST", body }),
  put: (path, body, options) => apiFetch(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => apiFetch(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => apiFetch(path, { ...options, method: "DELETE" }),
};
