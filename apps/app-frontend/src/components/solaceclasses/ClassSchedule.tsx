import type { Lesson } from "@/src/types/solaceclasses";

export default function ClassSchedule({
  schedule
}: {
  schedule: { date: string; lessons: Lesson[] }[]
}) {

  return (
    <section className="mt-24">

      <h2 className="text-3xl font-serif font-black mb-10">
        Class Schedule
      </h2>

      <div className="space-y-6">
        {schedule.map((s) => (
          <div key={s.date} className="border p-6 rounded-2xl">

            <div className="font-bold mb-3">
              {new Date(s.date).toLocaleDateString()}
            </div>

            <ul className="space-y-2">
              {s.lessons.map((l) => (
                <li key={l.id} className="text-sm text-gray-600">
                  {l.title} — {l.durationMinutes ?? 45} mins
                </li>
              ))}
            </ul>

          </div>
        ))}
      </div>

    </section>
  );
}