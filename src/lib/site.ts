/**
 * Site-wide constants that are written in exactly one place.
 *
 * Fields set to `null` are content the founder has not supplied yet (blueprint
 * §9). Components render a clearly-marked gap for them instead of inventing an
 * answer. Fill a value in here and the gap disappears everywhere it appears.
 */
export const site = {
  name: "Spearpoint Automation",
  tagline: "We build it. You own it. We support it when you need us.",

  /**
   * The public enquiry address (blueprint §9.1 #2).
   * While this is null, the Contact page does NOT open an email application: it
   * composes the message for the visitor to copy, and says so on the page.
   * Set it to e.g. "hello@example.com" to switch the pre-composed email handoff
   * on — nothing else needs to change.
   */
  contactEmail: "brandon@spearpointautomation.com" as string | null,

  /** The service region, e.g. "Serving the United Kingdom" (blueprint §9.1 #2). */
  serviceRegion: null as string | null,

  /**
   * The registered legal name (blueprint §9.1 #2).
   * Do not print "LLC" (or any other entity suffix) before it exists.
   */
  legalName: null as string | null,

  /** Copyright year printed in the footer. */
  year: 2026,
} as const;

/** True when the founder has supplied the public email address. */
export const hasContactEmail = site.contactEmail !== null;
