"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import { useState, useEffect, useRef } from "react";
import { getCertificates, addCertificate, updateCertificate, deleteCertificate, Certificate } from "@/lib/data";

export default function AdminCertificates() {
  const [data, setData] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", issuer: "", issuedDate: "", credentialUrl: "", imageUrl: "" });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setData(await getCertificates());
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      await addCertificate({
        name: form.get("name") as string,
        issuer: form.get("issuer") as string,
        issuedDate: form.get("issuedDate") as string,
        imageUrl,
        credentialUrl: (form.get("credentialUrl") as string) || imageUrl || "",
      });
      formRef.current?.reset();
      setShowForm(false);
      setImageUrl("");
      await loadData();
    } catch (err) {
      console.error("Failed to add certificate:", err);
      alert("Gagal menyimpan. Cek console.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(cert: Certificate) {
    setEditingId(cert.id);
    setEditForm({
      name: cert.name,
      issuer: cert.issuer,
      issuedDate: cert.issuedDate,
      credentialUrl: cert.credentialUrl,
      imageUrl: cert.imageUrl,
    });
  }

  async function handleUpdate() {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateCertificate(editingId, {
        name: editForm.name,
        issuer: editForm.issuer,
        issuedDate: editForm.issuedDate,
        credentialUrl: editForm.credentialUrl,
        imageUrl: editForm.imageUrl,
      });
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Gagal update. Cek console.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus sertifikat ini?")) return;
    try {
      await deleteCertificate(id);
      setData(data.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  const inputClass = "bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors w-full";

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary mb-1">Certificates</h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary">Kelola sertifikat & kredensial</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary-container text-on-primary text-sm font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Certificate
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form ref={formRef} onSubmit={handleSave} className="bg-surface-elevated bento-card rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary mb-2">New Certificate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" required placeholder="Certificate Name" className={inputClass} />
            <input name="issuer" required placeholder="Issuer (e.g. Dicoding)" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="issuedDate" required placeholder="Issued Date (YYYY-MM)" className={inputClass} />
            <input name="credentialUrl" placeholder="Credential URL (opsional, bisa kosong jika upload file)" className={inputClass} />
          </div>
          <CloudinaryUpload
            currentUrl={imageUrl}
            onUpload={setImageUrl}
            label="Certificate Image"
            hint="Upload foto/scan sertifikat"
            folder="portfolio/certificates"
          />
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-primary-container text-on-primary text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />}
              {saving ? "Saving..." : "Save to Firestore"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-border text-text-secondary text-sm px-5 py-2.5 rounded-lg hover:bg-surface-2">Cancel</button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface-elevated bento-card rounded-xl p-5 animate-pulse">
              <div className="space-y-2"><div className="h-4 bg-surface-2 rounded w-2/3" /><div className="h-3 bg-surface-2 rounded w-1/3" /></div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">🏆</p>
          <p className="font-[family-name:var(--font-body)] text-sm">Belum ada sertifikat. Tambahkan atau seed database dulu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((cert) => (
            <div key={cert.id} className="bg-surface-elevated bento-card rounded-xl p-5 hover:border-border-hover transition-all">
              {editingId === cert.id ? (
                /* ── Inline Edit Form ── */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Certificate Name" className={inputClass} />
                    <input value={editForm.issuer} onChange={(e) => setEditForm({ ...editForm, issuer: e.target.value })} placeholder="Issuer" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input value={editForm.issuedDate} onChange={(e) => setEditForm({ ...editForm, issuedDate: e.target.value })} placeholder="Issued Date (YYYY-MM)" className={inputClass} />
                    <input value={editForm.credentialUrl} onChange={(e) => setEditForm({ ...editForm, credentialUrl: e.target.value })} placeholder="Credential URL" className={inputClass} />
                  </div>
                  <CloudinaryUpload
                    currentUrl={editForm.imageUrl}
                    onUpload={(url) => setEditForm({ ...editForm, imageUrl: url })}
                    label="Certificate Image"
                    hint="Ganti gambar sertifikat"
                    folder="portfolio/certificates"
                  />
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleUpdate} disabled={saving} className="bg-primary-container text-on-primary text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2">
                      {saving && <div className="w-3.5 h-3.5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={() => setEditingId(null)} className="border border-border text-text-secondary text-sm px-4 py-2 rounded-lg hover:bg-surface-2">Cancel</button>
                  </div>
                </div>
              ) : (
                /* ── Display Mode ── */
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-text-primary mb-1 leading-snug">{cert.name}</h3>
                    <p className="font-[family-name:var(--font-body)] text-sm text-primary">{cert.issuer}</p>
                    <p className="font-[family-name:var(--font-code)] text-xs text-text-muted mt-1">{cert.issuedDate}</p>
                    {cert.imageUrl && (
                      <div className="mt-2 w-16 h-12 rounded border border-border overflow-hidden bg-white">
                        <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary hover:text-primary hover:bg-accent-subtle transition-all" title="View">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                    </a>
                    <button onClick={() => startEdit(cert)} className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary hover:text-primary hover:bg-accent-subtle transition-all" title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary hover:text-error hover:bg-error/10 transition-all" title="Delete">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
