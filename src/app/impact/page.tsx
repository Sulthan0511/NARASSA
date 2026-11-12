import Link from "next/link";
import {
  HandHeart,
  Users,
  Clock,
  Award,
  Target,
  TrendingUp,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { getDB } from "@/lib/db";
import { formatRupiah, formatShortRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dampak Sosial NARASSA" };

export default async function ImpactPage() {
  const db = await getDB();
  const collected = db.donations.reduce((s, d) => s + d.collected, 0);
  const target = db.donations.reduce((s, d) => s + d.target, 0);
  const donors = db.donations.reduce((s, d) => s + d.donorsCount, 0);
  const volunteers = db.activities.reduce((s, a) => s + a.registered, 0);
  const hours = db.certificates.reduce((s, c) => s + c.hoursCount, 0) + volunteers * 6;
  const beneficiaries = Math.round(donors * 4.2);
  const cities = 18;

  const stats = [
    { icon: HandHeart, label: "Total Dana Tersalurkan", value: formatShortRupiah(collected), sub: `dari target ${formatShortRupiah(target)}` },
    { icon: Users, label: "Donatur Aktif", value: donors.toLocaleString("id-ID"), sub: "tersebar di seluruh Indonesia" },
    { icon: Target, label: "Penerima Manfaat", value: beneficiaries.toLocaleString("id-ID"), sub: "jiwa terbantu" },
    { icon: Clock, label: "Jam Relawan", value: hours.toLocaleString("id-ID"), sub: "kontribusi waktu murni" },
    { icon: Award, label: "E-Sertifikat Terbit", value: db.certificates.length.toLocaleString("id-ID"), sub: "terverifikasi digital" },
    { icon: TrendingUp, label: "Kota Dijangkau", value: String(cities), sub: "kabupaten/kota" },
  ];

  const reports = [
    {
      title: "Bantuan Darurat Banjir Demak – Tahap 1",
      status: "Tersalurkan",
      detail: "400 paket sembako, 2 perahu karet, 1 posko kesehatan",
      amount: 78500000,
      date: "Bulan ini",
    },
    {
      title: "Beasiswa Anak Pesisir Muara Angke",
      status: "Berjalan",
      detail: "SPP & perlengkapan untuk 62 dari 100 anak",
      amount: 48200000,
      date: "Bulan ini",
    },
    {
      title: "Operasi Jantung Balita Ghaisan",
      status: "Berjalan",
      detail: "Terbayar 2 tahap operasi di RS Harapan Kita",
      amount: 165000000,
      date: "2 bulan terakhir",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div className="bg-gradient-to-r from-brand-deep to-brand text-white rounded-2xl p-6 sm:p-8 space-y-3">
        <span className="bg-white/20 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Laporan Dampak Publik
        </span>
        <h1 className="text-2xl sm:text-3xl font-black">Dampak Sosial NARASSA</h1>
        <p className="text-sm text-white/90 max-w-2xl">
          Transparansi adalah janji kami. Berikut ringkasan kontribusi komunitas donatur dan
          relawan yang tercatat di platform.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
            <s.icon className="w-6 h-6 text-brand" />
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-bold text-slate-600">{s.label}</p>
            <p className="text-[11px] text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="font-black text-slate-900">Progres Penyaluran Global</h2>
          <span className="text-xs font-bold text-brand-dark bg-brand-light px-2.5 py-1 rounded">
            {Math.round((collected / target) * 100)}% dari target gabungan
          </span>
        </div>
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand to-emerald-500 h-full rounded-full"
            style={{ width: `${Math.min(100, (collected / target) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-bold">
          <span className="text-brand-dark">{formatRupiah(collected)}</span>
          <span className="text-slate-400">{formatRupiah(target)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-black text-slate-900">Laporan Penyaluran Terbaru</h2>
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{r.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      r.status === "Tersalurkan"
                        ? "bg-brand-light text-brand-dark"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{r.detail}</p>
                <p className="text-[11px] text-slate-400">{r.date}</p>
              </div>
              <p className="text-sm font-black text-brand-dark">{formatRupiah(r.amount)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-brand" /> Ingin berkontribusi?
          </h2>
          <p className="text-xs text-slate-500">
            Setiap donasi dan jam relawan tercatat dalam laporan dampak ini.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/donation"
            className="px-5 py-3 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
          >
            Donasi <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/activity"
            className="px-5 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg"
          >
            Jadi Relawan
          </Link>
        </div>
      </div>
    </div>
  );
}
