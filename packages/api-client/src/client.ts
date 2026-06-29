import {
  apiErrorResponseSchema,
  authResponseSchema,
  chatMessageListResponseSchema,
  chatMessageResponseSchema,
  developmentPlanListResponseSchema,
  developmentPlanResponseSchema,
  healthResponseSchema,
  highConceptCandidateListResponseSchema,
  logoutResponseSchema,
  projectCoreCardResponseSchema,
  projectIdeaResponseSchema,
  projectListResponseSchema,
  projectResponseSchema,
  storyAssetListResponseSchema,
  storyAssetResponseSchema,
  storyRelationListResponseSchema,
  storyRelationResponseSchema,
  type AuthResponse,
  type ChatMessageListResponse,
  type ChatMessageResponse,
  type CreateProjectIdeaInput,
  type CreateProjectInput,
  type DevelopmentPlanListResponse,
  type DevelopmentPlanResponse,
  type HealthResponse,
  type HighConceptCandidateListResponse,
  type LoginInput,
  type LogoutResponse,
  type ProjectCoreCardResponse,
  type ProjectIdeaResponse,
  type ProjectListResponse,
  type ProjectResponse,
  type RegisterInput,
  type SendChatMessageInput,
  type StoryAssetListResponse,
  type StoryAssetResponse,
  type StoryRelationListResponse,
  type StoryRelationResponse,
  type UpdateAssetInput,
  type UpdateCoreCardInput,
  type UpdateDevelopmentPlanInput,
  type UpdateProjectInput,
  type UpdateRelationInput,
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

  async updateCoreCard(
    projectId: string,
    input: UpdateCoreCardInput,
  ): Promise<ProjectCoreCardResponse> {
    return this.request(
      `/projects/${projectId}/core-cards`,
      { method: "PATCH", body: JSON.stringify(input) },
      projectCoreCardResponseSchema,
    );
  }

  async generateDevelopmentPlan(
    projectId: string,
  ): Promise<DevelopmentPlanResponse> {
    return this.request(
      `/projects/${projectId}/development-plan`,
      { method: "POST" },
      developmentPlanResponseSchema,
    );
  }

  async getDevelopmentPlan(
    projectId: string,
  ): Promise<DevelopmentPlanResponse> {
    return this.request(
      `/projects/${projectId}/development-plan`,
      {},
      developmentPlanResponseSchema,
    );
  }

  async updateDevelopmentPlan(
    projectId: string,
    input: UpdateDevelopmentPlanInput,
  ): Promise<DevelopmentPlanResponse> {
    return this.request(
      `/projects/${projectId}/development-plan`,
      { method: "PUT", body: JSON.stringify(input) },
      developmentPlanResponseSchema,
    );
  }

  async listDevelopmentPlanVersions(
    projectId: string,
  ): Promise<DevelopmentPlanListResponse> {
    return this.request(
      `/projects/${projectId}/development-plan/versions`,
      {},
      developmentPlanListResponseSchema,
    );
  }

  async extractAssets(projectId: string): Promise<StoryAssetListResponse> {
    return this.request(
      `/projects/${projectId}/assets/extract`,
      { method: "POST" },
      storyAssetListResponseSchema,
    );
  }

  async listAssets(
    projectId: string,
    status?: string,
  ): Promise<StoryAssetListResponse> {
    const query = status ? `?status=${status}` : "";
    return this.request(
      `/projects/${projectId}/assets${query}`,
      {},
      storyAssetListResponseSchema,
    );
  }

  async updateAsset(
    projectId: string,
    assetId: string,
    input: UpdateAssetInput,
  ): Promise<StoryAssetResponse> {
    return this.request(
      `/projects/${projectId}/assets/${assetId}`,
      { method: "PATCH", body: JSON.stringify(input) },
      storyAssetResponseSchema,
    );
  }

  async confirmAsset(
    projectId: string,
    assetId: string,
  ): Promise<StoryAssetResponse> {
    return this.request(
      `/projects/${projectId}/assets/${assetId}/confirm`,
      { method: "POST" },
      storyAssetResponseSchema,
    );
  }

  async rejectAsset(
    projectId: string,
    assetId: string,
  ): Promise<StoryAssetResponse> {
    return this.request(
      `/projects/${projectId}/assets/${assetId}/reject`,
      { method: "POST" },
      storyAssetResponseSchema,
    );
  }

  async extractRelations(
    projectId: string,
  ): Promise<StoryRelationListResponse> {
    return this.request(
      `/projects/${projectId}/relations/extract`,
      { method: "POST" },
      storyRelationListResponseSchema,
    );
  }

  async listRelations(
    projectId: string,
    status?: string,
  ): Promise<StoryRelationListResponse> {
    const query = status ? `?status=${status}` : "";
    return this.request(
      `/projects/${projectId}/relations${query}`,
      {},
      storyRelationListResponseSchema,
    );
  }

  async updateRelation(
    projectId: string,
    relationId: string,
    input: UpdateRelationInput,
  ): Promise<StoryRelationResponse> {
    return this.request(
      `/projects/${projectId}/relations/${relationId}`,
      { method: "PATCH", body: JSON.stringify(input) },
      storyRelationResponseSchema,
    );
  }

  async confirmRelation(
    projectId: string,
    relationId: string,
  ): Promise<StoryRelationResponse> {
    return this.request(
      `/projects/${projectId}/relations/${relationId}/confirm`,
      { method: "POST" },
      storyRelationResponseSchema,
    );
  }

  async rejectRelation(
    projectId: string,
    relationId: string,
  ): Promise<StoryRelationResponse> {
    return this.request(
      `/projects/${projectId}/relations/${relationId}/reject`,
      { method: "POST" },
      storyRelationResponseSchema,
    );
  }

  async sendChatMessage(
    projectId: string,
    input: SendChatMessageInput,
  ): Promise<ChatMessageResponse> {
    return this.request(
      `/projects/${projectId}/chat`,
      { method: "POST", body: JSON.stringify(input) },
      chatMessageResponseSchema,
    );
  }

  async listChatMessages(projectId: string): Promise<ChatMessageListResponse> {
    return this.request(
      `/projects/${projectId}/chat/messages`,
      {},
      chatMessageListResponseSchema,
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
