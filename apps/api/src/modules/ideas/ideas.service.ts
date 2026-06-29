import { Injectable } from "@nestjs/common";
import type { Actor } from "../../actor/actor-context.service";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from "../../database/prisma.service";
import type { CreateProjectIdeaInput } from "@agentos/shared";

@Injectable()
export class IdeasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    input: CreateProjectIdeaInput,
    actor: Actor,
  ): Promise<unknown> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: actor.id },
      select: { id: true },
    });

    if (!project) {
      return null;
    }

    const record = await this.prisma.projectIdea.create({
      data: {
        projectId,
        rawText: input.rawText,
        genrePreference: input.genrePreference ?? null,
        readerExpectation: input.readerExpectation ?? null,
        tabooNotes: input.tabooNotes ?? null,
        referenceVibe: input.referenceVibe ?? null,
      },
    });

    return record;
  }
}
