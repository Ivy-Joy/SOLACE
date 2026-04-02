const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal | null;
};

async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers = new Headers(opts.headers ?? {});

  if (opts.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("member_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

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

    if (!res.ok) {
      let message = `API error ${res.status}`;
      try {
        const data = await res.json();
        if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
          message = data.message;
        }
      } catch {}
      throw new Error(message);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }

    return undefined as T;
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out");
    }

    if (err instanceof Error) throw err;
    throw new Error("Network error");
  }
}

export default {
  get: <T = unknown>(p: string) => request<T>(p, { method: "GET" }),
  post: <T = unknown>(p: string, body?: unknown) => request<T>(p, { method: "POST", body }),
  patch: <T = unknown>(p: string, body?: unknown) => request<T>(p, { method: "PATCH", body }),
  del: <T = unknown>(p: string) => request<T>(p, { method: "DELETE" }),
};