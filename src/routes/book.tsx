import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
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
 * How long the calendar is given to appear once the visitor has asked for it,
 * before the card says it could not be shown. The new-tab button never depends
 * on this: it is rendered whether the calendar loads or not.
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
            <BookingCard />
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
 * The booking card.
 *
 * The calendar is not loaded when the page opens. It lives on Microsoft's
 * servers, so this page cannot see whether it is working, slow, or showing its
 * own error — and a frame that has "loaded" an error page still counts as
 * loaded, so no fallback here could catch that. A tall grey rectangle as the
 * first thing on the page reads as broken, and the visitor has no way to know
 * otherwise.
 *
 * So the card opens with two calm choices instead:
 *
 *  1. "Open the booking calendar" — a plain link to the booking page in a new
 *     tab. This is the path that always works, so it is the primary control.
 *  2. "Show the calendar on this page" — a button that swaps the frame in for
 *     visitors who would rather not leave the site.
 *
 * Once shown, the frame behaves as it always did: "loading" until it reports
 * it has loaded, "unavailable" if it errors or does not load within
 * LOAD_TIMEOUT_MS (with the new-tab button above as the way through), and a
 * "Hide the calendar" control that puts the card back how it started.
 *
 * The choice lasts for this page view only — nothing is stored, no cookie is
 * set, and a reload returns to the two choices.
 */
function BookingCard() {
  const [showing, setShowing] = useState(false);
  /** Read out by a polite live region so the change is not silent. */
  const [announcement, setAnnouncement] = useState("");
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const showButtonRef = useRef<HTMLButtonElement | null>(null);
  /** Only move focus once the visitor has actually made a choice. */
  const hasChosen = useRef(false);

  useEffect(() => {
    if (!hasChosen.current) return;
    if (showing) frameRef.current?.focus();
    else showButtonRef.current?.focus();
  }, [showing]);

  function showCalendar() {
    hasChosen.current = true;
    setShowing(true);
    setAnnouncement("The booking calendar is now shown on this page.");
  }

  function hideCalendar() {
    hasChosen.current = true;
    setShowing(false);
    setAnnouncement("The booking calendar has been hidden.");
  }

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="type-small font-medium">Spearpoint Automation booking calendar</span>
        <span className="type-eyebrow text-ink-muted">Microsoft Bookings</span>
      </div>

      <div className="p-4 sm:p-5">
        <p className="type-small measure text-ink-muted">
          The calendar is provided by Microsoft Bookings, the scheduling service we use. Opening it
          in a new tab is the reliable way to see which times are free.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href={BOOKING_URL} newTab className="w-full sm:w-auto">
            Open the booking calendar
          </Button>
          {showing ? null : (
            <Button
              variant="secondary"
              buttonRef={showButtonRef}
              onClick={showCalendar}
              className="w-full sm:w-auto"
            >
              Show the calendar on this page
            </Button>
          )}
        </div>

        {showing ? (
          <div className="mt-4">
            <CalendarFrame frameRef={frameRef} />

            <p className="type-small measure mt-3 text-ink-muted">
              If the calendar does not appear, the button above opens the same page in a new tab.
            </p>

            <Button variant="quiet" onClick={hideCalendar} className="mt-1">
              Hide the calendar
            </Button>
          </div>
        ) : null}

        {/* Polite live region: the change is announced, and it stays out of the
            way of sighted visitors. It starts empty so nothing is read on load. */}
        <p className="sr-only" role="status">
          {announcement}
        </p>
      </div>
    </div>
  );
}

/**
 * The Microsoft Bookings calendar itself, mounted only after the visitor asks
 * for it. Because it mounts on demand, the load timeout starts when the frame
 * appears, and hiding then showing again starts from a clean state.
 *
 * The frame stays mounted while unavailable (just hidden), so a calendar that
 * arrives late still appears instead of being thrown away.
 */
function CalendarFrame({ frameRef }: { frameRef: RefObject<HTMLIFrameElement | null> }) {
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "unavailable" : current));
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const unavailable = status === "unavailable";

  return (
    <div className="p-2 sm:p-3">
      {unavailable ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-card bg-ivory-100 px-6 py-12 text-center">
          <p className="type-body">The calendar could not be shown on this page.</p>
          <p className="type-small text-ink-muted">
            Nothing is broken on your side — the button above opens the booking page in a new tab.
          </p>
        </div>
      ) : null}

      <iframe
        ref={frameRef}
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
  );
}
