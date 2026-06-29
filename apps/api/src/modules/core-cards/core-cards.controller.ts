import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorContextService } from "../../actor/actor-context.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CoreCardsService } from "./core-cards.service";
import { updateCoreCardInputSchema } from "@agentos/shared";

@Controller("projects/:projectId/core-cards")
export class CoreCardsController {
  constructor(
    private readonly coreCards: CoreCardsService,
    private readonly actorContext: ActorContextService,
  ) {}

  @Post()
  async create(
    @Param("projectId") projectId: string,
    @Body() rawBody: unknown,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const body =
      typeof rawBody === "object" && rawBody !== null
        ? (rawBody as Record<string, unknown>)
        : {};
    const candidateId =
      typeof body.candidateId === "string" ? body.candidateId : "";

    if (!candidateId) {
      throw new NotFoundException({
        code: "INVALID_INPUT",
        message: "candidateId 不能为空",
      });
    }

    const card = await this.coreCards.create(
      projectId,
      candidateId,
      actor,
    );
    if (!card) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: card };
  }

  @Get()
  async getLatest(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const card = await this.coreCards.getLatest(projectId, actor);
    if (card === null) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: card };
  }

  @Patch()
  async update(
    @Param("projectId") projectId: string,
    @Body() rawBody: unknown,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const body = updateCoreCardInputSchema.parse(rawBody);
    const card = await this.coreCards.update(projectId, body, actor);
    if (!card) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在、无权访问或尚无核心卡",
      });
    }
    return { data: card };
  }
}
