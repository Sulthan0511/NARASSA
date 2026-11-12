import { error, json, readBody } from "@/lib/api";
import { getDB, mutate } from "@/lib/db";
import { getSessionUser, hashPassword, setSessionCookie } from "@/lib/auth";

const OTP_TTL = 5 * 60 * 1000;

export async function POST(req: Request) {
  const body = await readBody<{
    action: "request" | "verify" | "reset";
    contact?: string;
    code?: string;
    password?: string;
  }>(req);

  if (body.action === "request") {
    const contact = (body.contact || "").trim().toLowerCase();
    if (!contact) return error("Email atau no HP wajib diisi.");
    const user = (await getDB()).users.find(
      (u) => u.email.toLowerCase() === contact || u.phone === contact
    );
    if (!user) return error("Akun dengan data tersebut tidak ditemukan.");
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await mutate((m) => {
      m.otps = m.otps.filter((o) => o.contact !== contact);
      m.otps.push({ contact, code, expiresAt: Date.now() + OTP_TTL });
    });
    return json({ ok: true, demoOtp: code, message: "OTP terkirim (mode demo, gunakan kode di respons)." });
  }

  if (body.action === "verify") {
    const contact = (body.contact || "").trim().toLowerCase();
    const code = (body.code || "").trim();
    const rec = (await getDB()).otps.find((o) => o.contact === contact);
    if (!rec) return error("OTP belum diminta.");
    if (rec.expiresAt < Date.now()) return error("OTP kedaluwarsa, minta ulang.");
    if (rec.code !== code) return error("Kode OTP salah.");
    return json({ ok: true });
  }

  if (body.action === "reset") {
    const contact = (body.contact || "").trim().toLowerCase();
    const code = (body.code || "").trim();
    const password = body.password || "";
    if (password.length < 6) return error("Password baru minimal 6 karakter.");
    const rec = (await getDB()).otps.find((o) => o.contact === contact);
    if (!rec || rec.code !== code || rec.expiresAt < Date.now())
      return error("Verifikasi OTP tidak valid.");
    const hash = await hashPassword(password);
    await mutate((m) => {
      const u = m.users.find((x) => x.email.toLowerCase() === contact || x.phone === contact);
      if (u) u.passwordHash = hash;
      m.otps = m.otps.filter((o) => o.contact !== contact);
      if (u) m.notifications.unshift({
        id: "nt-" + Date.now().toString(36),
        userId: u.id,
        title: "Password diubah",
        body: "Password akun Anda berhasil direset melalui OTP. Segera login kembali.",
        type: "sistem",
        read: false,
        createdAt: new Date().toISOString().split("T")[0],
      });
    });
    const u = (await getDB()).users.find((x) => x.email.toLowerCase() === contact || x.phone === contact);
    if (u) await setSessionCookie(u.id);
    return json({ ok: true });
  }

  return error("Aksi tidak dikenal.");
}
