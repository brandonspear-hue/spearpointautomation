import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { StaticPath } from "~/components/button";

/**
 * A flat card: hairline border, no shadow (blueprint §2.4). Shadow appears only
 * when the whole card is a link and the pointer is over it.
 */
export function Card({
  children,
  className = "",
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "ivory-100";
}) {
  return (
    <div
      className={`rounded-card border border-line ${tone === "white" ? "bg-white" : "bg-ivory-100"} p-6 ${className}`}
    >
      {children}
    </div>
  );
}

/** A card that is entirely a link, so the whole surface is clickable and lifts 2px. */
export function LinkCard({
  to,
  children,
  className = "",
}: {
  to: StaticPath;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`hover-lift block rounded-card border border-line bg-white p-6 hover:border-navy-900/20 ${className}`}
    >
      {children}
    </Link>
  );
}
