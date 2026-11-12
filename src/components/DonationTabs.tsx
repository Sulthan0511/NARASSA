"use client";

import { useState } from "react";
import { Users, Target, CalendarClock, Wallet } from "lucide-react";
import { formatRupiah } from "@/lib/format";

export interface FeedItem {
  id: string;
  title: string;
  body: string;
  date: string;
  tag: string;
}

export interface TxItem {
  id: string;
  name: string;
  meta: string;
  amount: string;
  /** status verifikasi admin (default tampil "Dikonfirmasi" untuk data lama) */
  status?: string;
}

const TABS = ["Kisah Lengkap", "Kabar Terbaru", "Rincian Dana"];

export default function DonationTabs({
  description,
  feed,
  txs,
  collected,
  target,
  donors,
  pct,
  endDateLabel,
}: {
  description: string;
  feed: FeedItem[];
  txs: TxItem[];
  collected: number;
  target: number;
  donors: number;
  pct: number;
  endDateLabel: string;
}) {
  const [active, setActive] = useState(TABS[0]);

  const parts = description.split(/(?<=\.)\s+/);
  const quote = parts[0] || description;
  const rest = parts.slice(1).join(" ");

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex overflow-x-auto border-b border-slate-200">
        {TABS.map((t) => {
          const label = t === "Kabar Terbaru" ? `Kabar Terbaru ${feed.length}` : t;
          const on = active === t;
          return (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 sm:px-6 py-3.5 text-xs font-extrabold whitespace-nowrap border-b-2 transition ${
                on
                  ? "border-brand text-brand-dark bg-brand-soft"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-6">
        {active === "Kisah Lengkap" && (
          <div className="space-y-4">
            <blockquote className="border-l-4 border-brand bg-brand-soft rounded-r-xl p-4 sm:p-5">
              <p className="text-sm sm:text-[15px] text-slate-700 italic leading-relaxed">
                “{quote}”
              </p>
            </blockquote>
            {rest && <p className="text-sm text-slate-600 leading-relaxed">{rest}</p>}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="font-black text-slate-900 text-sm">Kenapa Program Ini Penting?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Setiap donasi yang masuk diverifikasi dan disalurkan langsung untuk kebutuhan
                program. Laporan penyaluran dapat dipantau melalui tab Rincian Dana serta halaman
                Dampak Sosial NARASSA.
              </p>
            </div>
          </div>
        )}

        {active === "Kabar Terbaru" && (
          <div className="space-y-3">
            {feed.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada kabar terbaru untuk program ini.
              </p>
            ) : (
              feed.map((f) => (
                <div key={f.id} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-brand-light text-brand-dark px-2 py-0.5 rounded">
                      {f.tag}
                    </span>
                    <span className="text-[11px] text-slate-400">{f.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{f.title}</h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">{f.body}</p>
                </div>
              ))
            )}
          </div>
        )}

        {active === "Rincian Dana" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: Wallet, label: "Dana Terkumpul", value: formatRupiah(collected) },
                { icon: Target, label: "Target", value: formatRupiah(target) },
                { icon: Users, label: "Total Donatur", value: donors.toLocaleString("id-ID") },
                { icon: CalendarClock, label: "Batas Akhir", value: endDateLabel },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    <s.icon className="w-3.5 h-3.5 text-brand" /> {s.label}
                  </div>
                  <p className="text-sm font-black text-slate-900 break-words">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-brand-dark">{pct}% tercapai</span>
                <span className="text-slate-400 font-normal">
                  Kurang {formatRupiah(Math.max(0, target - collected))}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-brand h-full rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-slate-900 text-sm">Transparansi Donatur Terakhir</h3>
              {txs.length === 0 ? (
                <p className="text-xs text-slate-400">Belum ada donasi masuk pada program ini.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {txs.map((t) => (
                    <li key={t.id} className="py-2.5 flex justify-between items-center gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{t.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{t.meta}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            (t.status || "Dikonfirmasi") === "Dikonfirmasi"
                              ? "bg-emerald-100 text-emerald-700"
                              : (t.status || "") === "Ditolak"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {t.status || "Dikonfirmasi"}
                        </span>
                        <span className="font-bold text-brand-dark">{t.amount}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
