import Link from "next/link";
import { Users, BadgeCheck } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { Donation } from "@/lib/types";
import DonateButton from "./DonateButton";

export default function DonationCard({
  item,
  showDays = true,
}: {
  item: Donation;
  showDays?: boolean;
}) {
  const pct = Math.min(100, Math.round((item.collected / item.target) * 100));
  const days = Math.ceil(
    (new Date(item.endDate + "T00:00:00").getTime() - Date.now()) / 86400000
  );
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3 flex flex-col justify-between hover:shadow-md transition">
      <div className="space-y-3">
        <Link href={`/donation/${item.id}`} className="relative block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
          <span className="absolute top-2 right-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {showDays ? (days > 0 ? `Sisa ${days} Hari` : "Berakhir") : item.category}
          </span>
          {item.urgent && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              Mendesak
            </span>
          )}
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-dark bg-brand-light px-2 py-0.5 rounded uppercase">
            {item.category}
          </span>
          {item.verified && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-dark">
              <BadgeCheck className="w-3.5 h-3.5" /> Terverifikasi
            </span>
          )}
        </div>

        <Link href={`/donation/${item.id}`}>
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug hover:text-brand-dark">
            {item.title}
          </h3>
        </Link>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-brand-dark">{formatRupiah(item.collected)}</span>
            <span className="text-slate-400 font-normal">Target {formatRupiah(item.target)}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-brand h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {item.donorsCount} Donatur
          </span>
          <span>{pct}% tercapai</span>
        </div>
      </div>

      <DonateButton item={item} />
    </div>
  );
}
