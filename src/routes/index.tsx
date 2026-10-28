import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { CtaBand } from "~/components/cta-band";
import { Eyebrow } from "~/components/eyebrow";
import {
  IconArrowDown,
  IconArrowRight,
  IconHelp,
  IconInvoice,
  IconList,
  IconMail,
  IconSync,
} from "~/components/icons";
import { Section } from "~/components/section";
import { StageBadge } from "~/components/stage-badge";
import { SyntheticDataNotice } from "~/components/synthetic-data-notice";
import { FEATURED_PRODUCT } from "~/lib/products";

const TITLE = "Spearpoint Automation — custom AI solutions for small businesses";
const DESCRIPTION =
  "We find the manual work that is quietly costing you hours, then build software and automation on the systems you already use — accounting, email, CRM, shop. We build it. You own it.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: HomePage,
});

/** The four places manual work tends to sit (blueprint §3.1 item 2). */
const PROBLEMS = [
  {
    icon: <IconInvoice className="h-6 w-6" />,
    title: "Invoices that need chasing",
    detail:
      "Someone opens the aging report every Monday, picks the customers to call, and retypes the totals into a follow-up list.",
  },
  {
    icon: <IconSync className="h-6 w-6" />,
    title: "The same figures typed into two systems",
    detail:
      "A number arrives in one system in the morning and is still being typed into another one in the afternoon.",
  },
  {
    icon: <IconMail className="h-6 w-6" />,
    title: "Email that needs reading, sorting and answering",
    detail:
      "A shared inbox fills with invoices, questions and confirmations, and all of it has to be read before anyone can act on it.",
  },
  {
    icon: <IconHelp className="h-6 w-6" />,
    title: "Answers that only exist in someone's head or a spreadsheet",
    detail:
      "The person who knows which file is current is away this week, so the answer waits until they are back.",
  },
];

/** The compressed engagement summary (blueprint §3.1 item 7). */
const ENGAGEMENT = [
  { title: "Paid discovery", detail: "Scoped work before anyone proposes anything." },
  { title: "Written scope", detail: "Included, excluded and dependencies, in a document." },
  { title: "Fixed price", detail: "Per agreed deliverable, agreed before building." },
  { title: "Staged review", detail: "Something you can open and test each cycle." },
  { title: "Handover", detail: "Your accounts, your documentation, optional support." },
];

function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <WhatWeDoSection />
      <SystemsSection />
      <ProofSection />
      <AssessmentSection />
      <EngagementSection />
      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <Section className="pb-16">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>Custom AI solutions · Built on your existing systems</Eyebrow>
          <h1 className="type-display measure-display mt-6">
            Custom AI solutions for businesses without an in-house development team.
          </h1>
          <p className="type-lead measure mt-6 text-ink-muted">
            We find the manual work that is quietly costing you hours, then build software and
            automation on the systems you already use — your accounting, your email, your CRM,
            your shop.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/contact">Book a consultation</Button>
            {/* The assessment is a separate build; until it exists this is a
                labelled non-link rather than a link to a page that would 404. */}
            <Button variant="secondary" soon>
              Take the two-minute assessment
            </Button>
          </div>
        </div>
        <div className="lg:col-span-5">
          <DemoFrame />
        </div>
      </div>
    </Section>
  );
}

/**
 * The frame beside the hero (blueprint §3.1 item 1).
 *
 * It shows the real product record, not a mock-up: the demo does not exist yet,
 * so there is no screenshot to show. When `/showcase/ar-collections` ships, the
 * inner panel is replaced with the actual priority queue and the caption becomes
 * "running on synthetic data".
 */
function DemoFrame() {
  const product = FEATURED_PRODUCT;

  return (
    <figure className="overflow-hidden rounded-panel border border-line bg-white">
      <div className="flex items-center justify-between gap-3 bg-navy-800 px-4 py-3 text-white on-navy">
        <span className="type-small font-medium">{product.name}</span>
        <span className="type-eyebrow text-white/70">Synthetic data</span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="rounded-card border border-dashed border-ink-muted/40 p-5 text-center sm:p-6">
          <IconList className="mx-auto h-6 w-6 text-ink-muted" />
          <p className="type-h3 mt-3">The working demonstration is being built.</p>
          <p className="type-small mx-auto mt-2 max-w-sm text-ink-muted">
            This frame will show the real priority queue — not a picture of one. Every screen
            will carry the same label it carries today: synthetic data, invented customers,
            invented invoices.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <StageBadge stage={product.stage} />
          <span className="type-small text-ink-muted">Not a client project</span>
        </div>
      </div>

      <figcaption className="border-t border-line px-4 py-3 type-small text-ink-muted sm:px-5">
        Our AR Collections Manager. Prototype: the demonstration is in progress, so there is
        nothing here to click yet.
      </figcaption>
    </figure>
  );
}

function ProblemSection() {
  return (
    <Section tone="ivory-100">
      <h2 className="type-h2 measure">You know where the time goes. It&apos;s usually the same four places.</h2>
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {PROBLEMS.map((problem) => (
          <li key={problem.title}>
            <Card className="h-full">
              <span className="text-ink-muted">{problem.icon}</span>
              <h3 className="type-h3 mt-4">{problem.title}</h3>
              <p className="type-body mt-3 text-ink-muted">{problem.detail}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function WhatWeDoSection() {
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="type-h2">Diagnose. Build. Hand over.</h2>
        </div>
        <div className="measure flex flex-col gap-6 type-body lg:col-span-7">
          <p>
            <span className="font-semibold">Diagnose.</span> We start with the process, not the
            software: the steps, the handoffs and the waiting in between. Then we tell you which
            parts are worth changing and which are better left alone.
          </p>
          <p>
            <span className="font-semibold">Build.</span> We build on the systems you already
            run, in stages you can open and test. Anything that leaves your business — a
            message, a payment, a claim — goes through a person first.
          </p>
          <p>
            <span className="font-semibold">Hand over.</span> Everything ends up in your own
            accounts, documented for someone who has never met us. It is yours to keep and to
            change, with or without us.
          </p>
          <p className="type-lead pt-2 font-medium">
            We build it. You own it. We support it when you need us.
          </p>
        </div>
      </div>
    </Section>
  );
}

function SystemsSection() {
  return (
    <Section tone="ivory-100">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="type-h2">AI that works with the systems you already use.</h2>
        </div>
        <div className="lg:col-span-8">
          <SystemsDiagram />
          <p className="type-body measure mt-8 text-ink-muted">
            We don&apos;t ask you to migrate, and we don&apos;t replace your accounting system. If
            a change of system is the honest answer, we&apos;ll say so before you spend anything.
          </p>
        </div>
      </div>
    </Section>
  );
}

function SystemsDiagram() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
      <DiagramBox
        title="Your systems"
        items={[
          "QuickBooks · Xero",
          "Microsoft 365 · Google Workspace",
          "HubSpot · Shopify · Square",
          "Spreadsheets",
        ]}
      />
      <DiagramArrow />
      <DiagramBox
        title="Integration layer"
        items={[
          "Read access to what the process needs",
          "Approved app review where it applies",
          "The narrowest scope that works",
        ]}
      />
      <DiagramArrow />
      <DiagramBox
        title="What we build"
        items={["A queue, a report, an inbox, a draft", "Reviewed by a person before it leaves"]}
      />
    </div>
  );
}

function DiagramBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex-1 rounded-card border border-line bg-white p-4">
      <h3 className="type-eyebrow text-ink-muted">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="type-small">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiagramArrow() {
  return (
    <div aria-hidden="true" className="flex shrink-0 items-center justify-center text-ink-muted">
      <IconArrowDown className="h-5 w-5 md:-rotate-90" />
    </div>
  );
}

function ProofSection() {
  const product = FEATURED_PRODUCT;

  return (
    <Section>
      <h2 className="type-h2 measure">A working example, with the labels left on.</h2>

      <div className="mt-12 rounded-panel border border-line bg-white p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="type-h3">{product.name}</h3>
              <StageBadge stage={product.stage} />
            </div>
            <p className="type-lead mt-4">{product.problem}</p>

            <p className="type-eyebrow mt-8 text-ink-muted">What it is being built to do</p>
            <ul className="mt-3 flex flex-col gap-2">
              {product.capabilities.map((capability) => (
                <li key={capability} className="type-body flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-blue-700" />
                  {capability}
                </li>
              ))}
            </ul>

            <p className="type-small mt-6 text-ink-muted">
              Connects to: {product.connectsTo.join(", ")}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card bg-ivory-100 p-5">
              <p className="type-eyebrow text-ink-muted">Where it is today</p>
              <p className="type-body mt-3">
                Prototype. The demonstration is being built, so it is not open to the public yet.
              </p>
              <p className="type-body mt-3">
                No client has used it. When one does, the label changes — and not before.
              </p>
            </div>
            <SyntheticDataNotice className="mt-4" />
          </div>
        </div>

        <p className="type-body measure mt-8 border-t border-line pt-6">
          This is a demonstration build, not a client engagement. We have not had a client use it
          yet, and we won&apos;t say we have.
        </p>
      </div>
    </Section>
  );
}

function AssessmentSection() {
  return (
    <Section tone="ivory-100">
      <div className="rounded-panel border border-line bg-white p-8 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-12">
        <div>
          <h2 className="type-h2 measure">Not sure where to start? Answer nine questions.</h2>
          <p className="type-body measure mt-4 text-ink-muted">
            It returns a shortlist of where automation might help and the questions a discovery
            conversation would ask — not a quote, and not a diagnosis.
          </p>
          <p className="type-small measure mt-3 text-ink-muted">
            Answers stay in your browser. Nothing is sent unless you choose to send it.
          </p>
        </div>
        <div className="mt-6 shrink-0 lg:mt-0">
          <Button variant="secondary" soon>
            Take the two-minute assessment
          </Button>
        </div>
      </div>
    </Section>
  );
}

function EngagementSection() {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="type-h2 measure">What working with us involves.</h2>
        <Link to="/how-it-works" className="text-link type-body inline-flex items-center gap-2">
          How it works
          <IconArrowRight />
        </Link>
      </div>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {ENGAGEMENT.map((step, index) => (
          <li key={step.title} className="border-t border-line pt-4">
            <p className="type-eyebrow text-ink-muted">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="type-h3 mt-2">{step.title}</h3>
            <p className="type-small mt-2 text-ink-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
