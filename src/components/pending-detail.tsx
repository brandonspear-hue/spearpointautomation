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
  block = false,
}: {
  /** What is missing, e.g. "public email address". */
  children: ReactNode;
  onNavy?: boolean;
  /** Put the label above the text, for a long gap inside a sentence. */
  block?: boolean;
}) {
  const colours = onNavy
    ? "border-white/50 text-white"
    : "border-ink-muted/60 bg-white text-navy-900";

  if (block) {
    return (
      <span
        className={`mt-1 flex w-fit max-w-full flex-col gap-1 rounded-badge border border-dashed px-3 py-2 type-small ${colours}`}
      >
        <span className="font-medium">To be supplied</span>
        <span>{children}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex max-w-full flex-wrap items-baseline gap-x-2 rounded-badge border border-dashed px-2 py-0.5 type-small ${colours}`}
    >
      <span className="font-medium">To be supplied:</span>
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
