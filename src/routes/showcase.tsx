import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";
import { StageBadge } from "~/components/stage-badge";
import { SyntheticDataNotice } from "~/components/synthetic-data-notice";
import { FEATURED_PRODUCT, PRODUCTS } from "~/lib/products";
import { STAGES, STAGE_INFO } from "~/lib/stages";

const TITLE = "Solutions Showcase — Spearpoint Automation";
const DESCRIPTION =
  "Six products we have designed and are building: one working prototype and five concepts. Every card carries an honest stage label. None has been used by a client, and we don't imply otherwise.";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ShowcasePage,
});

const OTHER_PRODUCTS = PRODUCTS.filter((product) => product.slug !== FEATURED_PRODUCT.slug);

function ShowcasePage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Six products, and an honest label on each one."
        lead="These are products we have designed and are building. One has a working demonstration today. None has been used by a client, and we won't imply otherwise."
      />

      <Section tone="ivory-100">
        <h2 className="type-eyebrow text-ink-muted">What the labels mean</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage) => (
            <div key={stage} className="border-t border-line pt-4">
              <dt>
                <StageBadge stage={stage} />
              </dt>
              <dd className="type-small mt-3 text-ink-muted">{STAGE_INFO[stage].definition}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <FeaturedProductCard />

        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {OTHER_PRODUCTS.map((product) => (
            <li key={product.slug}>
              <Card className="flex h-full flex-col">
                <h3 className="type-h3">{product.name}</h3>
                <div className="mt-3">
                  <StageBadge stage={product.stage} />
                </div>
                <p className="type-body mt-4 text-ink-muted">{product.problem}</p>
                <p className="type-small mt-4">
                  <span className="type-eyebrow text-ink-muted">Connects to </span>
                  {product.connectsTo.join(", ")}
                </p>
                <div className="mt-auto pt-6">
                  <Link
                    to="/contact"
                    search={{ topic: product.slug }}
                    className="text-link type-small"
                  >
                    Talk to us about this product
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <SyntheticDataNotice className="mt-8" />

        <div className="mt-8 rounded-card bg-ivory-100 p-5">
          <h2 className="type-h3">The standing note on all of this</h2>
          <p className="type-body measure mt-3">
            Stage labels describe the build, not a client outcome. Nothing here has been run in a
            client&apos;s business. If a label says Prototype, that is exactly what it means: built,
            labelled, tested on synthetic data, and not yet used for anyone.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="type-lead measure">
            If one of these is close to a problem you have, tell us — the honest answer may be
            that you need a quarter of it.
          </p>
          <Button to="/contact" className="w-full shrink-0 sm:w-auto">
            Book a consultation
          </Button>
        </div>
      </Section>
    </>
  );
}

/**
 * The featured card for the product with a demonstration (blueprint §5).
 *
 * The demonstration is a separate build. Until `/showcase/ar-collections` exists
 * this card is deliberately not a link — a dead link would be worse than an
 * honest "not yet".
 */
function FeaturedProductCard() {
  const product = FEATURED_PRODUCT;

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid lg:grid-cols-12">
        <div className="p-6 lg:col-span-7 lg:p-8">
          <StageBadge stage={product.stage} />
          <h2 className="type-h2 mt-4">{product.name}</h2>
          <p className="type-lead mt-4">{product.problem}</p>
          <p className="type-small mt-6 text-ink-muted">
            Connects to: {product.connectsTo.join(", ")}
          </p>
        </div>

        <div className="border-t border-line bg-ivory-100 p-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-8">
          <p className="type-eyebrow text-ink-muted">Demonstration</p>
          <p className="type-body mt-3">
            The working demonstration is being built. It is not open yet, so this card does not
            link anywhere — there is no page to send you to.
          </p>
          <p className="type-small mt-4 text-ink-muted">
            When it is finished it will run in your browser on synthetic data, and it will only be
            labelled Demo Ready once its own totals reconcile.
          </p>
          <p className="mt-6">
            <span className="type-eyebrow inline-flex items-center gap-2 rounded-full border border-dashed border-ink-muted/60 px-3 py-1.5 text-ink-muted">
              Demonstration coming
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
