import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, doc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";

// Dummy data to seed
const profile = {
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
    email: "rex@example.com",
    whatsapp: "https://wa.me/6281234567890",
  },
};

const projects = [
  {
    title: "Spada Task Manager",
    description: "A comprehensive task management platform with real-time synchronization, automated attendance tracking, and team collaboration features. Built with Laravel and Flutter.",
    thumbnailUrl: "/images/projects/spada.jpg",
    techStack: ["Laravel", "Flutter", "PostgreSQL", "Docker", "REST API"],
    category: "Web",
    githubUrl: "https://github.com/rex/spada-task-manager",
    demoUrl: "https://spada.rex.id",
    sortOrder: 1,
    isFeatured: true,
  },
  {
    title: "Axion HRD System",
    description: "Human Resource Development system for managing employee data, attendance, payroll, and performance reviews with intuitive dashboards.",
    thumbnailUrl: "/images/projects/axion.jpg",
    techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    category: "Web",
    githubUrl: "https://github.com/rex/axion-hrd",
    sortOrder: 2,
    isFeatured: false,
  },
  {
    title: "Sign Language Recognition",
    description: "AI-powered sign language recognition system using wearable sensors and machine learning models to bridge communication gaps.",
    thumbnailUrl: "/images/projects/sign-lang.jpg",
    techStack: ["Python", "TensorFlow", "Arduino", "Flask", "OpenCV"],
    category: "AI",
    githubUrl: "https://github.com/rex/sign-language",
    sortOrder: 3,
    isFeatured: false,
  },
  {
    title: "Campus Event App",
    description: "A mobile application for discovering, organizing, and managing campus events with real-time notifications and social features.",
    thumbnailUrl: "/images/projects/campus-event.jpg",
    techStack: ["Flutter", "Firebase", "Dart", "Google Maps API"],
    category: "Mobile",
    githubUrl: "https://github.com/rex/campus-event",
    demoUrl: "https://play.google.com/store/apps/details?id=com.rex.campusevent",
    sortOrder: 4,
    isFeatured: false,
  },
  {
    title: "WhatsApp Bot Service",
    description: "Automated WhatsApp bot for team notifications, attendance reminders, and task status updates with webhook integration.",
    thumbnailUrl: "/images/projects/wa-bot.jpg",
    techStack: ["Node.js", "WhatsApp Web.js", "Docker", "Coolify"],
    category: "Other",
    githubUrl: "https://github.com/rex/wa-bot-service",
    sortOrder: 5,
    isFeatured: false,
  },
  {
    title: "Portfolio Website",
    description: "This very portfolio — a showcase of editorial minimalism, featuring bento grid layouts, smooth animations, and a custom admin dashboard.",
    thumbnailUrl: "/images/projects/portfolio.jpg",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Firebase"],
    category: "Web",
    githubUrl: "https://github.com/rex/portfolio",
    demoUrl: "https://rex.id",
    sortOrder: 6,
    isFeatured: false,
  },
];

const experiences = [
  {
    position: "Divisi Pengembangan — Sub-bidang Teknologi Informasi",
    organization: "BEM UPN 'Veteran' Yogyakarta",
    type: "organisasi",
    startDate: "2024-05",
    endDate: null,
    description: "Managing IT infrastructure and developing digital solutions for student government operations. Leading the technical team to build internal tools and modernize workflows.",
    sortOrder: 1,
  },
  {
    position: "Ketua Panitia Divisi Acara",
    organization: "Hackathon Campus 2024",
    type: "kepanitiaan",
    startDate: "2024-03",
    endDate: "2024-06",
    description: "Led the event division for the annual campus hackathon, coordinating 200+ participants, managing speakers, and ensuring smooth execution across 3 days.",
    sortOrder: 2,
  },
  {
    position: "Web Developer Intern",
    organization: "PT Teknologi Nusantara",
    type: "magang",
    startDate: "2024-01",
    endDate: "2024-03",
    description: "Built and maintained web applications using Laravel and React. Collaborated with senior developers on client projects and improved CI/CD pipelines.",
    sortOrder: 3,
  },
  {
    position: "Anggota Divisi Media & Informasi",
    organization: "Himpunan Mahasiswa Informatika",
    type: "organisasi",
    startDate: "2023-09",
    endDate: "2024-05",
    description: "Created digital content and managed social media channels for the Computer Science student association. Designed promotional materials for events.",
    sortOrder: 4,
  },
  {
    position: "Mentor Volunteer",
    organization: "Coding Camp for Kids",
    type: "volunteer",
    startDate: "2023-07",
    endDate: "2023-08",
    description: "Volunteered as a coding mentor teaching basic programming concepts to middle school students using Scratch and Python.",
    sortOrder: 5,
  },
];

const certificates = [
  { name: "Belajar Membuat Aplikasi Back-End untuk Pemula", issuer: "Dicoding Indonesia", issuedDate: "2024-08", imageUrl: "/images/certs/dicoding-backend.jpg", credentialUrl: "https://www.dicoding.com/certificates/xxx" },
  { name: "Google IT Support Professional Certificate", issuer: "Google via Coursera", issuedDate: "2024-06", imageUrl: "/images/certs/google-it.jpg", credentialUrl: "https://coursera.org/verify/xxx" },
  { name: "Belajar Fundamental Aplikasi Android", issuer: "Dicoding Indonesia", issuedDate: "2024-04", imageUrl: "/images/certs/dicoding-android.jpg", credentialUrl: "https://www.dicoding.com/certificates/xxx" },
  { name: "AWS Cloud Practitioner Essentials", issuer: "AWS via Dicoding", issuedDate: "2024-02", imageUrl: "/images/certs/aws-cloud.jpg", credentialUrl: "https://www.dicoding.com/certificates/xxx" },
  { name: "Meta Front-End Developer", issuer: "Meta via Coursera", issuedDate: "2023-12", imageUrl: "/images/certs/meta-frontend.jpg", credentialUrl: "https://coursera.org/verify/xxx" },
  { name: "Belajar Dasar Pemrograman Web", issuer: "Dicoding Indonesia", issuedDate: "2023-09", imageUrl: "/images/certs/dicoding-web.jpg", credentialUrl: "https://www.dicoding.com/certificates/xxx" },
];

export async function POST() {
  try {
    // Seed profile
    await setDoc(doc(db, "profiles", "main"), { ...profile, updatedAt: serverTimestamp() });

    // Seed projects
    for (const p of projects) {
      await addDoc(collection(db, "projects"), { ...p, createdAt: serverTimestamp() });
    }

    // Seed experiences
    for (const e of experiences) {
      await addDoc(collection(db, "experiences"), { ...e, createdAt: serverTimestamp() });
    }

    // Seed certificates
    for (const c of certificates) {
      await addDoc(collection(db, "certificates"), { ...c, createdAt: serverTimestamp() });
    }

    // Seed visitor count
    await setDoc(doc(db, "settings", "main"), { visitorCount: 1234 });

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
