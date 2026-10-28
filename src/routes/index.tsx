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
  IconMail,
  IconSync,
} from "~/components/icons";
import { Section } from "~/components/section";

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

/**
 * What every piece of work ends with. Deliberately about the method, not about
 * past clients: the business has none yet, so this promises a way of working
 * rather than a track record.
 */
const DELIVERABLES = [
  {
    title: "A working build",
    detail:
      "Software running on the systems you already use, doing the step it was built for — open it and check it before you accept it.",
  },
  {
    title: "The process map",
    detail:
      "The written record of steps, handoffs and waits from discovery, so the build can be judged against the process it came from.",
  },
  {
    title: "A runbook",
    detail:
      "Written for someone who has never met us: what it does, what to do when something looks wrong, and who to ask.",
  },
  {
    title: "Your accounts and your data",
    detail:
      "Everything sits in systems you control. Support is a separate arrangement you can end.",
  },
];

function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <WhatWeDoSection />
      <SystemsSection />
      <DeliverablesSection />
      <AssessmentSection />
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
            your shop. We are set up for small businesses: no in-house development team, and no
            appetite for a long project before anything works. Whether the problem sits in
            finance, sales or admin, the approach is the same — understand how the business
            actually runs, then build the workflow that takes the work off someone's desk.
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
          <EngagementPanel />
        </div>
      </div>
    </Section>
  );
}

/**
 * The panel beside the hero (blueprint §3.1 item 1, revised).
 *
 * This space used to hold a frame of a product demonstration. The site no longer
 * advertises products, so it now answers the question a first-time visitor
 * actually has: what happens if I get in touch, and what am I committing to?
 */
function EngagementPanel() {
  return (
    <div className="overflow-hidden rounded-panel border border-line bg-white">
      <div className="flex items-center justify-between gap-3 bg-navy-800 px-4 py-3 text-white on-navy">
        <span className="type-small font-medium">What working with us involves</span>
        <span className="type-eyebrow text-white/70">Five steps</span>
      </div>

      <ol className="flex flex-col divide-y divide-line">
        {ENGAGEMENT.map((step, index) => (
          <li key={step.title} className="flex gap-4 px-4 py-3 sm:px-5">
            <span className="type-eyebrow mt-1 shrink-0 text-ink-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="type-small font-medium">{step.title}</p>
              <p className="type-small text-ink-muted">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-line px-4 py-3 sm:px-5">
        <Link to="/how-it-works" className="text-link type-small inline-flex items-center gap-2">
          How an engagement works, in detail
          <IconArrowRight />
        </Link>
      </div>
    </div>
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

function DeliverablesSection() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="type-h2">What you end up with.</h2>
          <p className="type-body measure mt-6 text-ink-muted">
            However small the build, it ends the same way. If it doesn&apos;t, it isn&apos;t
            finished.
          </p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
          {DELIVERABLES.map((item) => (
            <li key={item.title} className="border-t border-line pt-4">
              <h3 className="type-h3">{item.title}</h3>
              <p className="type-body mt-2 text-ink-muted">{item.detail}</p>
            </li>
          ))}
        </ul>
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
