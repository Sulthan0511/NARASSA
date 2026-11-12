"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const CATS = [
  "Semua",
  "Mendesak",
  "Medis & Kesehatan",
  "Bencana Alam",
  "Pendidikan",
  "Panti & Yatim",
  "Rumah Ibadah",
  "Zakat & Wakaf",
  "Menolong Hewan",
  "Lingkungan",
  "Sosial",
];

const SORTS = [
  ["", "Paling Sesuai"],
  ["terdekat", "Deadline Terdekat"],
  ["terbaru", "Terbaru"],
  ["progress", "Progress Tertinggi"],
];

function FilterInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") || "");

  const push = (key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (!value || value === "Semua") params.delete(key);
    else params.set(key, value);
    router.push(`/donation?${params.toString()}`);
  };

  const activeCat = sp.get("category") || "Semua";
  const activeSort = sp.get("sort") || "";

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-3">
      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => push("category", c)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeCat === c
                ? "bg-brand text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Urutkan</span>
          {SORTS.map(([v, label]) => (
            <button
              key={v}
              onClick={() => push("sort", v)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                activeSort === v
                  ? "bg-brand-light text-brand-dark border border-brand"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams(sp.toString());
            if (q) params.set("q", q);
            else params.delete("q");
            router.push(`/donation?${params.toString()}`);
          }}
          className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari program..."
            className="bg-transparent text-xs px-2 py-1 focus:outline-none w-40"
          />
          <button className="text-[11px] font-bold text-brand-dark px-2">Cari</button>
        </form>
      </div>
    </div>
  );
}

export default function DonationFilter() {
  return (
    <Suspense>
      <FilterInner />
    </Suspense>
  );
}
