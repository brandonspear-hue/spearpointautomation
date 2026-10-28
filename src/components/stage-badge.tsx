import { STAGE_INFO, type Stage } from "~/lib/stages";

/**
 * Stage badge (blueprint §5).
 *
 * Text plus shape — never colour alone: Concept and Prototype are outlined,
 * Prototype carries a dot, Demo Ready is filled blue, Implementation Ready is
 * filled navy. The definition is available as a tooltip and mirrored in the
 * stage legend on the Showcase page.
 */
const STYLE: Record<Stage, string> = {
  concept: "border border-navy-900/35 text-navy-900",
  prototype: "border border-navy-900/35 text-navy-900",
  "demo-ready": "bg-blue-600 text-white",
  "implementation-ready": "bg-navy-900 text-white",
  "client-validated": "bg-navy-900 text-white",
};

export function StageBadge({ stage, className = "" }: { stage: Stage; className?: string }) {
  const info = STAGE_INFO[stage];
  const showsDot = stage === "prototype" || stage === "concept";

  return (
    <span
      title={info.definition}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 type-eyebrow ${STYLE[stage]} ${className}`}
    >
      <span className="sr-only">Stage: </span>
      {showsDot ? (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${stage === "prototype" ? "bg-navy-900" : "bg-navy-900/40"}`}
        />
      ) : null}
      {info.label}
    </span>
  );
}
