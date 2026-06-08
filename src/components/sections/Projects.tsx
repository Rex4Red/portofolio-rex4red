"use client";

import { useState, useEffect } from "react";
import { getProjects, Project } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/Animations";

const categories = ["All", "Web", "Mobile", "AI", "Other"] as const;

export function Projects() {
  const [active, setActive] = useState<string>("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((p) => {
      setProjects(p);
      setLoading(false);
    });
  }, []);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);
  const featured = filtered.find((p) => p.isFeatured);
  const rest = filtered.filter((p) => !p.isFeatured);

  return (
    <section id="projects" className="mb-16 md:mb-[120px]">
      <FadeInUp>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <SectionHeader label="Projects" title="Selected Work" className="!mb-0" />
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-[family-name:var(--font-body)] text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-300 ${
                  active === cat
                    ? "bg-accent text-on-primary border-accent"
                    : "bg-transparent text-text-secondary border-border hover:border-border-hover hover:text-text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </FadeInUp>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-elevated bento-card rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-surface-2" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-surface-2 rounded w-2/3" />
                <div className="h-3 bg-surface-2 rounded w-full" />
                <div className="h-3 bg-surface-2 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Featured project */}
          {featured && (
            <FadeInUp delay={0.1}>
              <div className="bg-surface-elevated bento-card rounded-2xl overflow-hidden mb-6 group hover:border-accent/40 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Thumbnail */}
                  <div className="h-64 md:h-auto bg-surface-2 relative overflow-hidden">
                    {featured.thumbnailUrl ? (
                      <img src={featured.thumbnailUrl} alt={featured.title} className="absolute inset-0 w-full h-full object-contain bg-surface-2 p-2" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent">
                        <span className="font-[family-name:var(--font-display)] text-6xl text-accent/20">
                          {featured.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      {featured.githubUrl && (
                        <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        </a>
                      )}
                      {featured.demoUrl && (
                        <a href={featured.demoUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <Badge variant="category" className="mb-4 w-fit">{featured.category}</Badge>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-text-primary mb-3">
                      {featured.title}
                    </h3>
                    <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary leading-relaxed mb-6">
                      {featured.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featured.techStack.map((t) => (
                        <Badge key={t} variant="tech">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>
          )}

          {/* Project Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            {rest.map((project) => (
              <StaggerItem key={project.id}>
                <div className="bg-surface-elevated bento-card rounded-2xl overflow-hidden group hover:border-accent/40 hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="h-48 bg-surface-2 relative overflow-hidden">
                    {project.thumbnailUrl ? (
                      <img src={project.thumbnailUrl} alt={project.title} className="absolute inset-0 w-full h-full object-contain bg-surface-2 p-2" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent">
                        <span className="font-[family-name:var(--font-display)] text-5xl text-accent/15">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        </a>
                      )}
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="category">{project.category}</Badge>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-text-primary mb-2">
                      {project.title}
                    </h3>
                    <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.techStack.slice(0, 3).map((t) => (
                        <Badge key={t} variant="tech">{t}</Badge>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-text-muted text-xs self-center ml-1">+{project.techStack.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </>
      )}
    </section>
  );
}
