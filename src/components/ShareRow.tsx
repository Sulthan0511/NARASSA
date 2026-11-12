"use client";

import { Share2, Link2 } from "lucide-react";
import { toast } from "@/lib/client";

export default function ShareRow({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href;
    const text = `${title} — Bantu sekarang di NARASSA: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const copy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast("Tautan berhasil disalin ke papan klip.");
    } catch {
      toast("Gagal menyalin tautan.", "error");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={share}
        className="flex items-center justify-center gap-1.5 py-2.5 bg-brand hover:bg-brand-dark text-white text-[11px] font-bold rounded-lg transition"
      >
        <Share2 className="w-3.5 h-3.5" /> Bagikan WA
      </button>
      <button
        onClick={copy}
        className="flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold rounded-lg transition"
      >
        <Link2 className="w-3.5 h-3.5" /> Salin Tautan
      </button>
    </div>
  );
}
