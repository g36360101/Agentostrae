import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module";
import { HttpExceptionFilter } from "../src/common/http-exception.filter";
import { PrismaService } from "../src/database/prisma.service";

interface FakeUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FakeSession {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const users: FakeUser[] = [];
const sessions: FakeSession[] = [];
let idCounter = 1;
const id = (): string => `00000000-0000-4000-8000-${String(idCounter++).padStart(12, "0")}`;

const fakePrisma = {
  user: {
    create: vi.fn(({ data }: { data: Omit<FakeUser, "id" | "createdAt" | "updatedAt"> }) => {
      if (users.some((user) => user.email === data.email)) {
        throw new Error("Duplicate email fixture");
      }
      const now = new Date("2026-06-29T00:00:00.000Z");
      const user = { ...data, id: id(), createdAt: now, updatedAt: now };
      users.push(user);
      return user;
    }),
    findUnique: vi.fn(({ where }: { where: { email?: string; id?: string } }) =>
      users.find(
        (user) =>
          (where.email !== undefined && user.email === where.email) ||
          (where.id !== undefined && user.id === where.id),
      ),
    ),
  },
  session: {
    create: vi.fn(({ data }: { data: Pick<FakeSession, "userId" | "tokenHash" | "expiresAt"> }) => {
      const now = new Date("2026-06-29T00:00:00.000Z");
      const session = { ...data, id: id(), createdAt: now, updatedAt: now };
      sessions.push(session);
      return session;
    }),
    findUnique: vi.fn(({ where }: { where: { tokenHash: string } }) =>
      sessions.find((session) => session.tokenHash === where.tokenHash),
    ),
    deleteMany: vi.fn(({ where }: { where: { tokenHash: string } }) => {
      const index = sessions.findIndex((session) => session.tokenHash === where.tokenHash);
      if (index !== -1) sessions.splice(index, 1);
      return { count: index === -1 ? 0 : 1 };
    }),
  },
  $transaction: vi.fn(async (callback: (client: typeof fakePrisma) => Promise<unknown>) =>
    callback(fakePrisma),
  ),
};

describe("authentication API", () => {
  let app: INestApplication;
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(fakePrisma)
      .compile();
    app = testingModule.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(0, "127.0.0.1");
    agent = request.agent(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it("registers a user and sets a protected session cookie", async () => {
    const response = await agent
      .post("/auth/register")
      .send({
        email: "author@example.com",
        name: "测试作者",
        password: "correct horse battery staple",
      })
      .expect(201);

    const setCookie = response.headers["set-cookie"];
    expect(setCookie?.[0]).toContain("agentos_session=");
    expect(setCookie?.[0]).toContain("HttpOnly");
    expect(setCookie?.[0]).toContain("SameSite=Lax");
    expect(response.body.data.user).toMatchObject({
      email: "author@example.com",
      name: "测试作者",
    });
  });

  it("returns the current user from the session", async () => {
    const response = await agent.get("/auth/me").expect(200);
    expect(response.body.data.user.email).toBe("author@example.com");
  });

  it("rejects an incorrect password without revealing the cause", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "author@example.com", password: "incorrect password" })
      .expect(401);

    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("revokes the current session on logout", async () => {
    await agent.post("/auth/logout").expect(201);
    const response = await agent.get("/auth/me").expect(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("logs in again with the correct password", async () => {
    await agent
      .post("/auth/login")
      .send({ email: "author@example.com", password: "correct horse battery staple" })
      .expect(201);
    await agent.get("/auth/me").expect(200);
  });
});
