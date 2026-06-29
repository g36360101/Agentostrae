import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module";
import { ActorContextService } from "../src/actor/actor-context.service";
import { HttpExceptionFilter } from "../src/common/http-exception.filter";
import { PrismaService } from "../src/database/prisma.service";

const actorId = "00000000-0000-4000-8000-000000000000";
const otherActorId = "00000000-0000-4000-8000-000000000099";
const otherProjectId = "00000000-0000-4000-8000-000000000099";

interface FakeProject {
  id: string;
  ownerId: string;
  title: string;
  genre: string | null;
  premise: string | null;
  status: "draft" | "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const projects: FakeProject[] = [
  {
    id: otherProjectId,
    ownerId: otherActorId,
    title: "Other user's project",
    genre: null,
    premise: null,
    status: "draft",
    createdAt: new Date("2026-06-29T00:00:00.000Z"),
    updatedAt: new Date("2026-06-29T00:00:00.000Z"),
  },
];

const fakePrisma = {
  project: {
    create: vi.fn(
      ({
        data,
      }: {
        data: { ownerId: string; title: string; genre?: string; premise?: string };
      }) => {
        const now = new Date("2026-06-29T01:00:00.000Z");
        const project: FakeProject = {
          id: "11111111-1111-4111-8111-111111111111",
          ownerId: data.ownerId,
          title: data.title,
          genre: data.genre ?? null,
          premise: data.premise ?? null,
          status: "draft",
          createdAt: now,
          updatedAt: now,
        };
        projects.push(project);
        return project;
      },
    ),
    findMany: vi.fn(({ where }: { where: { ownerId: string } }) =>
      projects.filter((project) => project.ownerId === where.ownerId),
    ),
    findFirst: vi.fn(
      ({ where }: { where: { id: string; ownerId: string }; select?: { id: true } }) =>
        projects.find((project) => project.id === where.id && project.ownerId === where.ownerId) ??
        null,
    ),
    update: vi.fn(({ where, data }: { where: { id: string }; data: Partial<FakeProject> }) => {
      const index = projects.findIndex((project) => project.id === where.id);
      const current = projects[index];
      if (!current) {
        throw new Error("Project missing in test fixture");
      }
      const updated: FakeProject = {
        ...current,
        ...data,
        updatedAt: new Date("2026-06-29T02:00:00.000Z"),
      };
      projects[index] = updated;
      return updated;
    }),
  },
};

describe("projects API", () => {
  let app: INestApplication;
  let createdProjectId: string;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(fakePrisma)
      .overrideProvider(ActorContextService)
      .useValue({ getCurrentActor: async () => ({ id: actorId }) })
      .compile();
    app = testingModule.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(0, "127.0.0.1");
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates a project for the current actor", async () => {
    const response = await request(app.getHttpServer())
      .post("/projects")
      .send({ title: "天道草稿", genre: "玄幻悬疑" })
      .expect(201);

    expect(response.body).toMatchObject({
      success: true,
      data: { ownerId: actorId, title: "天道草稿", status: "draft" },
    });
    createdProjectId = response.body.data.id;
  });

  it("lists only the current actor's projects", async () => {
    const response = await request(app.getHttpServer()).get("/projects").expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].id).toBe(createdProjectId);
  });

  it("reopens and updates the current actor's project", async () => {
    await request(app.getHttpServer())
      .patch(`/projects/${createdProjectId}`)
      .send({ premise: "一个失忆的修仙者发现自己其实是天道写废的草稿。" })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/projects/${createdProjectId}`)
      .expect(200);

    expect(response.body.data.premise).toContain("天道写废的草稿");
  });

  it("does not reveal another actor's project", async () => {
    const response = await request(app.getHttpServer())
      .get(`/projects/${otherProjectId}`)
      .expect(404);

    expect(response.body.error.code).toBe("PROJECT_NOT_FOUND");
  });

  it("rejects invalid project input", async () => {
    const response = await request(app.getHttpServer())
      .post("/projects")
      .send({ title: "" })
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
