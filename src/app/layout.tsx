import LocalApp from "@/components/LocalApp";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landlordr 🔥 | Tinder for Landlords & Dream Tenants",
  description:
    "The dating app for rentals. Landlords swipe on 800+ credit scores and spotless backgrounds; tenants swipe on dream pads and responsive landlords who actually fix sinks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-rose-500 selection:text-white">
        <LocalApp>{children}</LocalApp>
      </body>
    </html>
  );
}
