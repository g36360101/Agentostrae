import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import {
  createProjectInputSchema,
  updateProjectInputSchema,
  type CreateProjectInput,
  type ProjectListResponse,
  type ProjectResponse,
  type UpdateProjectInput,
} from "@agentos/shared";
import { ActorContextService } from "../../actor/actor-context.service";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { ProjectsService } from "./projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(
    @Inject(ProjectsService)
    private readonly projects: ProjectsService,
    @Inject(ActorContextService)
    private readonly actorContext: ActorContextService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createProjectInputSchema)) input: CreateProjectInput,
  ): Promise<ProjectResponse> {
    const actor = await this.actorContext.getCurrentActor();
    return { success: true, data: await this.projects.create(actor.id, input) };
  }

  @Get()
  async list(): Promise<ProjectListResponse> {
    const actor = await this.actorContext.getCurrentActor();
    return { success: true, data: await this.projects.list(actor.id) };
  }

  @Get(":projectId")
  async get(
    @Param("projectId", new ParseUUIDPipe({ version: "4" })) projectId: string,
  ): Promise<ProjectResponse> {
    const actor = await this.actorContext.getCurrentActor();
    return { success: true, data: await this.projects.get(actor.id, projectId) };
  }

  @Patch(":projectId")
  async update(
    @Param("projectId", new ParseUUIDPipe({ version: "4" })) projectId: string,
    @Body(new ZodValidationPipe(updateProjectInputSchema)) input: UpdateProjectInput,
  ): Promise<ProjectResponse> {
    const actor = await this.actorContext.getCurrentActor();
    return { success: true, data: await this.projects.update(actor.id, projectId, input) };
  }
}
