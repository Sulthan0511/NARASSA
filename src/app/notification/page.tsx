import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDateId } from "@/lib/format";
import MarkAllRead from "@/components/MarkAllRead";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifikasi" };

export default async function NotificationPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/notification");

  const db = await getDB();
  const items = db.notifications.filter((n) => n.userId === user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand" /> Notifikasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">Update donasi, relawan, dan sistem akun Anda.</p>
        </div>
        <MarkAllRead />
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-sm text-slate-400">
          Belum ada notifikasi.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-4 space-y-1 ${
                n.read ? "border-slate-200" : "border-brand/40 bg-brand-soft"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <p className="font-bold text-sm text-slate-900">{n.title}</p>
                {!n.read && <span className="w-2 h-2 bg-brand rounded-full mt-1.5 shrink-0" />}
              </div>
              <p className="text-xs text-slate-600">{n.body}</p>
              <p className="text-[10px] text-slate-400">
                {formatDateId(n.createdAt)} ·{" "}
                <span className="uppercase font-bold text-brand-dark">{n.type}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs">
        <Link href="/profile" className="text-brand-dark font-bold hover:underline">
          ← Kembali ke Profil
        </Link>
      </div>
    </div>
  );
}
