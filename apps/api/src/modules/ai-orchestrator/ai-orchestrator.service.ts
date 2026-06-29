import { Injectable } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from "../../database/prisma.service";
import { MockAiProvider } from "@agentos/ai-core";
import type { CoreCardContent, DevelopmentPlanContent } from "@agentos/shared";

interface GenerateOptions {
  projectId: string;
  projectTitle: string;
  projectGenre: string | null;
  ideaId: string;
  rawText: string;
  genrePreference: string | null;
}

@Injectable()
export class AiOrchestratorService {
  constructor(private readonly prisma: PrismaService) {}

  async generateHighConcepts(
    options: GenerateOptions,
  ): Promise<unknown[]> {
    const { projectId, rawText, genrePreference, ideaId } = options;

    const job = await this.prisma.aiJob.create({
      data: {
        projectId,
        taskType: "generate_high_concepts",
        status: "pending",
        provider: "mock",
        model: "agentos-deterministic-v1",
        inputJson: { rawText, genrePreference },
      },
    });

    try {
      const provider = new MockAiProvider();
      const callInput: { idea: string; genrePreference?: string } = {
        idea: rawText,
      };
      if (genrePreference) {
        callInput.genrePreference = genrePreference;
      }
      const output = await provider.generateHighConcepts(callInput);

      const candidates: unknown[] = [];
      for (const raw of output.candidates) {
        const record = await this.prisma.highConceptCandidate.create({
          data: {
            projectId,
            ideaId,
            aiJobId: job.id,
            title: raw.title,
            logline: raw.logline,
            genre: raw.genre,
            coreHook: raw.coreHook,
            mainConflict: raw.mainConflict,
            protagonistDrive: raw.protagonistDrive,
            worldDifference: raw.worldDifference,
            emotionalPromise: raw.emotionalPromise,
            targetReader: raw.targetReader,
            serializationPotential: raw.serializationPotential,
            expansionDirection: raw.expansionDirection,
            riskNotes: raw.riskNotes,
          },
        });
        candidates.push(record);
      }

      await this.prisma.aiJob.update({
        where: { id: job.id },
        data: {
          status: "succeeded",
          outputJson: output,
          completedAt: new Date(),
        },
      });

      return candidates;
    } catch (error) {
      await this.prisma.aiJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    }
  }

  async generateCoreCard(options: {
    projectId: string;
    candidateId: string;
    candidateTitle: string;
    candidateLogline: string | null;
    candidateGenre: string | null;
    candidateCoreHook: string | null;
  }): Promise<CoreCardContent> {
    const { projectId, candidateId } = options;

    const job = await this.prisma.aiJob.create({
      data: {
        projectId,
        taskType: "generate_core_card",
        status: "pending",
        provider: "mock",
        model: "agentos-deterministic-v1",
        inputJson: { candidateId },
      },
    });

    try {
      const provider = new MockAiProvider();
      const output = await provider.generateCoreCard({
        candidate: {
          title: options.candidateTitle,
          logline: options.candidateLogline ?? "",
          genre: options.candidateGenre ?? "",
          coreHook: options.candidateCoreHook ?? "",
          mainConflict: "",
          protagonistDrive: "",
          worldDifference: "",
          emotionalPromise: "",
          targetReader: "",
          serializationPotential: "",
          expansionDirection: "",
          riskNotes: [],
        },
      });

      await this.prisma.aiJob.update({
        where: { id: job.id },
        data: {
          status: "succeeded",
          outputJson: output,
          completedAt: new Date(),
        },
      });

      return output;
    } catch (error) {
      await this.prisma.aiJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    }
  }

  async generateDevelopmentPlan(options: {
    projectId: string;
    coreCardId: string;
    coreCardTitle: string;
    coreCardLogline: string;
    coreCardWorldview: string;
    coreCardProtagonist: string;
    coreCardConflict: string;
    coreCardTheme: string;
  }): Promise<DevelopmentPlanContent & { aiJobId: string }> {
    const { projectId, coreCardId } = options;

    const job = await this.prisma.aiJob.create({
      data: {
        projectId,
        taskType: "generate_development_plan",
        status: "pending",
        provider: "mock",
        model: "agentos-deterministic-v1",
        inputJson: { coreCardId },
      },
    });

    try {
      const provider = new MockAiProvider();
      const output = await provider.generateDevelopmentPlan({
        coreCard: {
          title: options.coreCardTitle,
          logline: options.coreCardLogline,
          genre: "",
          readerPromise: "",
          worldviewSummary: options.coreCardWorldview,
          protagonistSummary: options.coreCardProtagonist,
          protagonistGap: "",
          centralConflict: options.coreCardConflict,
          antagonistForce: "",
          longTermMystery: "",
          themeStatement: options.coreCardTheme,
          targetReader: "",
          canonConstraints: [],
        },
      });

      await this.prisma.aiJob.update({
        where: { id: job.id },
        data: {
          status: "succeeded",
          outputJson: output,
          completedAt: new Date(),
        },
      });

      return { ...output, aiJobId: job.id };
    } catch (error) {
      await this.prisma.aiJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    }
  }
}
