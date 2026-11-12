"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Download, ListFilter } from "lucide-react";
import Link from "next/link";

interface Act {
  id: string;
  title: string;
  date: string;
  deadline: string;
  location: string;
  type: string;
  category: string;
  quota: number;
  registered: number;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const DAY_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const FILTERS = ["Semua Kegiatan", "Diikuti Saya", "Lingkungan", "Pendidikan", "Bencana"];

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export default function CalendarView({ activities }: { activities: Act[] }) {
  const now = new Date();
  const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string>(todayIso);
  const [filter, setFilter] = useState("Semua Kegiatan");
  const [mine, setMine] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("narassa_my_activities");
      if (raw) setMine(JSON.parse(raw));
    } catch {}
  }, []);

  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const filtered = useMemo(() => {
    if (filter === "Diikuti Saya") return activities.filter((a) => mine.includes(a.id));
    if (filter !== "Semua Kegiatan")
      return activities.filter((a) => a.category === filter);
    return activities;
  }, [activities, filter, mine]);

  const eventsOn = (dateStr: string) => {
    const list: { act: Act; kind: "agenda" | "deadline" }[] = [];
    filtered.forEach((a) => {
      if (a.date === dateStr) list.push({ act: a, kind: "agenda" });
      else if (a.deadline === dateStr) list.push({ act: a, kind: "deadline" });
    });
    return list;
  };

  const selectedEvents = eventsOn(selected);
  const selectedDate = new Date(selected + "T00:00:00");
  const monthCount = filtered.filter((a) => {
    const dt = new Date(a.date + "T00:00:00");
    return dt.getMonth() === month && dt.getFullYear() === year;
  }).length;

  const shift = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
  };

  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelected(todayIso);
  };

  const downloadBriefing = () => {
    const lines = [
      `BRIEFING AGENDA NARASSA`,
      `${DAY_FULL[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`,
      `${selectedEvents.length} inisiatif aksi sosial dijadwalkan berlangsung`,
      "",
      ...selectedEvents.map(
        (e, i) =>
          `${i + 1}. ${e.act.title}\n   Kategori: ${e.act.category} · Format: ${e.act.type}\n   Lokasi: ${e.act.location}\n   Kuota: ${e.act.registered}/${e.act.quota} relawan\n   Status: ${e.kind === "deadline" ? "Batas akhir pendaftaran" : "Pelaksanaan aksi"}`
      ),
      "",
      "Salam Aksi, NARASSA",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `briefing-agenda-${selected}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const routeUrl = selectedEvents.length
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvents[0].act.location)}`
    : null;

  const cellCls = (dateStr: string) => {
    const isSel = selected === dateStr;
    const isToday = dateStr === todayIso;
    const evs = eventsOn(dateStr);
    const hasDeadline = evs.some((e) => e.kind === "deadline");
    const critical = evs.some((e) => e.kind === "agenda" && e.act.quota - e.act.registered < 15);
    return [
      "relative w-full rounded-lg p-1 sm:p-1.5 transition flex flex-col items-stretch min-h-[52px] sm:min-h-[76px] text-left",
      isSel
        ? "bg-brand text-white shadow-sm ring-2 ring-brand-dark/30"
        : evs.length
        ? hasDeadline
          ? "bg-red-50 border border-red-200 hover:bg-red-100"
          : critical
          ? "bg-amber-50 border border-amber-200 hover:bg-amber-100"
          : "bg-brand-soft border border-brand-light hover:bg-brand-light"
        : "bg-white border border-slate-100 hover:bg-slate-50",
      isToday && !isSel ? "ring-2 ring-amber-400" : "",
    ].join(" ");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button onClick={() => shift(-1)} className="p-1.5 hover:bg-slate-100 rounded-md" aria-label="Bulan sebelumnya">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-extrabold text-slate-900 text-sm min-w-[130px] text-center px-1">
              {MONTHS[month]} {year}
            </h3>
            <button onClick={() => shift(1)} className="p-1.5 hover:bg-slate-100 rounded-md" aria-label="Bulan berikutnya">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={goToday}
            className="px-3.5 py-2.5 bg-brand-light text-brand-dark border border-brand-light rounded-lg text-xs font-bold hover:bg-brand hover:text-white transition"
          >
            Hari Ini
          </button>
          <span className="text-xs bg-white border border-slate-200 text-slate-600 font-bold px-2.5 py-2 rounded-lg">
            {monthCount} Agenda
          </span>
        </div>

        <div className="-mx-4 px-4 xl:mx-0 xl:px-0 overflow-x-auto">
          <div className="flex gap-2 w-max xl:w-auto xl:flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  filter === f
                    ? "bg-brand text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white p-3 sm:p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-7 text-center font-bold text-[10px] sm:text-xs text-slate-400 py-1">
            {DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`b-${i}`} className="rounded-lg bg-slate-50/60 min-h-[52px] sm:min-h-[76px]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = iso(year, month, day);
              const evs = eventsOn(dateStr);
              const isSel = selected === dateStr;
              return (
                <button
                  key={day}
                  onClick={() => setSelected(dateStr)}
                  className={cellCls(dateStr)}
                >
                  <span className="flex items-center justify-between w-full">
                    <span className={`text-[11px] sm:text-xs font-extrabold ${isSel ? "text-white" : "text-slate-700"}`}>
                      {day}
                    </span>
                    {dateStr === todayIso && (
                      <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-wide px-1 py-0.5 rounded ${isSel ? "bg-white/25 text-white" : "bg-amber-400 text-slate-950"}`}>
                        Hari Ini
                      </span>
                    )}
                  </span>
                  <span className="hidden sm:flex flex-col gap-0.5 mt-1 w-full overflow-hidden">
                    {evs.slice(0, 2).map(({ act, kind }) => (
                      <span
                        key={act.id + kind}
                        className={`text-[9px] leading-tight font-bold px-1 py-0.5 rounded truncate ${
                          isSel
                            ? "bg-white/25 text-white"
                            : kind === "deadline"
                            ? "bg-red-100 text-red-700"
                            : "bg-brand text-white"
                        }`}
                        title={act.title}
                      >
                        {act.title}
                      </span>
                    ))}
                    {evs.length > 2 && (
                      <span className={`text-[9px] font-bold ${isSel ? "text-white/80" : "text-slate-400"}`}>
                        +{evs.length - 2} lagi
                      </span>
                    )}
                  </span>
                  <span className="sm:hidden flex gap-0.5 mt-1">
                    {evs.slice(0, 3).map(({ kind }, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${isSel ? "bg-white" : kind === "deadline" ? "bg-red-500" : "bg-brand"}`}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 space-y-4 h-fit">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-wider">
              Detail Agenda Terpilih
            </h4>
            <ListFilter className="w-4 h-4 text-brand" />
          </div>

          <div>
            <p className="font-black text-slate-900 text-lg leading-tight">
              {DAY_FULL[selectedDate.getDay()]}, {String(selectedDate.getDate()).padStart(2, "0")}
            </p>
            <p className="font-black text-brand-dark text-lg leading-tight">
              {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              {selectedEvents.length > 0
                ? `${selectedEvents.length} inisiatif aksi sosial dijadwalkan berlangsung.`
                : "Tidak ada aksi terjadwal pada tanggal ini."}
            </p>
          </div>

          <div className="space-y-2">
            {selectedEvents.length > 0 ? (
              selectedEvents.map(({ act, kind }) => (
                <Link
                  key={act.id + kind}
                  href={`/activity/${act.id}`}
                  className="block p-3 rounded-lg border border-slate-200 hover:border-brand hover:bg-brand-soft transition space-y-1"
                >
                  <span
                    className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      kind === "deadline"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-brand-light text-brand-dark"
                    }`}
                  >
                    {kind === "deadline" ? "Batas Pendaftaran" : `Pelaksanaan · ${act.category}`}
                  </span>
                  <h5 className="font-bold text-xs text-slate-900 leading-snug">{act.title}</h5>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-brand shrink-0" /> {act.location}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Kuota {act.registered}/{act.quota} relawan · {act.type}
                  </p>
                </Link>
              ))
            ) : (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  {filter === "Diikuti Saya"
                    ? "Anda belum terdaftar pada kegiatan apa pun."
                    : "Pilih tanggal bertanda untuk melihat agenda."}
                </p>
                {filter === "Diikuti Saya" && (
                  <Link
                    href="/activity"
                    className="inline-block px-4 py-2 bg-brand text-white text-[11px] font-bold rounded-lg"
                  >
                    Cari Kegiatan
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={downloadBriefing}
              disabled={!selectedEvents.length}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-brand hover:bg-brand-dark text-white text-[11px] font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Briefing
            </button>
            <a
              href={routeUrl || "#"}
              target={routeUrl ? "_blank" : undefined}
              rel="noreferrer"
              aria-disabled={!routeUrl}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-lg transition border ${
                routeUrl
                  ? "border-slate-200 text-slate-700 hover:bg-slate-100"
                  : "border-slate-200 text-slate-400 pointer-events-none"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> Rute Maps
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
        <p className="font-black text-slate-900 text-xs shrink-0">Panduan Indikator Kalender:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400 ring-2 ring-amber-200" /> Hari ini
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand" /> Kegiatan Aksi Terjadwal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300" /> Kuota Kritis
            (&lt;15 Kursi)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300" /> Batas Akhir
            Pendaftaran
          </span>
        </div>
      </div>
    </div>
  );
}
