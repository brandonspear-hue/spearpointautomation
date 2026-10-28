/**
 * The synthetic-data notice (blueprint §5).
 *
 * One fixed string, rendered from this component and never retyped, so the claim
 * cannot drift between pages. The banner is not dismissible.
 */
export const SYNTHETIC_DATA_NOTICE =
  "Synthetic data. Every customer, invoice and figure in this demonstration is invented. Nothing here is a client's.";

export function SyntheticDataNotice({
  variant = "inline",
  className = "",
}: {
  variant?: "inline" | "banner" | "footer";
  className?: string;
}) {
  if (variant === "banner") {
    return (
      <div className={`border-y border-line bg-blue-100 py-3 text-navy-900 ${className}`}>
        <p className="mx-auto max-w-page px-5 sm:px-8 lg:px-12 type-small">{SYNTHETIC_DATA_NOTICE}</p>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`bg-navy-800 py-3 text-white on-navy ${className}`}>
        <p className="mx-auto max-w-wide px-5 sm:px-8 lg:px-12 type-small">{SYNTHETIC_DATA_NOTICE}</p>
      </div>
    );
  }

  return (
    <p
      className={`rounded-card border border-line bg-white px-5 py-4 type-small text-navy-900 ${className}`}
    >
      {SYNTHETIC_DATA_NOTICE}
    </p>
  );
}
