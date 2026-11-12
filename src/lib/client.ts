export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(path, {
    method: opts.method || "POST",
    headers: { "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan, coba lagi.");
  return data as T;
}

export function toast(message: string, type: "success" | "error" | "warning" = "success") {
  window.dispatchEvent(new CustomEvent("narassa:toast", { detail: { message, type } }));
}
