import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorContextService } from "../../actor/actor-context.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HighConceptsService } from "./high-concepts.service";

@Controller("projects/:projectId/high-concepts")
export class HighConceptsController {
  constructor(
    private readonly highConcepts: HighConceptsService,
    private readonly actorContext: ActorContextService,
  ) {}

  @Post()
  async generate(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const result = await this.highConcepts.generate(projectId, actor);
    if (!result) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: result };
  }

  @Get()
  async list(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const result = await this.highConcepts.list(projectId, actor);
    if (!result) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: result };
  }
}
