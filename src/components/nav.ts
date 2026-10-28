/**
 * Navigation, defined once (blueprint §1.2).
 *
 * Only pages that exist are listed. The Automation Assessment is deliberately
 * absent until it is built — and, once it is, it stays out of the header, where
 * it reads as a giveaway rather than a service.
 *
 * The second item points at /examples. Its label describes the page's job — the
 * kinds of work the business builds for, with one worked example — rather than
 * naming a product list.
 */
export type NavItem = {
  label: string;
  to: "/services" | "/examples" | "/how-it-works" | "/about" | "/contact";
};

export const NAV: NavItem[] = [
  { label: "Services", to: "/services" },
  { label: "What we build", to: "/examples" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** The one filled button in the header and in the closing bands. */
export const PRIMARY_CTA = { label: "Book a consultation", to: "/contact" } as const;
