"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Unduh / Print" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="w-1/2 py-2 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 no-print"
    >
      <Printer className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
