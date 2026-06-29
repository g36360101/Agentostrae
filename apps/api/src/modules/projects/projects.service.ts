import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateProjectInput, Project, UpdateProjectInput } from "@agentos/shared";
import type { Project as DatabaseProject } from "@agentos/db";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ProjectsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(ownerId: string, input: CreateProjectInput): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        ownerId,
        title: input.title,
        ...(input.genre === undefined ? {} : { genre: input.genre }),
        ...(input.premise === undefined ? {} : { premise: input.premise }),
      },
    });

    return toProject(project);
  }

  async list(ownerId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { ownerId },
      orderBy: { updatedAt: "desc" },
    });

    return projects.map(toProject);
  }

  async get(ownerId: string, projectId: string): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId },
    });

    if (!project) {
      throw projectNotFound();
    }

    return toProject(project);
  }

  async update(ownerId: string, projectId: string, input: UpdateProjectInput): Promise<Project> {
    const existingProject = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId },
      select: { id: true },
    });

    if (!existingProject) {
      throw projectNotFound();
    }

    const project = await this.prisma.project.update({
      where: { id: existingProject.id },
      data: {
        ...(input.title === undefined ? {} : { title: input.title }),
        ...(input.genre === undefined ? {} : { genre: input.genre }),
        ...(input.premise === undefined ? {} : { premise: input.premise }),
        ...(input.status === undefined ? {} : { status: input.status }),
      },
    });

    return toProject(project);
  }
}

const toProject = (project: DatabaseProject): Project => ({
  id: project.id,
  ownerId: project.ownerId,
  title: project.title,
  genre: project.genre,
  premise: project.premise,
  status: project.status,
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
});

const projectNotFound = (): NotFoundException =>
  new NotFoundException({
    code: "PROJECT_NOT_FOUND",
    message: "Project not found",
  });
