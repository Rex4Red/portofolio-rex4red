import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { ExperienceSection } from "@/components/sections/Experience";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 pt-24 md:pt-32">
        <Hero />
        <About />
        <Projects />
        <ExperienceSection />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
