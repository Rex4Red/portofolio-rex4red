"use client";

import { getCertificates, Certificate } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/Animations";
import { useEffect, useState } from "react";

/** Convert a Cloudinary PDF URL to a JPG preview of page 1 */
function certPreview(url: string) {
  if (url.toLowerCase().endsWith(".pdf")) {
    return url.replace(/\.pdf$/i, ".jpg");
  }
  return url;
}

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCert, setViewCert] = useState<string | null>(null);

  useEffect(() => {
    getCertificates().then((c) => {
      setCertificates(c);
      setLoading(false);
    });
  }, []);

  return (
    <section id="certificates" className="mb-16 md:mb-[120px]">
      <FadeInUp><SectionHeader label="Certificates" title="Credentials" /></FadeInUp>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-elevated bento-card rounded-2xl overflow-hidden animate-pulse">
              <div className="h-40 bg-surface-2" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-surface-2 rounded w-2/3" />
                <div className="h-3 bg-surface-2 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {certificates.map((cert) => (
            <StaggerItem key={cert.id}>
              <div className="bg-surface-elevated bento-card rounded-2xl overflow-hidden group hover:translate-y-[-4px] hover:shadow-xl hover:shadow-black/30 transition-all duration-300 h-full flex flex-col">
                {/* Certificate Image Thumbnail */}
                <div
                  className="h-40 bg-white relative overflow-hidden cursor-pointer"
                  onClick={() => cert.imageUrl && setViewCert(certPreview(cert.imageUrl))}
                >
                  {cert.imageUrl ? (
                    <img
                      src={certPreview(cert.imageUrl)}
                      alt={cert.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-2">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1" className="opacity-30">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary mb-2 leading-snug">{cert.name}</h3>
                  <p className="font-[family-name:var(--font-body)] text-sm text-primary font-medium mb-1">{cert.issuer}</p>
                  <p className="font-[family-name:var(--font-code)] text-xs text-text-muted mb-4">{cert.issuedDate}</p>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                      className="cert-link-mobile mt-auto inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors font-[family-name:var(--font-body)] font-medium md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300">
                      Lihat Sertifikat
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Fullscreen Modal */}
      {viewCert && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setViewCert(null)}
        >
          <button
            onClick={() => setViewCert(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <img
            src={viewCert}
            alt="Certificate"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
