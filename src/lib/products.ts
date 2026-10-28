import type { Stage } from "~/lib/stages";

/**
 * The six products (blueprint §5).
 *
 * This is the business's own record of what it has designed and is building —
 * an internal library, not a public catalogue. The site no longer lists these
 * as products: the Examples page describes the kinds of work we build for, and
 * shows the one example that has a build behind it (AR Collections Manager).
 *
 * This remains the ONLY place a product name, stage, problem statement or
 * connection is written. Anything that shows a product on the site reads from
 * here, so a stage can only be raised in one file, on purpose, with the
 * evidence to back it.
 */
export type Product = {
  /** URL-safe id, also used for the `?topic=` handoff to the Contact page. */
  slug: string;
  name: string;
  stage: Stage;
  problem: string;
  /** Systems this product connects to. Plain text — never vendor logos (§2.6). */
  connectsTo: string[];
  /**
   * The working demonstration's route, once an interactive one exists. `null`
   * means the example's page renders a "demonstration being built" state
   * instead of a link that would 404. The example's own page lives at
   * `/examples/ar-collections`; this field is for embedding the real thing.
   */
  demoPath: string | null;
  /** One line on what the build is designed to do. Used on the Home proof card. */
  capabilities: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "ar-collections",
    name: "AR Collections Manager",
    stage: "prototype",
    problem:
      "The aging report tells you who is late; someone still has to decide who to chase and write the emails.",
    connectsTo: [
      "QuickBooks Online",
      "Xero",
      "Microsoft 365 / Google Workspace",
      "Stripe (read-only status)",
    ],
    // The interactive demonstration is a separate build. Until it ships, this
    // stays null and the example's page says so instead of offering a link that
    // would lead to nothing.
    demoPath: null,
    capabilities: [
      "A priority queue built from the aging report",
      "Reminder drafts for a person to approve",
      "Every figure computed from the invoice, not written by a model",
      "An activity log of what was approved and when",
    ],
  },
  {
    slug: "financial-reporting",
    name: "Financial Reporting Assistant",
    stage: "concept",
    problem:
      "The same figures get pulled from the same places into the same report, every month, by hand.",
    connectsTo: ["QuickBooks Online", "Xero", "Excel", "SharePoint"],
    demoPath: null,
    capabilities: [],
  },
  {
    slug: "inbox-assistant",
    name: "Inbox Assistant",
    stage: "concept",
    problem:
      "A shared inbox needs reading, sorting and answering before anyone can do the work it contains.",
    connectsTo: ["Microsoft 365 / Google Workspace", "HubSpot"],
    demoPath: null,
    capabilities: [],
  },
  {
    slug: "inventory-assistant",
    name: "Inventory Assistant",
    stage: "concept",
    problem:
      "Nobody can answer 'do we have it, should we reorder it?' without opening three systems.",
    connectsTo: ["Shopify", "Square", "ERP", "spreadsheets"],
    demoPath: null,
    capabilities: [],
  },
  {
    slug: "customer-follow-up",
    name: "Customer Follow-Up Assistant",
    stage: "concept",
    problem:
      "Quotes and enquiries go quiet because no one has a list of who is owed a follow-up.",
    connectsTo: ["HubSpot", "Microsoft 365", "accounting"],
    demoPath: null,
    capabilities: [],
  },
  {
    slug: "document-processor",
    name: "Document Processor",
    stage: "concept",
    problem:
      "Invoice, PO and contract details get retyped from a PDF one document at a time.",
    connectsTo: ["SharePoint / Drive", "accounting", "email"],
    demoPath: null,
    capabilities: [],
  },
];

/** The product with a working demonstration, used on the Home page proof card. */
export const FEATURED_PRODUCT = PRODUCTS[0];

/** Look a product up by its `?topic=` slug. Returns undefined for unknown topics. */
export function findProductBySlug(slug: string | undefined): Product | undefined {
  if (!slug) return undefined;
  return PRODUCTS.find((product) => product.slug === slug);
}
