//session room page
"use client";

import LiveSessionRoom from "@/src/components/member/live/LiveSessionRoom";

export default function Page({ params }: { params: { id: string } }) {
  return <LiveSessionRoom sessionId={params.id} />;
}