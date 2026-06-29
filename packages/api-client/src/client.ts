import {
  apiErrorResponseSchema,
  authResponseSchema,
  healthResponseSchema,
  highConceptCandidateListResponseSchema,
  logoutResponseSchema,
  projectCoreCardResponseSchema,
  projectIdeaResponseSchema,
  projectListResponseSchema,
  projectResponseSchema,
  type AuthResponse,
  type CreateProjectIdeaInput,
  type CreateProjectInput,
  type HealthResponse,
  type HighConceptCandidateListResponse,
  type LoginInput,
  type LogoutResponse,
  type ProjectCoreCardResponse,
  type ProjectIdeaResponse,
  type ProjectListResponse,
  type ProjectResponse,
  type RegisterInput,
  type UpdateProjectInput,
} from "@agentos/shared";

interface ResponseSchema<T> {
  parse(value: unknown): T;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number | undefined = undefined,
    readonly code: string | undefined = undefined,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export interface ApiClientOptions {
  baseUrl: string;
  fetch?: typeof fetch;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly fetchImplementation: typeof fetch;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.fetchImplementation = options.fetch ?? fetch;
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request("/health", {}, healthResponseSchema);
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    return this.request(
      "/auth/register",
      { method: "POST", body: JSON.stringify(input) },
      authResponseSchema,
    );
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    return this.request(
      "/auth/login",
      { method: "POST", body: JSON.stringify(input) },
      authResponseSchema,
    );
  }

  async logout(): Promise<LogoutResponse> {
    return this.request("/auth/logout", { method: "POST" }, logoutResponseSchema);
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.request("/auth/me", {}, authResponseSchema);
  }

  async createProject(input: CreateProjectInput): Promise<ProjectResponse> {
    return this.request(
      "/projects",
      { method: "POST", body: JSON.stringify(input) },
      projectResponseSchema,
    );
  }

  async listProjects(): Promise<ProjectListResponse> {
    return this.request("/projects", {}, projectListResponseSchema);
  }

  async getProject(projectId: string): Promise<ProjectResponse> {
    return this.request(`/projects/${projectId}`, {}, projectResponseSchema);
  }

  async updateProject(projectId: string, input: UpdateProjectInput): Promise<ProjectResponse> {
    return this.request(
      `/projects/${projectId}`,
      { method: "PATCH", body: JSON.stringify(input) },
      projectResponseSchema,
    );
  }

  async createProjectIdea(
    projectId: string,
    input: CreateProjectIdeaInput,
  ): Promise<ProjectIdeaResponse> {
    return this.request(
      `/projects/${projectId}/ideas`,
      { method: "POST", body: JSON.stringify(input) },
      projectIdeaResponseSchema,
    );
  }

  async generateHighConcepts(
    projectId: string,
  ): Promise<HighConceptCandidateListResponse> {
    return this.request(
      `/projects/${projectId}/high-concepts`,
      { method: "POST" },
      highConceptCandidateListResponseSchema,
    );
  }

  async listHighConceptCandidates(
    projectId: string,
  ): Promise<HighConceptCandidateListResponse> {
    return this.request(
      `/projects/${projectId}/high-concepts`,
      {},
      highConceptCandidateListResponseSchema,
    );
  }

  async createCoreCard(
    projectId: string,
    candidateId: string,
  ): Promise<ProjectCoreCardResponse> {
    return this.request(
      `/projects/${projectId}/core-cards`,
      { method: "POST", body: JSON.stringify({ candidateId }) },
      projectCoreCardResponseSchema,
    );
  }

  async getCoreCard(projectId: string): Promise<ProjectCoreCardResponse> {
    return this.request(
      `/projects/${projectId}/core-cards`,
      {},
      projectCoreCardResponseSchema,
    );
  }

  private async request<T>(path: string, init: RequestInit, schema: ResponseSchema<T>): Promise<T> {
    let response: Response;
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (init.body) {
      headers.set("Content-Type", "application/json");
    }

    try {
      response = await this.fetchImplementation(`${this.baseUrl}${path}`, {
        ...init,
        credentials: "include",
        headers,
      });
    } catch (error: unknown) {
      throw new ApiClientError(error instanceof Error ? error.message : "API request failed");
    }

    const body: unknown = await response.json();

    if (!response.ok) {
      const parsedError = apiErrorResponseSchema.safeParse(body);
      throw new ApiClientError(
        parsedError.success ? parsedError.data.error.message : `API returned ${response.status}`,
        response.status,
        parsedError.success ? parsedError.data.error.code : undefined,
      );
    }

    return schema.parse(body);
  }
}
