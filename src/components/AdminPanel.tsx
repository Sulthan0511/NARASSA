"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Award,
  Users,
  Plus,
  Wallet,
  Check,
  X,
  CalendarDays,
  Pencil,
  Trash2,
  CircleDollarSign,
  Settings,
  QrCode,
  Copy,
} from "lucide-react";
import QRCode from "qrcode";
import { formatRupiah, formatDateId } from "@/lib/format";
import { api, toast } from "@/lib/client";
import type { PaymentAccount } from "@/lib/types";

/** Data kegiatan yang dikirim dari halaman /admin (src/app/admin/page.tsx). */
export interface ActivityRow {
  id: string;
  title: string;
  category: string;
  type: string;
  location: string;
  date: string;
  deadline: string;
  quota: number;
  registered: number;
  description: string;
  absenCode?: string;
}

/** Ringkasan program donasi untuk tabel admin (src/app/admin/page.tsx). */
export interface DonationRow {
  id: string;
  title: string;
  category: string;
  organizer: string;
  target: number;
  collected: number;
  donorsCount: number;
  endDate: string;
  urgent: boolean;
  verified: boolean;
  description: string;
  image?: string;
}

interface Initial {
  applications: any[];
  txs: any[];
  certificates: any[];
  users: any[];
  activities: ActivityRow[];
  donations: DonationRow[];
  attendance: {
    id: string;
    activityId: string | null;
    name: string;
    volunteerId: string;
    checkInAt: string;
  }[];
  paymentAccounts: PaymentAccount[];
}

const TABS = [
  { key: "applications", label: "Kandidat Relawan", icon: FileText },
  { key: "activities", label: "Kegiatan Relawan", icon: CalendarDays },
  { key: "donations", label: "Program Donasi", icon: CircleDollarSign },
  { key: "verify", label: "Verifikasi Donasi", icon: Wallet },
  { key: "certificates", label: "Terbitkan Sertifikat", icon: Award },
  { key: "txs", label: "Transaksi", icon: Wallet },
  { key: "users", label: "Pengguna", icon: Users },
  { key: "settings", label: "Pengaturan", icon: Settings },
];

const statusChip = (s: string) =>
  s === "Diterima" || s === "Disetujui"
    ? "bg-emerald-100 text-emerald-800"
    : s === "Ditolak"
    ? "bg-red-100 text-red-800"
    : "bg-amber-100 text-amber-800";

export default function AdminPanel({ initial }: { initial: Initial }) {
  const [tab, setTab] = useState("applications");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDon, setShowDon] = useState(false);
  const [editDonId, setEditDonId] = useState<string | null>(null);
  const [newDon, setNewDon] = useState({
    title: "",
    category: "Sosial",
    organizer: "Tim Admin NARASSA",
    target: 10000000,
    endDate: "",
    description: "",
    image: "",
    urgent: false,
    verified: true,
  });
  const [accounts, setAccounts] = useState<PaymentAccount[]>(initial.paymentAccounts);
  const [showQr, setShowQr] = useState<ActivityRow | null>(null);
  const [qrImg, setQrImg] = useState("");
  const [certForm, setCertForm] = useState({ userId: "", activityTitle: "", role: "", hoursCount: 8 });
  const [newAct, setNewAct] = useState({
    title: "",
    category: "Pendidikan",
    location: "",
    type: "On-site",
    date: "",
    deadline: "",
    quota: 20,
    description: "",
  });
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const run = async (fn: () => Promise<any>, msg: string) => {
    setBusy(true);
    try {
      await fn();
      toast(msg);
      router.refresh();
    } catch (e: any) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full p-2.5 mt-1 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand";

  /* ----- Aksi manajemen kegiatan (Jadwal #19) & sertifikat (Jadwal #20) --- */
  const openCreate = () => {
    setEditId(null);
    setNewAct({
      title: "",
      category: "Pendidikan",
      location: "",
      type: "On-site",
      date: "",
      deadline: "",
      quota: 20,
      description: "",
    });
    setShowAdd(true);
  };

  const openEdit = (a: ActivityRow) => {
    setEditId(a.id);
    setNewAct({
      title: a.title,
      category: a.category,
      location: a.location,
      type: a.type,
      date: a.date,
      deadline: a.deadline,
      quota: a.quota,
      description: a.description,
    });
    setShowAdd(true);
  };

  const removeActivity = (a: ActivityRow) => {
    if (!confirm(`Hapus kegiatan "${a.title}"?\n\nPendaftar pada kegiatan ini ikut dihapus.`)) return;
    run(
      () => api(`/api/admin/activities/${a.id}`, { method: "DELETE" }),
      "Kegiatan berhasil dihapus."
    );
  };

  /* --- Program donasi: tambah / ubah / hapus (dibuat khusus oleh admin) --- */
  const openDonCreate = () => {
    setEditDonId(null);
    setNewDon({
      title: "",
      category: "Sosial",
      organizer: "Tim Admin NARASSA",
      target: 10000000,
      endDate: "",
      description: "",
      image: "",
      urgent: false,
      verified: true,
    });
    setShowDon(true);
  };

  const openDonEdit = (d: DonationRow) => {
    setEditDonId(d.id);
    setNewDon({
      title: d.title,
      category: d.category,
      organizer: d.organizer,
      target: d.target,
      endDate: d.endDate,
      description: d.description,
      image: d.image || "",
      urgent: d.urgent,
      verified: d.verified,
    });
    setShowDon(true);
  };

  const removeDon = (d: DonationRow) => {
    if (!confirm(`Hapus program donasi "${d.title}"? Riwayat transaksi tetap tersimpan.`)) return;
    run(() => api(`/api/admin/donations/${d.id}`, { method: "DELETE" }), "Program donasi dihapus.");
  };

  /* --- QR absensi kegiatan (dipakai member saat hari pelaksanaan) --- */
  const makeQr = (a: ActivityRow) => {
    if (!a.absenCode) {
      setQrImg("");
      return;
    }
    QRCode.toDataURL(`NARASSA:${a.id}:${a.absenCode}`, {
      width: 320,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQrImg)
      .catch(() => setQrImg(""));
  };

  const openQr = (a: ActivityRow) => {
    setShowQr(a);
    makeQr(a);
  };

  const genAbsenCode = (regenerate = false) => {
    if (!showQr) return;
    run(async () => {
      const res = await api<{ absenCode: string }>(
        `/api/admin/activities/${showQr.id}/absen`,
        { body: { regenerate } }
      );
      const updated = { ...showQr, absenCode: res.absenCode };
      setShowQr(updated);
      makeQr(updated);
      return res;
    }, regenerate ? "Kode absen baru dibuat — tampilkan QR terbaru kepada peserta." : "Kode absen siap ditampilkan.");
  };

  const copyAbsenCode = async () => {
    if (!showQr?.absenCode) return;
    try {
      await navigator.clipboard.writeText(showQr.absenCode);
      toast("Kode absen disalin.");
    } catch {
      toast("Gagal menyalin kode.", "error");
    }
  };

  const saveAccounts = () => {
    run(
      () => api("/api/admin/settings", { body: { key: "payment_accounts", value: accounts } }),
      "Pengaturan rekening tujuan donasi tersimpan."
    );
  };

  const removeCertificate = (c: any) => {
    if (!confirm(`Cabut sertifikat ${c.id} milik ${c.recipientName}?`)) return;
    run(
      () => api(`/api/admin/certificates/${c.id}`, { method: "DELETE" }),
      "Sertifikat berhasil dicabut."
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              tab === t.key ? "bg-brand text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" /> {t.label}
            {t.key === "verify" && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white text-brand-dark" : "bg-slate-200"}`}>
                {initial.txs.filter((x) => !x.status || x.status === "Menunggu Verifikasi").length}
              </span>
            )}
            {t.key === "applications" && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white text-brand-dark" : "bg-slate-200"}`}>
                {initial.applications.filter((a) => a.status === "Menunggu").length}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={openCreate}
          className="ml-auto px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Terbitkan Kegiatan
        </button>
      </div>

      {/* KANDIDAT */}
      {tab === "applications" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Pelamar</th>
                  <th className="py-3 px-4">Kegiatan Dituju</th>
                  <th className="py-3 px-4">Tgl Daftar</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verifikasi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initial.applications.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {c.name}
                      <span className="block text-[10px] text-slate-400 font-normal">{c.email}</span>
                    </td>
                    <td className="py-3 px-4 max-w-[220px]">{c.activityTitle}</td>
                    <td className="py-3 px-4 text-slate-500">{c.appliedDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${statusChip(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button
                          disabled={busy}
                          onClick={() =>
                            run(
                              () => api(`/api/admin/applications/${c.id}`, { method: "PATCH", body: { status: "Diterima" } }),
                              "Pendaftar disetujui."
                            )
                          }
                          className="px-2 py-1 bg-emerald-600 text-white font-bold rounded text-[10px] flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Setujui
                        </button>
                        <button
                          disabled={busy}
                          onClick={() =>
                            run(
                              () => api(`/api/admin/applications/${c.id}`, { method: "PATCH", body: { status: "Ditolak" } }),
                              "Pendaftar ditolak."
                            )
                          }
                          className="px-2 py-1 bg-red-600 text-white font-bold rounded text-[10px] flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {initial.applications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Belum ada pendaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KEGIATAN RELAWAN — manajemen (Jadwal fitur #19) */}
      {tab === "activities" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Judul Kegiatan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Pelaksanaan</th>
                  <th className="py-3 px-4">Batas Daftar</th>
                  <th className="py-3 px-4">Terdaftar</th>
                  <th className="py-3 px-4 text-right">Kendali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initial.activities.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      Belum ada kegiatan.
                    </td>
                  </tr>
                )}
                {initial.activities.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 max-w-[260px] line-clamp-2">{a.title}</p>
                      <p className="text-[10px] text-slate-400">{a.location}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold text-brand-dark bg-brand-light px-2 py-0.5 rounded uppercase">
                        {a.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{a.type}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{a.date}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold whitespace-nowrap">
                      {a.deadline}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{a.registered}</span>
                      <span className="text-slate-400">/{a.quota}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(a)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold bg-slate-100 hover:bg-brand-light hover:text-brand-dark text-slate-700"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Ubah
                        </button>
                        <button
                          onClick={() => openQr(a)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold bg-brand-light text-brand-dark hover:bg-brand hover:text-white"
                        >
                          <QrCode className="w-3.5 h-3.5" /> QR Absen
                        </button>
                        <button
                          onClick={() => removeActivity(a)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROGRAM DONASI - hanya admin yang membuat & mengelola */}
      {tab === "donations" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500 font-semibold">
              Program donasi hanya dibuat oleh admin.
            </p>
            <button
              onClick={openDonCreate}
              className="px-3.5 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Program Donasi
            </button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Judul Program</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">Terkumpul</th>
                    <th className="py-3 px-4">Batas</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Kendali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initial.donations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        Belum ada program donasi.
                      </td>
                    </tr>
                  )}
                  {initial.donations.map((d) => {
                    const pct = Math.min(100, Math.round((d.collected / Math.max(1, d.target)) * 100));
                    return (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 max-w-[260px] line-clamp-2">{d.title}</p>
                          <p className="text-[10px] text-slate-400">{d.organizer}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold text-brand-dark bg-brand-light px-2 py-0.5 rounded uppercase">
                            {d.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{formatRupiah(d.target)}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-brand-dark">{formatRupiah(d.collected)}</span>
                          <span className="text-slate-400"> ({pct}%)</span>
                        </td>
                        <td className="py-3 px-4 text-red-600 font-semibold whitespace-nowrap">{d.endDate}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              d.urgent
                                ? "bg-red-100 text-red-700"
                                : d.verified
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {d.urgent ? "Mendesak" : d.verified ? "Tayang" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openDonEdit(d)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold bg-slate-100 hover:bg-brand-light hover:text-brand-dark text-slate-700"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Ubah
                            </button>
                            <button
                              onClick={() => removeDon(d)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIKASI DONASI - admin mengecek bukti transfer */}
      {tab === "verify" && (
        <div className="space-y-3">
          {initial.txs.filter((t) => !t.status || t.status === "Menunggu Verifikasi").length === 0 && (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-xs text-slate-400">
              Tidak ada donasi yang menunggu verifikasi.
            </div>
          )}
          {initial.txs
            .filter((t) => !t.status || t.status === "Menunggu Verifikasi")
            .map((t) => (
              <div
                key={t.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex gap-3 min-w-0">
                  {t.bukti ? (
                    <button onClick={() => window.open(t.bukti, "_blank")} title="Perbesar bukti">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.bukti}
                        alt="Bukti pembayaran"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-slate-200"
                      />
                    </button>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 text-center px-1">
                      Tidak ada bukti
                    </div>
                  )}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm">{t.donorName}</h3>
                      <span className="font-black text-brand-dark text-sm">{formatRupiah(t.amount)}</span>
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Menunggu Verifikasi
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      {initial.donations.find((d) => d.id === t.donationId)?.title || "Program donasi"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {t.method} · {t.createdAt}
                      {t.reference ? ` · Ref ${t.reference}` : ""}
                      {t.userId ? " · akun terlogin" : " · tamu"}
                    </p>
                    {t.note && <p className="text-[11px] italic text-slate-500">"{t.note}"</p>}
                    <p className="text-[10px] text-slate-400">Klik gambar untuk memperbesar.</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={busy}
                    onClick={() =>
                      run(
                        () => api(`/api/admin/txs/${t.id}`, { method: "PATCH", body: { action: "approve" } }),
                        "Donasi disetujui - dana masuk ke jumlah terkumpul."
                      )
                    }
                    className="px-4 py-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Setujui &amp; Verifikasi
                  </button>
                  <button
                    disabled={busy}
                    onClick={() =>
                      run(
                        () => api(`/api/admin/txs/${t.id}`, { method: "PATCH", body: { action: "reject" } }),
                        "Donasi ditolak - dana tidak dihitung."
                      )
                    }
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* SERTIFIKAT */}
      {tab === "certificates" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900">Terbitkan E-Sertifikat</h3>
            <div className="text-xs">
              <label className="font-bold text-slate-700">Penerima</label>
              <select value={certForm.userId} onChange={(e) => setCertForm({ ...certForm, userId: e.target.value })} className={field}>
                <option value="">— Pilih pengguna —</option>
                {initial.users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs">
              <label className="font-bold text-slate-700">Judul Kegiatan</label>
              <input
                list="act-list"
                value={certForm.activityTitle}
                onChange={(e) => setCertForm({ ...certForm, activityTitle: e.target.value })}
                placeholder="Pilih atau ketik judul kegiatan"
                className={field}
              />
              <datalist id="act-list">
                {initial.activities.map((a) => (
                  <option key={a.id} value={a.title} />
                ))}
              </datalist>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Peran</label>
                <input
                  value={certForm.role}
                  onChange={(e) => setCertForm({ ...certForm, role: e.target.value })}
                  placeholder="Relawan Lapangan"
                  className={field}
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Jam Kerja</label>
                <input
                  type="number"
                  value={certForm.hoursCount}
                  onChange={(e) => setCertForm({ ...certForm, hoursCount: parseInt(e.target.value) || 0 })}
                  className={field}
                />
              </div>
            </div>
            <button
              disabled={busy || !certForm.userId || !certForm.activityTitle}
              onClick={() =>
                run(() => api("/api/admin/certificates", { body: certForm }), "Sertifikat berhasil diterbitkan!")
              }
              className="w-full py-2.5 bg-brand text-white font-bold text-xs rounded-lg disabled:opacity-60"
            >
              Terbitkan E-Sertifikat
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900">Sertifikat Terbit ({initial.certificates.length})</h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {initial.certificates.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-lg text-xs space-y-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-slate-800">{c.recipientName}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[10px] text-slate-400">{c.id}</span>
                      <button
                        onClick={() => removeCertificate(c)}
                        title="Cabut sertifikat"
                        className="p-1 rounded text-red-500 hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">{c.activityTitle}</p>
                  <p className="text-[10px] font-mono text-brand-dark">{c.verificationCode}</p>
                </div>
              ))}
              {initial.certificates.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Belum ada sertifikat.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TRANSAKSI */}
      {tab === "txs" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Donatur</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initial.txs.map((t) => {
                  const dn = initial.users.length >= 0 ? t : t;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {t.anon ? "Donatur Anonim" : t.donorName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{t.donationId}</td>
                      <td className="py-3 px-4 text-slate-500">{t.method}</td>
                      <td className="py-3 px-4 text-slate-500">{t.createdAt}</td>
                      <td className="py-3 px-4 text-right font-black text-brand-dark">
                        {formatRupiah(t.amount)}
                      </td>
                    </tr>
                  );
                })}
                {initial.txs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PENGGUNA */}
      {tab === "users" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Volunteer ID</th>
                  <th className="py-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initial.users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-500">{u.email}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{u.volunteerId}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          u.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PENGATURAN - rekening tujuan transfer donasi (diedit admin) */}
      {tab === "settings" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="font-extrabold text-xs text-slate-900">Rekening / E-wallet Tujuan Transfer Donasi</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Daftar nomor di bawah ini tampil pada modal donasi member (setelah mereka memilih
              metode). Ubah sesuai rekening asli lalu tekan Simpan.
            </p>
          </div>

          <div className="space-y-3">
            {accounts.map((a, i) => (
              <div key={i} className="grid sm:grid-cols-12 gap-2 items-end border border-slate-100 rounded-lg p-3">
                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700">Metode</label>
                  <input
                    value={a.method}
                    onChange={(e) =>
                      setAccounts(accounts.map((x, j) => (j === i ? { ...x, method: e.target.value } : x)))
                    }
                    className={field}
                    placeholder="BCA"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="font-bold text-slate-700">Nomor</label>
                  <input
                    value={a.number}
                    onChange={(e) =>
                      setAccounts(accounts.map((x, j) => (j === i ? { ...x, number: e.target.value } : x)))
                    }
                    className={field}
                    placeholder="1234567890"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="font-bold text-slate-700">Atas Nama</label>
                  <input
                    value={a.owner}
                    onChange={(e) =>
                      setAccounts(accounts.map((x, j) => (j === i ? { ...x, owner: e.target.value } : x)))
                    }
                    className={field}
                    placeholder="PT NARASSA INDONESIA"
                  />
                </div>
                <div className="sm:col-span-1 flex sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setAccounts(accounts.filter((_, j) => j !== i))}
                    className="p-2 rounded-md text-red-500 border border-red-100 bg-red-50 hover:bg-red-100"
                    title="Hapus metode"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <p className="text-xs text-slate-400">Belum ada rekening. Tambahkan minimal satu.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t pt-3">
            <button
              type="button"
              onClick={() => setAccounts([...accounts, { method: "", number: "", owner: "" }])}
              className="px-3.5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Metode
            </button>
            <button
              type="button"
              onClick={saveAccounts}
              className="px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}

      {/* MODAL QR ABSENSI */}
      {showQr && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-brand" /> QR Absensi Kegiatan
              </h3>
              <button onClick={() => setShowQr(null)} aria-label="Tutup">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-800">{showQr.title}</p>
            <p className="text-[11px] text-slate-500">{showQr.date} · {showQr.location}</p>

            {!showQr.absenCode ? (
              <div className="text-center space-y-3 py-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Kegiatan ini belum punya kode absen. Buat kode lalu tampilkan QR-nya kepada
                  peserta; setiap scan akan langsung tercatat sebagai kehadiran di daftar bawah.
                </p>
                <button
                  onClick={() => genAbsenCode(false)}
                  className="px-4 py-2.5 bg-brand hover:bg-brand-dark text-white text-xs font-bold rounded-lg"
                >
                  Buat Kode Absen
                </button>
              </div>
            ) : (
              <>
                {qrImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrImg} alt="QR Absensi" className="w-56 h-56 mx-auto border border-slate-200 rounded-xl" />
                ) : (
                  <div className="w-56 h-56 mx-auto bg-slate-100 rounded-xl animate-pulse" />
                )}
                <div className="text-center space-y-1">
                  <p className="text-[11px] text-slate-500">Kode absensi (cadangan bila kamera tidak bisa dipakai):</p>
                  <p className="font-mono font-black text-lg text-slate-900">{showQr.absenCode}</p>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      onClick={copyAbsenCode}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Salin Kode
                    </button>
                    <button
                      onClick={() => genAbsenCode(true)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg"
                    >
                      Buat Ulang Kode
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="border-t pt-3 space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900">
                Kehadiran Peserta ({initial.attendance.filter((x) => x.activityId === showQr.id).length})
              </h4>
              {initial.attendance.filter((x) => x.activityId === showQr.id).length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-3">
                  Belum ada peserta yang melakukan scan QR.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {initial.attendance
                    .filter((x) => x.activityId === showQr.id)
                    .map((x) => (
                      <li key={x.id} className="py-2 flex justify-between items-center gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{x.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{x.volunteerId}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0">
                          {new Date(x.checkInAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KEGIATAN */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(
                () =>
                  editId
                    ? api(`/api/admin/activities/${editId}`, { method: "PATCH", body: newAct })
                    : api("/api/admin/activities", { body: newAct }),
                editId ? "Kegiatan berhasil diperbarui!" : "Kegiatan relawan baru diterbitkan!"
              ).then(() => setShowAdd(false));
            }}
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">
                {editId ? "Ubah Kegiatan" : "Terbitkan Kegiatan Baru"}
              </h3>
              <button type="button" onClick={() => setShowAdd(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="font-bold text-slate-700">Judul Kegiatan</label>
              <input
                required
                value={newAct.title}
                onChange={(e) => setNewAct({ ...newAct, title: e.target.value })}
                className={field}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700">Kategori</label>
                <select
                  value={newAct.category}
                  onChange={(e) => setNewAct({ ...newAct, category: e.target.value })}
                  className={field}
                >
                  {["Pendidikan", "Lingkungan", "Bencana", "Anak", "Lansia", "Sosial"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">Mode</label>
                <select
                  value={newAct.type}
                  onChange={(e) => setNewAct({ ...newAct, type: e.target.value })}
                  className={field}
                >
                  <option>On-site</option>
                  <option>Remote</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700">Lokasi</label>
              <input
                required
                value={newAct.location}
                onChange={(e) => setNewAct({ ...newAct, location: e.target.value })}
                className={field}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700">Pelaksanaan</label>
                <input
                  type="date"
                  value={newAct.date}
                  onChange={(e) => setNewAct({ ...newAct, date: e.target.value })}
                  className={field}
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Batas Daftar</label>
                <input
                  type="date"
                  value={newAct.deadline}
                  onChange={(e) => setNewAct({ ...newAct, deadline: e.target.value })}
                  className={field}
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Kuota</label>
                <input
                  type="number"
                  value={newAct.quota}
                  onChange={(e) => setNewAct({ ...newAct, quota: parseInt(e.target.value) || 1 })}
                  className={field}
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700">Deskripsi</label>
              <textarea
                rows={3}
                value={newAct.description}
                onChange={(e) => setNewAct({ ...newAct, description: e.target.value })}
                className={field}
              />
            </div>
            <button
              disabled={busy}
              className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg disabled:opacity-60"
            >
              {busy
                ? editId
                  ? "Menyimpan..."
                  : "Menerbitkan..."
                : editId
                ? "Simpan Perubahan"
                : "Terbitkan Kegiatan"}
            </button>
          </form>
        </div>
      )}
      {/* MODAL TAMBAH / UBAH PROGRAM DONASI */}
      {showDon && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(
                () =>
                  editDonId
                    ? api(`/api/admin/donations/${editDonId}`, { method: "PATCH", body: newDon })
                    : api("/api/admin/donations", { body: newDon }),
                editDonId ? "Program donasi diperbarui." : "Program donasi baru diterbitkan!"
              ).then(() => setShowDon(false));
            }}
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">
                {editDonId ? "Ubah Program Donasi" : "Tambah Program Donasi"}
              </h3>
              <button type="button" onClick={() => setShowDon(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-bold text-slate-700">Judul Program</label>
              <input
                required
                value={newDon.title}
                onChange={(e) => setNewDon({ ...newDon, title: e.target.value })}
                className={field}
                placeholder="Bantuan ... untuk ..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700">Kategori</label>
                <select
                  value={newDon.category}
                  onChange={(e) => setNewDon({ ...newDon, category: e.target.value })}
                  className={field}
                >
                  {["Medis & Kesehatan", "Bencana Alam", "Pendidikan", "Panti & Yatim", "Rumah Ibadah", "Zakat & Wakaf", "Menolong Hewan", "Lingkungan", "Sosial"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">Penggalang</label>
                <input
                  value={newDon.organizer}
                  onChange={(e) => setNewDon({ ...newDon, organizer: e.target.value })}
                  className={field}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700">Target Dana (Rp)</label>
                <input
                  type="number"
                  min={100000}
                  value={newDon.target}
                  onChange={(e) => setNewDon({ ...newDon, target: parseInt(e.target.value) || 0 })}
                  className={field}
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Batas Akhir</label>
                <input
                  type="date"
                  value={newDon.endDate}
                  onChange={(e) => setNewDon({ ...newDon, endDate: e.target.value })}
                  className={field}
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700">Deskripsi</label>
              <textarea
                rows={3}
                value={newDon.description}
                onChange={(e) => setNewDon({ ...newDon, description: e.target.value })}
                className={field}
                placeholder="Jelaskan manfaat program dan penerima manfaatnya..."
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">URL Gambar (opsional)</label>
              <input
                value={newDon.image}
                onChange={(e) => setNewDon({ ...newDon, image: e.target.value })}
                className={field}
                placeholder="https://..."
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={newDon.urgent}
                  onChange={(e) => setNewDon({ ...newDon, urgent: e.target.checked })}
                  className="accent-brand"
                />{" "}
                Tandai mendesak
              </label>
              <label className="flex items-center gap-2 font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={newDon.verified}
                  onChange={(e) => setNewDon({ ...newDon, verified: e.target.checked })}
                  className="accent-brand"
                />{" "}
                Tayangkan (terverifikasi)
              </label>
            </div>

            <button
              disabled={busy}
              className="w-full py-2.5 bg-brand text-white font-bold rounded-lg disabled:opacity-60"
            >
              {busy ? "Menyimpan..." : editDonId ? "Simpan Perubahan" : "Terbitkan Program"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
