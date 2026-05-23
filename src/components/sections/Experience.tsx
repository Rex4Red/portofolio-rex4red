"use client";

import { getExperiences, Experience } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeInUp, SlideInLeft } from "@/components/ui/Animations";
import { useEffect, useState } from "react";

function fmtDate(d: string) {
  const [y, m] = d.split("-");
  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${mo[+m - 1]} ${y}`;
}

const typeClr: Record<string, string> = {
  organisasi: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  kepanitiaan: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  magang: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  volunteer: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

/** Convert a Cloudinary PDF URL to a JPG preview of page 1 */
function certPreview(url: string) {
  if (url.toLowerCase().endsWith(".pdf")) {
    return url.replace(/\.pdf$/i, ".jpg");
  }
  return url;
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCert, setViewCert] = useState<string | null>(null);

  useEffect(() => {
    getExperiences().then((e) => {
      // Sort newest first by startDate (YYYY-MM)
      e.sort((a, b) => b.startDate.localeCompare(a.startDate));
      setExperiences(e);
      setLoading(false);
    });
  }, []);

  return (
    <section id="experience" className="mb-16 md:mb-[120px]">
      <FadeInUp><SectionHeader label="Experience" title="My Journey" /></FadeInUp>

      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 md:gap-10 animate-pulse">
              <div className="hidden md:block w-[120px]" />
              <div className="w-3 h-3 rounded-full bg-surface-2 mt-1.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-surface-2 rounded w-2/3" />
                <div className="h-4 bg-surface-2 rounded w-1/3" />
                <div className="h-3 bg-surface-2 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[5px] md:left-[calc(120px+5px)] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <SlideInLeft key={exp.id} delay={i * 0.1}>
                <div className="timeline-item flex gap-6 md:gap-10 group">
                  <div className="hidden md:block w-[120px] shrink-0 text-right">
                    <span className="font-[family-name:var(--font-code)] text-sm text-text-muted">{exp.startDate.split("-")[0]}</span>
                  </div>
                  <div className="relative shrink-0 mt-1.5"><div className="timeline-dot" /></div>
                  <div className="flex-1 pb-2">
                    <span className="md:hidden font-[family-name:var(--font-code)] text-xs text-text-muted mb-1 block">{exp.startDate.split("-")[0]}</span>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-[family-name:var(--font-display)] text-lg md:text-xl text-text-primary">{exp.position}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${typeClr[exp.type] || ""}`}>{exp.type}</span>
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-sm font-semibold text-primary mb-1">{exp.organization}</p>
                    <p className="font-[family-name:var(--font-code)] text-xs text-text-muted mb-3">{fmtDate(exp.startDate)} — {exp.endDate ? fmtDate(exp.endDate) : "Sekarang"}</p>
                    <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary leading-relaxed">{exp.description}</p>

                    {/* Certificate Display */}
                    {exp.certificateUrl && (
                      <div className="mt-4">
                        <div
                          className="group/cert cursor-pointer flex items-center gap-4 bg-surface-elevated border border-border rounded-xl p-3 hover:border-accent/40 transition-all duration-300 max-w-sm"
                          onClick={() => setViewCert(certPreview(exp.certificateUrl!))}
                        >
                          <div className="w-24 h-[68px] rounded-lg overflow-hidden shrink-0 border border-border/50 bg-white">
                            <img
                              src={certPreview(exp.certificateUrl)}
                              alt={`Certificate - ${exp.position}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary group-hover/cert:text-accent transition-colors truncate">Certificate of {exp.position}</p>
                            <p className="text-xs text-text-muted mt-0.5">{exp.organization}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SlideInLeft>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Full-Screen Modal */}
      {viewCert && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
          onClick={() => setViewCert(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setViewCert(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Close
            </button>

            {/* Certificate Image */}
            <img
              src={viewCert}
              alt="Certificate"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Open in new tab */}
            <a
              href={viewCert}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
              Open Full Size
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
