import { redirect } from "next/navigation";
import { QrCode, CheckCircle2, Clock } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import AttendanceTabs from "@/components/AttendanceTabs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Absensi Relawan QR Code" };

export default async function AttendancePage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/attendance");

  const db = await getDB();
  const records = db.attendance
    .filter((a) => a.userId === user.id)
    .slice(0, 10)
    .map((a) => ({
      id: a.id,
      at: a.checkInAt,
      activity:
        db.activities.find((x) => x.id === a.activityId)?.title || "Presensi umum / bebas",
    }));

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">Absensi Relawan via QR Code</h1>
        <p className="text-xs text-slate-500">
          Pindai QR absensi yang disediakan admin/petugas di lokasi kegiatan.
        </p>
      </div>

      <AttendanceTabs activities={db.activities.map((a) => ({ id: a.id, title: a.title }))} />

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand" /> Riwayat Kehadiran Terakhir
        </h2>
        {records.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">Belum ada presensi tercatat.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {records.map((r) => (
              <li key={r.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">{r.activity}</p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(r.at).toLocaleString("id-ID")}
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-brand" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
