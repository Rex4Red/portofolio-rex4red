// ─── Data Layer — Firebase Firestore ───

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// ─── Types ───
export interface Profile {
  name: string;
  tagline: string;
  bioShort: string;
  bioLong: string;
  photoUrl: string;
  skills: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    email: string;
    whatsapp: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  techStack: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
}

export interface Experience {
  id: string;
  position: string;
  organization: string;
  type: "organisasi" | "kepanitiaan" | "magang" | "volunteer";
  startDate: string;
  endDate: string | null;
  description: string;
  certificateUrl?: string;
  sortOrder: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  imageUrl: string;
  credentialUrl: string;
}

// ─── Profile ───
export async function getProfile(): Promise<Profile> {
  const snap = await getDoc(doc(db, "profiles", "main"));
  if (snap.exists()) return snap.data() as Profile;
  return defaultProfile;
}

export async function updateProfile(data: Partial<Profile>): Promise<void> {
  await setDoc(doc(db, "profiles", "main"), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Projects ───
export async function getProjects(): Promise<Project[]> {
  const snap = await getDocs(query(collection(db, "projects"), orderBy("sortOrder")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function addProject(project: Omit<Project, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "projects"), {
    ...project,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// ─── Experiences ───
export async function getExperiences(): Promise<Experience[]> {
  const snap = await getDocs(query(collection(db, "experiences"), orderBy("sortOrder")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience));
}

export async function addExperience(exp: Omit<Experience, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "experiences"), {
    ...exp,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateExperience(id: string, data: Partial<Experience>): Promise<void> {
  await updateDoc(doc(db, "experiences", id), data);
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, "experiences", id));
}

// ─── Certificates ───
export async function getCertificates(): Promise<Certificate[]> {
  const snap = await getDocs(query(collection(db, "certificates"), orderBy("issuedDate")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Certificate));
}

export async function addCertificate(cert: Omit<Certificate, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "certificates"), {
    ...cert,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCertificate(id: string, data: Partial<Certificate>): Promise<void> {
  await updateDoc(doc(db, "certificates", id), data);
}

export async function deleteCertificate(id: string): Promise<void> {
  await deleteDoc(doc(db, "certificates", id));
}

// ─── Stats ───
export async function getStats() {
  const [projects, experiences, certificates] = await Promise.all([
    getProjects(),
    getExperiences(),
    getCertificates(),
  ]);
  return {
    projectsCompleted: projects.length,
    certifications: certificates.length,
    organizationsJoined: new Set(experiences.map((e) => e.organization)).size,
  };
}

// ─── Visitor Count ───
export async function getVisitorCount(): Promise<number> {
  const snap = await getDoc(doc(db, "settings", "main"));
  if (snap.exists()) return snap.data().visitorCount || 0;
  return 0;
}

export async function incrementVisitorCount(): Promise<void> {
  await setDoc(
    doc(db, "settings", "main"),
    { visitorCount: increment(1) },
    { merge: true }
  );
}

// ─── Default Profile (fallback) ───
const defaultProfile: Profile = {
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
