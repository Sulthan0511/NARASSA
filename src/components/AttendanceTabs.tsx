"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanLine, Camera, CameraOff, Keyboard, UserCheck } from "lucide-react";
import { api, toast } from "@/lib/client";

/**
 * ABSRELASI — pemindai QR absensi milik member.
 *
 * QR-nya dibuat oleh ADMIN (panel /admin -> tab Kegiatan Relawan -> QR Absen).
 * Payload QR:  NARASSA:<activityId>:<kodeAbsen>
 * Setiap scan berhasil -> POST /api/attendance { activityId, code } ->
 * kehadiran langsung tercatat dan muncul di daftar admin kegiatan tersebut.
 */
interface Props {
  activities: { id: string; title: string }[];
}

export default function AttendanceTabs({ activities }: Props) {
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [activityId, setActivityId] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const busyRef = useRef(false);

  const stopCam = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    try {
      if (scanner) {
        await scanner.stop();
        scanner.clear();
      }
    } catch {
      /* kamera sudah berhenti */
    }
    setCamOn(false);
  };

  // berhenti saat komponen dilepas
  useEffect(() => {
    return () => {
      void stopCam();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // berhenti saat beralih ke mode input manual
  useEffect(() => {
    if (mode === "manual") void stopCam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const submit = async (actId: string, scanCode: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const res = await api<{ title: string }>("/api/attendance", {
        body: { activityId: actId, code: scanCode },
      });
      toast(`Kehadiran tercatat untuk "${res.title}". Panitia menerima data Anda.`);
      setCode("");
      await stopCam();
    } catch (e: any) {
      toast(e.message, "error");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const handleDecoded = (text: string) => {
    const parts = String(text).split(":");
    if (parts.length !== 3 || parts[0] !== "NARASSA") {
      toast("QR tidak dikenali. Gunakan QR absensi dari panitia.", "error");
      return;
    }
    const [, actId, scanCode] = parts;
    void submit(actId, scanCode);
  };

  const startCam = async () => {
    if (camOn) return;
    try {
      const scanner = new Html5Qrcode("narassa-qr-region", { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => handleDecoded(decoded),
        () => {}
      );
      setCamOn(true);
    } catch (e: any) {
      scannerRef.current = null;
      toast(
        "Kamera tidak dapat diaktifkan. Izinkan akses kamera atau gunakan Input Kode Manual. (" +
          (e?.message || e) +
          ")",
        "error"
      );
    }
  };

  const tabCls = (on: boolean) =>
    `px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
      on ? "bg-brand text-white" : "bg-white border text-slate-700"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex justify-center border-b pb-3 gap-2">
        <button onClick={() => setMode("camera")} className={tabCls(mode === "camera")}>
          <ScanLine className="w-3.5 h-3.5" /> Pindai QR Kamera
        </button>
        <button onClick={() => setMode("manual")} className={tabCls(mode === "manual")}>
          <Keyboard className="w-3.5 h-3.5" /> Input Kode Manual
        </button>
      </div>

      {mode === "camera" && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 border border-slate-800">
          <div className="text-center space-y-1">
            <p className="text-xs font-extrabold text-white">Scan QR Absensi dari Panitia</p>
            <p className="text-[11px] text-slate-400">
              Arahkan kamera ke QR yang ditampilkan admin/petugas di lokasi kegiatan.
            </p>
          </div>

          <div
            id="narassa-qr-region"
            className="w-full max-w-xs mx-auto aspect-square bg-slate-950 rounded-xl overflow-hidden [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
          />

          <div className="flex gap-2">
            {!camOn ? (
              <button
                onClick={startCam}
                disabled={busy}
                className="flex-1 py-2.5 bg-brand hover:bg-brand-dark font-bold text-xs rounded-lg transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Camera className="w-4 h-4" /> Aktifkan Kamera
              </button>
            ) : (
              <button
                onClick={() => void stopCam()}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 font-bold text-xs rounded-lg transition inline-flex items-center justify-center gap-2"
              >
                <CameraOff className="w-4 h-4" /> Matikan Kamera
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-500 text-center">
            Bila kamera tidak didukung (misal di desktop), gunakan tab Input Kode Manual.
          </p>
        </div>
      )}

      {mode === "manual" && (
        <div className="bg-white p-6 rounded-2xl border text-center space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
              <Keyboard className="w-4 h-4 text-brand" /> Input Kode Absen
            </p>
            <p className="text-[11px] text-slate-500">
              Kode tertera di QR panitia (contoh: <span className="font-mono font-bold">7KQ2MX</span>).
            </p>
          </div>

          <div className="text-left space-y-1">
            <label className="font-bold text-slate-700 text-xs">Kegiatan</label>
            <select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold"
            >
              <option value="">— Pilih kegiatan —</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          <div className="text-left space-y-1">
            <label className="font-bold text-slate-700 text-xs">Kode Absen</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Masukkan kode dari QR"
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono font-bold tracking-widest text-center"
            />
          </div>

          <button
            onClick={() => {
              if (!activityId) return toast("Pilih kegiatan dulu.", "error");
              if (!code.trim()) return toast("Masukkan kode absennya.", "error");
              void submit(activityId, code.trim());
            }}
            disabled={busy}
            className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-lg transition disabled:opacity-60"
          >
            {busy ? "Memproses..." : "Absen Sekarang"}
          </button>
        </div>
      )}

      <div className="bg-brand-soft border border-brand-light rounded-xl p-4 flex items-start gap-3">
        <UserCheck className="w-5 h-5 text-brand-dark shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Setelah berhasil discan, kehadiran Anda langsung terkirim ke data admin untuk kegiatan
          tersebut (bisa dilihat admin di menu <strong>Kegiatan Relawan → QR Absen</strong>) dan
          muncul sebagai notifikasi di akun Anda.
        </p>
      </div>
    </div>
  );
}
