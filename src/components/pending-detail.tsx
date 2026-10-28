import type { ReactNode } from "react";

/**
 * A clearly-marked gap for content the founder has not supplied yet.
 *
 * The blueprint lists every one of these (§9.1). Rendering a visible, honest gap
 * is intentional: the alternative is inventing a detail, which the site must
 * never do. When the real content arrives, it replaces this component.
 */
export function PendingDetail({
  children,
  onNavy = false,
}: {
  /** What is missing, e.g. "public email address". */
  children: ReactNode;
  onNavy?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 rounded-badge border border-dashed px-2 py-0.5 type-small ${
        onNavy ? "border-white/50 text-white" : "border-ink-muted/60 bg-white text-navy-900"
      }`}
    >
      <span className="type-eyebrow">To be supplied</span>
      <span>{children}</span>
    </span>
  );
}

/** A larger marked gap: a whole paragraph or list the founder must write. */
export function PendingBlock({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card border border-dashed border-ink-muted/50 bg-white p-5 ${className}`}>
      <p className="type-eyebrow text-ink-muted">Founder content — not yet supplied</p>
      <p className="type-h3 mt-2 text-navy-900">{title}</p>
      <div className="type-small mt-2 text-ink-muted">{children}</div>
    </div>
  );
}
