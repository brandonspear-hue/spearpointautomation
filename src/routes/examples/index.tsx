import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Card } from "~/components/card";
import { CtaBand } from "~/components/cta-band";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";
import { SyntheticDataNotice } from "~/components/synthetic-data-notice";
import {
  IconArrowRight,
  IconBox,
  IconChart,
  IconInvoice,
  IconList,
  IconMail,
  IconSync,
} from "~/components/icons";
import { FEATURED_PRODUCT } from "~/lib/products";

const TITLE = "What we build — Spearpoint Automation";
const DESCRIPTION =
  "The kinds of manual work we build software for — collections, month-end reporting, shared inboxes, stock and reorder, follow-up, document data entry — and one worked example, labelled honestly. No client work is shown.";

export const Route = createFileRoute("/examples/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ExamplesPage,
});

/**
 * The kinds of manual work we build for.
 *
 * Each entry is written as "here is the work, here is what we build, here is
 * what you end up with". No client, no result, no saving and no timeline is
 * claimed anywhere on this page — the business has no clients yet, and these
 * are the shapes of work it is set up to take on.
 *
 * The six problems and the systems they touch mirror the internal product
 * records in `src/lib/products.ts`. That library is the business's own record
 * of what it has built or specified; it is deliberately not shown as a
 * catalogue here.
 */
type Work = {
  slug: string;
  icon: ReactNode;
  /** The manual work, in the words a business owner would use for it. */
  title: string;
  /** What we build to take it off someone's desk. */
  build: string;
  /** What the client is left holding when the build is handed over. */
  result: string;
  /** The systems the build reads from or writes to. Plain text, never logos. */
  systems: string[];
};

const WORK: Work[] = [
  {
    slug: "collections",
    icon: <IconInvoice className="h-6 w-6" />,
    title: "Chasing overdue invoices, and managing collections",
    build:
      "A queue built from your aging report, ordered by what actually needs attention, with the reminder drafted and every figure taken from the invoice itself. A person approves each message before it leaves.",
    result:
      "A list of who to chase and why, and drafts you approve rather than write.",
    systems: ["QuickBooks Online", "Xero", "Microsoft 365 / Google Workspace", "Stripe (status only)"],
  },
  {
    slug: "reporting",
    icon: <IconChart className="h-6 w-6" />,
    title: "Month-end reporting, variance and reconciliation",
    build:
      "The monthly pack assembled from the same sources you pull from now, with the variance lines worked out and an exception list of what does not match — instead of a full re-check by hand.",
    result:
      "A report that is ready before you sit down, with the exceptions already separated.",
    systems: ["QuickBooks Online", "Xero", "Excel", "SharePoint"],
  },
  {
    slug: "inbox",
    icon: <IconMail className="h-6 w-6" />,
    title: "Reading, sorting and answering a shared inbox",
    build:
      "Mail read and sorted by what it is and how urgent it is, the facts pulled out of the attachments, and reply drafts a person finishes and sends.",
    result:
      "An inbox that is triaged before anyone opens it, and replies that start half-written.",
    systems: ["Microsoft 365 / Google Workspace", "HubSpot"],
  },
  {
    slug: "stock",
    icon: <IconBox className="h-6 w-6" />,
    title: "Stock and reorder monitoring across the shop and the books",
    build:
      "Sales history and lead times read together so reorder suggestions arrive before something runs out, and any mismatch between what the shop sold and what the accounts record is listed for you.",
    result:
      "Reorder suggestions you review, and one place to look when someone asks whether you have it.",
    systems: ["Shopify", "Square", "ERP", "Spreadsheets"],
  },
  {
    slug: "follow-up",
    icon: <IconList className="h-6 w-6" />,
    title: "Following up on leads and quotes",
    build:
      "A follow-up list built from what actually happened in the CRM or the quote log, with the reason for each name attached and the next message drafted.",
    result: "A daily list of who is owed a follow-up, and why.",
    systems: ["HubSpot", "Microsoft 365", "Accounting"],
  },
  {
    slug: "documents",
    icon: <IconSync className="h-6 w-6" />,
    title: "Extracting data from documents into the systems that need it",
    build:
      "Invoice, PO and contract details read out of the document and written into the system that needs them, with the source file kept against the record.",
    result:
      "Records that arrive filled in, with the document they came from attached.",
    systems: ["SharePoint / Drive", "Accounting", "Email"],
  },
];

function ExamplesPage() {
  const example = FEATURED_PRODUCT;

  return (
    <>
      <PageHeader
        eyebrow="What we build"
        title="The manual work we take off your desk."
        lead="These are the kinds of work we build software for. Each one starts with the process as it actually runs inside your business, and ends with something you own and can operate — built on the accounting, email, CRM and shop systems you already use."
      />

      <Section className="pt-0">
        <ul className="grid gap-6 md:grid-cols-2">
          {WORK.map((work) => (
            <li key={work.slug}>
              <Card className="flex h-full flex-col">
                <span className="text-ink-muted">{work.icon}</span>
                <h2 className="type-h3 mt-4">{work.title}</h2>

                <p className="type-eyebrow mt-5 text-ink-muted">What we build</p>
                <p className="type-body mt-2 text-ink-muted">{work.build}</p>

                <p className="type-eyebrow mt-4 text-ink-muted">What you end up with</p>
                <p className="type-body mt-2">{work.result}</p>

                <p className="type-small mt-auto pt-5 text-ink-muted">
                  Reads from: {work.systems.join(", ")}
                </p>
              </Card>
            </li>
          ))}
        </ul>

        <p className="type-body measure mt-10 text-ink-muted">
          None of this has been built for a client yet. What follows is the one example we have
          taken furthest, and it is labelled for exactly what it is.
        </p>
      </Section>

      <Section tone="ivory-100">
        <p className="type-eyebrow text-ink-muted">One example of this, built</p>
        <h2 className="type-h2 measure mt-3">{example.name}</h2>
        <p className="type-lead measure mt-4">
          An example of the collections work above, taken through to an actual build rather than a
          picture of a screen. It is a prototype: tested on invented invoices, and not yet used in a
          client&apos;s business.
        </p>

        <Card className="mt-10 overflow-hidden p-0">
          <div className="grid lg:grid-cols-12">
            <div className="p-6 lg:col-span-7 lg:p-8">
              <h3 className="type-h3">What it does</h3>
              <p className="type-body mt-3 text-ink-muted">{example.problem}</p>

              <ul className="mt-6 flex flex-col gap-2">
                {example.capabilities.map((capability) => (
                  <li key={capability} className="type-body flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-blue-700" />
                    {capability}
                  </li>
                ))}
              </ul>

              <p className="type-small mt-6 text-ink-muted">
                Connects to: {example.connectsTo.join(", ")}
              </p>
            </div>

            <div className="border-t border-line bg-white p-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-8">
              <p className="type-eyebrow text-ink-muted">Where it is today</p>
              <p className="type-body mt-3">
                Prototype. The interactive demonstration is being built, so it is not open to the
                public yet.
              </p>
              <p className="type-body mt-3">
                No client has used it. When one does, the label changes — and not before.
              </p>
              <p className="mt-6">
                <span className="type-eyebrow inline-flex items-center gap-2 rounded-full border border-dashed border-ink-muted/60 px-3 py-1.5 text-ink-muted">
                  Demonstration being built
                </span>
              </p>
              <p className="mt-6">
                <Link
                  to="/examples/ar-collections"
                  className="text-link type-body inline-flex items-center gap-2"
                >
                  Read about this example
                  <IconArrowRight />
                </Link>
              </p>
            </div>
          </div>
        </Card>

        <SyntheticDataNotice className="mt-6" />

        <p className="type-body measure mt-8">
          This is a demonstration build, not a client engagement. We have not had a client use it
          yet, and we won&apos;t say we have.
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="type-h2">Why there are no case studies here.</h2>
          </div>
          <div className="measure type-body lg:col-span-8">
            <p>
              There is no client work to show yet. This is a new business, and inventing a logo
              wall or a saving would tell you nothing true about what we do.
            </p>
            <p className="mt-4">
              What is on this page is the work itself: the kinds of problem we are set up to take
              on, and one build we can show you the inside of. When there is a real engagement to
              describe, it will appear here — with the client&apos;s permission, and only with
              numbers they have agreed to publish.
            </p>
            <p className="mt-6">
              <Link to="/services" className="text-link type-body inline-flex items-center gap-2">
                How an engagement runs
                <IconArrowRight />
              </Link>
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Which of these is your week?"
        lead="A 30-minute conversation about the process, not a pitch deck. If the honest answer is that you don't need this, we'll say so."
      />
    </>
  );
}
