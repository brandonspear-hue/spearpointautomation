import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Internal routes that exist today. Keeps link targets honest and typo-proof. */
export type StaticPath =
  | "/"
  | "/services"
  | "/how-it-works"
  | "/about"
  | "/contact";

type Variant = "primary" | "secondary" | "quiet" | "onNavy";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-card px-5 py-3 type-body font-medium transition duration-[120ms] ease-out";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border border-line bg-white text-navy-900 hover:bg-ivory-100",
  quiet: "px-0 text-blue-700 underline decoration-blue-700/40 underline-offset-4 hover:decoration-blue-700",
  onNavy: "bg-white text-navy-900 hover:bg-ivory-100",
};

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  /** Internal route — renders a client-side link. */
  to?: StaticPath;
  /** External address — renders a plain anchor. */
  href?: string;
  /**
   * The destination is not built yet. Renders a non-interactive label carrying a
   * visible "Coming soon" tag, never a link that would 404.
   */
  soon?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

/**
 * The site's only button (blueprint §2.9). One filled blue button per view;
 * everything else is secondary (white + hairline) or quiet (a link).
 */
export function Button({
  children,
  variant = "primary",
  to,
  href,
  soon = false,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${className}`;

  if (soon) {
    // Shown, but not a control: there is nothing to click and nothing to break.
    return (
      <span className={`inline-flex flex-col items-stretch gap-1 ${className}`}>
        <span
          className={`${BASE} cursor-not-allowed border border-dashed border-ink-muted/60 bg-transparent whitespace-nowrap text-ink-muted`}
        >
          {children}
        </span>
        <span className="type-small text-ink-muted">Coming soon — not available yet.</span>
      </span>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
