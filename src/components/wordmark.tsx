import { Link } from "@tanstack/react-router";

/**
 * The wordmark. Text only — there is no invented logo, and no image that would
 * imply a team, an office or a client.
 */
export function Wordmark({ onNavy = false }: { onNavy?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-baseline gap-2" aria-label="Spearpoint Automation — home">
      <span className={`type-h3 font-semibold ${onNavy ? "text-white" : "text-navy-900"}`}>
        Spearpoint
      </span>
      <span className={`type-h3 font-normal ${onNavy ? "text-white/70" : "text-ink-muted"}`}>
        Automation
      </span>
    </Link>
  );
}
