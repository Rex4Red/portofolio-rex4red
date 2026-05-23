"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import { useState, useEffect, useRef } from "react";
import { getExperiences, addExperience, updateExperience, deleteExperience, Experience } from "@/lib/data";

const typeClr: Record<string, string> = {
  organisasi: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  kepanitiaan: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  magang: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  volunteer: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function AdminExperience() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [certUrl, setCertUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setData(await getExperiences());
    } catch (err) {
      console.error("Failed to load experiences:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      await addExperience({
        position: form.get("position") as string,
        organization: form.get("organization") as string,
        type: form.get("type") as Experience["type"],
        startDate: form.get("startDate") as string,
        endDate: (form.get("endDate") as string) || null,
        description: form.get("description") as string,
        certificateUrl: certUrl || "",
        sortOrder: data.length + 1,
      });
      formRef.current?.reset();
      setCertUrl("");
      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error("Failed to add experience:", err);
      alert("Gagal menyimpan. Cek console.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus pengalaman ini?")) return;
    try {
      await deleteExperience(id);
      setData(data.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  async function handleCertUpload(id: string, url: string) {
    try {
      await updateExperience(id, { certificateUrl: url });
      setData(data.map((e) => (e.id === id ? { ...e, certificateUrl: url } : e)));
    } catch (err) {
      console.error("Failed to update certificate:", err);
    }
  }

  async function handleRemoveCert(id: string) {
    try {
      await updateExperience(id, { certificateUrl: "" });
      setData(data.map((e) => (e.id === id ? { ...e, certificateUrl: "" } : e)));
    } catch (err) {
      console.error("Failed to remove certificate:", err);
    }
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary mb-1">Experience</h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary">Kelola pengalaman organisasi & kerja</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary-container text-on-primary text-sm font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Experience
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form ref={formRef} onSubmit={handleSave} className="bg-surface-elevated bento-card rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary mb-2">New Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="position" required placeholder="Position / Jabatan" className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors" />
            <input name="organization" required placeholder="Organization" className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="type" className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-secondary text-sm focus:outline-none focus:border-accent">
              <option value="organisasi">Organisasi</option>
              <option value="kepanitiaan">Kepanitiaan</option>
              <option value="magang">Magang</option>
              <option value="volunteer">Volunteer</option>
            </select>
            <input name="startDate" required placeholder="Start Date (YYYY-MM)" className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent" />
            <input name="endDate" placeholder="End Date (kosongkan jika masih)" className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent" />
          </div>
          <textarea name="description" required placeholder="Description" rows={3} className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent resize-none" />

          {/* Certificate Upload */}
          <div>
            <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-2 block">Sertifikat (opsional)</label>
            <CloudinaryUpload
              currentUrl={certUrl}
              onUpload={(url) => setCertUrl(url)}
              label="Certificate"
              hint="Upload gambar sertifikat (JPG/PNG)"
              folder="portfolio/certificates"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-primary-container text-on-primary text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />}
              {saving ? "Saving..." : "Save to Firestore"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setCertUrl(""); }} className="border border-border text-text-secondary text-sm px-5 py-2.5 rounded-lg hover:bg-surface-2">Cancel</button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-elevated bento-card rounded-xl p-5 animate-pulse">
              <div className="space-y-2"><div className="h-4 bg-surface-2 rounded w-1/3" /><div className="h-3 bg-surface-2 rounded w-2/3" /></div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">💼</p>
          <p className="font-[family-name:var(--font-body)] text-sm">Belum ada experience. Tambahkan atau seed database dulu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((exp) => (
            <div key={exp.id} className="bg-surface-elevated bento-card rounded-xl p-5 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-text-primary">{exp.position}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${typeClr[exp.type] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>{exp.type}</span>
                  </div>
                  <p className="font-[family-name:var(--font-body)] text-sm text-primary">{exp.organization}</p>
                  <p className="font-[family-name:var(--font-code)] text-xs text-text-muted mt-1">
                    {exp.startDate} — {exp.endDate || "Sekarang"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {exp.certificateUrl && (
                    <a href={exp.certificateUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all" title="Lihat Sertifikat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </a>
                  )}
                  <button onClick={() => handleDelete(exp.id)} className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary hover:text-error hover:bg-error/10 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>

              {/* Certificate upload for existing items */}
              <div className="border-t border-border pt-3">
                <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-2 block">
                  {exp.certificateUrl ? "✅ Sertifikat terupload" : "📎 Upload sertifikat"}
                </label>
                <CloudinaryUpload
                  currentUrl={exp.certificateUrl || ""}
                  onUpload={(url) => handleCertUpload(exp.id, url)}
                  label="Certificate"
                  hint="JPG/PNG"
                  folder="portfolio/certificates"
                />
                {exp.certificateUrl && (
                  <button
                    onClick={() => handleRemoveCert(exp.id)}
                    className="mt-2 text-xs text-error hover:underline"
                  >
                    Hapus sertifikat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
