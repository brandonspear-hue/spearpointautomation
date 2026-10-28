import { Link, createFileRoute } from "@tanstack/react-router";
import { Callout } from "~/components/callout";
import { CtaBand } from "~/components/cta-band";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";
import { SyntheticDataNotice } from "~/components/synthetic-data-notice";
import { IconList } from "~/components/icons";
import { FEATURED_PRODUCT } from "~/lib/products";

const TITLE = "AR Collections Manager — Spearpoint Automation";
const DESCRIPTION =
  "One worked example of the collections work: a prototype that builds a priority queue from an aging report and drafts reminders for a person to approve. Synthetic data, no client use, demonstration being built.";

export const Route = createFileRoute("/examples/ar-collections")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ArCollectionsPage,
});

/**
 * The worked example's own page.
 *
 * The interactive demonstration is planned here and is still being built. Until
 * it exists, this page describes the build honestly and renders the same
 * "being built" state the Examples page shows — it never links to a page that
 * does not exist.
 *
 * The product record supplies the name, the problem, the capabilities and the
 * systems, so those can only be changed in one place (`src/lib/products.ts`).
 * The limits below are page copy about how the build behaves; they are not a
 * product claim and must not become one.
 */
function ArCollectionsPage() {
  const example = FEATURED_PRODUCT;

  return (
    <>
      <PageHeader
        eyebrow="What we build · Example"
        title={example.name}
        lead="One example of the collections work, taken through to an actual build. A prototype: tested on invented invoices, and not yet used in a client's business."
      />

      <Section className="pt-0">
        <p className="type-body measure text-ink-muted">
          <Link to="/examples" className="text-link">
            What we build
          </Link>{" "}
          / {example.name}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 className="type-h2">What it does</h2>
            <p className="type-lead measure mt-3">{example.problem}</p>

            <ul className="mt-8 flex flex-col gap-3">
              {example.capabilities.map((capability) => (
                <li key={capability} className="type-body flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-blue-700" />
                  {capability}
                </li>
              ))}
            </ul>

            <h2 className="type-h2 mt-12">Where the data comes from</h2>
            <p className="type-body measure mt-3">
              It reads the systems that already hold the answers, at the narrowest access that
              does the job:
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {example.connectsTo.map((system) => (
                <li
                  key={system}
                  className="type-small rounded-badge border border-line bg-white px-3 py-1.5"
                >
                  {system}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-panel border border-line bg-white p-6">
              <p className="type-eyebrow text-ink-muted">Where it is today</p>
              <p className="type-h3 mt-3">The demonstration is being built.</p>
              <p className="type-body mt-3">
                There is no interactive version to open yet. When there is, it will run in your
                browser on synthetic data and every screen will carry that label.
              </p>
              <p className="mt-5">
                <span className="type-eyebrow inline-flex items-center gap-2 rounded-full border border-dashed border-ink-muted/60 px-3 py-1.5 text-ink-muted">
                  Demonstration being built
                </span>
              </p>
            </div>

            <div className="mt-4 rounded-card border border-dashed border-ink-muted/40 p-5 text-center">
              <IconList className="mx-auto h-6 w-6 text-ink-muted" />
              <p className="type-small mx-auto mt-3 max-w-sm text-ink-muted">
                This is where the priority queue will appear — the real thing, not a picture of
                one.
              </p>
            </div>

            <SyntheticDataNotice className="mt-4" />
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="type-h2">What it won&apos;t do</h2>
          </div>
          <div className="measure type-body lg:col-span-8">
            <p>
              Send anything on its own. Every reminder is a draft until a person approves it, and
              the log records who approved what and when.
            </p>
            <p className="mt-4">
              Invent a number. Every figure comes from the invoice it belongs to; no model is
              asked to produce an amount.
            </p>
            <p className="mt-4">
              Replace your ledger or tidy it up. If the books are not reconciled, that is
              bookkeeping, and it comes first.
            </p>
          </div>
        </div>

        <Callout label="The honest label" className="mt-10">
          This is a demonstration build, not a client engagement. No client has used it, and we
          won&apos;t say otherwise. If that changes, the label on this page changes with it.
        </Callout>
      </Section>

      <CtaBand
        title="Tell us about your week."
        lead="If this example is close to a problem you have, a 30-minute conversation about the process is a good start — and the honest answer may be that you need none of it."
      />
    </>
  );
}
