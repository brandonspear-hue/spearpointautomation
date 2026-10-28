/**
 * Tests for the assessment engine (blueprint §4.8).
 *
 * Run with `bun test`. These cover the guarantees that are easy to break later:
 * the same answers always produce the same result, the band boundaries are where
 * the blueprint puts them, every one of the eleven rules can fire, and the
 * empty-answer path still returns an honest reading rather than a guess.
 */
import { describe, expect, test } from "bun:test";
import {
  BAND_HEADLINES,
  EMPTY_ANSWERS,
  NOT_LIST,
  QUESTIONS,
  RULESET_VERSION,
  bandFor,
  hashAnswers,
  intensity,
  summarise,
  type Answers,
  type Summary,
} from "../src/lib/assessment";

/** Answers with only the fields a test cares about. */
function answers(overrides: Partial<Answers> = {}): Answers {
  return { ...EMPTY_ANSWERS, ...overrides };
}

/** Every rule id that appears in a result, opportunity or note. */
function ruleIds(summary: Summary): string[] {
  return [...summary.opportunities.map((item) => item.ruleId), ...summary.notes.map((item) => item.ruleId)];
}

/** Every piece of text the visitor can read in a result. */
function resultText(summary: Summary): string[] {
  return [
    summary.headline,
    summary.nextStep.text,
    summary.notList,
    ...summary.echo.map((line) => line.value),
    ...summary.opportunities.flatMap((item) => [item.name, item.purpose, item.reason]),
    ...summary.notes.map((note) => note.text),
    ...summary.dependencies.map((item) => item.text),
    ...summary.discovery.map((item) => item.question),
    ...summary.missing.map((item) => item.label),
  ];
}

describe("determinism", () => {
  const full = answers({
    a1: "Someone opens the aging report every Monday and retypes the totals.",
    a2: "invoicing-collections",
    a3: ["quickbooks", "microsoft-365", "hubspot"],
    a4: "several-times-a-day",
    a5: "two-or-three",
    a6: "fifteen-to-sixty-min",
    a7: ["retyping", "email-threads"],
    a8: "customer-notices",
    a9: "faster-turnaround",
  });

  test("three runs on the same answers are byte-identical", () => {
    const runs = [summarise(full), summarise(full), summarise(full)];
    const serialised = runs.map((run) => JSON.stringify(run));
    expect(serialised[0]).toBe(serialised[1]);
    expect(serialised[1]).toBe(serialised[2]);
    expect(runs[0]).toEqual(runs[2]);
  });

  test("the hash is stable and order-independent for multi-select answers", () => {
    const one = answers({ a3: ["quickbooks", "hubspot"], a7: ["email-threads", "retyping"] });
    const other = answers({ a3: ["hubspot", "quickbooks"], a7: ["retyping", "email-threads"] });
    expect(hashAnswers(one)).toBe(hashAnswers(other));
    expect(hashAnswers(one)).toBe(hashAnswers(one));
    expect(hashAnswers(one)).not.toBe(hashAnswers(EMPTY_ANSWERS));
  });

  test("the weights sum to the score the blueprint describes", () => {
    expect(intensity(full)).toBe(5 + 3 + 1 + 2);
    expect(summarise(full).signals.intensity).toBe(intensity(full));
  });
});

describe("band boundaries", () => {
  test("bandFor is 1 at 8 and above, 2 from 4 to 7, 3 at 3 and below", () => {
    expect(bandFor(0)).toBe(3);
    expect(bandFor(3)).toBe(3);
    expect(bandFor(4)).toBe(2);
    expect(bandFor(7)).toBe(2);
    expect(bandFor(8)).toBe(1);
    expect(bandFor(13)).toBe(1);
  });

  test("real answers land on the boundary where the weights say they should", () => {
    // 5 + 3 = 8 → band 1
    const eight = answers({ a4: "several-times-a-day", a6: "fifteen-to-sixty-min" });
    expect(intensity(eight)).toBe(8);
    expect(summarise(eight).band).toBe(1);
    expect(summarise(eight).headline).toBe(BAND_HEADLINES[1]);

    // 4 + 3 = 7 → band 2
    const seven = answers({ a4: "daily", a6: "fifteen-to-sixty-min" });
    expect(intensity(seven)).toBe(7);
    expect(summarise(seven).band).toBe(2);
    expect(summarise(seven).headline).toBe(BAND_HEADLINES[2]);

    // 3 → band 3
    const three = answers({ a4: "few-times-a-week" });
    expect(intensity(three)).toBe(3);
    expect(summarise(three).band).toBe(3);
    expect(summarise(three).headline).toBe(BAND_HEADLINES[3]);
  });

  test("unanswered questions add nothing rather than a default", () => {
    expect(intensity(EMPTY_ANSWERS)).toBe(0);
    expect(intensity(answers({ a4: "no-rhythm" }))).toBe(0);
  });
});

describe("the eleven rules", () => {
  const cases: { rule: string; input: Answers }[] = [
    { rule: "R1", input: answers({ a2: "invoicing-collections" }) },
    { rule: "R2", input: answers({ a2: "reporting-month-end" }) },
    { rule: "R3", input: answers({ a7: ["paper-scans"] }) },
    { rule: "R4", input: answers({ a3: ["hubspot"] }) },
    { rule: "R5", input: answers({ a2: "inventory-purchasing" }) },
    { rule: "R6", input: answers({ a2: "scheduling-admin" }) },
    { rule: "R7", input: answers({ a2: "supplier-invoices" }) },
    { rule: "R8", input: answers({ a7: ["script-macro"] }) },
    { rule: "R9", input: answers({ a7: ["person-decides"] }) },
    { rule: "R10", input: answers() },
    { rule: "R11", input: answers({ a4: "monthly" }) },
  ];

  for (const item of cases) {
    test(`${item.rule} fires`, () => {
      const summary = summarise(item.input);
      expect(ruleIds(summary)).toContain(item.rule);
    });
  }

  test("R2 also fires on the outcome the visitor wants", () => {
    const summary = summarise(answers({ a9: "better-visibility" }));
    expect(ruleIds(summary)).toContain("R2");
  });

  test("R6 also fires on email threads when the volume is high enough", () => {
    const summary = summarise(
      answers({ a4: "several-times-a-day", a6: "fifteen-to-sixty-min", a7: ["email-threads"] }),
    );
    expect(summary.signals.intensity).toBeGreaterThanOrEqual(6);
    expect(ruleIds(summary)).toContain("R6");
  });

  test("R11 reads differently when an opportunity matched at a low volume", () => {
    const nothingMatched = summarise(answers());
    const somethingMatched = summarise(answers({ a2: "invoicing-collections", a4: "monthly" }));

    const first = nothingMatched.notes.find((note) => note.ruleId === "R11");
    const second = somethingMatched.notes.find((note) => note.ruleId === "R11");
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(first?.text).not.toBe(second?.text);
  });

  test("every line of the result carries a rule id and a non-empty reason", () => {
    const summary = summarise(answers({ a2: "invoicing-collections", a7: ["retyping"] }));
    for (const opportunity of summary.opportunities) {
      expect(opportunity.ruleId).toMatch(/^R\d+$/);
      expect(opportunity.reason.length).toBeGreaterThan(0);
    }
    for (const note of summary.notes) {
      expect(note.ruleId).toMatch(/^R\d+$/);
      expect(note.text.length).toBeGreaterThan(0);
    }
  });
});

describe("a minimal set of answers", () => {
  test("no answers at all still returns a coherent, honest result", () => {
    const summary = summarise(EMPTY_ANSWERS);

    expect(summary.band).toBe(3);
    expect(summary.headline).toBe(BAND_HEADLINES[3]);
    expect(summary.notList).toBe(NOT_LIST);
    expect(summary.rulesetVersion).toBe(RULESET_VERSION);

    // The reading says what it could not see.
    expect(summary.missing).toHaveLength(QUESTIONS.length);
    expect(summary.answeredCount).toBe(0);

    // A shape, not a guess: one opportunity line (R10), the R11 note, and the
    // dependencies and questions that are always true.
    expect(summary.opportunities).toHaveLength(1);
    expect(summary.opportunities[0].ruleId).toBe("R10");
    expect(summary.notes.map((note) => note.ruleId)).toContain("R11");
    expect(summary.dependencies.length).toBeGreaterThanOrEqual(2);
    expect(summary.dependencies.at(-1)?.id).toBe("approver");
    expect(summary.discovery.length).toBeGreaterThanOrEqual(3);
    expect(summary.nextStep.to).toBe("/services");
    expect(summary.echo.map((line) => line.value)).toContain("Not described.");
  });

  test("one or two answers still produce a reading that names the gaps", () => {
    const summary = summarise(answers({ a4: "weekly", a7: ["spreadsheet-copy-paste"] }));
    expect(summary.answeredCount).toBe(2);
    expect(summary.missing).toHaveLength(QUESTIONS.length - 2);
    expect(summary.opportunities.length).toBeGreaterThan(0);
  });
});

describe("what the result must never contain", () => {
  const fixtures: Answers[] = [
    EMPTY_ANSWERS,
    answers({ a2: "invoicing-collections", a4: "several-times-a-day", a6: "half-day-plus" }),
    answers({
      a1: "Chasing late invoices every Monday morning.",
      a2: "sales-follow-up",
      a3: ["shopify", "microsoft-365", "spreadsheets-only"],
      a4: "daily",
      a5: "four-to-ten",
      a6: "one-to-four-hours",
      a7: ["retyping", "person-decides", "paper-scans"],
      a8: "costs-money",
      a9: "capacity-without-hiring",
      a9Note: "Nothing falls through the cracks.",
    }),
  ];

  test("no digit appears in any result line, so no invented figure can hide", () => {
    for (const fixture of fixtures) {
      for (const line of resultText(summarise(fixture))) {
        expect(line).not.toMatch(/\d/);
      }
    }
  });

  test("dependencies only come from the systems named", () => {
    const none = summarise(EMPTY_ANSWERS).dependencies.map((item) => item.id);
    expect(none).not.toContain("accounting");
    expect(none).not.toContain("crm");

    const accounting = summarise(answers({ a3: ["xero"] })).dependencies.map((item) => item.id);
    expect(accounting).toContain("accounting");

    const paper = summarise(answers({ a7: ["paper-scans"] })).dependencies.map((item) => item.id);
    expect(paper).toContain("paper");
  });

  test("the discovery list skips the timing question only when it was answered", () => {
    const answered = summarise(answers({ a6: "one-to-four-hours" })).discovery.map((item) => item.id);
    const notAnswered = summarise(EMPTY_ANSWERS).discovery.map((item) => item.id);
    expect(answered).not.toContain("time");
    expect(notAnswered).toContain("time");
  });
});
