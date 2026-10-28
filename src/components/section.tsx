import type { ReactNode } from "react";
import { Container } from "~/components/container";

type Tone = "ivory" | "ivory-100" | "navy";

const TONE_CLASSES: Record<Tone, string> = {
  ivory: "bg-ivory-50 text-navy-900",
  "ivory-100": "bg-ivory-100 text-navy-900",
  navy: "bg-navy-900 text-white on-navy",
};

/**
 * A full-width page band with the standard 64px mobile / 96px desktop padding
 * (blueprint §2.3). Every page section is one of these, so vertical rhythm is
 * consistent and never hand-tuned per page.
 */
export function Section({
  children,
  tone = "ivory",
  id,
  className = "",
  contentClassName = "",
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  /** Applies to the outer <section> — used for ordering on mobile. */
  className?: string;
  /** Applies to the inner container. */
  contentClassName?: string;
}) {
  return (
    <section id={id} className={`${TONE_CLASSES[tone]} py-16 lg:py-24 ${className}`}>
      <Container className={contentClassName}>{children}</Container>
    </section>
  );
}
