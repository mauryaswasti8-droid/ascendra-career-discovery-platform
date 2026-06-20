import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Stars from "@/components/Stars";

export const metadata: Metadata = {
  title: "Ascendra – Your Magical Guide to Career Discovery",
  description: "Discover careers, opportunities, and resources with Nova, your magical owl guide.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-800 min-h-screen">
        <AuthProvider>
          <Stars />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <footer className="relative z-10 border-t border-purple-200/40 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-purple-600/70">
              <p className="flex items-center justify-center gap-1">
                🦉 <span className="font-medium">Ascendra</span> — Your magical guide to discovery
              </p>
              <p className="mt-1">Built with ✨ for students everywhere</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
