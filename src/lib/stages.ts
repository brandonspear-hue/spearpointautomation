/**
 * Product stages (blueprint §5).
 *
 * A stage describes how far a build has got — never a client outcome. The last
 * value, "client-validated", is unreachable until a real client has used the
 * product and agreed it works. No product record may hold it today, and no badge
 * may be upgraded because a page looks thin.
 */
export const STAGES = [
  "concept",
  "prototype",
  "demo-ready",
  "implementation-ready",
  "client-validated",
] as const;

export type Stage = (typeof STAGES)[number];

/** Human label and one-line definition shown in the badge tooltip and legend. */
export const STAGE_INFO: Record<Stage, { label: string; definition: string }> = {
  concept: {
    label: "Concept",
    definition: "Designed and specified. There is no working build yet.",
  },
  prototype: {
    label: "Prototype",
    definition:
      "A working build being tested on synthetic data. It has not been used in a client's business.",
  },
  "demo-ready": {
    label: "Demo Ready",
    definition:
      "A demonstration that has passed its own reconciliation tests. Still no client use.",
  },
  "implementation-ready": {
    label: "Implementation Ready",
    definition:
      "Documented and prepared for a real delivery. No client has validated it yet.",
  },
  "client-validated": {
    label: "Client Validated",
    definition:
      "A real client has used it in their business and agreed it works. Nothing on this site has reached this stage.",
  },
};
