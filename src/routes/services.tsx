import { createFileRoute } from "@tanstack/react-router";
import { Callout } from "~/components/callout";
import { CtaBand } from "~/components/cta-band";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";

const TITLE = "Services — Spearpoint Automation";
const DESCRIPTION =
  "Seven ways we remove manual work: operational assessment, custom AI applications, accounting and finance automation, email and document workflow, CRM follow-up, inventory operations, and handover with optional support.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ServicesPage,
});

type Service = {
  slug: string;
  name: string;
  /** The line the service is summarised by. */
  summary: string;
  /** What it is — two sentences. */
  what: string;
  inPractice: string[];
  outcome: string;
  depends: string;
  /** One honest disqualifier. This line is the page's credibility. */
  notFit: string;
};

/**
 * The seven services (blueprint §3.2). The names, order, "in practice" bullets
 * and "not a fit if" lines are the blueprint's. The two-sentence description,
 * outcome and dependency for each block are written in the same voice, from the
 * same brief — no claim of prior client delivery is made anywhere on this page.
 */
const SERVICES: Service[] = [
  {
    slug: "operational-assessment",
    name: "Operational assessment",
    summary: "Find where the time actually goes.",
    what: "Before anything is built, we spend time with the process as it actually runs, including the parts nobody wrote down. You get a written map of where the work goes and a plain opinion about which parts are worth changing.",
    inPractice: [
      "Walking the process with the people who do it",
      "A written map of steps, handoffs and waits",
      "What is worth automating and what is not",
    ],
    outcome:
      "A process map, a prioritised shortlist, and the list of things we would leave alone.",
    depends: "Access to the people who do the work, and more than one hour of their time.",
    notFit: "You already know exactly what to build — go to service 2.",
  },
  {
    slug: "custom-ai-applications",
    name: "Custom AI applications",
    summary: "Software built for your one process.",
    what: "A small application that does one job properly, built around the way your business already works rather than around a product's idea of how it should. It runs in your own accounts, and you can read the code.",
    inPractice: [
      "A small application for one job",
      "Draft replies, extract data, assemble a report, route work",
      "A person approves anything consequential",
    ],
    outcome:
      "A working application you own, with documentation and a named person who knows how to run it.",
    depends:
      "Read access to whatever the process touches, and someone who can say what a correct output looks like.",
    notFit: "A feature of software you already own covers it.",
  },
  {
    slug: "accounting-and-finance-automation",
    name: "Accounting and finance automation",
    summary: "Collections, reporting, reconciliation prep.",
    what: "The repetitive work around the ledger — chasing, assembling, checking — handled by something that reads your actual figures. The figures are always computed from your data; no model is ever asked to produce a number.",
    inPractice: [
      "Aging-based collection queues with drafted reminders for approval",
      "Reporting packs assembled from ledger data",
      "Exception lists instead of full re-checks",
    ],
    outcome:
      "A queue or a report that is ready before you sit down, and drafts you approve rather than write.",
    depends:
      "Read access to the accounting system, and the vendor's app review where it applies to a single business.",
    notFit: "Your ledger is unreconciled — that is bookkeeping, and it comes first.",
  },
  {
    slug: "email-and-document-workflow",
    name: "Email and document workflow",
    summary: "Read, sort, extract, draft — then a person approves.",
    what: "The paper and the inbox, turned into something a person can act on quickly. The output is a draft or a record; the decision stays with a person.",
    inPractice: [
      "Inbox triage by type and urgency",
      "Invoice and PO data pulled from PDFs",
      "Reply drafts with the facts already filled in",
    ],
    outcome: "A triaged inbox or a set of extracted records, with the source document attached.",
    depends:
      "Mailbox or file access inside your own tenant, at the narrowest scope that does the job.",
    notFit: "The process depends on judgement nobody can describe in writing yet.",
  },
  {
    slug: "crm-and-customer-follow-up",
    name: "CRM and customer follow-up",
    summary: "Nothing goes quiet.",
    what: "Follow-up that is triggered by something real in your CRM rather than by memory. The list is built for you; the conversation is still yours.",
    inPractice: [
      "Follow-up triggered by real CRM events",
      "A daily list of who to contact and why",
      "Notes summarised onto the record",
    ],
    outcome: "A daily list of who to contact, with the reason attached to each name.",
    depends: "A CRM that is actually used, and API access to it.",
    notFit: "Your CRM is a spreadsheet nobody updates — configure the CRM first.",
  },
  {
    slug: "inventory-and-order-operations",
    name: "Inventory and order operations",
    summary: "Answer stock questions from data you already have.",
    what: "Stock, reorder and order questions answered from the data you already hold, without opening three systems to find out. Where the data is not there, we say so rather than guessing.",
    inPractice: [
      "Reorder suggestions from sales history and lead times",
      "Stock queries without opening three systems",
      "Shop-to-ledger mismatch reports",
    ],
    outcome:
      "Reorder suggestions you can review, and one place to look when someone asks whether you have it.",
    depends:
      "Sales captured at the point of sale, and whatever the commerce or ERP interface exposes — which we check before quoting.",
    notFit: "Sales data isn't captured at the point of sale.",
  },
  {
    slug: "handover-training-and-support",
    name: "Handover, training and support",
    summary: "Documented, transferable, optional.",
    what: "Everything we build is handed over in a state you can operate without us. Support exists if you want it, and ends when you say so.",
    inPractice: [
      "Written runbook",
      "Training for the people who run it",
      "Support you can end",
    ],
    outcome: "Repositories, a runbook, training, and credentials that live in your own accounts.",
    depends: "The people who will run it, available for the handover sessions.",
    notFit: "You want a vendor to host and operate it indefinitely — different business model, not ours.",
  },
];

function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Seven ways we remove manual work."
        lead="Each one starts with the process, not the software. If a tool you already own can do the job, we'll tell you and stop there."
      />

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="type-eyebrow text-ink-muted">On this page</p>
              <nav aria-label="Services on this page" className="mt-4">
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 lg:grid-cols-1">
                  {SERVICES.map((service, index) => (
                    <li key={service.slug}>
                      <a
                        href={`#${service.slug}`}
                        className="type-small inline-block py-1 text-navy-900 underline-offset-4 hover:text-blue-700 hover:underline"
                      >
                        <span className="text-ink-muted">
                          {String(index + 1).padStart(2, "0")}{" "}
                        </span>
                        {service.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <div className="flex flex-col gap-16 lg:col-span-9">
            {SERVICES.map((service, index) => (
              <ServiceBlock key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="ivory-100">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-3">
            <p className="type-eyebrow text-ink-muted">Pricing</p>
          </div>
          <div className="measure type-lead lg:col-span-9">
            <p>
              Fixed fee per agreed deliverable, quoted after discovery. The first conversation
              and the assessment are how we find out whether a quote is appropriate. We don&apos;t
              bill by the hour for thinking, and we don&apos;t sell subscriptions.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

function ServiceBlock({ service, index }: { service: Service; index: number }) {
  return (
    <article
      id={service.slug}
      className={`scroll-mt-28 ${index === 0 ? "" : "border-t border-line pt-12"}`}
    >
      <p className="type-eyebrow text-ink-muted">{String(index + 1).padStart(2, "0")}</p>
      <h2 className="type-h2 mt-3">{service.name}</h2>
      <p className="type-lead mt-3 text-ink-muted">{service.summary}</p>
      <p className="type-body measure mt-5">{service.what}</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="type-eyebrow text-ink-muted">In practice</p>
          <ul className="mt-3 flex flex-col gap-2">
            {service.inPractice.map((item) => (
              <li key={item} className="type-body flex gap-3">
                <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-blue-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="type-eyebrow text-ink-muted">What you end up with</p>
            <p className="type-body mt-3">{service.outcome}</p>
          </div>
          <div>
            <p className="type-eyebrow text-ink-muted">Depends on</p>
            <p className="type-body mt-3">{service.depends}</p>
          </div>
        </div>
      </div>

      <Callout label="Not a fit if" className="mt-8">
        {service.notFit}
      </Callout>
    </article>
  );
}
