import { api } from "@/lib/client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "activity-images";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

type SignedUpload = {
  path: string;
  token: string;
  publicUrl: string;
};

let browserClient: SupabaseClient | null = null;

function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.");
  }
  if (!browserClient) browserClient = createClient(url, anonKey);
  return browserClient;
}

export async function uploadActivityImage(file: File): Promise<string> {
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran foto harus lebih dari 0 dan maksimal 50 MB.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("File yang dipilih harus berupa gambar.");
  }

  const signed = await api<SignedUpload>("/api/admin/activities/upload-url", {
    body: {
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
    },
  });

  const { error } = await getBrowserClient()
    .storage.from(BUCKET)
    .uploadToSignedUrl(signed.path, signed.token, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Gagal mengunggah foto: ${error.message}`);
  return signed.publicUrl;
}
