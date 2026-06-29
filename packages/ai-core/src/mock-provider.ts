import {
  coreCardContentSchema,
  generateHighConceptsOutputSchema,
  type CoreCardContent,
  type GenerateHighConceptsOutput,
} from "@agentos/shared";
import { acceptanceSamples, findSampleByIdea } from "./samples";
import type { AiProvider, GenerateCoreCardInput, GenerateHighConceptsInput } from "./types";

export class MockAiProvider implements AiProvider {
  readonly name = "mock";
  readonly model = "agentos-deterministic-v1";

  async generateHighConcepts(
    input: GenerateHighConceptsInput,
  ): Promise<GenerateHighConceptsOutput> {
    const sample = findSampleByIdea(input.idea);
    return generateHighConceptsOutputSchema.parse(sample.highConcepts);
  }

  async generateCoreCard(input: GenerateCoreCardInput): Promise<CoreCardContent> {
    const matchingSample =
      acceptanceSamples.find((sample) =>
        sample.highConcepts.candidates.some(
          (candidate) => candidate.title === input.candidate.title,
        ),
      ) ?? acceptanceSamples[0];
    return coreCardContentSchema.parse(matchingSample.coreCard);
  }
}
