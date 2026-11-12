"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, HandHeart, Users, CalendarDays, QrCode } from "lucide-react";

const items = [
  { href: "/", label: "Beranda", icon: LayoutDashboard },
  { href: "/donation", label: "Donasi", icon: HandHeart },
  { href: "/activity", label: "Relawan", icon: Users },
  { href: "/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/attendance", label: "QR Absen", icon: QrCode },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 px-3 py-2 flex justify-around text-[10px] font-bold text-slate-600 shadow-lg">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-col items-center gap-0.5 ${active ? "text-brand" : ""}`}
          >
            <it.icon className="w-4 h-4" /> {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
