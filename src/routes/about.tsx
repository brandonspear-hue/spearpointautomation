import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "~/components/cta-band";
import { PageHeader } from "~/components/page-header";
import { PendingBlock, PendingDetail } from "~/components/pending-detail";
import { Section } from "~/components/section";

const TITLE = "About — Spearpoint Automation";
const DESCRIPTION =
  "Spearpoint Automation is run by someone from accounting operations, ERP implementations and process improvement — an accountant's view of automation, not a software company's.";

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
 * Everything here is either written in the blueprint or verifiably true from the
 * founder's brief. Where a detail would be a personal fact — name, length of
 * experience, employers, sectors, modules, specific processes — it is shown as a
 * marked gap instead of invented. Nothing on this page claims a client, a result,
 * a certification or a team.
 */
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
        title="An accountant's view of automation, not a software company's."
        lead="Spearpoint Automation is run by one person, from accounting operations, ERP implementations and process improvement — not from a software sales team."
      />

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-12 lg:col-span-7">
            <section>
              <h2 className="type-h2">Why this exists</h2>
              <div className="measure mt-6 flex flex-col gap-4">
                <PendingBlock title="Two short paragraphs, in the founder's own words">
                  What he kept seeing in month-end closes and ERP implementations, and why he
                  started Spearpoint. The blueprint is explicit that these must be true and
                  personal — they will not be written for him.
                </PendingBlock>
              </div>
            </section>

            <section>
              <h2 className="type-h2">What I&apos;ve actually done</h2>
              <p className="type-body measure mt-4 text-ink-muted">
                Scope, not company names. The four lines below describe the work; the parts in
                dashed boxes are the details only the founder can supply.
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                <li className="type-body flex flex-col gap-2">
                  <span>
                    Ran accounting operations for{" "}
                    <PendingDetail>sector and size, no company name</PendingDetail>
                  </span>
                </li>
                <li className="type-body flex flex-col gap-2">
                  <span>
                    Led ERP implementations covering{" "}
                    <PendingDetail>modules</PendingDetail>, including data migration and training
                  </span>
                </li>
                <li className="type-body flex flex-col gap-2">
                  <span>
                    Redesigned <PendingDetail>which processes</PendingDetail> to remove{" "}
                    <PendingDetail>the specific manual step</PendingDetail>
                  </span>
                </li>
                <li className="type-body flex flex-col gap-2">
                  <span>
                    Built{" "}
                    <PendingDetail>
                      what — spreadsheets, Power Query, scripts, RPA, AI-assisted workflows
                    </PendingDetail>{" "}
                    for real operational use
                  </span>
                </li>
              </ul>
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
              <h2 className="type-h2">Why the demonstration matters</h2>
              <p className="type-body measure mt-4">
                The AR Collections Manager is product one. It exists to be inspected rather than
                described: you can open it, read the rules it applies, and check its totals
                against its own invoices. It runs on synthetic data because no client&apos;s data
                belongs on a public website — and the label saying so stays on every screen.
              </p>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-line bg-ivory-100 p-6 lg:sticky lg:top-28">
              <h2 className="type-h3">What this page cannot tell you yet</h2>
              <p className="type-small mt-3 text-ink-muted">
                The founder has not supplied the personal detail the blueprint asks for — name,
                length of experience, the two lived observations, and the four scope bullets.
                Rather than invent them, they are marked where they belong.
              </p>
              <p className="type-small mt-4">
                If you want the short version now, ask on the contact page and you will get it in
                words rather than in marketing.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
