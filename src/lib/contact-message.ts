/**
 * Composing an enquiry into an email.
 *
 * Pure functions with no side effects: the Contact page validates the form in the
 * browser and then hands the composed text to the visitor's own email
 * application. Nothing here sends, stores or transmits anything, and there is no
 * server endpoint to call.
 */

export type EnquiryValues = {
  name: string;
  business: string;
  email: string;
  software: string[];
  softwareOther: string;
  challenges: string;
  outcomes: string;
};

export type ComposedMessage = { subject: string; body: string };

/** Build the subject and body from the six fields the visitor filled in. */
export function composeEnquiryMessage(values: EnquiryValues): ComposedMessage {
  const software = [...values.software, values.softwareOther.trim()]
    .filter((item) => item.length > 0)
    .join(", ");

  const lines = [
    `Name: ${values.name.trim()}`,
    `Business: ${values.business.trim()}`,
    `Email: ${values.email.trim()}`,
    `Current software: ${software || "Not stated"}`,
    "",
    "Operational challenges:",
    values.challenges.trim(),
  ];

  if (values.outcomes.trim().length > 0) {
    lines.push("", "Desired outcomes:", values.outcomes.trim());
  }

  return {
    subject: `Website enquiry — ${values.business.trim()}`,
    body: lines.join("\n"),
  };
}

/** A `mailto:` address for the visitor's own email application. */
export function buildMailto(address: string, message: ComposedMessage): string {
  const query = `subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
  return `mailto:${address}?${query}`;
}

/**
 * Some browsers and mail clients silently drop a `mailto:` address that is too
 * long. Past this length we show the text to copy instead, and say why.
 */
export const MAILTO_LENGTH_LIMIT = 1800;
