import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "~/components/button";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";
import { BOOKING_EMBED_URL, BOOKING_URL } from "~/lib/booking";

const TITLE = "Book a conversation — Spearpoint Automation";
const DESCRIPTION =
  "Book a 30-minute conversation about one manual process in your business — what it takes now, where it slows down, and whether it is worth changing. No obligation, no preparation.";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: BookPage,
});

/**
 * How long the calendar is given to appear before the page says it could not be
 * shown. The page text and the button underneath never depend on this: they are
 * rendered whether the calendar loads or not.
 */
const LOAD_TIMEOUT_MS = 12000;

function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book a conversation"
        title="Pick a time to talk about one process."
        lead="Thirty minutes about a single piece of manual work — the invoices chased every Monday, the figures typed into two systems, the inbox someone reads by hand. What it takes now, where it slows down, and whether it is worth changing. No obligation, no pitch deck, and nothing to prepare."
      />

      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <BookingCalendar />

            {/* Always shown, not only when the frame reports a failure: a
                cross-origin frame can load a page that is itself an error, and
                this page has no way to see inside it. The line explains the
                card either way, and never claims a calendar is on screen. */}
            <p className="type-small measure mt-4 text-ink-muted">
              The calendar is provided by Microsoft Bookings. If it does not load for you, the
              button below opens the same page in a new tab.
            </p>

            <div className="mt-4">
              <Button variant="secondary" href={BOOKING_URL} newTab className="w-full sm:w-auto">
                Open the booking page in a new tab
              </Button>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-card bg-ivory-100 p-5">
              <h2 className="type-h3">Rather write it down?</h2>
              <p className="type-small mt-2 text-ink-muted">
                The contact form takes a written description instead. The more detail you give
                about the process, the more useful the first reply is.
              </p>
              <p className="mt-3">
                <Link to="/contact" className="text-link type-small">
                  Write to us instead
                </Link>
              </p>
            </div>

            <div className="mt-6 rounded-card border border-line bg-white p-5">
              <h2 className="type-h3">What happens after</h2>
              <ul className="mt-3 flex flex-col gap-3">
                <li className="type-small text-ink-muted">
                  A straight answer about whether the process is worth changing, and what it would
                  depend on.
                </li>
                <li className="type-small text-ink-muted">
                  If it is worth doing, the next step is discovery — scoped and priced in writing
                  before anything is built.
                </li>
                <li className="type-small text-ink-muted">
                  If it is not, we say so and you have lost half an hour.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

/**
 * The Microsoft Bookings calendar, in a card.
 *
 * An embedded calendar is the least reliable thing on a website: the host can
 * block the frame, the network can drop it, or the page can simply be slow. So
 * this is built so that failure is visible rather than silent:
 *
 *  - "loading" until the frame reports it has loaded;
 *  - "ready" once it has;
 *  - "unavailable" if the frame fires an error or has not loaded within
 *    LOAD_TIMEOUT_MS, in which case a plain sentence replaces it and the button
 *    underneath opens the same booking page in a new tab.
 *
 * The frame stays mounted while unavailable (just hidden), so a calendar that
 * arrives late still appears instead of being thrown away.
 */
function BookingCalendar() {
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "unavailable" : current));
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const unavailable = status === "unavailable";

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="type-small font-medium">Spearpoint Automation booking calendar</span>
        <span className="type-eyebrow text-ink-muted">Microsoft Bookings</span>
      </div>

      <div className="p-2 sm:p-3">
        {unavailable ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-card bg-ivory-100 px-6 py-12 text-center">
            <p className="type-body">The calendar could not be shown on this page.</p>
            <p className="type-small text-ink-muted">
              Nothing is broken on your side — the button below opens the booking page in a new
              tab.
            </p>
          </div>
        ) : null}

        <iframe
          title="Spearpoint Automation booking calendar (Microsoft Bookings)"
          src={BOOKING_EMBED_URL}
          loading="lazy"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("unavailable")}
          className={`h-[640px] w-full rounded-card border-0 sm:h-[780px] ${
            unavailable ? "hidden" : "block"
          }`}
        />

        {status === "loading" ? (
          <p className="type-small px-1 pt-2 text-ink-muted" role="status">
            Loading the calendar…
          </p>
        ) : null}
      </div>
    </div>
  );
}
