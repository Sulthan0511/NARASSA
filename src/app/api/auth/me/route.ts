import { json } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return json({ user: null });
  return json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      volunteerId: user.volunteerId,
    },
  });
}
