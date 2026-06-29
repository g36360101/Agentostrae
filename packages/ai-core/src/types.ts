import type {
  CoreCardContent,
  DevelopmentPlanContent,
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

export interface GenerateDevelopmentPlanInput {
  coreCard: CoreCardContent;
}

export interface AiProvider {
  readonly name: string;
  readonly model: string;
  generateHighConcepts(input: GenerateHighConceptsInput): Promise<GenerateHighConceptsOutput>;
  generateCoreCard(input: GenerateCoreCardInput): Promise<CoreCardContent>;
  generateDevelopmentPlan(input: GenerateDevelopmentPlanInput): Promise<DevelopmentPlanContent>;
}

export interface AcceptanceSample {
  id: "fantasy" | "mystery" | "science-fiction";
  label: string;
  idea: string;
  highConcepts: GenerateHighConceptsOutput;
  selectedCandidateIndex: number;
  coreCard: CoreCardContent;
  developmentPlan: DevelopmentPlanContent;
  invalidOutput: unknown;
}
