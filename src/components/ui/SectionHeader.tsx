export function SectionHeader({
  label,
  title,
  className = "",
}: {
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <span className="font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.15em] uppercase text-accent mb-3 block">
        {label}
      </span>
      <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl text-text-primary leading-tight">
        {title}
      </h2>
      <div className="mt-4 h-px w-16 bg-border" />
    </div>
  );
}
