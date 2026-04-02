"use client";

import ClassRoomPage from "@/src/components/member/community/ClassRoomPage";

export default function Page({ params }: { params: { classKey: string } }) {
  return <ClassRoomPage classKey={params.classKey} />;
}