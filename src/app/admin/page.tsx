"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { getProjects, getExperiences, getCertificates, getVisitorCount } from "@/lib/data";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, experiences: 0, certificates: 0, visitors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, e, c, v] = await Promise.all([getProjects(), getExperiences(), getCertificates(), getVisitorCount()]);
        setStats({ projects: p.length, experiences: e.length, certificates: c.length, visitors: v });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Projects", value: stats.projects, icon: "📁", trend: "From Firestore" },
    { label: "Experiences", value: stats.experiences, icon: "💼", trend: "From Firestore" },
    { label: "Certificates", value: stats.certificates, icon: "🏆", trend: "From Firestore" },
    { label: "Visitors", value: stats.visitors, icon: "👁️", trend: "Live counter" },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-text-primary mb-1">
          Dashboard
        </h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary">
          Selamat datang kembali, Rex 👋
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-surface-elevated bento-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="font-[family-name:var(--font-code)] text-[10px] text-success">{s.trend}</span>
            </div>
            <div className="font-[family-name:var(--font-display)] text-3xl text-text-primary mb-1">
              {loading ? (
                <div className="w-12 h-8 bg-surface-2 rounded animate-pulse" />
              ) : (
                s.value.toLocaleString()
              )}
            </div>
            <p className="font-[family-name:var(--font-body)] text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info Card */}
        <div className="bg-surface-elevated bento-card rounded-xl p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary mb-4">Database Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="font-[family-name:var(--font-body)] text-sm text-text-primary">Firebase Firestore — <span className="text-success">Connected</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="font-[family-name:var(--font-body)] text-sm text-text-primary">Firebase Auth — <span className="text-success">Active</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="font-[family-name:var(--font-body)] text-sm text-text-primary">Cloudinary Storage — <span className="text-success">Ready</span></span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-surface-elevated bento-card rounded-xl p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href="/admin/projects" className="bg-surface-2 rounded-lg p-4 text-center hover:bg-surface-container-high transition-colors">
              <span className="text-2xl mb-2 block">📁</span>
              <span className="font-[family-name:var(--font-body)] text-xs text-text-secondary">Add Project</span>
            </a>
            <a href="/admin/experience" className="bg-surface-2 rounded-lg p-4 text-center hover:bg-surface-container-high transition-colors">
              <span className="text-2xl mb-2 block">💼</span>
              <span className="font-[family-name:var(--font-body)] text-xs text-text-secondary">Add Experience</span>
            </a>
            <a href="/admin/certificates" className="bg-surface-2 rounded-lg p-4 text-center hover:bg-surface-container-high transition-colors">
              <span className="text-2xl mb-2 block">🏆</span>
              <span className="font-[family-name:var(--font-body)] text-xs text-text-secondary">Add Certificate</span>
            </a>
            <a href="/admin/profile" className="bg-surface-2 rounded-lg p-4 text-center hover:bg-surface-container-high transition-colors">
              <span className="text-2xl mb-2 block">👤</span>
              <span className="font-[family-name:var(--font-body)] text-xs text-text-secondary">Edit Profile</span>
            </a>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
