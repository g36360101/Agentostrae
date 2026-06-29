import {
  coreCardContentSchema,
  developmentPlanContentSchema,
  generateHighConceptsOutputSchema,
  type CoreCardContent,
  type DevelopmentPlanContent,
  type GenerateHighConceptsOutput,
} from "@agentos/shared";
import { acceptanceSamples, findSampleByIdea } from "./samples";
import type { AiProvider, ExtractAssetsInput, ExtractRelationsInput, GenerateCoreCardInput, GenerateDevelopmentPlanInput, GenerateHighConceptsInput } from "./types";

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

  async generateDevelopmentPlan(
    input: GenerateDevelopmentPlanInput,
  ): Promise<DevelopmentPlanContent> {
    const matchingSample =
      acceptanceSamples.find((sample) =>
        sample.coreCard.title === input.coreCard.title,
      ) ?? acceptanceSamples[0];
    return developmentPlanContentSchema.parse(matchingSample.developmentPlan);
  }

  async extractAssets(input: ExtractAssetsInput) {
    const matchingSample =
      acceptanceSamples.find((sample) =>
        sample.developmentPlan.contentMarkdown === input.developmentPlan.contentMarkdown,
      ) ?? acceptanceSamples[0];
    return matchingSample.extractedAssets;
  }

  async extractRelations(input: ExtractRelationsInput) {
    const matchingSample =
      acceptanceSamples.find((sample) =>
        sample.developmentPlan.contentMarkdown === input.developmentPlan.contentMarkdown,
      ) ?? acceptanceSamples[0];
    return matchingSample.extractedRelations;
  }
}
