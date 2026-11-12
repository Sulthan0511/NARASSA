"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { api, toast } from "@/lib/client";

interface Props {
  user: { id: string; name: string; email: string; phone: string; city: string; bio: string; role: string };
  txs: { id: string; amount: number; method: string; note: string; anon: boolean; date: string; campaign: string; status?: string }[];
  apps: { id: string; title: string; status: string; date: string }[];
  certs: { id: string; title: string; code: string; date: string }[];
}

const TABS = ["Donasi Saya", "Relawan Saya", "Pengaturan"];

export default function ProfileTabs({ user, txs, apps, certs }: Props) {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone, city: user.city, bio: user.bio });
  const [pw, setPw] = useState({ oldPassword: "", newPassword: "" });
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/profile", { method: "PATCH", body: profile });
      toast("Profil berhasil diperbarui.");
      router.refresh();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/auth/change-password", { body: pw });
      toast("Password diubah. Silakan login kembali.", "warning");
      await api("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const statusColor = (s: string) =>
    s === "Diterima"
      ? "bg-emerald-100 text-emerald-800"
      : s === "Ditolak"
      ? "bg-red-100 text-red-800"
      : "bg-amber-100 text-amber-800";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition ${
              tab === i ? "text-brand-dark border-b-2 border-brand bg-brand-soft" : "text-slate-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === 0 && (
          <div className="space-y-3">
            {txs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Belum ada donasi.{" "}
                <Link href="/donation" className="text-brand-dark font-bold">
                  Mulai berdonasi
                </Link>
              </p>
            ) : (
              txs.map((t) => (
                <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{t.campaign}</p>
                    <p className="text-[11px] text-slate-400">
                      {t.date} · {t.method} {t.anon && "· Anonim"}
                    </p>
                    {t.note && <p className="text-[11px] italic text-slate-500">"{t.note}"</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        (t.status || "Dikonfirmasi") === "Dikonfirmasi"
                          ? "bg-emerald-100 text-emerald-700"
                          : (t.status || "") === "Ditolak"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t.status || "Dikonfirmasi"}
                    </span>
                    <span className="font-black text-brand-dark">{formatRupiah(t.amount)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-3">
            {apps.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Belum terdaftar di kegiatan.{" "}
                <Link href="/activity" className="text-brand-dark font-bold">
                  Lihat kegiatan
                </Link>
              </p>
            ) : (
              apps.map((a) => (
                <div key={a.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{a.title}</p>
                    <p className="text-[11px] text-slate-400">Daftar: {a.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${statusColor(a.status)}`}>
                    {a.status}
                  </span>
                </div>
              ))
            )}
            {certs.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Sertifikat Terkait</p>
                {certs.map((c) => (
                  <div key={c.id} className="flex justify-between items-center p-2.5 bg-brand-soft rounded-lg text-xs mb-2">
                    <div>
                      <p className="font-bold text-slate-800">{c.title}</p>
                      <p className="text-[10px] font-mono text-slate-400">{c.id}</p>
                    </div>
                    <Link href="/certificates" className="text-brand-dark font-bold text-[11px]">
                      Lihat →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 2 && (
          <div className="grid sm:grid-cols-2 gap-6">
            <form onSubmit={saveProfile} className="space-y-3 text-xs">
              <h3 className="font-extrabold text-slate-900 text-sm">Ubah Profil</h3>
              {(
                [
                  ["name", "Nama Lengkap"],
                  ["phone", "No. HP"],
                  ["city", "Kota"],
                ] as const
              ).map(([k, label]) => (
                <div key={k}>
                  <label className="font-bold text-slate-700">{label}</label>
                  <input
                    value={(profile as any)[k]}
                    onChange={(e) => setProfile({ ...profile, [k]: e.target.value })}
                    className="w-full p-2.5 border rounded-lg mt-1"
                  />
                </div>
              ))}
              <div>
                <label className="font-bold text-slate-700">Bio</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full p-2.5 border rounded-lg mt-1"
                />
              </div>
              <button
                disabled={busy}
                className="px-5 py-2.5 bg-brand text-white font-bold rounded-lg disabled:opacity-60"
              >
                Simpan Profil
              </button>
            </form>

            <form onSubmit={changePw} className="space-y-3 text-xs">
              <h3 className="font-extrabold text-slate-900 text-sm">Ubah Password</h3>
              <div>
                <label className="font-bold text-slate-700">Password Lama</label>
                <input
                  type="password"
                  required
                  value={pw.oldPassword}
                  onChange={(e) => setPw({ ...pw, oldPassword: e.target.value })}
                  className="w-full p-2.5 border rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Password Baru</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={pw.newPassword}
                  onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
                  className="w-full p-2.5 border rounded-lg mt-1"
                />
              </div>
              <p className="text-[10px] text-amber-600 font-bold">
                *Sistem akan melakukan logout otomatis setelah mengganti password.
              </p>
              <button
                disabled={busy}
                className="px-5 py-2.5 bg-brand-deep text-white font-bold rounded-lg disabled:opacity-60"
              >
                Simpan &amp; Relogin
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
