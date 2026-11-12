import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import ToastHost from "@/components/ToastHost";

export const metadata: Metadata = {
  title: {
    default: "NARASSA – Platform Donasi & Relawan Terpercaya",
    template: "%s | NARASSA",
  },
  description:
    "NARASSA adalah platform donasi online, galang dana, dan komunitas relawan terpercaya di Indonesia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <ToastHost />
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
