import { Injectable } from "@nestjs/common";
import type { Actor } from "../../actor/actor-context.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from "../../database/prisma.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AiOrchestratorService } from "../ai-orchestrator/ai-orchestrator.service";
import type { CoreCardContent, UpdateCoreCardInput } from "@agentos/shared";

@Injectable()
export class CoreCardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiOrchestrator: AiOrchestratorService,
  ) {}

  async create(
    projectId: string,
    candidateId: string,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });

    if (!project) {
      return null;
    }

    // Check if there's already a selected candidate for this project
    const existingSelected = await this.prisma.highConceptCandidate.findFirst({
      where: { projectId, isSelected: true },
      select: { id: true },
    });

    if (existingSelected && existingSelected.id !== candidateId) {
      // Another candidate is already selected
      return null;
    }

    const candidate = await this.prisma.highConceptCandidate.findFirst({
      where: { id: candidateId, projectId },
    });

    if (!candidate) {
      return null;
    }

    // Mark candidate as selected
    await this.prisma.highConceptCandidate.update({
      where: { id: candidateId },
      data: { isSelected: true },
    });

    // Generate core card via AI orchestrator
    const coreCardContent: CoreCardContent =
      await this.aiOrchestrator.generateCoreCard({
        projectId,
        candidateId,
        candidateTitle: candidate.title,
        candidateLogline: candidate.logline,
        candidateGenre: candidate.genre,
        candidateCoreHook: candidate.coreHook,
      });

    // Get next version number
    const latestCard = await this.prisma.projectCoreCard.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
      select: { version: true },
    });
    const version = (latestCard?.version ?? 0) + 1;

    // Save core card
    const record = await this.prisma.projectCoreCard.create({
      data: {
        projectId,
        sourceCandidateId: candidateId,
        title: coreCardContent.title,
        genre: coreCardContent.genre,
        logline: coreCardContent.logline,
        readerPromise: coreCardContent.readerPromise,
        worldviewSummary: coreCardContent.worldviewSummary,
        protagonistSummary: coreCardContent.protagonistSummary,
        protagonistGap: coreCardContent.protagonistGap,
        centralConflict: coreCardContent.centralConflict,
        antagonistForce: coreCardContent.antagonistForce,
        longTermMystery: coreCardContent.longTermMystery,
        themeStatement: coreCardContent.themeStatement,
        targetReader: coreCardContent.targetReader,
        canonConstraints: coreCardContent.canonConstraints,
        version,
      },
    });

    return record;
  }

  async getLatest(
    projectId: string,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });

    if (!project) {
      return null;
    }

    const record = await this.prisma.projectCoreCard.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
    });

    return record;
  }

  async update(
    projectId: string,
    input: UpdateCoreCardInput,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });

    if (!project) {
      return null;
    }

    const latestCard = await this.prisma.projectCoreCard.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
    });

    if (!latestCard) {
      return null;
    }

    const record = await this.prisma.projectCoreCard.update({
      where: { id: latestCard.id },
      data: input as Record<string, unknown>,
    });

    return record;
  }
}
