//components/solaceclasses/ClassDetail.tsx
"use client";

import Image from "next/image";
import type { ClassDetailModel } from "@/src/types/solaceclasses";
import ClassMentors from "./ClassMentors";
import ClassSchedule from "./ClassSchedule";

export default function ClassDetail({ data }: { data: ClassDetailModel }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-serif font-black">{data.label}</h1>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            {data.description}
          </p>

          <div className="mt-8 text-sm">
            <span className="font-bold">Capacity:</span>{" "}
            {data.enrolled} / {data.capacity}
          </div>
        </div>

        {/* Updated h-[400px] and rounded-3xl per Tailwind best practices */}
        <div className="relative h-100 rounded-4xl overflow-hidden">
          <Image
            src={data.image || "/images/placeholder.jpg"}
            alt={data.label}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <ClassMentors mentors={data.mentors} />
      <ClassSchedule schedule={data.schedule} />
    </div>
  );
}