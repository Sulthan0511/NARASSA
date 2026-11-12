"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/lib/client";

export default function MarkAllRead() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/notifications", { method: "POST" });
        toast("Semua notifikasi ditandai telah dibaca.");
        router.refresh();
      }}
      className="text-xs font-bold text-brand-dark hover:underline"
    >
      Tandai semua dibaca
    </button>
  );
}
