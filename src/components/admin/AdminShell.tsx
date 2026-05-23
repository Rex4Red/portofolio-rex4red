"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";

const links = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Projects", href: "/admin/projects", icon: "folder" },
  { label: "Experience", href: "/admin/experience", icon: "briefcase" },
  { label: "Certificates", href: "/admin/certificates", icon: "award" },
  { label: "Profile", href: "/admin/profile", icon: "user" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

const icons: Record<string, React.ReactNode> = {
  grid: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  folder: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  briefcase: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  award: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar — Desktop */}
      <aside className="hidden md:flex flex-col w-[260px] bg-surface border-r border-border p-6 shrink-0">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-accent-subtle border border-accent/30 flex items-center justify-center">
            <span className="font-[family-name:var(--font-display)] text-xl text-accent">R</span>
          </div>
          <div>
            <span className="font-[family-name:var(--font-display)] text-lg text-text-primary block leading-none">Admin</span>
            <span className="text-[10px] text-text-muted font-[family-name:var(--font-code)]">Rex Portfolio</span>
          </div>
        </Link>

        <nav className="flex-1 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`admin-sidebar-link ${pathname === l.href ? "active" : ""}`}>
              {icons[l.icon]}
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-border mt-6 space-y-1">
          <Link href="/" className="admin-sidebar-link text-text-muted hover:text-text-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            Lihat Website
          </Link>
          <button onClick={logout} className="admin-sidebar-link text-text-muted hover:text-error w-full text-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[260px] bg-surface border-r border-border p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-[family-name:var(--font-display)] text-lg text-text-primary">Admin</span>
              <button onClick={() => setSidebarOpen(false)} className="text-text-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <nav className="space-y-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setSidebarOpen(false)}
                  className={`admin-sidebar-link ${pathname === l.href ? "active" : ""}`}>
                  {icons[l.icon]}
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="pt-6 border-t border-border mt-6">
              <button onClick={logout} className="admin-sidebar-link text-text-muted hover:text-error w-full text-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-surface/80 border-b border-border flex items-center justify-between px-6 shrink-0 glass-nav">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-text-secondary text-sm font-[family-name:var(--font-body)] hidden sm:block">
              {user?.email || "Admin"}
            </span>
            <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center">
              <span className="font-[family-name:var(--font-display)] text-sm text-accent">R</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
