import { Button } from "~/components/button";
import { Section } from "~/components/section";

/**
 * The closing navy band (blueprint §3.1 item 8, reused on Services and About).
 * One full-bleed navy band per page — this is it.
 */
export function CtaBand({
  title = "Tell us what's slowing you down.",
  lead = "A 30-minute conversation, no obligation and no pitch deck.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <Section tone="navy">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="type-h2 measure">{title}</h2>
          <p className="type-lead measure mt-4 text-white/80">{lead}</p>
        </div>
        {/* shrink-0: without it the flex row squeezes the button and the label
            wraps onto two lines on a wide screen. */}
        <Button to="/contact" variant="onNavy" className="w-full shrink-0 sm:w-auto">
          Book a consultation
        </Button>
      </div>
    </Section>
  );
}
