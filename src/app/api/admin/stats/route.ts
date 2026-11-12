import { json } from "@/lib/api";
import { getDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Akses admin diperlukan." }, 403);
  const db = await getDB();
  const totalCollected = db.donations.reduce((s, d) => s + d.collected, 0);
  return json({
    stats: {
      users: db.users.length,
      donations: db.donations.length,
      transactions: db.txs.length,
      collected: totalCollected,
      activities: db.activities.length,
      applications: db.applications.length,
      pendingApplications: db.applications.filter((a) => a.status === "Menunggu").length,
      certificates: db.certificates.length,
    },
    applications: db.applications,
    txs: db.txs,
    users: db.users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, volunteerId: u.volunteerId, createdAt: u.createdAt })),
  });
}
