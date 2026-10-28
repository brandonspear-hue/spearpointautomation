/**
 * Navigation, defined once (blueprint §1.2).
 *
 * Only pages that exist are listed. The Automation Assessment is deliberately
 * absent until it is built — and, once it is, it stays out of the header, where
 * it reads as a giveaway rather than a service.
 */
export type NavItem = {
  label: string;
  to: "/services" | "/showcase" | "/how-it-works" | "/about" | "/contact";
};

export const NAV: NavItem[] = [
  { label: "Services", to: "/services" },
  { label: "Solutions", to: "/showcase" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** The one filled button in the header and in the closing bands. */
export const PRIMARY_CTA = { label: "Book a consultation", to: "/contact" } as const;
