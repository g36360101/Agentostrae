import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ActorContextService } from "../../actor/actor-context.service";
import { ReviewService } from "./review.service";
import { updateAssetInputSchema, updateRelationInputSchema } from "@agentos/shared";

@Controller("projects/:projectId/assets")
export class AssetsController {
  constructor(
    private readonly review: ReviewService,
    private readonly actorContext: ActorContextService,
  ) {}

  @Post("extract")
  async extract(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const result = await this.review.extractAssets(projectId, actor);
    if (!result) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在、无权访问或尚无开发案",
      });
    }
    return { data: result };
  }

  @Get()
  async list(
    @Param("projectId") projectId: string,
    @Query("status") status?: string,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const assets = await this.review.listAssets(projectId, actor, status);
    if (assets === null) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: assets };
  }

  @Patch(":assetId")
  async update(
    @Param("projectId") projectId: string,
    @Param("assetId") assetId: string,
    @Body() rawBody: unknown,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const body = updateAssetInputSchema.parse(rawBody);
    const asset = await this.review.updateAsset(projectId, assetId, body, actor);
    if (!asset) {
      throw new NotFoundException({
        code: "NOT_FOUND",
        message: "资产不存在或无权访问",
      });
    }
    return { data: asset };
  }

  @Post(":assetId/confirm")
  async confirm(
    @Param("projectId") projectId: string,
    @Param("assetId") assetId: string,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const asset = await this.review.confirmAsset(projectId, assetId, actor);
    if (!asset) {
      throw new NotFoundException({
        code: "NOT_FOUND",
        message: "资产不存在或无权访问",
      });
    }
    return { data: asset };
  }

  @Post(":assetId/reject")
  async reject(
    @Param("projectId") projectId: string,
    @Param("assetId") assetId: string,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const asset = await this.review.rejectAsset(projectId, assetId, actor);
    if (!asset) {
      throw new NotFoundException({
        code: "NOT_FOUND",
        message: "资产不存在或无权访问",
      });
    }
    return { data: asset };
  }
}

@Controller("projects/:projectId/relations")
export class RelationsController {
  constructor(
    private readonly review: ReviewService,
    private readonly actorContext: ActorContextService,
  ) {}

  @Post("extract")
  async extract(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const result = await this.review.extractRelations(projectId, actor);
    if (!result) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在、无权访问或尚无开发案/资产",
      });
    }
    return { data: result };
  }

  @Get()
  async list(
    @Param("projectId") projectId: string,
    @Query("status") status?: string,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const relations = await this.review.listRelations(projectId, actor, status);
    if (relations === null) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: relations };
  }

  @Patch(":relationId")
  async update(
    @Param("projectId") projectId: string,
    @Param("relationId") relationId: string,
    @Body() rawBody: unknown,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const body = updateRelationInputSchema.parse(rawBody);
    const relation = await this.review.updateRelation(projectId, relationId, body, actor);
    if (!relation) {
      throw new NotFoundException({
        code: "NOT_FOUND",
        message: "关系不存在或无权访问",
      });
    }
    return { data: relation };
  }

  @Post(":relationId/confirm")
  async confirm(
    @Param("projectId") projectId: string,
    @Param("relationId") relationId: string,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const relation = await this.review.confirmRelation(projectId, relationId, actor);
    if (!relation) {
      throw new NotFoundException({
        code: "NOT_FOUND",
        message: "关系不存在或无权访问",
      });
    }
    return { data: relation };
  }

  @Post(":relationId/reject")
  async reject(
    @Param("projectId") projectId: string,
    @Param("relationId") relationId: string,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const relation = await this.review.rejectRelation(projectId, relationId, actor);
    if (!relation) {
      throw new NotFoundException({
        code: "NOT_FOUND",
        message: "关系不存在或无权访问",
      });
    }
    return { data: relation };
  }
}
