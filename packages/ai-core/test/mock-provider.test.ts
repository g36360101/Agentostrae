import { describe, expect, it } from "vitest";
import { generateHighConceptsOutputSchema } from "@agentos/shared";
import { acceptanceSamples, MockAiProvider } from "../src";

describe("MockAiProvider", () => {
  const provider = new MockAiProvider();

  it.each(acceptanceSamples)("returns a valid deterministic result for $label", async (sample) => {
    const first = await provider.generateHighConcepts({ idea: sample.idea });
    const second = await provider.generateHighConcepts({ idea: sample.idea });

    expect(first).toEqual(second);
    expect(first.candidates).toHaveLength(3);
    expect(generateHighConceptsOutputSchema.parse(first)).toEqual(first);
  });

  it.each(acceptanceSamples)("rejects the invalid $label fixture", (sample) => {
    expect(() => generateHighConceptsOutputSchema.parse(sample.invalidOutput)).toThrow();
  });
});
