import { error, json, readBody } from "@/lib/api";
import { mutate } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return error("Silakan login.", 401);
  const b = await readBody<{ name?: string; phone?: string; city?: string; bio?: string }>(req);

  const updated = await mutate((m) => {
    const u = m.users.find((x) => x.id === user.id);
    if (!u) return null;
    if (b.name !== undefined) {
      if (!b.name.trim()) return null;
      u.name = b.name.trim();
    }
    if (b.phone !== undefined) u.phone = b.phone.trim();
    if (b.city !== undefined) u.city = b.city;
    if (b.bio !== undefined) u.bio = b.bio;
    return { id: u.id, name: u.name, phone: u.phone, city: u.city, bio: u.bio };
  });
  if (!updated) return error("Gagal memperbarui profil.");
  return json({ ok: true, user: updated });
}
