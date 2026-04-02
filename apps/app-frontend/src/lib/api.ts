// apps/app-frontend/src/lib/api.ts

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

/**
 * Custom Error class to handle API-specific errors,
 * allowing us to check for status codes like 401 (Unauthorized).
 */
export class ResponseError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ResponseError";
    // Standard practice for extending built-in classes in TS
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal | null;
};

/**
 * Core request function with timeout and auth token handling
 */
async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers = new Headers(opts.headers ?? {});

  // Automatically set JSON content type if body is present
  if (opts.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Inject Admin Token from LocalStorage if in browser environment
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const res = await fetch(`${BASE}${path}`, {
      method: opts.method ?? "GET",
      body:
        opts.body !== undefined
          ? typeof opts.body === "string"
            ? opts.body
            : JSON.stringify(opts.body)
          : undefined,
      headers,
      signal: opts.signal ?? controller.signal,
      credentials: "same-origin",
    });

    clearTimeout(timeout);

    // If response is not in 200-299 range, parse the error message
    if (!res.ok) {
      let message = `API error ${res.status}`;
      try {
        // 1. Use 'unknown' instead of 'any'
        const data: unknown = await res.json();

        // 2. Type guard to safely check if 'message' exists and is a string
        if (
          data &&
          typeof data === "object" &&
          "message" in data &&
          typeof (data as { message: unknown }).message === "string"
        ) {
          message = (data as { message: string }).message;
        }
      } catch {
        // Fallback if the body isn't JSON or is empty
      }
      throw new ResponseError(message, res.status);
    }

    // Handle Successful Responses
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }

    // Return empty if no JSON (e.g., 204 No Content)
    return undefined as T;
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out");
    }

    // If it's already a ResponseError, just re-throw it
    if (err instanceof ResponseError) throw err;
    
    // For other errors (Network fail, CORS), wrap in generic Error
    if (err instanceof Error) throw err;
    throw new Error("Network error");
  }
}

// Exported API helper methods
const api = {
  get: <T = unknown>(path: string) => 
    request<T>(path, { method: "GET" }),

  post: <T = unknown>(path: string, body?: unknown) => 
    request<T>(path, { method: "POST", body }),

  patch: <T = unknown>(path: string, body?: unknown) => 
    request<T>(path, { method: "PATCH", body }),

  del: <T = unknown>(path: string) => 
    request<T>(path, { method: "DELETE" }),
};

export default api;