import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "~/components/button";
import { Callout } from "~/components/callout";
import { Eyebrow } from "~/components/eyebrow";
import { Section } from "~/components/section";
import {
  EMPTY_ANSWERS,
  QUESTION_COUNT,
  QUESTIONS,
  missingSummary,
  optionLabel,
  summarise,
  type Answers,
  type Question,
  type QuestionId,
  type Summary,
} from "~/lib/assessment";

const TITLE = "Automation Assessment — Spearpoint Automation";
const DESCRIPTION =
  "Nine questions about one manual process, and a preliminary reading of where automation might fit. It runs in your browser, sends and stores nothing, and is not a quote or a feasibility assessment.";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AssessmentPage,
});

type Stage = "intro" | "questions" | "review" | "result";

/** The intro's promise, repeated in the result footer so the two cannot drift. */
const PROMISE =
  "It does not estimate savings, price, effort, a timeline, or whether automation is possible in your systems.";

const STORAGE_PROMISE =
  "No name, no email address, no contact details. Nothing is sent anywhere and nothing is stored: your answers exist only in this page while it is open, and refreshing it clears them.";

/**
 * The Automation Assessment (blueprint §4).
 *
 * Four stages — intro, questions, review, result — all in this file, all driven
 * by `~/lib/assessment`. There is no server function, no fetch, no storage and no
 * analytics: everything the visitor types stays in component state.
 */
function AssessmentPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [failed, setFailed] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const stepFocusRef = useRef<HTMLElement | null>(null);
  const firstRender = useRef(true);
  const focusStep = (node: HTMLElement | null) => {
    stepFocusRef.current = node;
  };

  // One focus target per step, and one polite announcement of where you are.
  // Silent on first render: nothing has moved yet.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepFocusRef.current?.focus({ preventScroll: true });
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnnouncement(
      stage === "questions"
        ? `Question ${index + 1} of ${QUESTION_COUNT}`
        : stage === "review"
          ? "Review your answers"
          : stage === "result"
            ? "Your preliminary opportunity summary"
            : "",
    );
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [stage, index]);

  function setAnswer<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function toggleOption(question: Question, optionId: string, checked: boolean) {
    const current = answers[question.id === "a7" ? "a7" : "a3"];
    if (!Array.isArray(current)) return;
    const limit = question.maxSelected;
    let next = checked ? [...current, optionId] : current.filter((id) => id !== optionId);
    if (limit !== undefined && next.length > limit) next = next.slice(0, limit);
    setAnswer(question.id === "a7" ? "a7" : "a3", next);
  }

  function goToQuestion(position: number) {
    setIndex(Math.max(0, Math.min(QUESTIONS.length - 1, position)));
    setStage("questions");
  }

  function next() {
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
      return;
    }
    setStage("review");
  }

  function back() {
    if (index === 0) {
      setStage("intro");
      return;
    }
    setIndex(index - 1);
  }

  function showResult() {
    try {
      setSummary(summarise(answers));
      setFailed(false);
    } catch {
      setSummary(null);
      setFailed(true);
    }
    setStage("result");
  }

  function startOver() {
    setAnswers(EMPTY_ANSWERS);
    setSummary(null);
    setFailed(false);
    setIndex(0);
    setStage("intro");
  }

  return (
    <>
      <Section className="pb-8 lg:pb-12">
        <Eyebrow>Automation Assessment</Eyebrow>
        <h1 className="type-h1 mt-6 max-w-4xl">
          Nine questions about one manual process.
        </h1>
        <p className="type-lead measure mt-6 text-ink-muted">
          You get a preliminary reading: where automation might fit, what the systems you name
          would make it depend on, and what a discovery conversation would still have to confirm.
          {` ${PROMISE}`}
        </p>
      </Section>

      <Section className="pt-0">
          {/* Announced on step change only, never on first render. */}
          <p aria-live="polite" role="status" className="sr-only">
            {announcement}
          </p>

          {stage === "intro" ? (
            <Intro focusRef={focusStep} onStart={() => setStage("questions")} />
          ) : null}

          {stage === "questions" ? (
            <QuestionStep
              question={QUESTIONS[index]}
              index={index}
              answers={answers}
              focusRef={focusStep}
              onSetAnswer={setAnswer}
              onToggle={toggleOption}
              onBack={back}
              onNext={next}
              onJump={goToQuestion}
            />
          ) : null}

          {stage === "review" ? (
            <ReviewStep
              answers={answers}
              focusRef={focusStep}
              onJump={goToQuestion}
              onBack={() => goToQuestion(QUESTIONS.length - 1)}
              onFinish={showResult}
            />
          ) : null}

          {stage === "result" ? (
            <ResultStep
              summary={summary}
              failed={failed}
              focusRef={focusStep}
              onStartOver={startOver}
            />
          ) : null}
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Empty state.
 * ------------------------------------------------------------------ */

function Intro({ onStart, focusRef }: { onStart: () => void; focusRef: (node: HTMLElement | null) => void }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="rounded-panel border border-line bg-white p-6 lg:p-8">
          <h2 ref={focusRef} tabIndex={-1} className="type-h2">Before you start</h2>
          <ul className="mt-6 flex flex-col gap-4">
            <IntroItem title="About two minutes.">
              Nine questions about one manual process. Every one is optional, and you can go back
              and change an answer at any point.
            </IntroItem>
            <IntroItem title="A reading, not a verdict.">
              It names the areas that might fit and shows the reasoning behind each line, so you
              can disagree with it. It is not a quote, not a proposal, and not a judgement about
              whether automation is possible in your systems.
            </IntroItem>
            <IntroItem title="Nothing leaves this page.">
              {STORAGE_PROMISE}
            </IntroItem>
          </ul>
          <div className="mt-8">
            <Button onClick={onStart} type="button">
              Start the assessment
            </Button>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-card bg-ivory-100 p-6">
          <h2 className="type-h3">What you get at the end</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              "A headline reading of how much this process is worth looking at.",
              "The areas that might fit, each with the answer that made it appear.",
              "What the systems you name would make it depend on.",
              "The questions discovery would have to answer first.",
            ].map((item) => (
              <li key={item} className="type-small flex gap-3 text-navy-900">
                <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-blue-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function IntroItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="type-body">
      <span className="font-semibold">{title}</span> <span className="text-ink-muted">{children}</span>
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * Partial state: one question per step.
 * ------------------------------------------------------------------ */

function QuestionStep({
  question,
  index,
  answers,
  focusRef,
  onSetAnswer,
  onToggle,
  onBack,
  onNext,
  onJump,
}: {
  question: Question;
  index: number;
  answers: Answers;
  focusRef: (node: HTMLElement | null) => void;
  onSetAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
  onToggle: (question: Question, optionId: string, checked: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  onJump: (position: number) => void;
}) {
  const values = question.kind === "text" ? answers.a1 : answers[question.id === "a3" ? "a3" : question.id];
  const selected = Array.isArray(values) ? values : [];
  const single = typeof values === "string" ? values : null;
  const atLimit = question.maxSelected !== undefined && selected.length >= question.maxSelected;
  const isLast = index === QUESTIONS.length - 1;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <ProgressRail index={index} answers={answers} onJump={onJump} />

      <div className="lg:col-span-9">
        <fieldset ref={focusRef} tabIndex={-1} className="rounded-panel border border-line bg-white p-6 lg:p-8">
          <legend className="type-h2 max-w-2xl">{question.prompt}</legend>

          {question.help ? (
            <p id={`${question.id}-help`} className="type-body measure mt-3 text-ink-muted">
              {question.help}
            </p>
          ) : null}

          {question.kind === "text" ? (
            <div className="mt-6">
              <label htmlFor="a1" className="type-small font-medium">
                Your description (optional)
              </label>
              <textarea
                id="a1"
                name="a1"
                rows={4}
                maxLength={question.maxLength}
                value={answers.a1}
                aria-describedby={`${question.id}-help`}
                onChange={(event) => onSetAnswer("a1", event.target.value)}
                className={INPUT_CLASS}
              />
              <p className="type-small mt-2 text-ink-muted" aria-live="off">
                {answers.a1.length} of {question.maxLength} characters
              </p>
            </div>
          ) : null}

          {question.kind === "single" ? (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {(question.options ?? []).map((option) => (
                <label key={option.id} className={`${OPTION_CLASS} ${single === option.id ? "border-blue-700" : ""}`}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={single === option.id}
                    onChange={() => onSetAnswer(question.id as "a2" | "a4" | "a5" | "a6" | "a8" | "a9", option.id)}
                    className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          ) : null}

          {question.kind === "multi" ? (
            <div className="mt-6 flex flex-col gap-6">
              {(question.groups ?? [{ legend: "", options: question.options ?? [] }]).map((group) => (
                <fieldset key={group.legend || question.id}>
                  {group.legend ? (
                    <legend className="type-eyebrow text-ink-muted">{group.legend}</legend>
                  ) : null}
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {group.options.map((option) => {
                      const checked = selected.includes(option.id);
                      const disabled = !checked && atLimit;
                      return (
                        <label
                          key={option.id}
                          className={`${OPTION_CLASS} ${checked ? "border-blue-700" : ""} ${
                            disabled ? "bg-ivory-100 text-ink-muted" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name={question.id}
                            value={option.id}
                            checked={checked}
                            disabled={disabled}
                            onChange={(event) => onToggle(question, option.id, event.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          ) : null}

          {question.kind === "single" && question.note ? (
            <div className="mt-6">
              <label htmlFor="a9Note" className="type-small font-medium">
                {question.note.label}
              </label>
              <textarea
                id="a9Note"
                name="a9Note"
                rows={3}
                maxLength={question.note.maxLength}
                value={answers.a9Note}
                onChange={(event) => onSetAnswer("a9Note", event.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          ) : null}

          {question.maxSelected !== undefined ? (
            <p className="type-small mt-4 text-ink-muted" role="status" aria-live="polite">
              {selected.length} of {question.maxSelected} selected.
              {atLimit
                ? " That is the limit — untick one to choose a different one."
                : ""}
            </p>
          ) : null}

          <p className="type-small mt-4 text-ink-muted">
            Optional. You can continue without answering and the result will say so.
          </p>
        </fieldset>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="secondary" type="button" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={onNext}>
            {isLast ? "Review my answers" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProgressRail({
  index,
  answers,
  onJump,
}: {
  index: number;
  answers: Answers;
  onJump: (position: number) => void;
}) {
  return (
    <nav aria-label="Assessment progress" className="lg:col-span-3">
      <p className="type-small font-medium">
        Question {index + 1} of {QUESTION_COUNT}
      </p>
      <ol className="mt-4 hidden flex-col gap-1 lg:flex">
        {QUESTIONS.map((question, position) => {
          const current = position === index;
          const done = isAnsweredForRail(question, answers);
          return (
            <li key={question.id}>
              <button
                type="button"
                onClick={() => onJump(position)}
                aria-current={current ? "step" : undefined}
                className={`flex w-full items-center gap-2 rounded-badge px-2 py-1 text-left type-small transition-colors duration-[120ms] ease-out hover:bg-ivory-100 ${
                  current ? "font-medium text-blue-700" : "text-ink-muted"
                }`}
              >
                <span aria-hidden="true" className="type-eyebrow w-6 shrink-0 tabular-nums">
                  {String(question.number).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{railLabel(question)}</span>
                {done ? (
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-badge bg-blue-700" />
                ) : null}
                <span className="sr-only">{done ? "answered" : "not answered"}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Short labels for the rail only. The questions themselves keep their full wording. */
const RAIL_LABELS: Record<QuestionId, string> = {
  a1: "The task",
  a2: "Part of the business",
  a3: "Systems",
  a4: "How often",
  a5: "How many people",
  a6: "How long",
  a7: "How it is done",
  a8: "When it goes wrong",
  a9: "The outcome",
};

function railLabel(question: Question): string {
  return RAIL_LABELS[question.id];
}

function isAnsweredForRail(question: Question, answers: Answers): boolean {
  if (question.id === "a1") return answers.a1.trim().length > 0;
  if (question.id === "a3") return answers.a3.length > 0;
  if (question.id === "a7") return answers.a7.length > 0;
  return answers[question.id] !== null && answers[question.id] !== "";
}

/* ------------------------------------------------------------------ *
 * Review.
 * ------------------------------------------------------------------ */

function ReviewStep({
  answers,
  focusRef,
  onJump,
  onBack,
  onFinish,
}: {
  answers: Answers;
  focusRef: (node: HTMLElement | null) => void;
  onJump: (position: number) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div ref={focusRef} tabIndex={-1} className="rounded-panel border border-line bg-white p-6 lg:p-8">
        <h2 className="type-h2">Check your answers</h2>
        <p className="type-body measure mt-3 text-ink-muted">
          Nothing has been sent. Change anything that is wrong, then read the summary.
        </p>

        <dl className="mt-8 flex flex-col divide-y divide-line border-t border-line">
          {QUESTIONS.map((question, position) => (
            <div key={question.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <dt className="type-small font-medium">{railLabel(question)}</dt>
                <dd className="type-small mt-1 text-ink-muted">
                  {describeAnswer(question, answers)}
                </dd>
              </div>
              <Button variant="secondary" type="button" onClick={() => onJump(position)}>
                Change
              </Button>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" type="button" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onFinish}>
          Read my summary
        </Button>
      </div>
    </div>
  );
}

/** The visitor's own answer, in the option's words, or a plain "not answered". */
function describeAnswer(question: Question, answers: Answers): string {
  if (question.id === "a1") {
    return answers.a1.trim() || "Not answered.";
  }
  if (question.id === "a3" || question.id === "a7") {
    const chosen = answers[question.id].map((id) => optionLabel(question.id, id)).filter(Boolean);
    return chosen.length > 0 ? chosen.join(" · ") : "Not answered.";
  }
  const label = optionLabel(question.id, answers[question.id]);
  if (!label) return "Not answered.";
  if (question.id === "a9" && answers.a9Note.trim()) {
    return `${label} — “${answers.a9Note.trim()}”`;
  }
  return label;
}

/* ------------------------------------------------------------------ *
 * Result.
 * ------------------------------------------------------------------ */

function ResultStep({
  summary,
  failed,
  focusRef,
  onStartOver,
}: {
  summary: Summary | null;
  failed: boolean;
  focusRef: (node: HTMLElement | null) => void;
  onStartOver: () => void;
}) {
  if (failed || !summary) {
    return (
      <div ref={focusRef} tabIndex={-1} className="mx-auto max-w-3xl rounded-panel border border-line bg-white p-6 lg:p-8">
        <h2 className="type-h2">Something went wrong reading those answers</h2>
        <p className="type-body measure mt-3">
          Sorry — that is our fault, not yours. Your answers have not been sent anywhere and they
          are still here. Start again and they will be cleared, or go back and change an answer.
        </p>
        <div className="mt-6">
          <Button type="button" onClick={onStartOver}>
            Start over
          </Button>
        </div>
      </div>
    );
  }

  const thin = missingSummary(summary);

  return (
    <div className="mx-auto max-w-3xl">
      <div ref={focusRef} tabIndex={-1}>
        <Eyebrow>Preliminary opportunity summary</Eyebrow>
        <h2 className="type-h2 mt-4">{summary.headline}</h2>
        <p className="type-body measure mt-4 text-ink-muted">
          Based only on the nine answers below. Not a quote, not a feasibility assessment.
        </p>
        {thin ? <p className="type-small measure mt-3 text-ink-muted">{thin}</p> : null}
      </div>

      <div className="mt-10 rounded-card bg-ivory-100 p-5">
        <h3 className="type-h3">What you told us</h3>
        <dl className="mt-4 flex flex-col gap-2">
          {summary.echo.map((line) => (
            <div key={line.label} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
              <dt className="type-small font-medium sm:w-48 sm:shrink-0">{line.label}</dt>
              <dd className="type-small text-ink-muted">{line.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ResultSection title="Likely opportunities" count={summary.opportunities.length}>
        <ul className="flex flex-col gap-4">
          {summary.opportunities.map((opportunity) => (
            <li key={opportunity.ruleId} className="rounded-card border border-line bg-white p-5">
              <h4 className="type-h3">{opportunity.name}</h4>
              <p className="type-body mt-2 text-navy-900">{opportunity.purpose}</p>
              <details className="mt-3">
                <summary className="text-link type-small cursor-pointer">Why this appears</summary>
                <p className="type-small mt-2 text-ink-muted">{opportunity.reason}</p>
              </details>
            </li>
          ))}
        </ul>
      </ResultSection>

      {summary.notes.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {summary.notes.map((note) => (
            <li key={note.ruleId}>
              <Callout label="Worth knowing">
                <p className="type-small">{note.text}</p>
              </Callout>
            </li>
          ))}
        </ul>
      ) : null}

      <ResultSection title="What this would depend on" count={summary.dependencies.length}>
        <ul className="flex flex-col gap-3">
          {summary.dependencies.map((dependency) => (
            <li key={dependency.id} className="type-body flex gap-3">
              <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-blue-700" />
              <span className="text-ink-muted">{dependency.text}</span>
            </li>
          ))}
        </ul>
      </ResultSection>

      <ResultSection title="What discovery would have to confirm" count={summary.discovery.length}>
        <ul className="flex flex-col gap-3">
          {summary.discovery.map((item) => (
            <li key={item.id} className="type-body flex gap-3">
              <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-line" />
              <span className="text-ink-muted">{item.question}</span>
            </li>
          ))}
        </ul>
      </ResultSection>

      <div className="mt-10 rounded-panel border border-line bg-white p-6 lg:p-8">
        <h3 className="type-h3">Suggested next step</h3>
        <p className="type-body measure mt-3">{summary.nextStep.text}</p>
        <div className="mt-6">
          <Button to={summary.nextStep.to}>
            {summary.nextStep.to === "/contact" ? "Book a consultation" : "See what we do"}
          </Button>
        </div>
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <h3 className="type-h3">What this summary is not</h3>
        <p className="type-body measure mt-3 text-ink-muted">{summary.notList}</p>
        <p className="type-small measure mt-3 text-ink-muted">{PROMISE}</p>
        <p className="type-small measure mt-3 text-ink-muted">
          {STORAGE_PROMISE} Nothing has been sent to anyone by reading this page, and there is no
          send button.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button variant="secondary" type="button" onClick={onStartOver}>
            Start over
          </Button>
          <p className="type-small text-ink-muted">
            Ruleset v{summary.rulesetVersion} · answers {summary.answersHash}
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="type-h3">{title}</h3>
        <p className="type-small text-ink-muted">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const INPUT_CLASS =
  "mt-2 w-full rounded-badge border border-line bg-white px-3 py-3 type-body text-navy-900";

const OPTION_CLASS =
  "flex min-h-12 cursor-pointer items-start gap-3 rounded-badge border border-line bg-white px-4 py-3 type-body";
