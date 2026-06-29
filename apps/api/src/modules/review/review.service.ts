import { Injectable } from "@nestjs/common";
import type { Actor } from "../../actor/actor-context.service";
import { PrismaService } from "../../database/prisma.service";
import { AiOrchestratorService } from "../ai-orchestrator/ai-orchestrator.service";
import type { UpdateAssetInput, UpdateRelationInput } from "@agentos/shared";

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiOrchestrator: AiOrchestratorService,
  ) {}

  async extractAssets(
    projectId: string,
    actor: Actor,
  ): Promise<unknown[] | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const devPlan = await this.prisma.developmentPlan.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
    });
    if (!devPlan) return null;

    const existingAssets = await this.prisma.storyAsset.findMany({
      where: { projectId, status: "suggested" },
      select: { name: true },
    });
    const existingNames = new Set(existingAssets.map((a) => a.name));

    const extracted = await this.aiOrchestrator.extractAssets({
      projectId,
      planId: devPlan.id,
      contentMarkdown: devPlan.contentMarkdown,
    });

    const newAssets: unknown[] = [];
    for (const asset of extracted) {
      if (existingNames.has(asset.name)) continue;
      const record = await this.prisma.storyAsset.create({
        data: {
          projectId,
          name: asset.name,
          assetType: asset.assetType,
          description: asset.description,
          narrativeFunction: asset.narrativeFunction,
          evidenceText: asset.evidenceText,
          spoilerLevel: asset.spoilerLevel,
          status: "suggested",
          sourcePlanId: devPlan.id,
        },
      });
      newAssets.push(record);
    }

    return newAssets;
  }

  async listAssets(
    projectId: string,
    actor: Actor,
    status?: string,
  ): Promise<unknown[] | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const where: Record<string, unknown> = { projectId };
    if (status === "suggested" || status === "confirmed" || status === "rejected") {
      where.status = status;
    }

    return this.prisma.storyAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAsset(
    projectId: string,
    assetId: string,
    input: UpdateAssetInput,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const asset = await this.prisma.storyAsset.findFirst({
      where: { id: assetId, projectId },
    });
    if (!asset) return null;

    return this.prisma.storyAsset.update({
      where: { id: assetId },
      data: input as Record<string, unknown>,
    });
  }

  async confirmAsset(
    projectId: string,
    assetId: string,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const asset = await this.prisma.storyAsset.findFirst({
      where: { id: assetId, projectId },
    });
    if (!asset) return null;

    return this.prisma.storyAsset.update({
      where: { id: assetId },
      data: {
        status: "confirmed",
        confirmedBy: actor.id,
        confirmedAt: new Date(),
        rejectedBy: null,
        rejectedAt: null,
      },
    });
  }

  async rejectAsset(
    projectId: string,
    assetId: string,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const asset = await this.prisma.storyAsset.findFirst({
      where: { id: assetId, projectId },
    });
    if (!asset) return null;

    return this.prisma.storyAsset.update({
      where: { id: assetId },
      data: {
        status: "rejected",
        rejectedBy: actor.id,
        rejectedAt: new Date(),
        confirmedBy: null,
        confirmedAt: null,
      },
    });
  }

  async extractRelations(
    projectId: string,
    actor: Actor,
  ): Promise<unknown[] | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const devPlan = await this.prisma.developmentPlan.findFirst({
      where: { projectId },
      orderBy: { version: "desc" },
    });
    if (!devPlan) return null;

    const assets = await this.prisma.storyAsset.findMany({
      where: { projectId },
      select: { id: true, name: true },
    });
    if (assets.length < 2) return null;

    const existingRelations = await this.prisma.storyRelation.findMany({
      where: { projectId, status: "suggested" },
      select: { sourceAssetId: true, targetAssetId: true, relationType: true },
    });
    const existingKeys = new Set(
      existingRelations.map((r) => `${r.sourceAssetId}:${r.targetAssetId}:${r.relationType}`),
    );

    const extracted = await this.aiOrchestrator.extractRelations({
      projectId,
      planId: devPlan.id,
      contentMarkdown: devPlan.contentMarkdown,
      assets: assets.map((a) => ({ id: a.id, name: a.name })),
    });

    const assetMap = new Map(assets.map((a) => [a.name, a.id]));

    const newRelations: unknown[] = [];
    for (const rel of extracted) {
      const sourceId = assetMap.get(rel.sourceName);
      const targetId = assetMap.get(rel.targetName);
      if (!sourceId || !targetId) continue;
      const key = `${sourceId}:${targetId}:${rel.relationType}`;
      if (existingKeys.has(key)) continue;

      const record = await this.prisma.storyRelation.create({
        data: {
          projectId,
          sourceAssetId: sourceId,
          targetAssetId: targetId,
          relationType: rel.relationType,
          evidenceText: rel.evidenceText,
          spoilerLevel: rel.spoilerLevel,
          status: "suggested",
          sourcePlanId: devPlan.id,
        },
      });
      newRelations.push(record);
    }

    return newRelations;
  }

  async listRelations(
    projectId: string,
    actor: Actor,
    status?: string,
  ): Promise<unknown[] | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const where: Record<string, unknown> = { projectId };
    if (status === "suggested" || status === "confirmed" || status === "rejected") {
      where.status = status;
    }

    return this.prisma.storyRelation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async updateRelation(
    projectId: string,
    relationId: string,
    input: UpdateRelationInput,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const relation = await this.prisma.storyRelation.findFirst({
      where: { id: relationId, projectId },
    });
    if (!relation) return null;

    return this.prisma.storyRelation.update({
      where: { id: relationId },
      data: input as Record<string, unknown>,
    });
  }

  async confirmRelation(
    projectId: string,
    relationId: string,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const relation = await this.prisma.storyRelation.findFirst({
      where: { id: relationId, projectId },
    });
    if (!relation) return null;

    return this.prisma.storyRelation.update({
      where: { id: relationId },
      data: {
        status: "confirmed",
        confirmedBy: actor.id,
        confirmedAt: new Date(),
        rejectedBy: null,
        rejectedAt: null,
      },
    });
  }

  async rejectRelation(
    projectId: string,
    relationId: string,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    const relation = await this.prisma.storyRelation.findFirst({
      where: { id: relationId, projectId },
    });
    if (!relation) return null;

    return this.prisma.storyRelation.update({
      where: { id: relationId },
      data: {
        status: "rejected",
        rejectedBy: actor.id,
        rejectedAt: new Date(),
        confirmedBy: null,
        confirmedAt: null,
      },
    });
  }
}
