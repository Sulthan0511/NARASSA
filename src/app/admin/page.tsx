import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import { DEFAULT_PAYMENT_ACCOUNTS } from "@/lib/seed";
import type { PaymentAccount } from "@/lib/types";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel Admin NARASSA" };

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/admin");
  if (user.role !== "admin") redirect("/");

  const db = await getDB();
  const totalCollected = db.donations.reduce((s, d) => s + d.collected, 0);

  const stats = [
    { label: "Total Dana Terkumpul", value: formatRupiah(totalCollected) },
    { label: "Program Donasi", value: String(db.donations.length) },
    { label: "Kegiatan Relawan", value: String(db.activities.length) },
    { label: "Pendaftar Menunggu", value: String(db.applications.filter((a) => a.status === "Menunggu").length) },
    { label: "Donasi Menunggu Verifikasi", value: String(db.txs.filter((t) => !t.status || t.status === "Menunggu Verifikasi").length) },
    { label: "Pengguna Terdaftar", value: String(db.users.length) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Panel Staff Admin</h1>
          <p className="text-xs text-slate-500">
            Kelola kegiatan &amp; program donasi, verifikasi bukti donasi, kandidat relawan, dan terbitkan sertifikat.
          </p>
        </div>
        <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg w-fit">
          Masuk sebagai: {user.name}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
            <p className="text-sm font-black text-slate-900">{s.value}</p>
            <p className="text-[10px] font-bold uppercase text-slate-400 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminPanel
        initial={{
          applications: db.applications,
          // donasi menunggu verifikasi diurutkan paling depan agar cepat ditangani
          txs: [...db.txs]
            .sort(
              (a, b) =>
                (a.status === "Menunggu Verifikasi" ? 0 : 1) -
                (b.status === "Menunggu Verifikasi" ? 0 : 1)
            )
            .slice(0, 25),
          certificates: db.certificates,
          users: db.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            volunteerId: u.volunteerId,
          })),
          activities: db.activities.map((a) => ({
            id: a.id,
            title: a.title,
            category: a.category,
            type: a.type,
            location: a.location,
            date: a.date,
            deadline: a.deadline,
            quota: a.quota,
            registered: a.registered,
            description: a.description,
            absenCode: a.absenCode,
          })),
          donations: db.donations.map((d) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            organizer: d.organizer,
            target: d.target,
            collected: d.collected,
            donorsCount: d.donorsCount,
            endDate: d.endDate,
            urgent: d.urgent,
            verified: d.verified,
            description: d.description,
            image: d.image,
          })),
          attendance: db.attendance.map((a) => ({
            id: a.id,
            activityId: a.activityId,
            name: db.users.find((u) => u.id === a.userId)?.name || "Relawan",
            volunteerId: db.users.find((u) => u.id === a.userId)?.volunteerId || "-",
            checkInAt: a.checkInAt,
          })),
          paymentAccounts:
            (db.settings.find((x) => x.key === "payment_accounts")?.value as PaymentAccount[]) ||
            DEFAULT_PAYMENT_ACCOUNTS,
        }}
      />
    </div>
  );
}
