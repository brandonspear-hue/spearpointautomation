import { createFileRoute } from "@tanstack/react-router";
import { PendingDetail } from "~/components/pending-detail";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";
import { site } from "~/lib/site";

const TITLE = "Privacy — Spearpoint Automation";
const DESCRIPTION =
  "What this site does with your information: no cookies, no analytics and no tracking, and nothing you type here is stored or sent unless you choose to send it yourself.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PrivacyPage,
});

/**
 * Privacy note.
 *
 * Every paragraph here describes something the code actually does — the session
 * storage key the router writes, the mailto handoff on the contact form, the
 * assessment's client-side scoring, the Microsoft Bookings frame on /book, and
 * the Google Fonts stylesheet in the root head. If one of those changes, this
 * page has to change with it.
 */
const SECTIONS = [
  {
    heading: "This website",
    body: "There are no cookies and no analytics or advertising scripts on this site. One thing is kept in your browser's session storage: the scroll position, so the back button returns you where you were. It disappears when you close the tab. The server that delivers these pages keeps ordinary request logs, as any web server does.",
  },
  {
    heading: "The enquiry form",
    body: "The form on the contact page does not send anything by itself. It composes a message and opens your own email application; nothing reaches Spearpoint until you press send there. If you do send it, the message arrives in Spearpoint's mailbox, is used to answer you, is not sold or shared, and is kept only as long as it takes to deal with the enquiry.",
  },
  {
    heading: "The automation assessment",
    body: "All nine questions are worked out in your own browser. Your answers are never transmitted, never stored on a server, and are not linked to you in any way. Close the tab and they are gone.",
  },
  {
    heading: "Booking a call",
    body: "The booking calendar is provided by Microsoft Bookings. Choosing to open it takes you off this site to Microsoft, and Microsoft's own privacy terms apply from that point on.",
  },
  {
    heading: "Typefaces",
    body: "Pages load a typeface from Google Fonts. That means Google's servers see your IP address as they deliver it. Nothing else on the site contacts a third party.",
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What this site does with your information."
        lead="Short version: no cookies, no analytics, no tracking. Nothing you type here is stored or sent anywhere unless you choose to send it yourself."
      />

      <Section className="pt-0">
        <div className="flex max-w-3xl flex-col gap-12">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="type-h2">{section.heading}</h2>
              <p className="type-body measure mt-4">{section.body}</p>
            </section>
          ))}

          <section>
            <h2 className="type-h2">Questions</h2>
            <p className="type-body measure mt-4">
              Write to{" "}
              {site.contactEmail ? (
                <a href={`mailto:${site.contactEmail}`} className="text-link">
                  {site.contactEmail}
                </a>
              ) : (
                <PendingDetail>public email address</PendingDetail>
              )}
              .
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
