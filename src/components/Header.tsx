"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Leaf,
  Users,
  Sparkles,
  FileText,
  Newspaper,
} from "lucide-react";
import { api, toast } from "@/lib/client";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  volunteerId?: string;
}

const MAIN_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/activity", label: "Kegiatan" },
  { href: "/calendar", label: "Kalender" },
  { href: "/donation", label: "Donasi" },
  { href: "/blog", label: "Berita & Isu" },
];

const MORE_LINKS = [
  { href: "/impact", label: "Dampak Sosial", icon: Sparkles },
  { href: "/attendance", label: "Absensi QR", icon: Users },
  { href: "/certificates", label: "E-Sertifikat", icon: FileText },
  { href: "/feed", label: "Kabar Terbaru", icon: Newspaper },
  { href: "/about", label: "Tentang Kami", icon: Newspaper },
];

export default function Header() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    if (user) {
      fetch("/api/notifications")
        .then((r) => (r.ok ? r.json() : { items: [] }))
        .then((d) => setNotifs(d.items || []))
        .catch(() => {});
    }
  }, [user, pathname]);

  const unread = notifs.filter((n) => !n.read).length;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/donation?q=${encodeURIComponent(query)}`);
  };

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
    setNotifOpen(false);
    setUserMenuOpen(false);
    toast("Anda telah keluar dari sesi.");
    router.push("/");
  };

  const markRead = async () => {
    if (!user) return;
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  /** Pill navigasi: aktif = bg-[#E8F5E9] text brand + border emerald. */
  const pillCls = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
      active
        ? "bg-brand-light text-brand font-bold border border-emerald-200/80"
        : "text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900 font-medium"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-5">
          {/* --- Brand Logo --- */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-brand fill-brand/15" />
            <span className="flex flex-col leading-none">
              <span className="font-black text-lg tracking-tight text-brand leading-none">
                NARASSA
              </span>
              <span className="text-[10px] font-medium text-slate-400">Dampak Sosial</span>
            </span>
          </Link>

          {/* --- Desktop: pill navigation --- */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-xs text-slate-600">
            {MAIN_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={pillCls(pathname === l.href)}>
                {l.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`px-4 py-1.5 rounded-full text-xs flex items-center gap-1 transition-all ${
                  moreOpen
                    ? "bg-brand-light text-brand font-bold border border-emerald-200/80"
                    : "text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900 font-medium"
                }`}
              >
                Lainnya <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {moreOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                  {MORE_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-brand-soft hover:text-brand-dark"
                    >
                      <span className="flex items-center gap-2.5">
                        <l.icon className="w-4 h-4" /> {l.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* --- Right: bell + profile pill --- */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen) markRead();
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 relative border border-slate-200/60"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand ring-2 ring-white" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-3">
                  <div className="flex justify-between items-center border-b pb-2 font-bold text-slate-900">
                    <span>Notifikasi Program</span>
                    <span className="text-[10px] bg-brand-light text-brand px-2 py-0.5 rounded-full">
                      {unread} Baru
                    </span>
                  </div>
                  {user ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifs.length === 0 && (
                        <p className="text-slate-400 py-4 text-center">Belum ada notifikasi.</p>
                      )}
                      {notifs.slice(0, 6).map((n) => (
                        <div key={n.id} className="p-2.5 bg-brand-soft rounded-xl space-y-0.5">
                          <p className="font-bold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-600">{n.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-3 text-center space-y-2">
                      <p className="text-slate-500">Login untuk melihat notifikasi Anda.</p>
                      <Link
                        href="/auth/login"
                        className="inline-block px-4 py-2 bg-brand text-white font-bold rounded-full text-[11px]"
                      >
                        Masuk
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {user ? (
              /* --- User profile pill (avatar inisial + nama + caret) --- */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-brand-light border border-emerald-200/80 rounded-full pl-1 pr-3 py-1 hover:border-brand/40 transition"
                >
                  <span className="w-6 h-6 rounded-full bg-brand text-white font-bold flex items-center justify-center text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-brand">{user.name}</span>
                  <ChevronDown className={`w-3 h-3 text-brand transition ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs font-bold text-slate-700">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-brand-soft hover:text-brand-dark"
                    >
                      <User className="w-4 h-4" /> Profil Saya
                    </Link>
                    <Link
                      href="/notification"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-brand-soft hover:text-brand-dark"
                    >
                      <Bell className="w-4 h-4" /> Notifikasi
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-800 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-4 h-4" /> Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-block text-xs font-bold px-4 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs font-bold px-4 py-1.5 rounded-full bg-brand hover:bg-brand-dark text-white shadow-sm transition"
                >
                  Daftar
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-slate-600 rounded-full hover:bg-slate-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* --- Mobile: baris pill navigasi (sesuai contoh) --- */}
        <div className="md:hidden flex overflow-x-auto px-1 pb-2 gap-1 text-xs">
          {MAIN_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                pathname === l.href
                  ? "bg-brand text-white font-semibold shadow-sm"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 max-h-[75vh] overflow-y-auto">
            <form
              onSubmit={submitSearch}
              className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 mb-2.5"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kegiatan, donasi, atau berita..."
                className="w-full bg-transparent text-xs px-3 py-1.5 focus:outline-none text-slate-800"
              />
              <button type="submit" className="p-1.5 text-slate-400 hover:text-brand shrink-0">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="grid grid-cols-2 gap-1.5">
              {[...MAIN_LINKS, ...MORE_LINKS].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-2xl text-xs font-bold hover:bg-brand-soft ${
                    pathname === l.href ? "bg-brand-light text-brand" : "text-slate-700"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href={user ? "/profile" : "/auth/login"}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-brand-soft flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Profil
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-2xl text-xs font-bold text-amber-800 bg-amber-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Panel Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
