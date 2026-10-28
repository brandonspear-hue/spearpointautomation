import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { PendingDetail } from "~/components/pending-detail";
import { PageHeader } from "~/components/page-header";
import { Section } from "~/components/section";
import {
  buildMailto,
  composeEnquiryMessage,
  MAILTO_LENGTH_LIMIT,
  type ComposedMessage,
  type EnquiryValues,
} from "~/lib/contact-message";
import { findProductBySlug } from "~/lib/products";
import { site } from "~/lib/site";

const TITLE = "Contact — Spearpoint Automation";
const DESCRIPTION =
  "Tell us what's slowing your business down. A short description is enough to start. This form composes an email in your own mail application — nothing is sent from this website.";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { topic?: string } => ({
    topic: typeof search.topic === "string" ? search.topic : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ContactPage,
});

const SOFTWARE_OPTIONS = [
  "QuickBooks",
  "Xero",
  "Microsoft 365",
  "Google Workspace",
  "HubSpot",
  "Shopify",
  "Square / POS",
  "Spreadsheets",
];

type FieldName =
  | "name"
  | "business"
  | "email"
  | "software"
  | "challenges"
  | "outcomes"
  | "consent";

const FIELD_LABELS: Record<FieldName, string> = {
  name: "Your name",
  business: "Business name",
  email: "Email",
  software: "Current software",
  challenges: "Operational challenges",
  outcomes: "Desired outcomes",
  consent: "Consent",
};

type Errors = Partial<Record<FieldName, string>>;

/** Validation rules from blueprint §3.6. Pure, so the same rules can be tested. */
function validate(values: EnquiryValues & { consent: boolean }): Errors {
  const errors: Errors = {};

  const name = values.name.trim();
  if (name.length === 0) errors.name = "Enter your name.";
  else if (name.length < 2 || name.length > 100)
    errors.name = "Your name should be between 2 and 100 characters.";

  const business = values.business.trim();
  if (business.length === 0) errors.business = "Enter your business name.";
  else if (business.length < 2 || business.length > 120)
    errors.business = "The business name should be between 2 and 120 characters.";

  const email = values.email.trim();
  const parts = email.split("@");
  const emailShape = /^[^\s@]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
  if (email.length === 0) errors.email = "Enter an email address we can reply to.";
  else if (email.length > 254 || parts.length !== 2 || !emailShape.test(email))
    errors.email = "That doesn't look like an email address — check it and try again.";

  const challenges = values.challenges.trim();
  if (challenges.length === 0) errors.challenges = "Tell us what is slowing you down.";
  else if (challenges.length < 20)
    errors.challenges = "A sentence or two is enough — at least 20 characters.";
  else if (challenges.length > 2000)
    errors.challenges = "Please keep this to 2,000 characters or fewer.";

  if (values.outcomes.trim().length > 1000)
    errors.outcomes = "Please keep this to 1,000 characters or fewer.";

  if (values.softwareOther.length > 200)
    errors.software = "Please keep this to 200 characters or fewer.";

  if (!values.consent)
    errors.consent = "Please tick the box so we know you're happy for us to reply.";

  return errors;
}

const EMPTY_VALUES: EnquiryValues & { consent: boolean; honeypot: string } = {
  name: "",
  business: "",
  email: "",
  software: [],
  softwareOther: "",
  challenges: "",
  outcomes: "",
  consent: false,
  honeypot: "",
};

type Status = "idle" | "not-configured" | "handed-off" | "too-long" | "blocked";

function ContactPage() {
  const { topic } = Route.useSearch();
  const product = findProductBySlug(topic);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what's slowing you down."
        lead="A short description is enough to start. If it isn't a fit, we'll say so."
      />

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {product ? (
              <p className="type-small mb-6 text-ink-muted">
                You came from the {product.name} card on the solutions page. Mention that in your
                message if it is the right place to start.
              </p>
            ) : null}
            <ConsultationForm />
          </div>
          <aside className="lg:col-span-5">
            <ContactAside />
          </aside>
        </div>
      </Section>
    </>
  );
}

function ContactAside() {
  return (
    <div className="flex flex-col gap-8 lg:sticky lg:top-28">
      <div>
        <h2 className="type-h3">By email</h2>
        <p className="type-body mt-3">
          {site.contactEmail ? (
            <a href={`mailto:${site.contactEmail}`} className="text-link">
              {site.contactEmail}
            </a>
          ) : (
            <PendingDetail>public email address</PendingDetail>
          )}
        </p>
      </div>

      <div>
        <h2 className="type-h3">What to expect</h2>
        <ul className="mt-3 flex flex-col gap-3">
          <li className="type-body">
            Reply time: <PendingDetail>reply-time commitment</PendingDetail>
          </li>
          <li className="type-body">
            Service area: <PendingDetail>service region</PendingDetail>
          </li>
        </ul>
      </div>

      <div className="rounded-card bg-ivory-100 p-5">
        <p className="type-body">
          No obligation. If it isn&apos;t a fit, we&apos;ll say so and point you somewhere better.
        </p>
      </div>

      <div className="rounded-card border border-line bg-white p-5">
        <h2 className="type-h3">Something else?</h2>
        <p className="type-small mt-2 text-ink-muted">
          The Automation Assessment will help you work out where to start. It is being built and
          is not available yet.
        </p>
      </div>
    </div>
  );
}

function ConsultationForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [prepared, setPrepared] = useState<ComposedMessage | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const summaryRef = useRef<HTMLDivElement>(null);

  const errorEntries = Object.entries(errors) as [FieldName, string][];
  const showsErrors = errorEntries.length > 0;

  useEffect(() => {
    if (showsErrors) summaryRef.current?.focus();
  }, [showsErrors]);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleSoftware(option: string, checked: boolean) {
    setValues((current) => ({
      ...current,
      software: checked
        ? [...current.software, option]
        : current.software.filter((item) => item !== option),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCopyStatus("idle");

    // Honeypot: a real visitor never sees this field, so a filled one is a bot.
    if (values.honeypot.length > 0) {
      setStatus("blocked");
      setPrepared(null);
      return;
    }

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      setPrepared(null);
      return;
    }

    const message = composeEnquiryMessage(values);
    setPrepared(message);

    if (!site.contactEmail) {
      setStatus("not-configured");
      return;
    }

    const mailto = buildMailto(site.contactEmail, message);
    if (mailto.length > MAILTO_LENGTH_LIMIT) {
      setStatus("too-long");
      return;
    }

    window.location.href = mailto;
    setStatus("handed-off");
  }

  async function copyMessage() {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(`${prepared.subject}\n\n${prepared.body}`);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {showsErrors ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-card border border-danger-700 bg-white p-5"
        >
          <h2 className="type-h3 text-danger-700">Check these before continuing</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`} className="text-link type-small">
                  {FIELD_LABELS[field]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <FormField
        id="name"
        label="Your name"
        required
        error={errors.name}
        help="So we know who we're replying to."
      >
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : "name-help"}
          className={INPUT_CLASS}
        />
      </FormField>

      <FormField
        id="business"
        label="Business name"
        required
        error={errors.business}
        help="Size and sector change the answer."
      >
        <input
          id="business"
          name="business"
          type="text"
          autoComplete="organization"
          value={values.business}
          onChange={(event) => update("business", event.target.value)}
          aria-invalid={errors.business ? true : undefined}
          aria-describedby={errors.business ? "business-error" : "business-help"}
          className={INPUT_CLASS}
        />
      </FormField>

      <FormField
        id="email"
        label="Email"
        required
        error={errors.email}
        help="The only reply channel we have today."
      >
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : "email-help"}
          className={INPUT_CLASS}
        />
      </FormField>

      <fieldset>
        <legend className="type-eyebrow text-ink-muted">Current software (optional)</legend>
        <p className="type-small mt-2 text-ink-muted">
          Tick anything the work passes through. It separates an integration problem from a
          process problem.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SOFTWARE_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex min-h-12 items-center gap-3 rounded-badge border border-line bg-white px-3 type-body"
            >
              <input
                type="checkbox"
                name="software"
                value={option}
                checked={values.software.includes(option)}
                onChange={(event) => toggleSoftware(option, event.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
              {option}
            </label>
          ))}
        </div>

        <div className="mt-3">
          <label htmlFor="softwareOther" className="type-small font-medium">
            Anything else (optional)
          </label>
          <input
            id="softwareOther"
            name="softwareOther"
            type="text"
            maxLength={200}
            value={values.softwareOther}
            onChange={(event) => update("softwareOther", event.target.value)}
            aria-invalid={errors.software ? true : undefined}
            aria-describedby={errors.software ? "software-error" : undefined}
            className={`${INPUT_CLASS} mt-2`}
          />
          {errors.software ? (
            <p id="software-error" className="type-small mt-2 text-danger-700">
              {errors.software}
            </p>
          ) : null}
        </div>
      </fieldset>

      <FormField
        id="challenges"
        label="Operational challenges"
        required
        error={errors.challenges}
        help="What happens, how often, and who does it. Between 20 and 2,000 characters."
      >
        <textarea
          id="challenges"
          name="challenges"
          rows={5}
          maxLength={2000}
          value={values.challenges}
          onChange={(event) => update("challenges", event.target.value)}
          aria-invalid={errors.challenges ? true : undefined}
          aria-describedby={errors.challenges ? "challenges-error" : "challenges-help"}
          className={INPUT_CLASS}
        />
        <p className="type-small mt-2 text-ink-muted" aria-live="off">
          {values.challenges.length} of 2,000 characters
        </p>
      </FormField>

      <FormField
        id="outcomes"
        label="Desired outcomes (optional)"
        error={errors.outcomes}
        help="What would be different if this worked."
      >
        <textarea
          id="outcomes"
          name="outcomes"
          rows={3}
          maxLength={1000}
          value={values.outcomes}
          onChange={(event) => update("outcomes", event.target.value)}
          aria-invalid={errors.outcomes ? true : undefined}
          aria-describedby={errors.outcomes ? "outcomes-error" : "outcomes-help"}
          className={INPUT_CLASS}
        />
      </FormField>

      {/* Honeypot: off-screen, out of the tab order, and never announced. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="_company">Company (leave this empty)</label>
        <input
          id="_company"
          name="_company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(event) => update("honeypot", event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="consent" className="flex items-start gap-3 type-body">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
          />
          <span>
            I agree that Spearpoint Automation may use the details I&apos;ve entered to reply to
            this enquiry. I understand this form does not send anything automatically — see below.
          </span>
        </label>
        {errors.consent ? (
          <p id="consent-error" className="type-small mt-2 text-danger-700">
            {errors.consent}
          </p>
        ) : null}
        <p className="type-small mt-2 text-ink-muted">
          A privacy note is not published yet: <PendingDetail>privacy note</PendingDetail>
        </p>
      </div>

      <SubmissionExplainer />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className={SUBMIT_CLASS}>
          {site.contactEmail ? "Open my email app" : "Prepare my message"}
        </button>
        <p className="type-small text-ink-muted">No obligation. Nothing is sent from this page.</p>
      </div>

      {prepared ? (
        <PreparedMessage
          status={status}
          prepared={prepared}
          onCopy={copyMessage}
          copyStatus={copyStatus}
        />
      ) : null}
    </form>
  );
}

const INPUT_CLASS =
  "mt-2 w-full rounded-badge border border-line bg-white px-3 py-3 type-body text-navy-900 aria-[invalid=true]:border-danger-700";

const SUBMIT_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-card bg-blue-600 px-5 py-3 type-body font-medium text-white transition duration-[120ms] ease-out hover:bg-blue-700";

function FormField({
  id,
  label,
  required = false,
  error,
  help,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-small font-medium">
        {label}
        {required ? <span className="ml-2 type-eyebrow text-ink-muted">Required</span> : null}
      </label>
      {help && !error ? (
        <p id={`${id}-help`} className="type-small mt-1 text-ink-muted">
          {help}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="type-small mt-2 text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** States exactly what happens to a submission — in the words the code implements. */
function SubmissionExplainer() {
  return (
    <div className="rounded-card bg-ivory-100 p-5">
      <h2 className="type-h3">What happens when you continue</h2>
      {site.contactEmail ? (
        <>
          <p className="type-body mt-3">
            This form does not send anything to us directly. When you continue, your email
            application opens with your message ready to send — nothing reaches us until you
            press Send there.
          </p>
          <p className="type-small mt-3 text-ink-muted">
            If your email application didn&apos;t open, write to{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-link">
              {site.contactEmail}
            </a>{" "}
            with the same details.
          </p>
        </>
      ) : (
        <>
          <p className="type-body mt-3">
            This form does not send anything to us directly, and no enquiry address has been set
            up for this page yet. Nothing you type is transmitted or stored: when you continue,
            the page shows you the message to copy into your own email.
          </p>
          <p className="type-small mt-3 text-ink-muted">
            Once an address exists, this becomes a single click that opens your email application
            with the message already written.
          </p>
        </>
      )}
    </div>
  );
}

function PreparedMessage({
  status,
  prepared,
  onCopy,
  copyStatus,
}: {
  status: Status;
  prepared: ComposedMessage;
  onCopy: () => void;
  copyStatus: "idle" | "copied" | "failed";
}) {
  const heading =
    status === "handed-off"
      ? "Your message is ready in your email application"
      : status === "blocked"
        ? "Nothing has been sent"
        : "Your message is ready to copy";

  const explanation =
    status === "blocked"
      ? "This form could not be prepared. Please reload the page and try again."
      : status === "handed-off"
        ? "Nothing reaches us until you press Send there. If your email application didn't open, copy the text below instead."
        : status === "too-long"
          ? "This message is longer than an email link can carry reliably, so it has not been opened in your email application. Copy it below and send it from your own email."
          : "No enquiry address is set up for this page yet, so the message has not been put into an email. Copy it below and send it from your own email.";

  return (
    <div className="rounded-card border border-line bg-white p-5" aria-live="polite">
      <h2 className="type-h3">{heading}</h2>
      <p className="type-body mt-2 text-ink-muted">{explanation}</p>

      <p className="type-eyebrow mt-5 text-ink-muted">Subject</p>
      <p className="type-body mt-1">{prepared.subject}</p>

      <p className="type-eyebrow mt-4 text-ink-muted">Message</p>
      <pre className="type-small mt-1 max-h-72 overflow-auto whitespace-pre-wrap rounded-badge border border-line bg-ivory-50 p-4 font-sans">
        {prepared.body}
      </pre>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onCopy} className={SUBMIT_CLASS}>
          Copy this message
        </button>
        <span className="type-small text-ink-muted" aria-live="polite">
          {copyStatus === "copied" ? "Copied to your clipboard." : null}
          {copyStatus === "failed" ? "Copying didn't work — select the text and copy it." : null}
        </span>
      </div>
    </div>
  );
}
