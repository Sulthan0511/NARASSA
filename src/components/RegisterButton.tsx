"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { api, toast } from "@/lib/client";
import type { Activity } from "@/lib/types";

export default function RegisterButton({
  item,
  className = "w-1/2 py-2 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-lg transition",
  label = "Daftar",
}: {
  item: Activity;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [motivation, setMotivation] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api(`/api/activities/${item.id}/register`, { body: { phone, motivation } });
      try {
        const raw = localStorage.getItem("narassa_my_activities");
        const ids: string[] = raw ? JSON.parse(raw) : [];
        if (!ids.includes(item.id)) {
          ids.push(item.id);
          localStorage.setItem("narassa_my_activities", JSON.stringify(ids));
        }
      } catch {}
      toast("Pendaftaran relawan berhasil dikirim! Panitia akan memverifikasi.");
      setOpen(false);
      setMotivation("");
      router.refresh();
    } catch (err: any) {
      if (err.message?.includes("login")) {
        setOpen(false);
        router.push("/auth/login");
      }
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const full = item.registered >= item.quota;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={full}
        className={`${className} ${full ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {full ? "Kuota Penuh" : label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <form
            onSubmit={submit}
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 text-xs"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Form Pendaftaran Relawan</h3>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="font-bold text-slate-800">{item.title}</p>
            <div>
              <label className="font-bold text-slate-700">No. WhatsApp</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812..."
                className="w-full p-2.5 border rounded-lg mt-1"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Motivasi Keikutsertaan</label>
              <textarea
                required
                rows={4}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Ceritakan alasan Anda ingin bergabung..."
                className="w-full p-2.5 border rounded-lg mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 bg-brand text-white font-bold rounded-lg disabled:opacity-60"
            >
              {busy ? "Mengirim..." : "Kirim Pendaftaran"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
