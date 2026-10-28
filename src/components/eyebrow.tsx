/**
 * Eyebrow label (blueprint §2.1, §2.2).
 *
 * The text stays navy/ink; the only blue is the short accent rule beneath it —
 * blue is never used for body or heading text.
 */
export function Eyebrow({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <p className="type-eyebrow text-ink-muted">{children}</p>
      <span aria-hidden="true" className="mt-2 block h-0.5 w-8 bg-blue-700" />
    </div>
  );
}
