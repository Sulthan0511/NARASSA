import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDateId } from "@/lib/format";
import ProfileTabs from "@/components/ProfileTabs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profil Saya" };

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/profile");

  const db = await getDB();
  const myTx = db.txs.filter((t) => t.userId === user.id);
  const myApps = db.applications.filter((a) => a.userId === user.id);
  const myCerts = db.certificates.filter((c) => c.userId === user.id);
  const totalDonated = myTx.reduce((s, t) => s + t.amount, 0);

  const stats = [
    { label: "Total Donasi", value: `Rp${totalDonated.toLocaleString("id-ID")}` },
    { label: "Program Didukung", value: String(new Set(myTx.map((t) => t.donationId)).size) },
    { label: "Kegiatan Diikuti", value: String(myApps.filter((a) => a.status === "Diterima").length) },
    { label: "Sertifikat", value: String(myCerts.length) },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-gradient-to-r from-brand-deep to-brand rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-3xl font-black">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h1 className="text-xl font-black">{user.name}</h1>
          <p className="text-xs text-white/80">{user.email}</p>
          <p className="text-[11px] font-mono bg-white/20 inline-block px-2 py-0.5 rounded">
            {user.volunteerId}
          </p>
        </div>
        <div className="text-[11px] text-white/80 space-y-0.5 text-center sm:text-right">
          <p>Role: <strong className="uppercase">{user.role}</strong></p>
          <p>Terdaftar: {formatDateId(user.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-lg font-black text-brand-dark">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <ProfileTabs
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city || "",
          bio: user.bio || "",
          role: user.role,
        }}
        txs={myTx.map((t) => ({
          id: t.id,
          amount: t.amount,
          method: t.method,
          note: t.note,
          anon: t.anon,
          status: t.status || "Dikonfirmasi",
          date: t.createdAt,
          campaign: db.donations.find((d) => d.id === t.donationId)?.title || "Program dihapus",
        }))}
        apps={myApps.map((a) => ({
          id: a.id,
          title: a.activityTitle,
          status: a.status,
          date: a.appliedDate,
        }))}
        certs={myCerts.map((c) => ({
          id: c.id,
          title: c.activityTitle,
          code: c.verificationCode,
          date: c.dateIssued,
        }))}
      />
    </div>
  );
}
