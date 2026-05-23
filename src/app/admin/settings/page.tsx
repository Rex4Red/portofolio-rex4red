"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/firebase/config";
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { useState } from "react";

// ─── Seed Data ───
const profileData = {
  name: "Rex",
  tagline: "Full Stack Developer & CS Student at UPN Veteran Yogyakarta",
  bioShort: "Building digital experiences that blend performance with elegance.",
  bioLong:
    "I'm a passionate Full Stack Developer and Computer Science student at UPN 'Veteran' Yogyakarta. I thrive at the intersection of clean code and beautiful design, crafting web and mobile experiences that are both functional and delightful. With a strong foundation in modern frameworks and a keen eye for detail, I transform complex problems into elegant digital solutions. When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, and mentoring fellow students in the tech community.",
  photoUrl: "/images/profile.jpg",
  skills: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "Flutter", "Python", "PostgreSQL", "Docker", "Git", "Figma", "Firebase"],
  socialLinks: {
    github: "https://github.com/rex",
    linkedin: "https://linkedin.com/in/rex",
    instagram: "https://instagram.com/rex",
    email: "putrasananda61@gmail.com",
    whatsapp: "https://wa.me/6281234567890",
  },
};

const projectsData = [
  { title: "Spada Task Manager", description: "A comprehensive task management platform with real-time synchronization, automated attendance tracking, and team collaboration features.", thumbnailUrl: "/images/projects/spada.jpg", techStack: ["Laravel", "Flutter", "PostgreSQL", "Docker", "REST API"], category: "Web", githubUrl: "https://github.com/rex/spada", demoUrl: "https://spada.rex.id", sortOrder: 1, isFeatured: true },
  { title: "Axion HRD System", description: "Human Resource Development system for managing employee data, attendance, payroll, and performance reviews.", thumbnailUrl: "/images/projects/axion.jpg", techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"], category: "Web", githubUrl: "https://github.com/rex/axion-hrd", sortOrder: 2, isFeatured: false },
  { title: "Sign Language Recognition", description: "AI-powered sign language recognition system using wearable sensors and machine learning.", thumbnailUrl: "/images/projects/sign-lang.jpg", techStack: ["Python", "TensorFlow", "Arduino", "Flask", "OpenCV"], category: "AI", githubUrl: "https://github.com/rex/sign-language", sortOrder: 3, isFeatured: false },
  { title: "Campus Event App", description: "Mobile application for discovering, organizing, and managing campus events with real-time notifications.", thumbnailUrl: "/images/projects/campus-event.jpg", techStack: ["Flutter", "Firebase", "Dart", "Google Maps API"], category: "Mobile", githubUrl: "https://github.com/rex/campus-event", sortOrder: 4, isFeatured: false },
  { title: "WhatsApp Bot Service", description: "Automated WhatsApp bot for team notifications, attendance reminders, and task updates.", thumbnailUrl: "/images/projects/wa-bot.jpg", techStack: ["Node.js", "WhatsApp Web.js", "Docker", "Coolify"], category: "Other", githubUrl: "https://github.com/rex/wa-bot", sortOrder: 5, isFeatured: false },
  { title: "Portfolio Website", description: "This portfolio — editorial minimalism with bento grids, smooth animations, and a custom admin dashboard.", thumbnailUrl: "/images/projects/portfolio.jpg", techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Firebase"], category: "Web", githubUrl: "https://github.com/rex/portfolio", demoUrl: "https://rex.id", sortOrder: 6, isFeatured: false },
];

const experiencesData = [
  { position: "Divisi Pengembangan — Sub-bidang TI", organization: "BEM UPN 'Veteran' Yogyakarta", type: "organisasi", startDate: "2024-05", endDate: null, description: "Managing IT infrastructure and developing digital solutions for student government operations.", sortOrder: 1 },
  { position: "Ketua Panitia Divisi Acara", organization: "Hackathon Campus 2024", type: "kepanitiaan", startDate: "2024-03", endDate: "2024-06", description: "Led the event division for the annual campus hackathon, coordinating 200+ participants.", sortOrder: 2 },
  { position: "Web Developer Intern", organization: "PT Teknologi Nusantara", type: "magang", startDate: "2024-01", endDate: "2024-03", description: "Built and maintained web applications using Laravel and React. Collaborated with senior developers.", sortOrder: 3 },
  { position: "Anggota Divisi Media & Informasi", organization: "Himpunan Mahasiswa Informatika", type: "organisasi", startDate: "2023-09", endDate: "2024-05", description: "Created digital content and managed social media channels for the CS student association.", sortOrder: 4 },
  { position: "Mentor Volunteer", organization: "Coding Camp for Kids", type: "volunteer", startDate: "2023-07", endDate: "2023-08", description: "Volunteered as a coding mentor teaching basic programming to middle school students.", sortOrder: 5 },
];

const certificatesData = [
  { name: "Belajar Membuat Aplikasi Back-End untuk Pemula", issuer: "Dicoding Indonesia", issuedDate: "2024-08", imageUrl: "/images/certs/dicoding-backend.jpg", credentialUrl: "https://www.dicoding.com/certificates/xxx" },
  { name: "Google IT Support Professional Certificate", issuer: "Google via Coursera", issuedDate: "2024-06", imageUrl: "/images/certs/google-it.jpg", credentialUrl: "https://coursera.org/verify/xxx" },
  { name: "Belajar Fundamental Aplikasi Android", issuer: "Dicoding Indonesia", issuedDate: "2024-04", imageUrl: "/images/certs/dicoding-android.jpg", credentialUrl: "https://www.dicoding.com/certificates/xxx" },
  { name: "AWS Cloud Practitioner Essentials", issuer: "AWS via Dicoding", issuedDate: "2024-02", imageUrl: "/images/certs/aws-cloud.jpg", credentialUrl: "https://www.dicoding.com/certificates/xxx" },
  { name: "Meta Front-End Developer", issuer: "Meta via Coursera", issuedDate: "2023-12", imageUrl: "/images/certs/meta-frontend.jpg", credentialUrl: "https://coursera.org/verify/xxx" },
  { name: "Belajar Dasar Pemrograman Web", issuer: "Dicoding Indonesia", issuedDate: "2023-09", imageUrl: "/images/certs/dicoding-web.jpg", credentialUrl: "https://www.dicoding.com/certificates/xxx" },
];

export default function AdminSettings() {
  const [seedStatus, setSeedStatus] = useState<string>("");
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedStatus("Seeding profile...");
    try {
      // Seed profile
      await setDoc(doc(db, "profiles", "main"), { ...profileData, updatedAt: serverTimestamp() });
      setSeedStatus("Seeding projects...");

      // Seed projects
      for (const p of projectsData) {
        await addDoc(collection(db, "projects"), { ...p, createdAt: serverTimestamp() });
      }
      setSeedStatus("Seeding experiences...");

      // Seed experiences
      for (const e of experiencesData) {
        await addDoc(collection(db, "experiences"), { ...e, createdAt: serverTimestamp() });
      }
      setSeedStatus("Seeding certificates...");

      // Seed certificates
      for (const c of certificatesData) {
        await addDoc(collection(db, "certificates"), { ...c, createdAt: serverTimestamp() });
      }

      // Seed visitor count
      await setDoc(doc(db, "settings", "main"), { visitorCount: 1234 });

      setSeedStatus("✅ Database seeded successfully!");
    } catch (err) {
      setSeedStatus(`❌ Error: ${err}`);
    }
    setSeeding(false);
  };

  const handleReset = async () => {
    if (!confirm("Yakin ingin menghapus semua data? Tindakan ini tidak bisa dibatalkan.")) return;
    setSeeding(true);
    setSeedStatus("Deleting all data...");
    try {
      const cols = ["projects", "experiences", "certificates"];
      for (const col of cols) {
        const snap = await getDocs(collection(db, col));
        for (const d of snap.docs) {
          const { deleteDoc: dd } = await import("firebase/firestore");
          await dd(d.ref);
        }
      }
      setSeedStatus("✅ All data deleted!");
    } catch (err) {
      setSeedStatus(`❌ Error: ${err}`);
    }
    setSeeding(false);
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary mb-1">Settings</h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary">Pengaturan website dan akun</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* General */}
        <div className="bg-surface-elevated bento-card rounded-xl p-6 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-text-primary">General</h3>
          <div>
            <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-1.5 block">Site Title</label>
            <input defaultValue="Rex — Portfolio" className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="font-[family-name:var(--font-body)] text-xs text-text-muted mb-1.5 block">Meta Description</label>
            <textarea defaultValue="Portfolio website of Rex, a Full Stack Developer." rows={3} className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-none" />
          </div>
        </div>

        {/* Seed Database */}
        <div className="bg-surface-elevated border border-accent/20 rounded-xl p-6 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-accent">🗄️ Seed Database</h3>
          <p className="font-[family-name:var(--font-body)] text-xs text-text-secondary">
            Isi database dengan dummy data untuk testing. Data mencakup profile, projects, experiences, certificates, dan visitor count.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="bg-accent/10 text-accent border border-accent/20 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent/20 transition-all disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "🌱 Seed Database"}
          </button>
          {seedStatus && (
            <p className="font-[family-name:var(--font-code)] text-xs text-text-secondary mt-2">{seedStatus}</p>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-surface-elevated border border-error/20 rounded-xl p-6 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-sm font-semibold text-error">Danger Zone</h3>
          <p className="font-[family-name:var(--font-body)] text-xs text-text-secondary">
            Hapus semua data dan reset database ke kosong.
          </p>
          <button
            onClick={handleReset}
            disabled={seeding}
            className="bg-error/10 text-error border border-error/20 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-error/20 transition-all disabled:opacity-50"
          >
            Reset All Data
          </button>
        </div>

        <button className="w-full bg-primary-container text-on-primary font-semibold py-3 rounded-lg hover:brightness-110 transition-all text-sm">
          Save Settings
        </button>
      </div>
    </AdminShell>
  );
}
