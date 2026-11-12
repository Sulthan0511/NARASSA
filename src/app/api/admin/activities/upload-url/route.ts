import { error, json, readBody } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseClient, uid } from "@/lib/db";

const BUCKET = "activity-images";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);

  const body = await readBody<{
    fileName?: string;
    fileSize?: number;
    contentType?: string;
  }>(req);

  if (!Number.isInteger(body.fileSize) || !body.fileSize || body.fileSize < 1) {
    return error("Ukuran file tidak valid.");
  }
  if (body.fileSize > MAX_FILE_SIZE) {
    return error("Ukuran foto maksimal 50 MB.", 413);
  }
  if (!body.contentType?.startsWith("image/")) {
    return error("File harus berupa gambar.");
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return error("Supabase belum dikonfigurasi di server.", 503);
  }

  const extension = body.fileName?.match(/\.([a-zA-Z0-9]{1,10})$/)?.[1]?.toLowerCase() || "img";
  const path = `activities/${uid("activity-")}.${extension}`;
  const { data, error: storageError } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (storageError || !data) {
    return error(
      `Gagal menyiapkan upload foto: ${storageError?.message || "respons Storage kosong"}. Pastikan bucket ${BUCKET} sudah dibuat.`,
      500
    );
  }

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return json({ path: data.path, token: data.token, publicUrl: publicData.publicUrl });
}
