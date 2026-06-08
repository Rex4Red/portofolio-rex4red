"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import { Badge } from "@/components/ui/Badge";
import { useState, useEffect, useRef } from "react";
import { getProjects, addProject, updateProject, deleteProject, Project } from "@/lib/data";

export default function AdminProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Web");
  const [customCategory, setCustomCategory] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // ─── Edit state ───
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    thumbnailUrl: "",
    isFeatured: false,
    sortOrder: 0,
  });
  const [editCategory, setEditCategory] = useState("Web");
  const [editCustomCategory, setEditCustomCategory] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const projects = await getProjects();
      setData(projects);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }

  // ─── Add Project ───
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const category = selectedCategory === "Other" ? customCategory : selectedCategory;
    try {
      await addProject({
        title: form.get("title") as string,
        description: form.get("description") as string,
        category,
        techStack: (form.get("techStack") as string).split(",").map((s) => s.trim()).filter(Boolean),
        githubUrl: (form.get("githubUrl") as string) || undefined,
        demoUrl: (form.get("demoUrl") as string) || undefined,
        thumbnailUrl,
        sortOrder: data.length + 1,
        isFeatured: false,
      });
      formRef.current?.reset();
      setShowForm(false);
      setSelectedCategory("Web");
      setThumbnailUrl("");
      setCustomCategory("");
      await loadProjects();
    } catch (err) {
      console.error("Failed to add project:", err);
      alert("Gagal menyimpan project. Cek console.");
    } finally {
      setSaving(false);
    }
  }

  // ─── Edit Project ───
  function startEdit(p: Project) {
    const presetCategories = ["Web", "Mobile", "AI", "Desktop"];
    const isPreset = presetCategories.includes(p.category);

    setEditingId(p.id);
    setEditForm({
      title: p.title,
      description: p.description,
      category: p.category,
      techStack: p.techStack.join(", "),
      githubUrl: p.githubUrl || "",
      demoUrl: p.demoUrl || "",
      thumbnailUrl: p.thumbnailUrl || "",
      isFeatured: p.isFeatured,
      sortOrder: p.sortOrder,
    });
    setEditCategory(isPreset ? p.category : "Other");
    setEditCustomCategory(isPreset ? "" : p.category);
    setShowForm(false); // close add form if open
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleEditSave() {
    if (!editingId) return;
    setEditSaving(true);
    const category = editCategory === "Other" ? editCustomCategory : editCategory;
    try {
      await updateProject(editingId, {
        title: editForm.title,
        description: editForm.description,
        category,
        techStack: editForm.techStack.split(",").map((s) => s.trim()).filter(Boolean),
        githubUrl: editForm.githubUrl || undefined,
        demoUrl: editForm.demoUrl || undefined,
        thumbnailUrl: editForm.thumbnailUrl,
        isFeatured: editForm.isFeatured,
        sortOrder: editForm.sortOrder,
      });
      setEditingId(null);
      await loadProjects();
    } catch (err) {
      console.error("Failed to update project:", err);
      alert("Gagal menyimpan perubahan. Cek console.");
    } finally {
      setEditSaving(false);
    }
  }

  // ─── Delete ───
  async function handleDelete(id: string) {
    if (!confirm("Hapus proyek ini?")) return;
    try {
      await deleteProject(id);
      setData(data.filter((p) => p.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Gagal menghapus. Cek console.");
    }
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary mb-1">Projects</h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary">Kelola proyek portofolio kamu</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }}
          className="bg-primary-container text-on-primary text-sm font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Project
        </button>
      </div>

      {/* ─── Add Form ─── */}
      {showForm && (
        <form ref={formRef} onSubmit={handleSave} className="bg-surface-elevated bento-card rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary mb-2">New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" required placeholder="Title" className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm font-[family-name:var(--font-body)] placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors" />
            <div className="space-y-2">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value !== "Other") setCustomCategory("");
                }}
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-secondary text-sm focus:outline-none focus:border-accent"
              >
                <option>Web</option><option>Mobile</option><option>AI</option><option>Desktop</option><option>Other</option>
              </select>
              {selectedCategory === "Other" && (
                <input
                  placeholder="Ketik nama kategori custom..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-bg border border-accent/40 rounded-lg px-4 py-2.5 text-text-primary text-sm font-[family-name:var(--font-body)] placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                  autoFocus
                />
              )}
            </div>
          </div>
          <textarea name="description" required placeholder="Description" rows={3} className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent resize-none" />
          <input name="techStack" required placeholder="Tech Stack (comma-separated)" className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="githubUrl" placeholder="GitHub URL" className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent" />
            <input name="demoUrl" placeholder="Demo URL" className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent" />
          </div>
          <CloudinaryUpload
            currentUrl={thumbnailUrl}
            onUpload={setThumbnailUrl}
            label="Project Thumbnail"
            hint="Recommended: 800x450px (16:9)"
            aspectRatio={16/9}
            folder="portfolio/projects"
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

      {/* ─── Loading ─── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-elevated bento-card rounded-xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-lg bg-surface-2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-2 rounded w-1/3" />
                  <div className="h-3 bg-surface-2 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">📁</p>
          <p className="font-[family-name:var(--font-body)] text-sm">Belum ada project. Klik &quot;Add Project&quot; atau seed database dulu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((p) => (
            <div key={p.id}>
              {/* ─── Edit Form (inline) ─── */}
              {editingId === p.id ? (
                <div className="bg-surface-elevated bento-card rounded-xl p-6 space-y-4 border border-accent/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary">Edit Project</h3>
                    <button onClick={cancelEdit} className="text-text-muted hover:text-text-primary text-sm">✕</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title"
                      className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent"
                    />
                    <div className="space-y-2">
                      <select
                        value={editCategory}
                        onChange={(e) => {
                          setEditCategory(e.target.value);
                          if (e.target.value !== "Other") setEditCustomCategory("");
                        }}
                        className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-secondary text-sm focus:outline-none focus:border-accent"
                      >
                        <option>Web</option><option>Mobile</option><option>AI</option><option>Desktop</option><option>Other</option>
                      </select>
                      {editCategory === "Other" && (
                        <input
                          placeholder="Ketik nama kategori custom..."
                          value={editCustomCategory}
                          onChange={(e) => setEditCustomCategory(e.target.value)}
                          className="w-full bg-bg border border-accent/40 rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent"
                          autoFocus
                        />
                      )}
                    </div>
                  </div>

                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                    rows={3}
                    className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent resize-none"
                  />

                  <input
                    value={editForm.techStack}
                    onChange={(e) => setEditForm({ ...editForm, techStack: e.target.value })}
                    placeholder="Tech Stack (comma-separated)"
                    className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      value={editForm.githubUrl}
                      onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                      placeholder="GitHub URL"
                      className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent"
                    />
                    <input
                      value={editForm.demoUrl}
                      onChange={(e) => setEditForm({ ...editForm, demoUrl: e.target.value })}
                      placeholder="Demo URL"
                      className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  <CloudinaryUpload
                    currentUrl={editForm.thumbnailUrl}
                    onUpload={(url) => setEditForm({ ...editForm, thumbnailUrl: url })}
                    label="Project Thumbnail"
                    hint="Recommended: 800x450px (16:9)"
                    aspectRatio={16/9}
                    folder="portfolio/projects"
                  />

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.isFeatured}
                        onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                      <span className="text-sm text-text-secondary">Featured Project</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-text-muted">Sort Order:</label>
                      <input
                        type="number"
                        value={editForm.sortOrder}
                        onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 0 })}
                        className="w-16 bg-bg border border-border rounded-lg px-2 py-1.5 text-text-primary text-sm text-center focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleEditSave}
                      disabled={editSaving}
                      className="bg-primary-container text-on-primary text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 flex items-center gap-2"
                    >
                      {editSaving && <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />}
                      {editSaving ? "Saving..." : "Update Project"}
                    </button>
                    <button type="button" onClick={cancelEdit} className="border border-border text-text-secondary text-sm px-5 py-2.5 rounded-lg hover:bg-surface-2">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── Project Row ─── */
                <div className="bg-surface-elevated bento-card rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-border-hover transition-all">
                  {/* Thumbnail preview */}
                  <div className="w-14 h-14 rounded-lg bg-surface-2 shrink-0 overflow-hidden flex items-center justify-center">
                    {p.thumbnailUrl ? (
                      <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-[family-name:var(--font-display)] text-2xl text-accent/30">{p.title.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-text-primary truncate">{p.title}</h3>
                      {p.isFeatured && <span className="text-[10px] bg-accent-subtle text-primary px-2 py-0.5 rounded-full border border-accent/20 font-semibold">Featured</span>}
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-xs text-text-secondary truncate">{p.description}</p>
                    <div className="flex gap-1.5 mt-2">
                      {p.techStack.slice(0, 3).map((t) => <Badge key={t} variant="tech">{t}</Badge>)}
                      {p.techStack.length > 3 && <span className="text-[10px] text-text-muted">+{p.techStack.length - 3}</span>}
                    </div>
                  </div>
                  <Badge variant="category">{p.category}</Badge>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary hover:text-primary hover:bg-accent-subtle transition-all"
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary hover:text-error hover:bg-error/10 transition-all" title="Delete">
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
