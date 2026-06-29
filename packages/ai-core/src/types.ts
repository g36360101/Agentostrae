import type {
  CoreCardContent,
  DevelopmentPlanContent,
  ExtractedAsset,
  ExtractedRelation,
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

export interface ExtractAssetsInput {
  developmentPlan: DevelopmentPlanContent;
}

export interface ExtractRelationsInput {
  assets: ExtractedAsset[];
  developmentPlan: DevelopmentPlanContent;
}

export interface ChatInput {
  messages: { role: "user" | "assistant"; content: string }[];
  contextPack: {
    coreCard: CoreCardContent;
    confirmedAssets: ExtractedAsset[];
    confirmedRelations: ExtractedRelation[];
  };
}

export interface ChatOutput {
  content: string;
  citedAssetNames: string[];
  citedRelationPairs: { source: string; target: string }[];
}

export interface AiProvider {
  readonly name: string;
  readonly model: string;
  generateHighConcepts(input: GenerateHighConceptsInput): Promise<GenerateHighConceptsOutput>;
  generateCoreCard(input: GenerateCoreCardInput): Promise<CoreCardContent>;
  generateDevelopmentPlan(input: GenerateDevelopmentPlanInput): Promise<DevelopmentPlanContent>;
  extractAssets(input: ExtractAssetsInput): Promise<ExtractedAsset[]>;
  extractRelations(input: ExtractRelationsInput): Promise<ExtractedRelation[]>;
  chat(input: ChatInput): Promise<ChatOutput>;
}

export interface AcceptanceSample {
  id: "fantasy" | "mystery" | "science-fiction";
  label: string;
  idea: string;
  highConcepts: GenerateHighConceptsOutput;
  selectedCandidateIndex: number;
  coreCard: CoreCardContent;
  developmentPlan: DevelopmentPlanContent;
  extractedAssets: ExtractedAsset[];
  extractedRelations: ExtractedRelation[];
  invalidOutput: unknown;
}
