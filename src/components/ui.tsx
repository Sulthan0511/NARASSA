import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  href,
  hrefLabel,
  icon,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-base sm:text-lg font-black text-slate-900">{title}</h2>
        </div>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs font-bold text-brand-dark hover:underline flex items-center gap-1 shrink-0 pb-0.5"
        >
          <span className="hidden sm:inline">{hrefLabel || "Lihat Semua"}</span>
          <span className="sm:hidden">{hrefLabel ? "Semua" : "Lihat Semua"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className="bg-brand h-full rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
      <p className="font-bold text-slate-700 text-sm">{title}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
