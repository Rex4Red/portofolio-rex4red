"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import { getProfile, updateProfile, Profile } from "@/lib/data";
import { useState, useEffect } from "react";

export default function AdminProfile() {
  const [p, setP] = useState<Profile | null>(null);
  const [skillsText, setSkillsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then((profile) => {
      setP(profile);
      setSkillsText(profile.skills.join(", "));
    });
  }, []);

  const handleSave = async () => {
    if (!p) return;
    setSaving(true);
    const skills = skillsText.split(",").map(s => s.trim()).filter(Boolean);
    await updateProfile({ ...p, skills });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!p) {
    return (
      <AdminShell>
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary mb-1">Profile</h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary">Loading...</p>
        </div>
        <div className="max-w-2xl space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-elevated bento-card rounded-xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary mb-1">Profile</h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary">Edit informasi profil kamu</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Photo */}
        <div className="bg-surface-elevated bento-card rounded-xl p-6">
          <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-text-primary mb-4">Profile Photo</h3>
          <CloudinaryUpload
            currentUrl={p.photoUrl}
            onUpload={(url) => setP({ ...p, photoUrl: url })}
            label="Photo"
            hint="Recommended: 400x400px, JPG/PNG"
            aspectRatio={1}
            folder="portfolio/profile"
          />
        </div>

        {/* Basic Info */}
        <div className="bg-surface-elevated bento-card rounded-xl p-6 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-text-primary">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-1.5 block">Name</label>
              <input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-1.5 block">Tagline</label>
              <input value={p.tagline} onChange={(e) => setP({ ...p, tagline: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
          </div>
          <div>
            <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-1.5 block">Short Bio</label>
            <input value={p.bioShort} onChange={(e) => setP({ ...p, bioShort: e.target.value })}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-1.5 block">Full Bio</label>
            <textarea value={p.bioLong} rows={5} onChange={(e) => setP({ ...p, bioLong: e.target.value })}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-none" />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-surface-elevated bento-card rounded-xl p-6 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-text-primary">Skills</h3>
          <input value={skillsText} onChange={(e) => setSkillsText(e.target.value)}
            placeholder="TypeScript, React, Next.js, ..."
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors" />
          <p className="font-[family-name:var(--font-body)] text-xs text-text-muted">Pisahkan skill dengan koma</p>
        </div>

        {/* Social Links */}
        <div className="bg-surface-elevated bento-card rounded-xl p-6 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-text-primary">Social Links</h3>
          {Object.entries(p.socialLinks).map(([key, val]) => (
            <div key={key}>
              <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-1.5 block capitalize">{key}</label>
              <input value={val}
                onChange={(e) => setP({ ...p, socialLinks: { ...p.socialLinks, [key]: e.target.value } })}
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary-container text-on-primary font-semibold py-3 rounded-lg hover:brightness-110 transition-all text-sm disabled:opacity-50"
        >
          {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </AdminShell>
  );
}
