"use client";

import { getProfile, getStats, Profile } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeInUp, CountUp } from "@/components/ui/Animations";
import { useEffect, useState } from "react";

export function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ projectsCompleted: 0, certifications: 0, organizationsJoined: 0 });

  useEffect(() => {
    getProfile().then(setProfile);
    getStats().then(setStats);
  }, []);

  if (!profile) {
    return (
      <section id="about" className="mb-16 md:mb-[120px]">
        <SectionHeader label="About Me" title="Who I Am" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            <div className="h-4 bg-surface-2 rounded w-full animate-pulse" />
            <div className="h-4 bg-surface-2 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-surface-2 rounded w-4/6 animate-pulse" />
          </div>
          <div className="md:col-span-5">
            <div className="w-full aspect-square max-w-[280px] mx-auto rounded-2xl bg-surface-2 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="mb-16 md:mb-[120px]">
      <FadeInUp>
        <SectionHeader label="About Me" title="Who I Am" />
      </FadeInUp>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left — Bio */}
        <FadeInUp delay={0.1} className="md:col-span-7">
          <p className="font-[family-name:var(--font-body)] text-base md:text-lg text-text-secondary leading-relaxed mb-8">
            {profile.bioLong}
          </p>

          {/* Tech Stack */}
          <div>
            <h4 className="font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.15em] uppercase text-text-muted mb-4">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="tech">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Right — Stats */}
        <FadeInUp delay={0.2} className="md:col-span-5">
          {/* Profile photo */}
          <div className="w-full aspect-square max-w-[280px] mx-auto mb-8 rounded-2xl bg-surface-elevated border border-border overflow-hidden flex items-center justify-center">
            {profile.photoUrl && profile.photoUrl.startsWith("http") ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent-subtle flex items-center justify-center">
                  <span className="font-[family-name:var(--font-display)] text-4xl text-accent">
                    {profile.name.charAt(0)}
                  </span>
                </div>
                <p className="text-text-muted text-xs">Profile Photo</p>
              </div>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-elevated bento-card rounded-xl p-4 text-center">
              <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-accent mb-1">
                <CountUp end={stats.projectsCompleted} suffix="+" />
              </div>
              <p className="font-[family-name:var(--font-body)] text-xs text-text-muted">Projects</p>
            </div>
            <div className="bg-surface-elevated bento-card rounded-xl p-4 text-center">
              <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-accent mb-1">
                <CountUp end={stats.certifications} />
              </div>
              <p className="font-[family-name:var(--font-body)] text-xs text-text-muted">Certs</p>
            </div>
            <div className="bg-surface-elevated bento-card rounded-xl p-4 text-center">
              <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-accent mb-1">
                <CountUp end={stats.organizationsJoined} />
              </div>
              <p className="font-[family-name:var(--font-body)] text-xs text-text-muted">Orgs</p>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
