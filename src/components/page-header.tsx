import { Eyebrow } from "~/components/eyebrow";
import { Section } from "~/components/section";

/**
 * The top of every inner page (blueprint §3.7): one H1, an optional eyebrow and
 * a lead paragraph. Keeping it in one component is what stops the five pages
 * drifting apart.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <Section className="pb-12 lg:pb-16">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="type-h1 mt-6 max-w-4xl">{title}</h1>
      {lead ? <p className="type-lead measure mt-6 text-ink-muted">{lead}</p> : null}
    </Section>
  );
}
