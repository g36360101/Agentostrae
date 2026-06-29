import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorContextService } from "../../actor/actor-context.service";
import { createProjectIdeaInputSchema } from "@agentos/shared";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { IdeasService } from "./ideas.service";

@Controller("projects/:projectId/ideas")
export class IdeasController {
  constructor(
    private readonly ideas: IdeasService,
    private readonly actorContext: ActorContextService,
  ) {}

  @Post()
  async create(
    @Param("projectId") projectId: string,
    @Body() rawBody: unknown,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const body = createProjectIdeaInputSchema.parse(rawBody);
    const idea = await this.ideas.create(projectId, body, actor);
    if (!idea) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: idea };
  }
}
