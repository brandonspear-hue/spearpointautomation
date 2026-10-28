import type { ReactNode } from "react";

/**
 * Page-width wrapper. 1200px with 20/32/48px gutters (blueprint §2.3).
 * `wide` is only for the demonstration workspace, never for prose.
 */
export function Container({
  children,
  wide = false,
  className = "",
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full ${wide ? "max-w-wide" : "max-w-page"} px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
