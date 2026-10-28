import type { ReactNode } from "react";

/**
 * Twelve hand-built icons (blueprint §2.6): 24×24 grid, 1.5px stroke,
 * currentColor, decorative by default. No icon library for twelve glyphs, and no
 * robot, brain, sparkle or circuit imagery — it would contradict the positioning.
 */
function Svg({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

type IconProps = { className?: string };

export function IconArrowRight({ className = "h-4 w-4" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </Svg>
  );
}

export function IconArrowDown({ className = "h-4 w-4" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 4v15" />
      <path d="M6 13l6 6 6-6" />
    </Svg>
  );
}

export function IconMenu({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Svg>
  );
}

export function IconClose({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </Svg>
  );
}

export function IconCheck({ className = "h-4 w-4" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Svg>
  );
}

export function IconMail({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </Svg>
  );
}

export function IconInvoice({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 3.5h9l3.5 3.5v13.5H6z" />
      <path d="M15 3.5V7h3.5" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </Svg>
  );
}

export function IconSync({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 10a8 8 0 0 1 13-4.5L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 14a8 8 0 0 1-13 4.5L4 16" />
      <path d="M4 20v-4h4" />
    </Svg>
  );
}

export function IconList({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M9 6.5h11" />
      <path d="M9 12h11" />
      <path d="M9 17.5h11" />
      <path d="M4.5 6.5h.01" />
      <path d="M4.5 12h.01" />
      <path d="M4.5 17.5h.01" />
    </Svg>
  );
}

export function IconChart({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 20h16" />
      <path d="M7 20V12" />
      <path d="M12 20V6" />
      <path d="M17 20v-5" />
    </Svg>
  );
}

export function IconBox({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 8L12 3.5 20.5 8v8L12 20.5 3.5 16z" />
      <path d="M3.5 8l8.5 4.5L20.5 8" />
      <path d="M12 12.5v8" />
    </Svg>
  );
}

export function IconHelp({ className = "h-6 w-6" }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8" />
      <path d="M12 17h.01" />
    </Svg>
  );
}
