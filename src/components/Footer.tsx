import Link from "next/link";
import { Leaf, Phone, Mail, Instagram, Facebook, Youtube, ArrowUpRight } from "lucide-react";

const NAV_LINKS: [string, string][] = [
  ["/about", "Tentang Kami"],
  ["/about", "Kemitraan Komunitas"],
  ["/impact", "Transparansi & Dampak"],
];

const CATEGORY_LINKS: [string, string][] = [
  ["/donation", "NARASSA Berbagi"],
  ["/activity", "NARASSA Mengabdi"],
  ["/activity?category=Lingkungan", "NARASSA Hijau"],
  ["/activity?category=Pendidikan", "NARASSA Mengajar"],
  ["/calendar", "NARASSA Ekspedisi"],
];

export default function Footer() {
  return (
    <footer className="bg-white text-slate-500 text-xs border-t border-slate-200 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Kolom 1 — Logo & deskripsi */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-brand fill-brand/15" />
            <span className="font-black text-slate-900 text-base">NARASSA</span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            Ruang bagi siapa pun yang ingin peduli, berkolaborasi, dan mewujudkan perubahan nyata
            melalui aksi sosial di seluruh Indonesia.
          </p>
          <div className="flex gap-3 text-slate-400 pt-1">
            <a href="#" aria-label="Instagram" className="hover:text-brand transition">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-brand transition">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-brand transition">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Kolom 2 — Navigasi Cepat */}
        <div>
          <h4 className="font-bold text-slate-900 mb-3 text-xs">Navigasi Cepat</h4>
          <ul className="space-y-2 text-[11px]">
            {NAV_LINKS.map(([href, label]) => (
              <li key={label}>
                <Link href={href} className="hover:text-brand cursor-pointer transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 3 — Kategori Aksi */}
        <div>
          <h4 className="font-bold text-slate-900 mb-3 text-xs">Kategori Aksi</h4>
          <ul className="space-y-2 text-[11px]">
            {CATEGORY_LINKS.map(([href, label]) => (
              <li key={label}>
                <Link href={href} className="hover:text-brand cursor-pointer transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 4 — Kontak */}
        <div>
          <h4 className="font-bold text-slate-900 mb-3 text-xs">Kontak</h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <a
                href="mailto:narassaindonesia@gmail.com"
                className="hover:text-brand transition inline-flex items-center gap-1.5 break-all"
              >
                <Mail className="w-3.5 h-3.5" /> narassaindonesia@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+622150889421" className="hover:text-brand transition inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> +62 21 5088 9421
              </a>
            </li>
            <li className="text-slate-400 pt-1">Senin–Sabtu · 08.00–17.00 WIB</li>
            <li>
              <Link href="/impact" className="hover:text-brand transition inline-flex items-center gap-1 font-bold">
                Laporan Dampak <ArrowUpRight className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
        <p>© 2026 NARASSA - Platform Social Community. Hak Cipta Dilindungi.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:underline cursor-pointer">
            Kebijakan Privasi
          </Link>
          <Link href="/terms-of-service" className="hover:underline cursor-pointer">
            Syarat &amp; Ketentuan
          </Link>
        </div>
      </div>
    </footer>
  );
}
