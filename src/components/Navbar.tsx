"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Compass, BookOpen, Lightbulb, LayoutDashboard, Shield, Menu, X, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/careers", label: "Career Explorer", icon: <Compass size={18} /> },
    { href: "/opportunities", label: "Opportunities", icon: <Lightbulb size={18} /> },
    { href: "/resources", label: "Resources", icon: <BookOpen size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-purple-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🦉</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Ascendra
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-100/60 transition-colors"
              >
                {l.icon} {l.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-100/60 transition-colors"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-100/60 transition-colors"
              >
                <Shield size={18} /> Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-700 flex items-center gap-1">
                  <User size={14} /> {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-1.5 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-colors shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-purple-700">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-purple-200/50 bg-white/90 backdrop-blur-lg animate-fadeIn">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-purple-700 hover:bg-purple-100/60"
              >
                {l.icon} {l.label}
              </Link>
            ))}
            {user && (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-purple-700 hover:bg-purple-100/60">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link
  href="/build-my-story"
  onClick={() => setMobileOpen(false)}
  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-purple-700 hover:bg-purple-100/60"
>
  ✨ Find Your Narrative
</Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-amber-700 hover:bg-amber-100/60">
                <Shield size={18} /> Admin
              </Link>
            )}
            <div className="border-t border-purple-100 pt-2 mt-2">
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-purple-600 hover:bg-purple-100 w-full">
                  <LogOut size={18} /> Logout ({user.name})
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-purple-700 hover:bg-purple-100">Login</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
