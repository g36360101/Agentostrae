import type {
  CoreCardContent,
  GenerateHighConceptsOutput,
  HighConceptCandidateContent,
} from "@agentos/shared";

export interface GenerateHighConceptsInput {
  idea: string;
  genrePreference?: string;
}

export interface GenerateCoreCardInput {
  candidate: HighConceptCandidateContent;
}

export interface AiProvider {
  readonly name: string;
  readonly model: string;
  generateHighConcepts(input: GenerateHighConceptsInput): Promise<GenerateHighConceptsOutput>;
  generateCoreCard(input: GenerateCoreCardInput): Promise<CoreCardContent>;
}

export interface AcceptanceSample {
  id: "fantasy" | "mystery" | "science-fiction";
  label: string;
  idea: string;
  highConcepts: GenerateHighConceptsOutput;
  selectedCandidateIndex: number;
  coreCard: CoreCardContent;
  invalidOutput: unknown;
}
