import { error, json, readBody } from "@/lib/api";
import { getDB, mutate, uid } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await readBody<{ name: string; email: string; phone: string; password: string }>(req);
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const phone = (body.phone || "").trim();
  const password = body.password || "";
  if (!name || !email || !password) return error("Semua wajib diisi.");
  if (password.length < 6) return error("Password minimal 6 karakter.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error("Format email tidak valid.");

  const db = await getDB();
  if (db.users.some((u) => u.email === email)) return error("Email sudah terdaftar.");

  const user = await mutate((m) => {
    const u = {
      id: uid("u-"),
      name,
      email,
      phone,
      passwordHash: "",
      role: "user" as const,
      city: "",
      bio: "",
      volunteerId: "NRS-VOL-" + Math.floor(10000 + Math.random() * 89999),
      createdAt: new Date().toISOString().split("T")[0],
    };
    u.passwordHash = "";
    m.users.push(u);
    m.notifications.push({
      id: uid("nt-"),
      userId: u.id,
      title: "Selamat datang di NARASSA!",
      body: "Akun Anda berhasil dibuat. Lengkapi profil dan mulai berdonasi atau menjadi relawan.",
      type: "sistem",
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
    });
    return u;
  });

  const hash = await hashPassword(password);
  await mutate((m) => {
    const u = m.users.find((x) => x.id === user.id);
    if (u) u.passwordHash = hash;
  });

  await setSessionCookie(user.id);
  return json({ ok: true, user: { id: user.id, name: user.name, email: user.email, volunteerId: user.volunteerId } });
}
