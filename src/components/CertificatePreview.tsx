"use client";

import { useState } from "react";
import { X, Award } from "lucide-react";
import { toast } from "@/lib/client";

interface Cert {
  id: string;
  userId: string;
  recipientName: string;
  activityTitle: string;
  organizer: string;
  dateIssued: string;
  hoursCount: number;
  role: string;
  verificationCode: string;
}

export default function CertificatePreview({ cert }: { cert: Cert }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-lg no-print"
      >
        Pratinjau
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-2 space-y-2">
            <div className="flex justify-end gap-2 no-print px-2 pt-1">
              <button
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => window.print(), 100);
                }}
                className="text-[11px] font-bold bg-brand text-white px-3 py-1.5 rounded-lg"
              >
                Cetak / Simpan PDF
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SERTIFIKAT */}
            <div className="border-4 border-brand/30 rounded-xl p-6 sm:p-8 text-center space-y-4 bg-[#FCFDFC]">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-slate-900">
                  NARASSA<span className="text-brand">.id</span>
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
                Sertifikat Keikutsertaan
              </p>
              <p className="text-xs text-slate-500">Diberikan kepada:</p>
              <p className="text-xl font-black text-slate-900">{cert.recipientName}</p>
              <div className="h-px bg-slate-200" />
              <p className="text-xs text-slate-600 italic">atas keikutsertaan dalam kegiatan:</p>
              <p className="text-sm font-bold text-brand-dark leading-snug">"{cert.activityTitle}"</p>
              <div className="grid grid-cols-3 gap-2 text-[10px] pt-2">
                <div>
                  <p className="text-slate-400 uppercase font-bold">Peran</p>
                  <p className="font-bold text-slate-700">{cert.role}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-bold">Jam Kerja</p>
                  <p className="font-bold text-slate-700">{cert.hoursCount} Jam</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-bold">Tanggal</p>
                  <p className="font-bold text-slate-700">{cert.dateIssued}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">Penyelenggara: {cert.organizer}</p>
              <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">ID Sertifikat</p>
                  <p className="text-[10px] font-mono text-slate-600">{cert.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Kode Verifikasi</p>
                  <p className="text-[10px] font-mono text-brand-dark font-bold">
                    {cert.verificationCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
