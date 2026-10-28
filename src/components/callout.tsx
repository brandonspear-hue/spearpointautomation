import type { ReactNode } from "react";

/**
 * Tinted callout (blue-100 with navy text — the only large blue fill allowed,
 * blueprint §2.1). Used for an honest disqualifier or a plain-language
 * explanation, never for a sales message.
 */
export function Callout({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card border border-line bg-blue-100 p-5 text-navy-900 ${className}`}>
      {label ? <p className="type-eyebrow mb-2 text-navy-900">{label}</p> : null}
      <div className="type-body">{children}</div>
    </div>
  );
}
