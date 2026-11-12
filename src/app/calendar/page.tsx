import { getDB } from "@/lib/db";
import CalendarView from "@/components/CalendarView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kalender Agenda & Jadwal Aksi Relawan" };

export default async function CalendarPage() {
  const db = await getDB();
  const activities = db.activities.map((a) => ({
    id: a.id,
    title: a.title,
    date: a.date,
    deadline: a.deadline,
    location: a.location,
    type: a.type,
    category: a.category,
    quota: a.quota,
    registered: a.registered,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
          Kalender Agenda &amp; Jadwal Aksi Relawan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Pantau jadwal kegiatan sosial, koordinasi lapangan terpadu, dan rencanakan kontribusi
          nyata Anda untuk ekosistem berdaya.
        </p>
      </div>

      <CalendarView activities={activities} />
    </div>
  );
}
