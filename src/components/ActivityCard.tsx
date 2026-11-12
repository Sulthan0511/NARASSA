import Link from "next/link";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import type { Activity } from "@/lib/types";
import RegisterButton from "./RegisterButton";

function shortDate(dateStr: string) {
  return new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : "")).toLocaleDateString(
    "id-ID",
    { weekday: "long", day: "numeric", month: "short", year: "numeric" }
  );
}

export default function ActivityCard({
  item,
  variant = "list",
}: {
  item: Activity;
  variant?: "list" | "home";
}) {
  const pct = Math.min(100, Math.round((item.registered / item.quota) * 100));
  const remaining = Math.max(0, item.quota - item.registered);
  const full = remaining === 0;
  const days = Math.ceil((new Date(item.deadline + "T00:00:00").getTime() - Date.now()) / 86400000);

  const badge = full ? (
    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
      Kuota Penuh
    </span>
  ) : remaining < 15 ? (
    <span className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
      Sisa {remaining} Kuota
    </span>
  ) : (
    <span className="absolute top-2 right-2 bg-brand text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
      Buka
    </span>
  );

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition">
      <Link href={`/activity/${item.id}`} className="relative block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.title} className="w-full h-40 sm:h-44 object-cover" />
        <span className="absolute top-2 left-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {item.type}
        </span>
        {badge}
        {item.urgent && days > 0 && days <= 3 && !full && (
          <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
            Segera Ditutup
          </span>
        )}
      </Link>

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <Link href={`/activity/${item.id}`}>
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug hover:text-brand-dark">
            {item.title}
          </h3>
        </Link>

        {variant === "home" ? (
          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        ) : (
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <p className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand shrink-0" />
              <span className="truncate">{shortDate(item.date)}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
              <span className="truncate">{item.location}</span>
            </p>
            <p className="flex items-center gap-1.5 text-red-600 font-semibold">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              Batas daftar {shortDate(item.deadline)}
            </p>
          </div>
        )}

        <div className="space-y-1.5 mt-auto">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="text-slate-600 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand" />
              {variant === "home"
                ? `${item.registered}/${item.quota} Relawan`
                : `Kuota: ${item.registered}/${item.quota} (${pct}%)`}
            </span>
            <span className={full ? "text-red-600" : "text-brand-dark"}>{pct}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${full ? "bg-red-500" : "bg-brand"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {variant === "home" ? (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-brand" /> {shortDate(item.date)}
            </span>
            <Link
              href={`/activity/${item.id}`}
              className="font-bold text-brand-dark hover:underline flex items-center gap-1"
            >
              Lihat Detail <span aria-hidden>→</span>
            </Link>
          </div>
        ) : (
          <div className="flex gap-2 pt-1">
            <Link
              href={`/activity/${item.id}`}
              className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition text-center"
            >
              Detail
            </Link>
            <RegisterButton item={item} className="w-1/2" />
          </div>
        )}
      </div>
    </article>
  );
}
