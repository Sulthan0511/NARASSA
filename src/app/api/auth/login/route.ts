import { error, json, readBody } from "@/lib/api";
import { getDB } from "@/lib/db";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await readBody<{ identifier: string; password: string }>(req);
  const identifier = (body.identifier || "").trim().toLowerCase();
  const password = body.password || "";
  if (!identifier || !password) return error("Email/no HP dan password wajib diisi.");

  const db = await getDB();
  const user = db.users.find((u) => u.email.toLowerCase() === identifier || u.phone === identifier);
  if (!user) return error("Akun tidak ditemukan.");
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return error("Password salah.");

  await setSessionCookie(user.id);
  return json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
