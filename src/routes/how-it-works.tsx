import { Link, createFileRoute } from "@tanstack/react-router";
import { Callout } from "~/components/callout";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";

const TITLE = "How It Works — Spearpoint Automation";
const DESCRIPTION =
  "Five steps in order: a 30-minute conversation, paid discovery with a written process map, a proposal you approve in writing, building in reviewable stages, and handover with optional support.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: HowItWorksPage,
});

type Step = {
  title: string;
  body: string;
  /** Every step boundary offers the same way to ask about it (§1.2). */
  linkLabel: string;
};

const STEPS: Step[] = [
  {
    title: "A conversation (30 minutes)",
    body: "What you tell us, what we ask, a straight answer about whether this is worth doing. No preparation, no obligation.",
    linkLabel: "Book a consultation",
  },
  {
    title: "Discovery (paid, fixed scope)",
    body: "Shadow the process, read the reports, list data sources, write it down. You get a process map, a prioritised shortlist, and what we would not automate. Duration is scoped in the proposal — quoted, not guessed on a website.",
    linkLabel: "Ask what discovery would cover",
  },
  {
    title: "Proposal",
    body: "Included, excluded, dependencies (credentials, decisions, third-party app review), and what happens if one is late. Fixed fee per deliverable; changes quoted separately. You approve it in writing before any code is written.",
    linkLabel: "Ask what a proposal includes",
  },
  {
    title: "Build in reviewable stages",
    body: "Something you can open and test each cycle; a named acceptance point; no silent scope growth. You see work every week, not a reveal at the end.",
    linkLabel: "Ask how a stage is accepted",
  },
  {
    title: "Handover and support",
    body: "Repositories, documentation, runbook, training, credentials in your own accounts. Support separate, optional, with a defined boundary.",
    linkLabel: "Ask what support covers",
  },
];

function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="Five steps, in this order, with the price agreed before any building starts."
      />

      {/*
        On a phone the boundaries come first (blueprint §3.4): someone deciding
        whether to get in touch should see the limits before the process. On a
        desktop the steps read top to bottom and the boundaries follow.
      */}
      <div className="flex flex-col">
        <Section className="order-2 bg-ivory-100 lg:order-1">
          <h2 className="type-h2 measure">The five steps.</h2>
          <ol className="mt-12 flex flex-col">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-5 sm:gap-6">
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white type-small font-medium"
                  >
                    {index + 1}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <span aria-hidden="true" className="w-px flex-1 bg-line" />
                  ) : null}
                </div>
                <div className={`${index < STEPS.length - 1 ? "pb-10" : ""} max-w-2xl`}>
                  <h3 className="type-h3">{step.title}</h3>
                  <p className="type-body mt-3 text-ink-muted">{step.body}</p>
                  <Link to="/contact" className="text-link type-small mt-3 inline-block">
                    {step.linkLabel}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section className="order-1 lg:order-2">
          <h2 className="type-h2 measure">What we won&apos;t promise.</h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2">
            <li>
              <h3 className="type-h3">Third-party systems</h3>
              <p className="type-body mt-3 text-ink-muted">
                Vendor interfaces can be blocked or changed without notice. We check before
                quoting and tell you exactly what we find, including when the answer is that a
                connection is not available to a business your size.
              </p>
            </li>
            <li>
              <h3 className="type-h3">Anything that leaves the business</h3>
              <p className="type-body mt-3 text-ink-muted">
                AI output is drafted and reviewed by a person. We don&apos;t build systems that
                send, pay or publish without approval, and we don&apos;t automate a decision that
                nobody can check afterwards.
              </p>
            </li>
          </ul>

          <Callout label="The uncomfortable one" className="mt-10">
            If a product you already own does the job, we&apos;ll say so and lose the sale.
          </Callout>

          <p className="mt-8">
            <Link to="/contact" className="text-link type-body">
              Ask us about any of this
            </Link>
          </p>
        </Section>
      </div>
    </>
  );
}
