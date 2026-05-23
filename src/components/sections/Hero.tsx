"use client";

import { getProfile, Profile } from "@/lib/data";
import { StaggerContainer, StaggerItem } from "@/components/ui/Animations";
import { useEffect, useState } from "react";

export function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (!profile) {
    return (
      <section id="hero" className="mb-16 md:mb-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-surface-elevated bento-card rounded-2xl p-8 md:p-12 min-h-[420px] animate-pulse" />
          <div className="md:col-span-4 bg-surface-elevated bento-card rounded-2xl p-8 min-h-[300px] md:min-h-[420px] animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="mb-16 md:mb-[120px]">
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-6" staggerDelay={0.12}>
        {/* Main Hero Cell */}
        <StaggerItem className="md:col-span-8 bg-surface-elevated bento-card rounded-2xl p-6 sm:p-8 md:p-12 flex flex-col justify-end min-h-[320px] sm:min-h-[380px] md:min-h-[420px] relative overflow-hidden noise-bg">
          {/* Ambient glow */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

          {/* Available badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-accent-subtle rounded-full px-4 py-2 border border-border z-10">
            <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
            <span className="font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.1em] uppercase text-primary">
              Available for work
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-20">
            <p className="font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.15em] uppercase text-accent mb-4">
              Hi, I&apos;m
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl md:text-7xl text-text-primary mb-4 leading-[1.1] tracking-tight">
              {profile.name}
              <span className="text-primary italic"> .</span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed">
              {profile.tagline}
            </p>
            {/* CTA */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-[family-name:var(--font-body)] text-sm font-semibold px-6 py-3 rounded-lg hover:brightness-110 active:scale-[0.97] transition-all duration-200"
              >
                Lihat Proyek
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-accent/40 text-accent font-[family-name:var(--font-body)] text-sm font-semibold px-6 py-3 rounded-lg hover:bg-accent-subtle transition-all duration-200"
              >
                Hubungi Saya
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </StaggerItem>

        {/* Secondary Cell */}
        <StaggerItem className="md:col-span-4 bg-surface-elevated bento-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[240px] md:min-h-[420px]">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-code)] text-xs text-text-muted">v2.0.26</span>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-text-primary mb-2">
              Systems &amp; Code
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary leading-relaxed">
              {profile.bioShort}
            </p>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 mt-6 text-primary hover:text-accent-hover font-[family-name:var(--font-body)] text-sm font-semibold group"
            >
              View Work
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="transform group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
