import { TechIcon } from "./TechIcon";

export function Badge({
  children,
  variant = "tech",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "tech" | "category";
  className?: string;
}) {
  const base =
    variant === "tech"
      ? "bg-surface-2 text-text-secondary border border-border font-[family-name:var(--font-code)] text-xs px-3 py-1.5 rounded-md hover:border-accent/40 hover:text-accent transition-colors duration-200"
      : "bg-accent-subtle text-accent border border-accent/20 text-xs font-semibold px-3 py-1.5 rounded-full";

  const skillName = typeof children === "string" ? children : null;

  return (
    <span className={`inline-flex items-center gap-1.5 ${base} ${className}`}>
      {variant === "tech" && skillName && (
        <TechIcon name={skillName} size={14} />
      )}
      {children}
    </span>
  );
}
