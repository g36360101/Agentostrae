import { Injectable } from "@nestjs/common";
import type { Actor } from "../../actor/actor-context.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from "../../database/prisma.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AiOrchestratorService } from "../ai-orchestrator/ai-orchestrator.service";

@Injectable()
export class HighConceptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiOrchestrator: AiOrchestratorService,
  ) {}

  async generate(
    projectId: string,
    actor: Actor,
  ): Promise<unknown[] | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true, title: true, genre: true },
    });

    if (!project) {
      return null;
    }

    const idea = await this.prisma.projectIdea.findFirst({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    if (!idea) {
      return [];
    }

    const candidates = await this.aiOrchestrator.generateHighConcepts({
      projectId,
      projectTitle: project.title,
      projectGenre: project.genre,
      ideaId: idea.id,
      rawText: idea.rawText,
      genrePreference: idea.genrePreference,
    });

    return candidates;
  }

  async list(
    projectId: string,
    actor: Actor,
  ): Promise<unknown[] | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });

    if (!project) {
      return null;
    }

    const records = await this.prisma.highConceptCandidate.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    return records;
  }
}
