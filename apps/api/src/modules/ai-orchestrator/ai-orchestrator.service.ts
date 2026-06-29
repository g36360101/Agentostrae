import { Injectable } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from "../../database/prisma.service";
import { MockAiProvider } from "@agentos/ai-core";

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
}
