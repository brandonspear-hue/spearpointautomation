/**
 * The Automation Assessment engine (website blueprint §4).
 *
 * This file is the single source of truth for the assessment: the questions, the
 * weights, the bands, the eleven opportunity rules, the dependency and unknown
 * rules, and the assembly of the result. It is deliberately pure — no I/O, no
 * network, no dates, no randomness, no server code — so that the same answers
 * always produce byte-identical output and the rules can be tested directly.
 *
 * What the result is allowed to say: which areas might fit, why each one appears
 * (named against the visitor's own answers), what the systems they named imply,
 * and what discovery would have to confirm. It never estimates hours, cost,
 * savings, effort or feasibility, and the intensity score is never displayed —
 * it only picks a band.
 */

/** Stamped into every result so an old reading can be recognised later. */
export const RULESET_VERSION = "2026-10-01";

export const QUESTION_COUNT = 9;

export type QuestionId = "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8" | "a9";

export type Option = {
  /** Stable id. Stored answers use this, never the label. */
  id: string;
  label: string;
};

export type Question = {
  id: QuestionId;
  /** 1-based position, shown as "Question 4 of 9" and nowhere as a percentage. */
  number: number;
  kind: "text" | "single" | "multi";
  /** The exact wording from the blueprint, including "(optional)" where it applies. */
  prompt: string;
  /** A short phrase used to build "you chose X for …" sentences in the result. */
  subject: string;
  /** Shown under the legend. Never used as a label. */
  help?: string;
  /** "text": the character limit. */
  maxLength?: number;
  /** "multi": how many options may be ticked. */
  maxSelected?: number;
  options?: Option[];
  /** A3 is the only grouped question. Each group has its own legend. */
  groups?: { legend: string; options: Option[] }[];
  /** A9 carries an optional free-text note beneath its options. */
  note?: { label: string; maxLength: number };
};

export const QUESTIONS: Question[] = [
  {
    id: "a1",
    number: 1,
    kind: "text",
    maxLength: 300,
    prompt: "Describe the task as if you were showing it to someone on their first day. (optional)",
    subject: "the task",
    help: "Your own words, in a sentence or two. This is echoed back in the summary and is not scored.",
  },
  {
    id: "a2",
    number: 2,
    kind: "single",
    prompt: "Which part of the business does it sit in?",
    subject: "which part of the business the work sits in",
    options: [
      { id: "sales-follow-up", label: "Sales & customer follow-up" },
      { id: "invoicing-collections", label: "Invoicing & collections" },
      { id: "supplier-invoices", label: "Supplier invoices & payables" },
      { id: "inventory-purchasing", label: "Inventory & purchasing" },
      { id: "reporting-month-end", label: "Reporting & month-end" },
      { id: "documents-records", label: "Documents & records" },
      { id: "scheduling-admin", label: "Scheduling & admin" },
      { id: "something-else", label: "Something else" },
    ],
  },
  {
    id: "a3",
    number: 3,
    kind: "multi",
    prompt: "Which systems does the work pass through?",
    subject: "the systems the work passes through",
    help: "Tick everything it touches. Leave it blank if you would rather not answer.",
    groups: [
      {
        legend: "Accounting",
        options: [
          { id: "quickbooks", label: "QuickBooks Online" },
          { id: "xero", label: "Xero" },
          { id: "sage", label: "Sage" },
          { id: "desktop-software", label: "Desktop accounting software" },
          { id: "spreadsheets-only", label: "Spreadsheets only" },
        ],
      },
      {
        legend: "Email",
        options: [
          { id: "microsoft-365", label: "Microsoft 365" },
          { id: "google-workspace", label: "Google Workspace" },
        ],
      },
      {
        legend: "Customer records",
        options: [
          { id: "hubspot", label: "HubSpot" },
          { id: "another-crm", label: "Another CRM" },
          { id: "no-crm", label: "None" },
        ],
      },
      {
        legend: "Sales & stock",
        options: [
          { id: "shopify", label: "Shopify" },
          { id: "square-pos", label: "Square or POS" },
          { id: "erp", label: "An ERP" },
          { id: "no-sales-system", label: "None" },
        ],
      },
      {
        legend: "Documents",
        options: [
          { id: "sharepoint-drive", label: "SharePoint or Drive" },
          { id: "paper-scans", label: "Paper and scans" },
        ],
      },
    ],
  },
  {
    id: "a4",
    number: 4,
    kind: "single",
    prompt: "How often does it happen?",
    subject: "how often it happens",
    options: [
      { id: "several-times-a-day", label: "Several times a day" },
      { id: "daily", label: "Daily" },
      { id: "few-times-a-week", label: "Few times a week" },
      { id: "weekly", label: "Weekly" },
      { id: "monthly", label: "Monthly" },
      { id: "no-rhythm", label: "No fixed rhythm" },
    ],
  },
  {
    id: "a5",
    number: 5,
    kind: "single",
    prompt: "How many people touch it?",
    subject: "how many people touch it",
    options: [
      { id: "one", label: "One" },
      { id: "two-or-three", label: "Two or three" },
      { id: "four-to-ten", label: "Four to ten" },
      { id: "more-than-ten", label: "More than ten" },
      { id: "varies", label: "Varies week to week" },
    ],
  },
  {
    id: "a6",
    number: 6,
    kind: "single",
    prompt: "How long does one round take, start to finish?",
    subject: "how long one round takes",
    options: [
      { id: "under-15-min", label: "Under 15 min" },
      { id: "fifteen-to-sixty-min", label: "15–60 min" },
      { id: "one-to-four-hours", label: "1–4 hours" },
      { id: "half-day-plus", label: "Half a day or more" },
      { id: "mostly-waiting", label: "Mostly waiting, not working" },
      { id: "dont-know-duration", label: "Don't know" },
    ],
  },
  {
    id: "a7",
    number: 7,
    kind: "multi",
    maxSelected: 3,
    prompt: "How is it done today?",
    subject: "how it is done today",
    help: "Choose up to three. This is the strongest signal in the assessment.",
    options: [
      { id: "one-system", label: "Mostly inside one system" },
      { id: "spreadsheet-copy-paste", label: "Spreadsheet plus copy-paste" },
      { id: "email-threads", label: "Email threads" },
      { id: "paper-scans", label: "Paper and scanned PDFs" },
      { id: "retyping", label: "Retyping between systems" },
      { id: "person-decides", label: "A person deciding case by case" },
      { id: "script-macro", label: "A script or macro someone built" },
    ],
  },
  {
    id: "a8",
    number: 8,
    kind: "single",
    prompt: "When it goes wrong, what happens?",
    subject: "what happens when it goes wrong",
    options: [
      { id: "rarely", label: "Rarely" },
      { id: "caught-later", label: "Caught later and redone" },
      { id: "customer-notices", label: "A customer or supplier notices" },
      { id: "costs-money", label: "It costs money or a relationship" },
      { id: "dont-know-rework", label: "Don't know" },
    ],
  },
  {
    id: "a9",
    number: 9,
    kind: "single",
    prompt: "What would a good outcome look like?",
    subject: "the outcome you want",
    options: [
      { id: "fewer-steps", label: "Fewer manual steps" },
      { id: "faster-turnaround", label: "Faster turnaround" },
      { id: "fewer-errors", label: "Fewer errors" },
      { id: "better-visibility", label: "Better visibility" },
      { id: "capacity-without-hiring", label: "Capacity without hiring" },
      { id: "not-sure", label: "Not sure yet" },
    ],
    note: { label: "Anything else about the outcome (optional)", maxLength: 300 },
  },
];

/** Answers exactly as the visitor left them. Unanswered is `null` or empty — never a default. */
export type Answers = {
  /** Free text. Echoed once in the result, never scored, never transmitted. */
  a1: string;
  a2: string | null;
  a3: string[];
  a4: string | null;
  a5: string | null;
  a6: string | null;
  a7: string[];
  a8: string | null;
  a9: string | null;
  a9Note: string;
};

export const EMPTY_ANSWERS: Answers = {
  a1: "",
  a2: null,
  a3: [],
  a4: null,
  a5: null,
  a6: null,
  a7: [],
  a8: null,
  a9: null,
  a9Note: "",
};

export function questionById(id: QuestionId): Question {
  const question = QUESTIONS.find((candidate) => candidate.id === id);
  if (!question) throw new Error(`Unknown question ${id}`);
  return question;
}

/** All options of a question, flattened (A3 keeps its groups). */
export function allOptions(question: Question): Option[] {
  if (question.groups) return question.groups.flatMap((group) => group.options);
  return question.options ?? [];
}

/** The human label for a stored option id, or null when the id is not one we know. */
export function optionLabel(id: QuestionId, optionId: string | null): string | null {
  if (!optionId) return null;
  const option = allOptions(questionById(id)).find((candidate) => candidate.id === optionId);
  return option ? option.label : null;
}

/* ------------------------------------------------------------------ *
 * Weights (§4.3). Four dimensions, max 13 in total.
 * ------------------------------------------------------------------ */

const FREQUENCY_POINTS: Record<string, number> = {
  "several-times-a-day": 5,
  daily: 4,
  "few-times-a-week": 3,
  weekly: 2,
  monthly: 1,
  "no-rhythm": 0,
};

const DURATION_POINTS: Record<string, number> = {
  "half-day-plus": 5,
  "one-to-four-hours": 4,
  "fifteen-to-sixty-min": 3,
  "under-15-min": 1,
  "mostly-waiting": 2,
  "dont-know-duration": 0,
};

const PEOPLE_POINTS: Record<string, number> = {
  "more-than-ten": 3,
  "four-to-ten": 2,
  "two-or-three": 1,
  one: 0,
  varies: 1,
};

const REWORK_POINTS: Record<string, number> = {
  "costs-money": 3,
  "customer-notices": 2,
  "caught-later": 2,
  rarely: 0,
  "dont-know-rework": 0,
};

function pointsFor(table: Record<string, number>, optionId: string | null): number {
  if (!optionId) return 0;
  return table[optionId] ?? 0;
}

/**
 * The intensity score behind the band. Max 13: frequency (5) + duration (5) +
 * people (3) + rework (3). Unanswered dimensions contribute nothing, and the
 * result names every question that was left blank so the reader can see what the
 * missing points were.
 */
export function intensity(answers: Answers): number {
  return (
    pointsFor(FREQUENCY_POINTS, answers.a4) +
    pointsFor(DURATION_POINTS, answers.a6) +
    pointsFor(PEOPLE_POINTS, answers.a5) +
    pointsFor(REWORK_POINTS, answers.a8)
  );
}

/**
 * The A7 signal values from §4.3 (+2 for retyping between systems, +2 for
 * spreadsheet plus copy-paste, +1 for paper and scans).
 *
 * They are recorded but deliberately NOT added to `intensity`: §4.3 defines
 * intensity from the four dimensions above and caps it at 13, and A7 drives the
 * dependency decisions and rules R3, R6, R8 and R9 directly. Folding these points
 * in would move every band boundary the blueprint states.
 */
export function a7Signal(answers: Answers): number {
  let score = 0;
  if (answers.a7.includes("retyping")) score += 2;
  if (answers.a7.includes("spreadsheet-copy-paste")) score += 2;
  if (answers.a7.includes("paper-scans")) score += 1;
  return score;
}

export type Band = 1 | 2 | 3;

export function bandFor(score: number): Band {
  if (score >= 8) return 1;
  if (score >= 4) return 2;
  return 3;
}

/** The band headlines, verbatim from §4.3. */
export const BAND_HEADLINES: Record<Band, string> = {
  1: "Based on your answers, this looks worth a proper look.",
  2: "This could be worth automating, but the answers don't yet show enough volume to be sure.",
  3: "On your answers, this may not be worth automating yet — and that is a useful answer.",
};

/** §4.4, verbatim. Shown on the result and in its footer. */
export const NOT_LIST =
  "This is not a quote, not a price, not a timeline, and not a judgement about whether automation is possible in your systems. It cannot see your data, your volumes or your people. It reflects your nine answers and nothing else.";

/* ------------------------------------------------------------------ *
 * The result.
 * ------------------------------------------------------------------ */

export type Opportunity = {
  /** The rule that produced this line. Every line in the result carries one. */
  ruleId: string;
  name: string;
  purpose: string;
  /** Why it appears, naming the answers that caused it. */
  reason: string;
};

export type Note = { ruleId: string; text: string };
export type Dependency = { id: string; text: string };
export type DiscoveryItem = { id: string; question: string };
export type EchoLine = { label: string; value: string };

export type Summary = {
  rulesetVersion: string;
  /** A hash of the normalised answers: identical answers, identical hash. */
  answersHash: string;
  band: Band;
  headline: string;
  /** What the visitor told us, in three lines. */
  echo: EchoLine[];
  opportunities: Opportunity[];
  notes: Note[];
  dependencies: Dependency[];
  discovery: DiscoveryItem[];
  nextStep: { text: string; to: "/contact" | "/services" };
  notList: string;
  /** Questions left blank, so the result can say what it could not see. */
  missing: { id: QuestionId; label: string }[];
  answeredCount: number;
  signals: { a7: number; intensity: number };
};

type Context = {
  answers: Answers;
  intensity: number;
  band: Band;
  a3: string[];
  a7: string[];
};

function has(values: string[], id: string): boolean {
  return values.includes(id);
}

/** "You chose “Invoicing & collections” for which part of the business the work sits in." */
function chose(id: QuestionId, optionId: string): string {
  const label = optionLabel(id, optionId);
  if (!label) return "";
  return `You chose “${label}” for ${questionById(id).subject}.`;
}

function joinSentences(sentences: string[]): string {
  return sentences.filter(Boolean).join(" ");
}

type OpportunityRule = {
  id: string;
  kind: "opportunity";
  match: (context: Context) => boolean;
  make: (context: Context) => Omit<Opportunity, "ruleId">;
};

type NoteRule = {
  id: string;
  kind: "note";
  match: (context: Context) => boolean;
  make: (context: Context) => string;
};

/**
 * The eleven rules, in the order they are evaluated and displayed. R8, R9 and
 * R11 are notes rather than opportunities; R10 only applies when no opportunity
 * rule matched.
 */
const OPPORTUNITY_RULES: OpportunityRule[] = [
  {
    id: "R1",
    kind: "opportunity",
    match: (context) => context.answers.a2 === "invoicing-collections",
    make: () => ({
      name: "Collections follow-up",
      purpose:
        "A call list built from your aging report, with reminder drafts for someone to approve before anything is sent.",
      reason: chose("a2", "invoicing-collections"),
    }),
  },
  {
    id: "R2",
    kind: "opportunity",
    match: (context) =>
      context.answers.a2 === "reporting-month-end" || context.answers.a9 === "better-visibility",
    make: (context) => {
      const reasons: string[] = [];
      if (context.answers.a2 === "reporting-month-end") reasons.push(chose("a2", "reporting-month-end"));
      if (context.answers.a9 === "better-visibility") reasons.push(chose("a9", "better-visibility"));
      return {
        name: "Period reporting",
        purpose:
          "The same figures pulled from the same sources each period, assembled in one place instead of by hand.",
        reason: joinSentences(reasons),
      };
    },
  },
  {
    id: "R3",
    kind: "opportunity",
    match: (context) =>
      context.answers.a2 === "documents-records" ||
      has(context.a7, "email-threads") ||
      has(context.a7, "paper-scans"),
    make: (context) => {
      const reasons: string[] = [];
      if (context.answers.a2 === "documents-records") reasons.push(chose("a2", "documents-records"));
      if (has(context.a7, "email-threads")) reasons.push(chose("a7", "email-threads"));
      if (has(context.a7, "paper-scans")) reasons.push(chose("a7", "paper-scans"));
      return {
        name: "Document extraction",
        purpose:
          "The details read out of emails and documents and put where they are needed, with a person checking them.",
        reason: joinSentences(reasons),
      };
    },
  },
  {
    id: "R4",
    kind: "opportunity",
    match: (context) => context.answers.a2 === "sales-follow-up" || has(context.a3, "hubspot"),
    make: (context) => {
      const reasons: string[] = [];
      if (context.answers.a2 === "sales-follow-up") reasons.push(chose("a2", "sales-follow-up"));
      if (has(context.a3, "hubspot")) reasons.push(chose("a3", "hubspot"));
      return {
        name: "Customer follow-up",
        purpose:
          "A list of who is owed a reply or a follow-up, built from your customer records rather than from memory.",
        reason: joinSentences(reasons),
      };
    },
  },
  {
    id: "R5",
    kind: "opportunity",
    match: (context) =>
      context.answers.a2 === "inventory-purchasing" ||
      has(context.a3, "shopify") ||
      has(context.a3, "square-pos") ||
      has(context.a3, "erp"),
    make: (context) => {
      const reasons: string[] = [];
      if (context.answers.a2 === "inventory-purchasing") reasons.push(chose("a2", "inventory-purchasing"));
      for (const system of ["shopify", "square-pos", "erp"]) {
        if (has(context.a3, system)) reasons.push(chose("a3", system));
      }
      return {
        name: "Stock and order answers",
        purpose:
          "Stock questions answered from the sales and stock data you already hold, rather than by opening three systems.",
        reason: joinSentences(reasons),
      };
    },
  },
  {
    id: "R6",
    kind: "opportunity",
    match: (context) =>
      context.answers.a2 === "scheduling-admin" ||
      (has(context.a7, "email-threads") && context.intensity >= 6),
    make: (context) => {
      const reasons: string[] = [];
      if (context.answers.a2 === "scheduling-admin") reasons.push(chose("a2", "scheduling-admin"));
      if (has(context.a7, "email-threads") && context.intensity >= 6) {
        reasons.push(
          `${chose("a7", "email-threads")} The answers on frequency, duration, people and rework add up to enough volume for the reading and drafting to be worth taking on.`,
        );
      }
      return {
        name: "Inbox triage and drafting",
        purpose:
          "Mail sorted by what it is and how urgent it is, with replies drafted and left for someone to send.",
        reason: joinSentences(reasons),
      };
    },
  },
  {
    id: "R7",
    kind: "opportunity",
    match: (context) => context.answers.a2 === "supplier-invoices",
    make: () => ({
      name: "Supplier invoice intake, with a review queue",
      purpose:
        "Invoice details read from the documents, then queued so a person approves each one before it moves.",
      reason: chose("a2", "supplier-invoices"),
    }),
  },
];

const NOTE_RULES: NoteRule[] = [
  {
    id: "R8",
    kind: "note",
    match: (context) => has(context.a7, "script-macro"),
    make: () =>
      "A script or macro someone already built is an asset, not a problem. The first question is whether to extend it, not replace it.",
  },
  {
    id: "R9",
    kind: "note",
    match: (context) => has(context.a7, "person-decides"),
    make: () =>
      "Because a person decides case by case today, anything built here should land as a draft for someone to approve — never an automatic action.",
  },
];

/** R10: nothing matched, so the honest shape is a small custom build. */
const R10: OpportunityRule = {
  id: "R10",
  kind: "opportunity",
  match: (context) => OPPORTUNITY_RULES.every((rule) => !rule.match(context)),
  make: () => ({
    name: "A small custom build",
    purpose:
      "A small application built around this one process, rather than a product that has to be bent to fit it.",
    reason:
      "None of the areas the assessment can recognise matched your answers, so there is nothing narrower to point at than the process itself.",
  }),
};

/** R11: band 3. Not a failure state — "leave it alone" is a real answer. */
function r11Note(matchedSomething: boolean): Note {
  if (!matchedSomething) {
    return {
      ruleId: "R11",
      text: "No opportunity is indicated by these answers. Leaving this process alone may be the right call — and that is a useful answer, not a failure.",
    };
  }
  return {
    ruleId: "R11",
    text: "None of this is indicated yet: at this volume, automation would probably cost more than it saves. What is listed above is what to come back to if the volume changes.",
  };
}

/* ------------------------------------------------------------------ *
 * Dependencies (§4.3). Only from the systems the visitor named.
 * ------------------------------------------------------------------ */

const ACCOUNTING = ["quickbooks", "xero", "sage", "desktop-software"];
const VENDOR_REVIEW = ["quickbooks", "xero", "sage", "microsoft-365", "google-workspace", "hubspot", "shopify", "square-pos", "erp"];

export function dependencies(answers: Answers): Dependency[] {
  const systems = answers.a3;
  const list: Dependency[] = [];

  if (ACCOUNTING.some((system) => has(systems, system))) {
    list.push({
      id: "accounting",
      text: "Accounting: read access to the ledger, plus the vendor's developer-app review, confirmed per account.",
    });
  }
  if (has(systems, "spreadsheets-only")) {
    list.push({
      id: "spreadsheets-only",
      text: "Spreadsheets only: there may be nothing to connect to yet — usually a smaller build.",
    });
  }
  if (has(systems, "microsoft-365") || has(systems, "google-workspace")) {
    list.push({
      id: "email",
      text: "Email: mailbox or file access under your own tenant, at the narrowest scope that covers this.",
    });
  }
  if (has(systems, "hubspot") || has(systems, "another-crm")) {
    list.push({
      id: "crm",
      text: "Customer records: API access, and a decision about which system is the record of truth.",
    });
  }
  if (has(systems, "shopify") || has(systems, "square-pos") || has(systems, "erp")) {
    list.push({
      id: "sales-stock",
      text: "Sales and stock: access, and whether the system exposes the fields this needs — unknown until it is checked.",
    });
  }
  if (has(systems, "sharepoint-drive")) {
    list.push({
      id: "documents",
      text: "Documents: a capture step and a landing place for what gets extracted.",
    });
  }
  if (has(systems, "paper-scans") || has(answers.a7, "paper-scans")) {
    list.push({
      id: "paper",
      text: "Paper and scans: something has to capture them, and there has to be a landing place for the result.",
    });
  }

  // Two vendors named in the same flow is itself a decision to make.
  const vendorGroups = [
    ACCOUNTING.some((system) => has(systems, system)),
    has(systems, "microsoft-365") || has(systems, "google-workspace"),
    has(systems, "hubspot") || has(systems, "another-crm"),
    has(systems, "shopify") || has(systems, "square-pos") || has(systems, "erp"),
    has(systems, "sharepoint-drive"),
  ].filter(Boolean).length;
  if (vendorGroups >= 2) {
    list.push({
      id: "two-vendors",
      text: "Two or more systems: an integration, and a decision about which one wins when they disagree.",
    });
  }

  // Nothing named means nothing to connect to — and that is itself the answer.
  if (list.length === 0) {
    list.push({
      id: "no-systems",
      text: "No system was named for this work, so the first dependency is finding out what it actually runs through.",
    });
  }

  // Always true, whoever answers what.
  const approver: Dependency = {
    id: "approver",
    text: "A named person who approves anything that leaves the business.",
  };

  // §4.4 asks for 2–5. When more than five apply, the specific ones come first
  // and the approver line always survives.
  if (list.length > 4) return [...list.slice(0, 4), approver];
  return [...list, approver];
}

/* ------------------------------------------------------------------ *
 * What discovery would have to confirm (§4.3, "Unknowns").
 * ------------------------------------------------------------------ */

export function discoveryQuestions(answers: Answers): DiscoveryItem[] {
  const list: DiscoveryItem[] = [];

  if (!answers.a6 || answers.a6 === "dont-know-duration") {
    list.push({
      id: "time",
      question: "How long does one round of this actually take, start to finish?",
    });
  }
  list.push({
    id: "volume",
    question: "What volume does it run at — how many cases in a typical week or month?",
  });
  list.push({
    id: "ownership",
    question: "Who owns each system involved, and can they grant access?",
  });
  list.push({
    id: "api",
    question: "Which edition and API level is each system on, and what can it actually expose?",
  });
  if (VENDOR_REVIEW.some((system) => has(answers.a3, system))) {
    list.push({
      id: "app-review",
      question: "Does the vendor's app review apply to a business of one, or only to published apps?",
    });
  }
  list.push({
    id: "correct",
    question: "What does “correct” look like for this process, and who decides when it is not?",
  });
  list.push({
    id: "maintenance",
    question: "Who maintains this after handover, and what happens when that person is away?",
  });

  return list;
}

/* ------------------------------------------------------------------ *
 * Determinism: a hash of the normalised answers.
 * ------------------------------------------------------------------ */

/** A canonical string: fixed question order, sorted multi-selects, trimmed text. */
export function normaliseAnswers(answers: Answers): string {
  return JSON.stringify([
    ["a1", answers.a1.trim()],
    ["a2", answers.a2 ?? ""],
    ["a3", [...answers.a3].sort()],
    ["a4", answers.a4 ?? ""],
    ["a5", answers.a5 ?? ""],
    ["a6", answers.a6 ?? ""],
    ["a7", [...answers.a7].sort()],
    ["a8", answers.a8 ?? ""],
    ["a9", answers.a9 ?? ""],
    ["a9Note", answers.a9Note.trim()],
  ]);
}

/**
 * FNV-1a, 32 bits, over the canonical string. Small and dependency-free so the
 * same hash is produced in the browser, in Node and in a test.
 */
export function hashAnswers(answers: Answers): string {
  const input = normaliseAnswers(answers);
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/* ------------------------------------------------------------------ *
 * Assembly.
 * ------------------------------------------------------------------ */

function isAnswered(question: Question, answers: Answers): boolean {
  switch (question.id) {
    case "a1":
      return answers.a1.trim().length > 0;
    case "a3":
      return answers.a3.length > 0;
    case "a7":
      return answers.a7.length > 0;
    default: {
      const value = answers[question.id];
      return typeof value === "string" && value.length > 0;
    }
  }
}

const MISSING_LABELS: Record<QuestionId, string> = {
  a1: "the task in your own words",
  a2: "which part of the business it sits in",
  a3: "the systems it passes through",
  a4: "how often it happens",
  a5: "how many people touch it",
  a6: "how long one round takes",
  a7: "how it is done today",
  a8: "what happens when it goes wrong",
  a9: "the outcome you want",
};

const NEXT_STEP: Record<Band, { text: string; to: "/contact" | "/services" }> = {
  1: { text: "Book a consultation and bring the process with you.", to: "/contact" },
  2: { text: "Come back with the volume figures, or book a conversation.", to: "/contact" },
  3: { text: "Nothing to do — if the volume changes, come back.", to: "/services" },
};

/**
 * Turn a set of answers into the result. Pure: same answers in, same object out,
 * every time, on every device. Nothing here reads a clock, a random source or
 * the network.
 */
export function summarise(answers: Answers): Summary {
  const score = intensity(answers);
  const band = bandFor(score);
  const context: Context = { answers, intensity: score, band, a3: answers.a3, a7: answers.a7 };

  const matched = OPPORTUNITY_RULES.filter((rule) => rule.match(context)).map((rule) => ({
    ruleId: rule.id,
    ...rule.make(context),
  }));
  const opportunities = matched.length > 0 ? matched : [{ ruleId: R10.id, ...R10.make(context) }];

  const notes: Note[] = NOTE_RULES.filter((rule) => rule.match(context)).map((rule) => ({
    ruleId: rule.id,
    text: rule.make(context),
  }));
  if (band === 3) notes.push(r11Note(matched.length > 0));

  const missing = QUESTIONS.filter((question) => !isAnswered(question, answers)).map((question) => ({
    id: question.id,
    label: MISSING_LABELS[question.id],
  }));

  const echo: EchoLine[] = [
    {
      label: "The task, in your words",
      value: answers.a1.trim() || "Not described.",
    },
    {
      label: "Part of the business",
      value: optionLabel("a2", answers.a2) ?? "Not answered.",
    },
    {
      label: "How often it happens",
      value: optionLabel("a4", answers.a4) ?? "Not answered.",
    },
  ];

  return {
    rulesetVersion: RULESET_VERSION,
    answersHash: hashAnswers(answers),
    band,
    headline: BAND_HEADLINES[band],
    echo,
    opportunities,
    notes,
    dependencies: dependencies(answers),
    discovery: discoveryQuestions(answers),
    nextStep: NEXT_STEP[band],
    notList: NOT_LIST,
    missing,
    answeredCount: QUESTION_COUNT - missing.length,
    signals: { a7: a7Signal(answers), intensity: score },
  };
}

/**
 * The sentence that tells the reader how thin the reading is. Derived from the
 * answers, so it cannot drift from what was actually filled in.
 */
export function missingSummary(summary: Summary): string | null {
  const { missing, answeredCount } = summary;
  if (missing.length === 0) return null;
  if (answeredCount === 0) {
    return "You answered none of the nine questions, so this is not a reading at all — it is the shape of the result with nothing behind it.";
  }
  if (missing.length === 1) {
    return `One question was left blank — ${missing[0].label} — so the reading below is based on eight answers.`;
  }
  return `${missing.length} questions were left blank, so the reading below is based on ${answeredCount} of nine answers.`;
}
