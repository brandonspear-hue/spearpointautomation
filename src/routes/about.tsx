import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "~/components/cta-band";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";

const TITLE = "About — Spearpoint Automation";
const DESCRIPTION =
  "Brandon Spear runs Spearpoint Automation from a background in accounting, financial systems and business process improvement — building AI-powered tools for businesses that do not have a development team.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AboutPage,
});

/**
 * About (blueprint §3.5).
 *
 * The words are the founder's own, supplied in writing. They describe his
 * background, what he has done and how he works; they make no claim about a
 * client, a result, a certification or a team, and the page adds none.
 */
const WHY = [
  "My background is in accounting, financial systems and business process improvement. I have spent years implementing software, improving workflows, and building automations that take repetitive work off someone's desk.",
  "Through that work I saw how much time businesses lose to manual processes, disconnected systems, and tasks that technology could handle better. That is why I started Spearpoint Automation.",
  "Small businesses should have access to the same technology and automation capabilities as larger companies, without needing their own development team.",
];

const WHAT_I_DO =
  "I work directly with business owners: understand how the operation actually runs, find where the time goes, then build the custom tool that removes the step. Automating financial reports, managing customer communications, connecting software that does not talk to itself — the problem decides the shape of the build, not the other way round.";

const APPROACH =
  "Understand the problem, build the right solution, and make sure the business can actually use it.";

const HOW_I_WORK = [
  "Process first, tool second.",
  "A person approves anything consequential.",
  "The client's own accounts, always.",
  "Documentation written for someone who has never met me.",
];

const WHAT_I_DONT_DO = [
  "Bookkeeping or attest work.",
  "Legal or tax advice.",
  "Hosting lock-in.",
  "AI without a human review step.",
  "Work I can't hand over.",
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Small businesses should have the same technology as the big ones."
        lead="I'm Brandon Spear, founder of Spearpoint Automation. I build AI-powered tools and automations for businesses that do not have a development team — then hand them over."
      />

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-12 lg:col-span-7">
            <section>
              <h2 className="type-h2">Why this exists</h2>
              <div className="measure mt-6 flex flex-col gap-4">
                {WHY.map((paragraph) => (
                  <p key={paragraph} className="type-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="type-h2">What I actually do</h2>
              <p className="type-body measure mt-6">{WHAT_I_DO}</p>
              <blockquote className="measure mt-8 border-l-2 border-blue-700 pl-5">
                <p className="type-h3">{APPROACH}</p>
              </blockquote>
              <p className="type-body measure mt-8 text-ink-muted">
                No unnecessary complexity. No one-size-fits-all software. Just technology built
                around the way your business operates.
              </p>
            </section>

            <section>
              <h2 className="type-h2">How I work</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {HOW_I_WORK.map((principle) => (
                  <li key={principle} className="type-body flex gap-3">
                    <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-blue-700" />
                    {principle}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="type-h2">What I don&apos;t do</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {WHAT_I_DONT_DO.map((limit) => (
                  <li key={limit} className="type-body flex gap-3">
                    <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-line" />
                    {limit}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="type-h2">How you can check any of this</h2>
              <p className="type-body measure mt-4">
                Nothing here asks you to take the work on trust. The assessment linked from the
                front page runs in your own browser and shows the reasoning behind every line it
                returns, so you can disagree with it before you ever speak to anyone. In a
                project, it is the same idea: something you can open, test and argue with at each
                stage, rather than a description of what will be built.
              </p>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-line bg-ivory-100 p-6 lg:sticky lg:top-28">
              <h2 className="type-h3">The short version</h2>
              <p className="type-small mt-3 text-ink-muted">
                One person, from an accounting and systems background rather than a software sales
                team. You deal with me from the first conversation to the handover.
              </p>
              <p className="type-body mt-6">{APPROACH}</p>
              <p className="type-small mt-6 font-medium">
                We build it. You own it. We support it when you need us.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
