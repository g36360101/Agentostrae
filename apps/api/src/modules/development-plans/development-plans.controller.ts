import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorContextService } from "../../actor/actor-context.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DevelopmentPlansService } from "./development-plans.service";
import { updateDevelopmentPlanInputSchema } from "@agentos/shared";

@Controller("projects/:projectId/development-plan")
export class DevelopmentPlansController {
  constructor(
    private readonly developmentPlans: DevelopmentPlansService,
    private readonly actorContext: ActorContextService,
  ) {}

  @Post()
  async generate(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const plan = await this.developmentPlans.generate(projectId, actor);
    if (!plan) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: plan };
  }

  @Get()
  async getLatest(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const plan = await this.developmentPlans.getLatest(projectId, actor);
    if (plan === null) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: plan };
  }

  @Put()
  async update(
    @Param("projectId") projectId: string,
    @Body() rawBody: unknown,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const body = updateDevelopmentPlanInputSchema.parse(rawBody);
    const plan = await this.developmentPlans.update(projectId, body, actor);
    if (!plan) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在、无权访问或尚无开发案",
      });
    }
    return { data: plan };
  }
}

@Controller("projects/:projectId/development-plan/versions")
export class DevelopmentPlanVersionsController {
  constructor(
    private readonly developmentPlans: DevelopmentPlansService,
    private readonly actorContext: ActorContextService,
  ) {}

  @Get()
  async list(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const plans = await this.developmentPlans.listVersions(projectId, actor);
    if (plans === null) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: plans };
  }
}
