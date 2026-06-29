import { Injectable } from "@nestjs/common";
import type { Actor } from "../../actor/actor-context.service";
import { PrismaService } from "../../database/prisma.service";
import { AiOrchestratorService } from "../ai-orchestrator/ai-orchestrator.service";
import type { SendChatMessageInput } from "@agentos/shared";

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiOrchestrator: AiOrchestratorService,
  ) {}

  async sendMessage(
    projectId: string,
    input: SendChatMessageInput,
    actor: Actor,
  ): Promise<unknown | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    await this.prisma.chatMessage.create({
      data: {
        projectId,
        role: "user",
        content: input.content,
        citedAssetIds: [],
        citedRelationIds: [],
        contextSnapshot: {},
      },
    });

    const history = await this.prisma.chatMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      select: { role: true, content: true },
    });

    const contextPack = await this.aiOrchestrator.buildContextPack(projectId);

    const aiResponse = await this.aiOrchestrator.chat({
      projectId,
      messages: history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      contextPack,
    });

    const confirmedAssets = await this.prisma.storyAsset.findMany({
      where: { projectId, status: "confirmed" },
      select: { id: true, name: true },
    });

    const confirmedRelations = await this.prisma.storyRelation.findMany({
      where: { projectId, status: "confirmed" },
      select: { id: true, sourceAssetId: true, targetAssetId: true },
    });

    const assetNameToId = new Map(confirmedAssets.map((a) => [a.name, a.id]));
    const citedAssetIds = aiResponse.citedAssetNames
      .map((name) => assetNameToId.get(name))
      .filter((id): id is string => id !== undefined);

    const relationPairToId = new Map(
      confirmedRelations.map((r) => [
        `${r.sourceAssetId}:${r.targetAssetId}`,
        r.id,
      ]),
    );
    const citedRelationIds = aiResponse.citedRelationPairs
      .map((pair) => {
        const sourceId = assetNameToId.get(pair.source);
        const targetId = assetNameToId.get(pair.target);
        if (!sourceId || !targetId) return undefined;
        return relationPairToId.get(`${sourceId}:${targetId}`);
      })
      .filter((id): id is string => id !== undefined);

    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        projectId,
        role: "assistant",
        content: aiResponse.content,
        citedAssetIds,
        citedRelationIds,
        contextSnapshot: contextPack,
      },
    });

    return assistantMessage;
  }

  async listMessages(
    projectId: string,
    actor: Actor,
  ): Promise<unknown[] | null> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });
    if (!project) return null;

    return this.prisma.chatMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });
  }
}
