import { describe, expect, it } from "vitest";
import { ApiClient, ApiClientError } from "../src";

describe("ApiClient", () => {
  it("parses a valid health response", async () => {
    const client = new ApiClient({
      baseUrl: "http://localhost:4000/",
      fetch: async () =>
        new Response(
          JSON.stringify({
            success: true,
            data: {
              status: "ok",
              service: "agentos-api",
              timestamp: "2026-06-28T00:00:00.000Z",
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
    });

    await expect(client.getHealth()).resolves.toMatchObject({
      success: true,
      data: { status: "ok" },
    });
  });

  it("turns connection failures into an ApiClientError", async () => {
    const client = new ApiClient({
      baseUrl: "http://localhost:4000",
      fetch: async () => {
        throw new Error("connection refused");
      },
    });

    await expect(client.getHealth()).rejects.toBeInstanceOf(ApiClientError);
  });

  it("creates and parses a project", async () => {
    const fetchMock = async (_input: string | URL | Request, init?: RequestInit) => {
      expect(init?.method).toBe("POST");
      expect(init?.credentials).toBe("include");
      return Response.json({
        success: true,
        data: project,
      });
    };
    const client = new ApiClient({ baseUrl: "http://localhost:4000", fetch: fetchMock });

    await expect(client.createProject({ title: "天道草稿" })).resolves.toMatchObject({
      data: { title: "天道草稿" },
    });
  });

  it("calls the session authentication endpoints", async () => {
    const calls: string[] = [];
    const client = new ApiClient({
      baseUrl: "http://localhost:4000",
      fetch: async (input) => {
        calls.push(String(input));
        return Response.json({
          success: true,
          data: { user },
        });
      },
    });

    await client.login({ email: "author@example.com", password: "long-enough-password" });
    await client.getCurrentUser();

    expect(calls).toEqual(["http://localhost:4000/auth/login", "http://localhost:4000/auth/me"]);
  });

  it("preserves structured API errors", async () => {
    const client = new ApiClient({
      baseUrl: "http://localhost:4000",
      fetch: async () =>
        Response.json(
          {
            success: false,
            error: { code: "PROJECT_NOT_FOUND", message: "Project not found" },
          },
          { status: 404 },
        ),
    });

    await expect(client.getProject(project.id)).rejects.toMatchObject({
      status: 404,
      code: "PROJECT_NOT_FOUND",
    });
  });
});

const project = {
  id: "00000000-0000-4000-8000-000000000001",
  ownerId: "00000000-0000-4000-8000-000000000000",
  title: "天道草稿",
  genre: "玄幻悬疑升级流",
  premise: "一个失忆的修仙者发现自己其实是天道写废的草稿。",
  status: "active",
  createdAt: "2026-06-29T00:00:00.000Z",
  updatedAt: "2026-06-29T00:00:00.000Z",
} as const;

const user = {
  id: "00000000-0000-4000-8000-000000000010",
  email: "author@example.com",
  name: "测试作者",
  createdAt: "2026-06-29T00:00:00.000Z",
  updatedAt: "2026-06-29T00:00:00.000Z",
} as const;
