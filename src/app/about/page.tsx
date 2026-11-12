import Link from "next/link";
import { Heart, ShieldCheck, Users, LineChart } from "lucide-react";

export const metadata = { title: "Tentang NARASSA" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-slate-900">Tentang NARASSA</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          NARASSA adalah platform donasi online dan komunitas relawan yang menjembatani kebaikan
          donatur dengan kebutuhan masyarakat di seluruh Indonesia. Kami menggabungkan transparansi
          finansial, verifikasi penggalang, dan teknologi absensi digital agar setiap kontribusi
          tercatat dan berdampak.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: ShieldCheck, title: "Terverifikasi", desc: "Setiap penggalang melewati verifikasi dokumen & rekening." },
          { icon: LineChart, title: "Transparan", desc: "Laporan penyaluran dan progres dana terbuka untuk publik." },
          { icon: Users, title: "Komunitas", desc: "Ribuan relawan aktif dalam aksi sosial on-site & remote." },
          { icon: Heart, title: "Berkelanjutan", desc: "Fitur donasi rutin agar kebaikan berjalan konsisten." },
        ].map((v) => (
          <div key={v.title} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <v.icon className="w-6 h-6 text-brand" />
            <h2 className="font-extrabold text-sm text-slate-900">{v.title}</h2>
            <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-brand-soft border border-brand-light rounded-xl p-6 space-y-3">
        <h2 className="font-black text-slate-900">Visi Kami</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Menjadi platform filantropi digital paling dipercaya di Indonesia — di mana setiap
          rupiah dan setiap jam relawan dapat dilacak dampaknya.
        </p>
        <Link
          href="/donation"
          className="inline-block px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-lg"
        >
          Mulai Berkontribusi
        </Link>
      </div>
    </div>
  );
}
