import { error, json } from "@/lib/api";
import { getDB, mutate } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return error("Silakan login.", 401);
  return json({ items: (await getDB()).notifications.filter((n) => n.userId === user.id) });
}

export async function POST() {
  const user = await getSessionUser();
  if (!user) return error("Silakan login.", 401);
  await mutate((m) => {
    m.notifications.forEach((n) => {
      if (n.userId === user.id) n.read = true;
    });
  });
  return json({ ok: true });
}

export async function PATCH() {
  const user = await getSessionUser();
  if (!user) return error("Silakan login.", 401);
  await mutate((m) => {
    m.notifications.forEach((n) => {
      if (n.userId === user.id) n.read = true;
    });
  });
  return json({ ok: true });
}
