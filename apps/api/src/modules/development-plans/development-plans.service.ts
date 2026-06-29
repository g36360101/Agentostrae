import { Injectable } from "@nestjs/common";
import type { Actor } from "../../actor/actor-context.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from "../../database/prisma.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AiOrchestratorService } from "../ai-orchestrator/ai-orchestrator.service";
import type { UpdateDevelopmentPlanInput } from "@agentos/shared";

@Injectable()
export class DevelopmentPlansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiOrchestrator: AiOrchestratorService,
  ) {}

  async generate(
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

    const coreCard = await this.prisma.projectCoreCard.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
    });

    if (!coreCard) {
      return null;
    }

    const latestPlan = await this.prisma.developmentPlan.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
      select: { version: true },
    });

    const version = (latestPlan?.version ?? 0) + 1;

    const content = await this.aiOrchestrator.generateDevelopmentPlan({
      projectId,
      coreCardId: coreCard.id,
      coreCardTitle: coreCard.title,
      coreCardLogline: coreCard.logline,
      coreCardWorldview: coreCard.worldviewSummary,
      coreCardProtagonist: coreCard.protagonistSummary,
      coreCardConflict: coreCard.centralConflict,
      coreCardTheme: coreCard.themeStatement,
    });

    const record = await this.prisma.developmentPlan.create({
      data: {
        projectId,
        sourceCoreCardId: coreCard.id,
        aiJobId: content.aiJobId,
        contentMarkdown: content.contentMarkdown,
        structuredJson: content.structuredJson,
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

    const record = await this.prisma.developmentPlan.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
    });

    return record;
  }

  async update(
    projectId: string,
    input: UpdateDevelopmentPlanInput,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });

    if (!project) {
      return null;
    }

    const latestPlan = await this.prisma.developmentPlan.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
    });

    if (!latestPlan) {
      return null;
    }

    const record = await this.prisma.developmentPlan.update({
      where: { id: latestPlan.id },
      data: {
        contentMarkdown: input.contentMarkdown,
        structuredJson: input.structuredJson,
      } as Record<string, unknown>,
    });

    return record;
  }

  async listVersions(
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

    const records = await this.prisma.developmentPlan.findMany({
      where: { projectId },
      orderBy: { version: "asc" },
      select: { id: true, version: true, createdAt: true },
    });

    return records;
  }
}
