"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Karosel foto volunteer pada hero beranda (grid 2 kolom — sisi kanan).
 * Tanpa library: panah kiri/kanan + indikator slide "n / total".
 */
export default function HeroCarousel({ slides }: { slides: string[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const go = (delta: number) => setIndex((prev) => (prev + delta + total) % total);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg h-64 sm:h-80 lg:h-[360px] group bg-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slides[index]}
        alt="Aksi relawan NARASSA"
        className="w-full h-full object-cover transition-all duration-500"
      />

      <button
        onClick={() => go(-1)}
        aria-label="Foto sebelumnya"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Foto berikutnya"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-3 right-4 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
        {index + 1} / {total}
      </div>
    </div>
  );
}
