import {
  coreCardContentSchema,
  developmentPlanContentSchema,
  generateHighConceptsOutputSchema,
  type CoreCardContent,
  type DevelopmentPlanContent,
  type GenerateHighConceptsOutput,
} from "@agentos/shared";
import { acceptanceSamples, findSampleByIdea } from "./samples";
import type { AiProvider, ChatInput, ExtractAssetsInput, ExtractRelationsInput, GenerateCoreCardInput, GenerateDevelopmentPlanInput, GenerateHighConceptsInput } from "./types";

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

  async chat(input: ChatInput) {
    const lastUserMessage = [...input.messages].reverse().find((m: { role: string }) => m.role === "user")?.content ?? "";
    const assetNames = input.contextPack.confirmedAssets.map((a) => a.name);
    const title = input.contextPack.coreCard.title;

    let content: string;
    let citedAssetNames: string[] = [];
    let citedRelationPairs: { source: string; target: string }[] = [];

    if (lastUserMessage.includes("主角") || lastUserMessage.includes("谁")) {
      const protagonist = input.contextPack.confirmedAssets.find((a) => a.assetType === "character" && a.narrativeFunction.includes("主角"));
      if (protagonist) {
        content = `根据项目设定，${title} 的主角是 **${protagonist.name}**。${protagonist.description}。${protagonist.narrativeFunction}。`;
        citedAssetNames = [protagonist.name];
      } else {
        content = `项目 ${title} 的主角信息尚未在已确认资产中明确记录。`;
      }
    } else if (lastUserMessage.includes("世界观") || lastUserMessage.includes("设定")) {
      const concept = input.contextPack.confirmedAssets.find((a) => a.assetType === "concept");
      if (concept) {
        content = `${title} 的核心世界观围绕 **${concept.name}** 展开。${concept.description}。这一设定驱动了故事中的主要冲突。`;
        citedAssetNames = [concept.name];
      } else {
        content = `项目 ${title} 的世界观基于已确认的资产和关系构建。目前核心设定尚未完全确认。`;
      }
    } else if (lastUserMessage.includes("关系") || lastUserMessage.includes("联系")) {
      const rel = input.contextPack.confirmedRelations[0];
      if (rel) {
        content = `已确认的关系中，**${rel.sourceName}** 与 **${rel.targetName}** 存在 ${rel.relationType} 关系。${rel.evidenceText}。`;
        citedRelationPairs = [{ source: rel.sourceName, target: rel.targetName }];
      } else {
        content = `目前项目中尚未确认任何关系。建议先生成并审核关系。`;
      }
    } else {
      content = `关于 ${title}，我可以基于已确认的 ${assetNames.length} 个资产和 ${input.contextPack.confirmedRelations.length} 条关系来回答。请问你想了解哪个方面？（主角、世界观、关系等）`;
      citedAssetNames = assetNames.slice(0, 3);
    }

    return { content, citedAssetNames, citedRelationPairs };
  }
}
