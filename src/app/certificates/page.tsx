import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, ShieldCheck } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import CertificatePreview from "@/components/CertificatePreview";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "E-Sertifikat Keikutsertaan" };

export default async function CertificatesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/certificates");

  const db = await getDB();
  const certs = db.certificates.filter((c) => c.userId === user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">E-Sertifikat Keikutsertaan</h1>
          <p className="text-xs text-slate-500 mt-1">
            Bukti apresiasi resmi atas kontribusi aksi sosial Anda.
          </p>
        </div>
        <span className="text-[11px] font-bold text-brand-dark bg-brand-light px-3 py-1.5 rounded-lg w-fit flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> {certs.length} sertifikat terverifikasi
        </span>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center space-y-2">
          <Award className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-600 text-sm">Belum ada sertifikat</p>
          <p className="text-xs text-slate-400">
            Ikuti kegiatan relawan dan minta panitia menerbitkan sertifikat Anda.
          </p>
          <Link
            href="/activity"
            className="inline-block px-4 py-2 bg-brand text-white font-bold text-xs rounded-lg mt-2"
          >
            Lihat Kegiatan
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400">{c.id}</span>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{c.activityTitle}</h3>
                <p className="text-xs text-slate-500">
                  Peran: <strong>{c.role}</strong> ({c.hoursCount} Jam)
                </p>
                <p className="text-[11px] text-slate-400">
                  {c.organizer} · {c.dateIssued}
                </p>
                <p className="text-[10px] font-mono text-brand-dark bg-brand-light inline-block px-2 py-0.5 rounded">
                  {c.verificationCode}
                </p>
              </div>
              <div className="flex gap-2">
                <CertificatePreview cert={JSON.parse(JSON.stringify(c))} />
                <PrintButton />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand" /> Verifikasi Sertifikat Publik
        </p>
        <p>
          Sertifikat NARASSA dapat diverifikasi melalui kode unik pada sertifikat. Hubungi
          halo@narassa.id dengan menyertakan kode verifikasi untuk pemeriksaan manual.
        </p>
      </div>
    </div>
  );
}
