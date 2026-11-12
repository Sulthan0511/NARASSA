import { error, json, readBody } from "@/lib/api";
import { mutate } from "@/lib/db";
import { getSessionUser, hashPassword, verifyPassword, clearSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return error("Silakan login terlebih dahulu.", 401);
  const body = await readBody<{ oldPassword: string; newPassword: string }>(req);
  if (!body.oldPassword || !body.newPassword) return error("Semua field wajib diisi.");
  if (body.newPassword.length < 6) return error("Password baru minimal 6 karakter.");

  const { getDB } = await import("@/lib/db");
  const full = (await getDB()).users.find((u) => u.id === user.id);
  if (!full) return error("Akun tidak ditemukan.");
  const ok = await verifyPassword(body.oldPassword, full.passwordHash);
  if (!ok) return error("Password lama salah.");

  const hash = await hashPassword(body.newPassword);
  await mutate((m) => {
    const u = m.users.find((x) => x.id === user.id);
    if (u) u.passwordHash = hash;
  });
  await clearSessionCookie();
  return json({ ok: true, relogin: true });
}
