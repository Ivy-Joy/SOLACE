"use client"

import useSWR from "swr"
import { useState } from "react"
import api from "@/src/lib/api"
import { AdminPrayer } from "@/src/types/prayer"

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? ""

type ModerateAction = "hide" | "escalate"

const fetcher = async (url: string): Promise<AdminPrayer[]> => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`
    }
  })

  if (!res.ok) throw new Error("Failed to fetch")

  return res.json()
}

export default function AdminPrayerList() {

  const { data, error } = useSWR<AdminPrayer[]>(
    `${BASE}/api/prayer-requests/admin/list`,
    fetcher
  )

  const [loading, setLoading] = useState(false)

  async function moderate(id: string, action: ModerateAction) {
    setLoading(true)

    try {
      await api.patch(`/prayer-requests/${id}/moderate`, { action })
      alert("Done")
      location.reload()
    } catch {
      alert("Failed")
    } finally {
      setLoading(false)
    }
  }

  if (error) return <div className="text-red-400">Failed to load</div>

  return (
    <div className="space-y-3">

      {data?.map((p) => (
        <div
          key={p._id}
          className="bg-white/5 p-3 rounded flex justify-between"
        >
          <div>
            <div className="font-semibold">{p.title || "Prayer"}</div>
            <div className="text-xs text-white/60">{p.excerpt}</div>
          </div>

          <div className="flex gap-2">
            <button
              disabled={loading}
              onClick={() => moderate(p._id, "hide")}
              className="px-2 py-1 border rounded"
            >
              Hide
            </button>

            <button
              disabled={loading}
              onClick={() => moderate(p._id, "escalate")}
              className="px-2 py-1 border rounded"
            >
              Escalate
            </button>
          </div>
        </div>
      ))}

    </div>
  )
}