import type { Stage } from "~/lib/stages";

/**
 * The six products (blueprint §5).
 *
 * This is the ONLY place a product name, stage, problem statement or connection
 * is written. The Showcase page, the Home page proof card and (later) the demo
 * banner all read from here, so a stage can only be raised in one file, on
 * purpose, with the evidence to back it.
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
   * The working demonstration's route, once it exists. `null` means the card is
   * rendered as a "demonstration coming" state instead of a link that would 404.
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
    // The demonstration is a separate build. Until it ships, this stays null and
    // the Showcase card says so instead of linking to a page that does not exist.
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
