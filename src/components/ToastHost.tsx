"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface ToastMsg {
  message: string;
  type: "success" | "error" | "warning";
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<(ToastMsg & { id: number })[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastMsg>).detail;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...detail, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    window.addEventListener("narassa:toast", handler);
    return () => window.removeEventListener("narassa:toast", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] space-y-2 max-w-xs">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-start gap-2.5 text-xs font-semibold animate-[fadeIn]"
        >
          {t.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}>
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
