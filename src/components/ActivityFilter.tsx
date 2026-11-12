"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

interface Props {
  count: number;
  categories: string[];
  regions: string[];
}

function FilterInner({ count, categories, regions }: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") || "");

  const activeCategory = sp.get("category") || "Semua";
  const activeRegion = sp.get("region") || "Semua";
  const activeTime = sp.get("time") || "Semua";
  const activeType = sp.get("type") || "Semua";
  const activeSort = sp.get("sort") || "terbaru";

  const push = (key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (!value || value === "Semua" || (key === "sort" && value === "terbaru")) params.delete(key);
    else params.set(key, value);
    router.push(`/activity?${params.toString()}`);
  };

  const reset = () => router.push("/activity");

  const hasFilter =
    sp.get("q") ||
    (sp.get("category") && sp.get("category") !== "Semua") ||
    sp.get("region") ||
    sp.get("time") ||
    (sp.get("type") && sp.get("type") !== "Semua");

  const selectCls =
    "p-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand max-w-[46%] sm:max-w-none";

  return (
    <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3 shadow-2xs">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams(sp.toString());
            if (q) params.set("q", q);
            else params.delete("q");
            router.push(`/activity?${params.toString()}`);
          }}
          className="flex items-center flex-1 bg-slate-100 border border-slate-200 rounded-lg p-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kegiatan, topik, atau inisiator..."
            className="w-full bg-transparent text-xs px-2.5 py-2 focus:outline-none text-slate-800"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-md shrink-0"
            aria-label="Cari"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="-mx-3 px-3 overflow-x-auto sm:-mx-4 sm:px-4 lg:mx-0 lg:px-0">
          <div className="flex gap-2 w-max lg:w-auto lg:flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => push("category", c)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeCategory === c
                    ? "bg-brand text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={activeRegion}
            onChange={(e) => push("region", e.target.value)}
            className={selectCls}
            aria-label="Wilayah"
          >
            <option value="Semua">Semua Wilayah</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={activeTime}
            onChange={(e) => push("time", e.target.value)}
            className={selectCls}
            aria-label="Waktu"
          >
            <option value="Semua">Semua Waktu</option>
            <option value="7">7 Hari ke Depan</option>
            <option value="30">30 Hari ke Depan</option>
            <option value="lewat">Terlampaui</option>
          </select>
          <select
            value={activeType}
            onChange={(e) => push("type", e.target.value)}
            className={selectCls}
            aria-label="Format"
          >
            <option value="Semua">Semua Format</option>
            <option value="On-site">On-site (Lokasi)</option>
            <option value="Remote">Remote (Online)</option>
          </select>
          {hasFilter && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            <strong className="text-brand-dark">{count}</strong> Aksi Tersedia
          </span>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={activeSort}
              onChange={(e) => push("sort", e.target.value)}
              className="p-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label="Urutkan"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terdekat">Terdekat</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivityFilter(props: Props) {
  return (
    <Suspense>
      <FilterInner {...props} />
    </Suspense>
  );
}
