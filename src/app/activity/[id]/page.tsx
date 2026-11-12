import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Clock, Users, BadgeCheck, CheckCircle2, Gift } from "lucide-react";
import { getDB } from "@/lib/db";
import RegisterButton from "@/components/RegisterButton";
import ActivityCard from "@/components/ActivityCard";

export const dynamic = "force-dynamic";

export default async function ActivityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDB();
  const item = db.activities.find((a) => a.id === id);
  if (!item) notFound();

  const related = db.activities.filter((a) => a.id !== item.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-dark">
          Beranda
        </Link>{" "}
        /{" "}
        <Link href="/activity" className="hover:text-brand-dark">
          Kegiatan
        </Link>{" "}
        / <span className="text-slate-600 font-semibold">{item.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="w-full h-56 sm:h-72 object-cover rounded-2xl" />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-brand-dark bg-brand-light px-2.5 py-1 rounded uppercase">
              {item.category}
            </span>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              {item.type}
            </span>
            {item.verified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand-dark bg-brand-light px-2.5 py-1 rounded">
                <BadgeCheck className="w-3.5 h-3.5" /> Terverifikasi
              </span>
            )}
            {item.urgent && (
              <span className="text-[10px] font-bold text-white bg-red-600 px-2.5 py-1 rounded uppercase">
                Mendesak
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">{item.title}</h1>
          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: MapPin, label: "Lokasi", value: item.location },
              { icon: Calendar, label: "Pelaksanaan", value: item.date },
              { icon: Clock, label: "Batas Daftar", value: item.deadline, danger: true },
            ].map((f) => (
              <div key={f.label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                  <f.icon className={`w-3.5 h-3.5 ${f.danger ? "text-red-500" : "text-brand"}`} />{" "}
                  {f.label}
                </p>
                <p className={`text-xs font-bold ${f.danger ? "text-red-600" : "text-slate-800"}`}>
                  {f.value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="font-extrabold text-sm text-slate-900">Syarat Keikutsertaan</h2>
            <ul className="space-y-2">
              {item.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-brand-soft border border-brand-light rounded-xl p-5 space-y-3">
            <h2 className="font-extrabold text-sm text-brand-deep flex items-center gap-2">
              <Gift className="w-4 h-4" /> Perks Relawan
            </h2>
            <div className="flex flex-wrap gap-2">
              {item.perks.map((p) => (
                <span key={p} className="text-[11px] font-bold bg-white border border-brand-light text-brand-dark px-3 py-1.5 rounded-lg">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 sticky top-24">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-4 h-4 text-brand" /> Kuota Terisi
                </span>
                <span className="text-brand-dark">
                  {item.registered}/{item.quota}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand h-full rounded-full"
                  style={{ width: `${Math.min(100, (item.registered / item.quota) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Sisa {Math.max(0, item.quota - item.registered)} slot relawan
              </p>
            </div>

            <RegisterButton item={item} className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-lg" label="Daftar Jadi Relawan" />

            <div className="text-[11px] text-slate-500 space-y-1 border-t pt-3">
              <p>
                Penyelenggara: <strong className="text-slate-700">{item.organizer}</strong>
              </p>
              <p>ID Kegiatan: <span className="font-mono">{item.id.toUpperCase()}</span></p>
            </div>
          </div>
        </aside>
      </div>

      <section className="space-y-4">
        <h2 className="font-black text-slate-900">Kegiatan Lainnya</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {related.map((a) => (
            <ActivityCard key={a.id} item={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
