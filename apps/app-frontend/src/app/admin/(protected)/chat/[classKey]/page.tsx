// apps/app-frontend/src/app/admin/(protected)/chat/[classKey]/page.tsx
import { notFound } from "next/navigation";
import ChatModerationView from "@/src/components/admin/chat/ChatModerationView";

const allowed = ["vuka", "ropes", "teens", "mph", "young"] as const;

export default function Page({ params }: { params: { classKey: string } }) {
  if (!allowed.includes(params.classKey as (typeof allowed)[number])) {
    notFound();
  }

  return <ChatModerationView classKey={params.classKey as "vuka" | "ropes" | "teens" | "mph" | "young"} />;
}