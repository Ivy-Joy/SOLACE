import type { Mentor } from "@/src/types/solaceclasses";
import Image from "next/image";

export default function ClassMentors({ mentors }: { mentors: Mentor[] }) {
  if (!mentors.length) return null;

  return (
    <section className="mt-24">

      <h2 className="text-3xl font-serif font-black mb-10">
        Mentors
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        {mentors.map((m) => (
          <div key={m.id} className="text-center">

            <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden">
              <Image
                src={m.photo || "/images/default-avatar.jpg"}
                alt={m.name}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="mt-4 font-bold">{m.name}</h3>
            <p className="text-sm text-gray-500">{m.role}</p>
          </div>
        ))}
      </div>

    </section>
  );
}