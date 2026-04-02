"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/api";
import type { PagedResponse } from "@/src/lib/adminTypes";

export function useAdminList<T>(endpoint: string, query: string, status: string, page: number, limit: number) {
  const [data, setData] = useState<PagedResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (query) params.set("q", query);
        if (status) params.set("status", status);

        const res = await api.get<PagedResponse<T>>(`${endpoint}?${params.toString()}`);
        if (mounted) setData(res);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [endpoint, page, limit, query, status]);

  return { data, loading, setData };
}